import mongoose from 'mongoose';
const schema = new mongoose.Schema({ reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, request: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest' }, reason: { type: String, required: true, trim: true, maxlength: 500 } }, { timestamps: true });
schema.index({ reporter: 1, reportedUser: 1, createdAt: -1 });
export const SafetyReport = mongoose.model('SafetyReport', schema);
