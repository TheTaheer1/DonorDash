import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cron from 'node-cron';
import { config } from './config.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { BloodRequest } from './models/index.js';
import { authRoutes } from './routes/authRoutes.js';
import { donorRoutes } from './routes/donorRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';
import { createRequestRoutes } from './routes/requestRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createNotification } from './services/notificationService.js';

const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: config.clientUrl, credentials: true } });
io.use((socket, next) => { try { const token = socket.handshake.headers.cookie?.match(/(?:^|;\s*)dd_token=([^;]+)/)?.[1]; if (token) socket.userId = jwt.verify(token, config.jwtSecret).sub; } catch {} next(); });
io.on('connection', socket => { if (socket.userId) socket.join(`user:${socket.userId}`); socket.emit('server:ready', { service: 'DonorDash' }); });

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: true }));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'DonorDash API' }));
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/requests', createRequestRoutes(io));
app.use('/api/dashboard', dashboardRoutes);
app.use(errorHandler);

cron.schedule('*/10 * * * *', async () => { try { const expired = await BloodRequest.find({ deadline: { $lt: new Date() }, status: { $in: ['OPEN', 'PARTIALLY_FILLED'] } }).select('_id requester'); if (!expired.length) return; await BloodRequest.updateMany({ _id: { $in: expired.map(request => request._id) } }, { status: 'EXPIRED' }); await Promise.allSettled(expired.map(request => createNotification(io, { user: request.requester, type: 'EXPIRED', title: 'Request expired', message: 'Your blood request passed its needed-by time without being fulfilled.', request: request._id }))); } catch (error) { console.error('Request expiry job failed:', error.message); } });

connectDatabase().then(connectRedis).then(() => httpServer.listen(config.port, () => console.log(`DonorDash API running on http://localhost:${config.port}`))).catch(error => { console.error('MongoDB connection failed:', error.message); console.error('Start MongoDB or set MONGO_URI before using the API.'); process.exitCode = 1; });
