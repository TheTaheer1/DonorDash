import { Router } from 'express';
import { DonorProfile } from '../models/index.js';
import { auth } from '../middleware/auth.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { profileSchema } from '../config/validation.js';
import { clearDonorMatchCache } from '../services/cacheService.js';

export const donorRoutes = Router();
donorRoutes.put('/me', auth, asyncRoute(async (req, res) => { const data = profileSchema.parse(req.body); const profile = await DonorProfile.findOneAndUpdate({ user: req.user._id }, { user: req.user._id, ...data }, { new: true, upsert: true, runValidators: true }).populate('user', 'name email phone'); await clearDonorMatchCache(); res.json({ profile }); }));
donorRoutes.get('/me', auth, asyncRoute(async (req, res) => res.json({ profile: await DonorProfile.findOne({ user: req.user._id }).populate('user', 'name email phone') })));
