import mongoose from 'mongoose';

const { Schema } = mongoose;
const groups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

const userSchema = new Schema({ name: { type: String, required: true, trim: true, maxlength: 80 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true }, passwordHash: { type: String, required: true, select: false }, phone: { type: String, required: true }, role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', index: true } }, { timestamps: true });
const donorProfileSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true, index: true }, bloodGroup: { type: String, enum: groups, required: true }, gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }, dob: { type: Date, required: true }, city: { type: String, required: true, trim: true }, lastDonatedAt: Date, isAvailable: { type: Boolean, default: true, index: true } }, { timestamps: true });
const bloodRequestSchema = new Schema({ requester: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, bloodGroup: { type: String, enum: groups, required: true }, unitsNeeded: { type: Number, min: 1, max: 10, required: true }, unitsConfirmed: { type: Number, min: 0, default: 0 }, hospital: { type: String, required: true, trim: true }, city: { type: String, required: true, trim: true, index: true }, deadline: { type: Date, required: true, index: true }, status: { type: String, enum: ['OPEN', 'PARTIALLY_FILLED', 'FULFILLED', 'EXPIRED', 'CANCELLED'], default: 'OPEN', index: true }, matchedDonors: [{ type: Schema.Types.ObjectId, ref: 'DonorProfile' }] }, { timestamps: true });
const donorResponseSchema = new Schema({ request: { type: Schema.Types.ObjectId, ref: 'BloodRequest', required: true, index: true }, donor: { type: Schema.Types.ObjectId, ref: 'DonorProfile', required: true, index: true }, status: { type: String, enum: ['NOTIFIED', 'ACCEPTED', 'DECLINED'], default: 'NOTIFIED', index: true }, respondedAt: Date }, { timestamps: true });

donorProfileSchema.index({ city: 1, bloodGroup: 1, isAvailable: 1 });
bloodRequestSchema.index({ requester: 1, createdAt: -1 });
bloodRequestSchema.index({ status: 1, deadline: 1 });
donorResponseSchema.index({ request: 1, donor: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
export const DonorProfile = mongoose.model('DonorProfile', donorProfileSchema);
export const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
export const DonorResponse = mongoose.model('DonorResponse', donorResponseSchema);
