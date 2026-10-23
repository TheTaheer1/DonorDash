import { Router } from 'express';
import { Hospital } from '../models/index.js';
import { auth } from '../middleware/auth.js';
import { asyncRoute } from '../middleware/asyncRoute.js';

export const hospitalRoutes = Router();
hospitalRoutes.get('/', auth, asyncRoute(async (req, res) => { const city = typeof req.query.city === 'string' ? req.query.city.trim().slice(0, 100) : ''; const state = typeof req.query.state === 'string' ? req.query.state.trim().slice(0, 100) : ''; const query = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 80) : ''; const filter = { verified: true }; if (city.length >= 2) filter.city = new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'); if (state.length >= 2) filter.state = new RegExp(`^${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'); if (query.length >= 2) filter.name = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); const hospitals = await Hospital.find(filter).select('name city state address phone verified').sort({ name: 1 }).limit(20).lean(); res.json({ hospitals }); }));
