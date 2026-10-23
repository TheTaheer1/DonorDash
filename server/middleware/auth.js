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
    next();
  } catch { return res.status(401).json({ message: 'Invalid session' }); }
});
