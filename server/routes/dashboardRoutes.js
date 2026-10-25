import { Router } from 'express';
import { BloodRequest, DonorProfile, DonorResponse } from '../models/index.js';
import { auth } from '../middleware/auth.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { donationEligibility } from '../logic.js';

export const dashboardRoutes = Router();
dashboardRoutes.get('/summary', auth, asyncRoute(async (req, res) => {
  const [activeDonorProfiles, responses, respondedResponses, requestTotals] = await Promise.all([
    DonorProfile.find({ healthEligible: true, $or: [{ isAvailable: true }, { lastDonatedAt: { $ne: null } }] }).lean(),
    DonorResponse.countDocuments(),
    DonorResponse.countDocuments({ status: { $in: ['ACCEPTED', 'ARRIVED', 'DONATED', 'VERIFIED', 'DECLINED'] } }),
    BloodRequest.aggregate([{ $group: { _id: null, units: { $sum: '$unitsConfirmed' }, open: { $sum: { $cond: [{ $in: ['$status', ['OPEN', 'PARTIALLY_FILLED']] }, 1, 0] } } } }])
  ]);
  const totals = requestTotals[0] || { units: 0, open: 0 };
  const activeDonors = activeDonorProfiles.filter(profile => (profile.isAvailable || (profile.lastDonatedAt && donationEligibility(profile).eligible)) && donationEligibility(profile).eligible).length;
  res.json({ activeDonors, responseRate: responses ? Math.round((respondedResponses / responses) * 100) : 0, livesSupported: totals.units, openRequests: totals.open });
}));
