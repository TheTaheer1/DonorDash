import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { DonorProfile, User } from './models/index.js';

const donors = [
  { name: 'Aarav Mehta', email: 'aarav@donordash.app', phone: '+91 98201 44512', bloodGroup: 'O-', gender: 'Male', dob: '1998-04-12', city: 'Pune', lastDonatedAt: '2026-01-10' },
  { name: 'Meera Shah', email: 'meera@donordash.app', phone: '+91 98765 12489', bloodGroup: 'A+', gender: 'Female', dob: '1994-08-20', city: 'Pune', lastDonatedAt: '2025-11-12' },
  { name: 'Rohan Kulkarni', email: 'rohan@donordash.app', phone: '+91 98909 77881', bloodGroup: 'O+', gender: 'Male', dob: '1991-02-18', city: 'Mumbai', lastDonatedAt: '2026-03-03' }
];

await mongoose.connect(config.mongoUri);
for (const donor of donors) {
  const user = await User.findOneAndUpdate({ email: donor.email }, { name: donor.name, email: donor.email, phone: donor.phone, passwordHash: await bcrypt.hash('DonorDashDemo123!', 12) }, { upsert: true, new: true, setDefaultsOnInsert: true });
  await DonorProfile.findOneAndUpdate({ user: user._id }, { user: user._id, ...donor }, { upsert: true, new: true, setDefaultsOnInsert: true });
}
console.log(`Seeded ${donors.length} demo donors.`);
await mongoose.disconnect();
