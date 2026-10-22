import mongoose from 'mongoose';
const groups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const schema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true, index: true }, bloodGroup: { type: String, enum: groups, required: true }, gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }, dob: { type: Date, required: true }, city: { type: String, required: true, trim: true }, lastDonatedAt: Date, isAvailable: { type: Boolean, default: true, index: true } }, { timestamps: true });
schema.index({ city: 1, bloodGroup: 1, isAvailable: 1 });
export const DonorProfile = mongoose.model('DonorProfile', schema);
