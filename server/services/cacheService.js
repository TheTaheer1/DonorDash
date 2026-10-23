import { redisDeleteByPrefix, redisGet, redisSet } from '../config/redis.js';

const donorMatchPrefix = 'donordash:donor-matches:';
export const donorMatchKey = ({ bloodGroup, city, state }) => `${donorMatchPrefix}${bloodGroup}:${state.trim().toLowerCase()}:${city.trim().toLowerCase()}`;
export const getCachedDonors = key => redisGet(key);
export const cacheDonors = (key, donors) => redisSet(key, donors, 45);
export const clearDonorMatchCache = () => redisDeleteByPrefix(donorMatchPrefix);
