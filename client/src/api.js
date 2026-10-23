import axios from 'axios';

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
const request = async (path, options = {}) => (await client({ url: path, ...options })).data;
export const apiErrorMessage = error => error?.response?.data?.message || (error?.request ? 'The server could not be reached. Check that the API is running.' : 'Something went wrong. Please try again.');
export const api = {
  me: () => request('/api/auth/me'),
  demoLogin: () => request('/api/auth/demo', { method: 'POST' }),
  profile: () => request('/api/donors/me'),
  saveProfile: profile => request('/api/donors/me', { method: 'PUT', data: { bloodGroup: profile.group, gender: profile.gender, dob: profile.dob, city: profile.city, lastDonatedAt: profile.last || null, isAvailable: profile.available } }),
  requests: (params = {}) => request('/api/requests/mine', { params }),
  createRequest: form => request('/api/requests', { method: 'POST', data: { bloodGroup: form.group, unitsNeeded: form.units, hospital: form.hospital, city: form.city, deadline: form.deadline } }),
  respond: (id, status) => request(`/api/requests/${id}/respond`, { method: 'POST', data: { status: status === 'accept' ? 'ACCEPTED' : 'DECLINED' } }),
  notifications: () => request('/api/notifications/mine'),
  markNotificationRead: id => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/api/notifications/read-all', { method: 'POST' })
};
