import axios from 'axios';

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
const request = async (path, options = {}) => (await client({ url: path, ...options })).data;
export const apiErrorMessage = error => error?.response?.data?.message || (error?.request ? 'The server could not be reached. Check that the API is running.' : 'Something went wrong. Please try again.');
export const api = {
  me: () => request('/api/auth/me'),
  register: data => request('/api/auth/register', { method: 'POST', data }),
  login: data => request('/api/auth/login', { method: 'POST', data }),
  requestPasswordReset: email => request('/api/auth/password-reset/request', { method: 'POST', data: { email } }),
  completePasswordReset: data => request('/api/auth/password-reset/complete', { method: 'POST', data }),
  demoLogin: () => request('/api/auth/demo', { method: 'POST' }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  updateMe: data => request('/api/auth/me', { method: 'PUT', data }),
  deleteAccount: password => request('/api/auth/me', { method: 'DELETE', data: { password } }),
  dashboard: () => request('/api/dashboard/summary'),
  profile: () => request('/api/donors/me'),
  saveProfile: profile => request('/api/donors/me', { method: 'PUT', data: { bloodGroup: profile.group, gender: profile.gender, dob: profile.dob, city: profile.city, state: profile.state, lastDonatedAt: profile.last || null, isAvailable: profile.available, healthEligible: profile.healthEligible } }),
  requests: (params = {}) => request('/api/requests/mine', { params }),
  requestResponses: () => request('/api/requests/responses'),
  cancelRequest: id => request(`/api/requests/${id}/cancel`, { method: 'POST' }),
  updateRequest: (id, form) => request(`/api/requests/${id}`, { method: 'PUT', data: { bloodGroup: form.group, unitsNeeded: form.units, hospital: form.hospital, city: form.city, state: form.state, deadline: form.deadline } }),
  deleteRequest: id => request(`/api/requests/${id}`, { method: 'DELETE' }),
  createRequest: form => request('/api/requests', { method: 'POST', data: { bloodGroup: form.group, unitsNeeded: form.units, hospital: form.hospital, city: form.city, state: form.state, deadline: form.deadline } }),
  hospitals: params => request('/api/hospitals', { params }),
  respond: (id, status) => request(`/api/requests/${id}/respond`, { method: 'POST', data: { status: status === 'accept' ? 'ACCEPTED' : 'DECLINED' } }),
  notifications: () => request('/api/notifications/mine'),
  markNotificationRead: id => request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/api/notifications/read-all', { method: 'POST' })
  ,reportUser: data => request('/api/safety/report', { method: 'POST', data })
  ,blockUser: id => request(`/api/safety/block/${id}`, { method: 'POST' })
};
