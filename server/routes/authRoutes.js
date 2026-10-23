import { Router } from 'express';
import { DonorProfile, User } from '../models/index.js';
import { asyncRoute } from '../middleware/asyncRoute.js';
import { auth } from '../middleware/auth.js';
import { identitySchema, loginSchema, registrationSchema } from '../config/validation.js';
import { cookieOptions, hashPassword, publicUser, tokenFor, verifyPassword } from '../services/authService.js';

export const authRoutes = Router();
authRoutes.post('/register', asyncRoute(async (req, res) => { const body = registrationSchema.parse(req.body); if (await User.findOne({ email: body.email })) return res.status(409).json({ message: 'Email already registered' }); const { password, bloodGroup, gender, dob, city, state, lastDonatedAt, isAvailable, ...userFields } = body; const user = await User.create({ ...userFields, passwordHash: await hashPassword(password) }); await DonorProfile.create({ user: user._id, bloodGroup, gender, dob, city, state, lastDonatedAt: lastDonatedAt || null, isAvailable }); res.cookie('dd_token', tokenFor(user), cookieOptions).status(201).json({ user: publicUser(user) }); }));
authRoutes.post('/login', asyncRoute(async (req, res) => { const body = loginSchema.parse(req.body); const user = await User.findOne({ email: body.email }).select('+passwordHash'); if (!user || !(await verifyPassword(body.password, user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' }); res.cookie('dd_token', tokenFor(user), cookieOptions).json({ user: publicUser(user) }); }));
authRoutes.post('/demo', asyncRoute(async (req, res) => { if (process.env.NODE_ENV === 'production') return res.status(404).json({ message: 'Not available in production' }); let user = await User.findOne({ email: 'demo@donordash.app' }); if (!user) user = await User.create({ name: 'Priya Deshmukh', email: 'demo@donordash.app', phone: '+91 98123 45678', passwordHash: await hashPassword('DonorDashDemo123!') }); res.cookie('dd_token', tokenFor(user), cookieOptions).json({ user: publicUser(user) }); }));
authRoutes.post('/logout', (req, res) => { res.clearCookie('dd_token'); res.status(204).end(); });
authRoutes.put('/me', auth, asyncRoute(async (req, res) => { const body = identitySchema.parse(req.body); const email = body.email.toLowerCase(); if (await User.exists({ email, _id: { $ne: req.user._id } })) return res.status(409).json({ message: 'That email is already registered' }); const user = await User.findByIdAndUpdate(req.user._id, { ...body, email }, { new: true, runValidators: true }); res.json({ user: publicUser(user) }); }));
authRoutes.get('/me', auth, asyncRoute(async (req, res) => res.json({ user: publicUser(req.user) })));
