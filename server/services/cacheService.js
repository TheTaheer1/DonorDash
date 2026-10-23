import { redisDeleteByPrefix, redisGet, redisSet } from '../config/redis.js';

const donorMatchPrefix = 'donordash:donor-matches:';
export const donorMatchKey = ({ bloodGroup, city, state, excludeUserId }) => `${donorMatchPrefix}${bloodGroup}:${state.trim().toLowerCase()}:${city.trim().toLowerCase()}:${excludeUserId || 'none'}`;
export const getCachedDonors = key => redisGet(key);
export const cacheDonors = (key, donors) => redisSet(key, donors, 45);
export const clearDonorMatchCache = () => redisDeleteByPrefix(donorMatchPrefix);
