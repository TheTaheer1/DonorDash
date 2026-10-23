import mongoose from 'mongoose';

export const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const validObjectId = (param, label) => (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params[param])) return res.status(400).json({ message: `Invalid ${label} id` });
  next();
};
