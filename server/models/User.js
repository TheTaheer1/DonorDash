import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true, maxlength: 80 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true }, passwordHash: { type: String, required: true, select: false }, phone: { type: String, required: true }, role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', index: true }, accountType: { type: String, enum: ['DONOR', 'REQUESTER', 'BOTH'], default: 'BOTH', index: true } }, { timestamps: true });
export const User = mongoose.model('User', schema);
