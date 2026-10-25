import { Router } from 'express';
import { BloodRequest, DonorProfile, DonorResponse } from '../models/index.js';
import { auth } from '../middleware/auth.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { profileSchema } from '../config/validation.js';
import { clearDonorMatchCache } from '../services/cacheService.js';
import { canReceiveFrom, donationEligibility } from '../logic.js';
import { createNotification } from '../services/notificationService.js';

export function createDonorRoutes(io) {
const donorRoutes = Router();
const visibleProfile = profile => { if (!profile) return null; const eligibility = donationEligibility(profile); return { ...profile.toObject(), isAvailable: Boolean(profile.healthEligible && (profile.isAvailable || (profile.lastDonatedAt && eligibility.eligible))), ...eligibility }; };
donorRoutes.put('/me', auth, asyncRoute(async (req, res) => {
  const data = profileSchema.parse(req.body);
  const profile = await DonorProfile.findOneAndUpdate({ user: req.user._id }, { user: req.user._id, ...data }, { new: true, upsert: true, runValidators: true }).populate('user', 'name email phone');
  await clearDonorMatchCache();
  if ((profile.isAvailable || (profile.lastDonatedAt && donationEligibility(profile).eligible)) && profile.healthEligible && donationEligibility(profile).eligible) {
    const compatibleGroups = Object.entries(canReceiveFrom).filter(([, donors]) => donors.includes(profile.bloodGroup)).map(([group]) => group);
    const escapedCity = profile.city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedState = profile.state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const requests = await BloodRequest.find({ requester: { $ne: req.user._id }, bloodGroup: { $in: compatibleGroups }, city: new RegExp(`^${escapedCity}$`, 'i'), state: new RegExp(`^${escapedState}$`, 'i'), status: { $in: ['OPEN', 'PARTIALLY_FILLED'] }, deadline: { $gt: new Date() }, $expr: { $lt: ['$unitsConfirmed', '$unitsNeeded'] } }).populate('requester', 'name blockedUsers').lean();
    await Promise.allSettled(requests.filter(request => !request.requester?.blockedUsers?.some(id => id.toString() === req.user._id.toString())).map(async request => {
      const existing = await DonorResponse.findOne({ request: request._id, donor: profile._id }).lean();
      if (existing) return;
      await DonorResponse.create({ request: request._id, donor: profile._id, status: 'NOTIFIED' });
      await BloodRequest.updateOne({ _id: request._id }, { $addToSet: { matchedDonors: profile._id } });
      await createNotification(io, { user: req.user._id, type: 'MATCH', title: 'New blood request match', message: `${request.bloodGroup} blood is needed at ${request.hospital} in ${request.city}.`, request: request._id });
      await createNotification(io, { user: request.requester._id, type: 'MATCH', title: 'New eligible donor found', message: `A new ${profile.bloodGroup} donor matches your request at ${request.hospital}.`, request: request._id });
      io.emit('request:updated', { requestId: request._id, type: 'matched', message: 'A new eligible donor was found.' });
    }));
  }
  res.json({ profile: visibleProfile(profile) });
}));
donorRoutes.get('/me', auth, asyncRoute(async (req, res) => { const profile = await DonorProfile.findOne({ user: req.user._id }).populate('user', 'name email phone'); res.json({ profile: visibleProfile(profile) }); }));
return donorRoutes;
}
