import { DonorProfile } from './models/DonorProfile.js';
import { User } from './models/User.js';
import { config } from './config.js';

export const canReceiveFrom = { 'O-': ['O-'], 'O+': ['O+', 'O-'], 'A-': ['A-', 'O-'], 'A+': ['A+', 'A-', 'O+', 'O-'], 'B-': ['B-', 'O-'], 'B+': ['B+', 'B-', 'O+', 'O-'], 'AB-': ['AB-', 'A-', 'B-', 'O-'], 'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] };
const age = dob => Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);
const daysSince = date => date ? Math.floor((Date.now() - new Date(date).getTime()) / 86400000) : Infinity;

export async function findEligibleDonors({ bloodGroup, city, state, excludeUserId }) {
  const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedState = state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const requester = excludeUserId ? await User.findById(excludeUserId).select('blockedUsers').lean() : null;
  const excludedUsers = [excludeUserId, ...(requester?.blockedUsers || [])].filter(Boolean);
  const donors = await DonorProfile.find({ isAvailable: true, healthEligible: true, city: new RegExp(`^${escapedCity}$`, 'i'), state: new RegExp(`^${escapedState}$`, 'i'), bloodGroup: { $in: canReceiveFrom[bloodGroup] }, ...(excludedUsers.length ? { user: { $nin: excludedUsers } } : {}) }).populate('user', 'name email phone').lean();
  return donors.filter(d => age(d.dob) >= 18 && age(d.dob) <= 65 && daysSince(d.lastDonatedAt) >= (d.gender === 'Female' ? config.gapFemale : config.gapMale)).sort((a, b) => new Date(a.lastDonatedAt || 0) - new Date(b.lastDonatedAt || 0));
}
