import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['MATCH', 'RESPONSE', 'FULFILLED', 'EXPIRED', 'SYSTEM'], required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 300 },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', index: true },
  readAt: { type: Date, default: null, index: true }
}, { timestamps: true });

schema.index({ user: 1, createdAt: -1 });
export const Notification = mongoose.model('Notification', schema);
