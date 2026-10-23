import { Router } from 'express';
import { User } from '../models/index.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { auth } from '../middleware/auth.js';
import { loginSchema, registrationSchema } from '../config/validation.js';
import { cookieOptions, hashPassword, publicUser, tokenFor, verifyPassword } from '../services/authService.js';

export const authRoutes = Router();
authRoutes.post('/register', asyncRoute(async (req, res) => { const body = registrationSchema.parse(req.body); if (await User.findOne({ email: body.email })) return res.status(409).json({ message: 'Email already registered' }); const user = await User.create({ ...body, passwordHash: await hashPassword(body.password) }); res.cookie('dd_token', tokenFor(user), cookieOptions).status(201).json({ user: publicUser(user) }); }));
authRoutes.post('/login', asyncRoute(async (req, res) => { const body = loginSchema.parse(req.body); const user = await User.findOne({ email: body.email }).select('+passwordHash'); if (!user || !(await verifyPassword(body.password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' }); res.cookie('dd_token', tokenFor(user), cookieOptions).json({ user: publicUser(user) }); }));
authRoutes.post('/demo', asyncRoute(async (req, res) => { if (process.env.NODE_ENV === 'production') return res.status(404).json({ message: 'Not available in production' }); let user = await User.findOne({ email: 'demo@donordash.app' }); if (!user) user = await User.create({ name: 'Priya Deshmukh', email: 'demo@donordash.app', phone: '+91 98123 45678', passwordHash: await hashPassword('DonorDashDemo123!') }); res.cookie('dd_token', tokenFor(user), cookieOptions).json({ user: publicUser(user) }); }));
authRoutes.post('/logout', (req, res) => { res.clearCookie('dd_token'); res.status(204).end(); });
authRoutes.get('/me', auth, asyncRoute(async (req, res) => res.json({ user: publicUser(req.user) })));
