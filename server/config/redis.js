import { createClient } from 'redis';
import { config } from './index.js';

let client;
let enabled = false;

export async function connectRedis() {
  if (!config.redisUrl) {
    console.log('Redis cache disabled: REDIS_URL is not configured.');
    return;
  }
  client = createClient({ url: config.redisUrl, socket: { reconnectStrategy: false } });
  client.on('error', error => console.error('Redis cache error:', error.message));
  try {
    await client.connect();
    enabled = true;
    console.log('Redis cache connected.');
  } catch (error) {
    enabled = false;
    console.warn('Redis unavailable; continuing without cache:', error.message);
    try { await client.disconnect(); } catch {}
  }
}

export const redisEnabled = () => enabled;
export const redisGet = async key => { if (!enabled) return null; try { const value = await client.get(key); return value ? JSON.parse(value) : null; } catch { return null; } };
export const redisSet = async (key, value, ttlSeconds) => { if (!enabled) return; try { await client.set(key, JSON.stringify(value), { EX: ttlSeconds }); } catch {} };
export const redisDeleteByPrefix = async prefix => { if (!enabled) return; try { for await (const key of client.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) await client.del(key); } catch {} };
