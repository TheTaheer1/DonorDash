import { io } from 'socket.io-client';

const isVercelProduction = import.meta.env.PROD && window.location.hostname.endsWith('vercel.app');
const SOCKET_URL = isVercelProduction ? 'https://donordash-api.onrender.com' : (import.meta.env.PROD ? window.location.origin : (import.meta.env.VITE_API_URL || 'http://localhost:5000'));
export const socket = io(SOCKET_URL, { autoConnect: false, withCredentials: true, transports: ['websocket', 'polling'] });
export const refreshSocketAuth = async () => { if (socket.connected) socket.disconnect(); if (isVercelProduction) { const response = await fetch('/api/auth/socket-token', { credentials: 'include' }); if (!response.ok) return; const { token } = await response.json(); socket.auth = { token }; } socket.connect(); };
