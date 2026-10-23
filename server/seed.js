import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { DonorProfile, Hospital, User } from './models/index.js';

const donors = [
  { name: 'Aarav Mehta', email: 'aarav@donordash.app', phone: '+91 98201 44512', bloodGroup: 'O-', gender: 'Male', dob: '1998-04-12', city: 'Pune', state: 'Maharashtra', lastDonatedAt: '2026-01-10' },
  { name: 'Meera Shah', email: 'meera@donordash.app', phone: '+91 98765 12489', bloodGroup: 'A+', gender: 'Female', dob: '1994-08-20', city: 'Pune', state: 'Maharashtra', lastDonatedAt: '2025-11-12' },
  { name: 'Rohan Kulkarni', email: 'rohan@donordash.app', phone: '+91 98909 77881', bloodGroup: 'O+', gender: 'Male', dob: '1991-02-18', city: 'Mumbai', state: 'Maharashtra', lastDonatedAt: '2026-03-03' }
];

await mongoose.connect(config.mongoUri);
for (const donor of donors) {
  const user = await User.findOneAndUpdate({ email: donor.email }, { name: donor.name, email: donor.email, phone: donor.phone, passwordHash: await bcrypt.hash('DonorDashDemo123!', 12) }, { upsert: true, new: true, setDefaultsOnInsert: true });
  await DonorProfile.findOneAndUpdate({ user: user._id }, { user: user._id, ...donor }, { upsert: true, new: true, setDefaultsOnInsert: true });
}
const hospitals = [
  { name: 'Ruby Hall Clinic', city: 'Pune', state: 'Maharashtra', address: 'Sassoon Road, Pune', phone: '+91 20 6645 5555', verified: true },
  { name: 'KEM Hospital Pune', city: 'Pune', state: 'Maharashtra', address: 'Rasta Peth, Pune', phone: '+91 20 2621 7300', verified: true },
  { name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', state: 'Maharashtra', address: 'Andheri West, Mumbai', phone: '+91 22 4269 6969', verified: true }
];
for (const hospital of hospitals) await Hospital.findOneAndUpdate({ name: hospital.name, city: hospital.city, state: hospital.state }, hospital, { upsert: true, new: true, setDefaultsOnInsert: true });
console.log(`Seeded ${donors.length} demo donors.`);
await mongoose.disconnect();
