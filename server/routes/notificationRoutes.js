import { Router } from 'express';
import { Notification } from '../models/index.js';
import { auth } from '../middleware/auth.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { validObjectId } from '../middleware/validation.js';

export const notificationRoutes = Router();
notificationRoutes.get('/mine', auth, asyncRoute(async (req, res) => { const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean(); res.json({ notifications }); }));
notificationRoutes.patch('/:id/read', auth, validObjectId('id', 'notification'), asyncRoute(async (req, res) => { const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id, readAt: null }, { readAt: new Date() }, { new: true }).lean(); if (!notification) return res.status(404).json({ message: 'Notification not found or already read' }); res.json({ notification }); }));
notificationRoutes.post('/read-all', auth, asyncRoute(async (req, res) => { await Notification.updateMany({ user: req.user._id, readAt: null }, { readAt: new Date() }); res.status(204).end(); }));
