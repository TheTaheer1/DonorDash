import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { config } from '../config.js';
import { asyncRoute } from './asyncRoute.js';

export const auth = asyncRoute(async (req, res, next) => {
  const token = req.cookies.dd_token;
  if (!token) return res.status(401).json({ message: 'Login required' });
  try {
    req.user = await User.findById(jwt.verify(token, config.jwtSecret).sub);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    if (req.baseUrl.endsWith('/requests') && req.method === 'POST' && req.path === '/' && req.user.accountType === 'DONOR') return res.status(403).json({ message: 'Donor-only accounts cannot create blood requests' });
    if (req.baseUrl.endsWith('/requests') && req.method === 'POST' && req.path.endsWith('/respond') && req.user.accountType === 'REQUESTER') return res.status(403).json({ message: 'Requester-only accounts cannot respond as donors' });
    next();
  } catch { return res.status(401).json({ message: 'Invalid session' }); }
});
