import { Notification } from '../models/index.js';

export async function createNotification(io, data) {
  const notification = await Notification.create(data);
  io.to(`user:${data.user}`).emit('notification:new', notification.toObject());
  return notification;
}
