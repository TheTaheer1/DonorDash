import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || !process.env.CLIENT_URL)) {
  throw new Error('Production requires MONGO_URI, CLIENT_URL, and a JWT_SECRET of at least 32 characters');
}

export const config = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/donordash',
  jwtSecret: process.env.JWT_SECRET || 'donordash-development-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  corsOrigins: (process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(origin => origin.trim()).filter(Boolean),
  redisUrl: process.env.REDIS_URL || '',
  gapMale: Number(process.env.DONATION_GAP_MALE_DAYS || 90),
  gapFemale: Number(process.env.DONATION_GAP_FEMALE_DAYS || 120)
};
