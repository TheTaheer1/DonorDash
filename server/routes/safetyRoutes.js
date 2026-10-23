import { Router } from 'express';
import mongoose from 'mongoose';
import { SafetyReport, User } from '../models/index.js';
import { auth } from '../middleware/auth.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { validObjectId } from '../middleware/validation.js';
import { safetyReportSchema } from '../config/validation.js';

export const safetyRoutes = Router();
safetyRoutes.post('/report', auth, asyncRoute(async (req, res) => { const data = safetyReportSchema.parse(req.body); if (data.reportedUserId === req.user._id.toString()) return res.status(400).json({ message: 'You cannot report yourself' }); if (!mongoose.isValidObjectId(data.reportedUserId) || (data.requestId && !mongoose.isValidObjectId(data.requestId))) return res.status(400).json({ message: 'Invalid safety report reference' }); if (!await User.exists({ _id: data.reportedUserId })) return res.status(404).json({ message: 'User not found' }); const report = await SafetyReport.create({ reporter: req.user._id, reportedUser: data.reportedUserId, request: data.requestId, reason: data.reason }); res.status(201).json({ report: { id: report._id, message: 'Report submitted for review.' } }); }));
safetyRoutes.post('/block/:id', auth, validObjectId('id', 'user'), asyncRoute(async (req, res) => { if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'You cannot block yourself' }); if (!await User.exists({ _id: req.params.id })) return res.status(404).json({ message: 'User not found' }); await User.findByIdAndUpdate(req.user._id, { $addToSet: { blockedUsers: req.params.id } }); res.json({ message: 'User blocked. Future matching will exclude this donor.' }); }));
safetyRoutes.delete('/block/:id', auth, validObjectId('id', 'user'), asyncRoute(async (req, res) => { await User.findByIdAndUpdate(req.user._id, { $pull: { blockedUsers: req.params.id } }); res.status(204).end(); }));
