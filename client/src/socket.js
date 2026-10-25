import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.PROD ? window.location.origin : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
const socketPath = import.meta.env.PROD && window.location.hostname.endsWith('vercel.app') ? '/api/socket.io' : '/socket.io';
export const socket = io(SOCKET_URL, { autoConnect: true, path: socketPath, withCredentials: true, transports: ['websocket', 'polling'] });
export const refreshSocketAuth = () => { if (socket.connected) socket.disconnect(); socket.connect(); };
