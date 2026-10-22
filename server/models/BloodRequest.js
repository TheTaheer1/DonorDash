import mongoose from 'mongoose';
const groups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const schema = new mongoose.Schema({ requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, bloodGroup: { type: String, enum: groups, required: true }, unitsNeeded: { type: Number, min: 1, max: 10, required: true }, unitsConfirmed: { type: Number, min: 0, default: 0 }, hospital: { type: String, required: true, trim: true }, city: { type: String, required: true, trim: true, index: true }, deadline: { type: Date, required: true, index: true }, status: { type: String, enum: ['OPEN', 'PARTIALLY_FILLED', 'FULFILLED', 'EXPIRED', 'CANCELLED'], default: 'OPEN', index: true }, matchedDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DonorProfile' }] }, { timestamps: true });
schema.index({ requester: 1, createdAt: -1 }); schema.index({ status: 1, deadline: 1 });
export const BloodRequest = mongoose.model('BloodRequest', schema);
