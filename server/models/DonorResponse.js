import mongoose from 'mongoose';
const schema = new mongoose.Schema({ request: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true, index: true }, donor: { type: mongoose.Schema.Types.ObjectId, ref: 'DonorProfile', required: true, index: true }, status: { type: String, enum: ['NOTIFIED', 'ACCEPTED', 'DECLINED'], default: 'NOTIFIED', index: true }, respondedAt: Date }, { timestamps: true });
schema.index({ request: 1, donor: 1 }, { unique: true });
export const DonorResponse = mongoose.model('DonorResponse', schema);
