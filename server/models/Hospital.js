import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true, maxlength: 160 }, city: { type: String, required: true, trim: true, index: true }, state: { type: String, required: true, trim: true, index: true }, address: { type: String, trim: true, maxlength: 300 }, phone: { type: String, trim: true, maxlength: 30 }, verified: { type: Boolean, default: false, index: true } }, { timestamps: true });
schema.index({ city: 1, state: 1, name: 1 });
export const Hospital = mongoose.model('Hospital', schema);
