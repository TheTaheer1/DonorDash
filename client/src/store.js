import { configureStore, createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: '', online: true },
  reducers: {
    showToast: (state, action) => { state.toast = action.payload; },
    clearToast: state => { state.toast = ''; },
    setOnline: (state, action) => { state.online = action.payload; }
  }
});
export const { showToast, clearToast, setOnline } = uiSlice.actions;

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: true },
  reducers: {
    setAuthUser: (state, action) => { state.user = action.payload; },
    setAuthLoading: (state, action) => { state.loading = action.payload; },
    clearAuth: state => { state.user = null; }
  }
});
export const { setAuthUser, setAuthLoading, clearAuth } = authSlice.actions;

const defaultProfile = { name: 'Priya Deshmukh', email: 'priya@example.com', phone: '+91 98123 45678', group: 'A+', city: 'Pune', gender: 'Female', dob: '1997-03-15', last: '2025-12-20', available: true };
const defaultDonors = [
  { id: 'd1', name: 'Aarav Mehta', group: 'O-', city: 'Pune', gender: 'Male', dob: '1998-04-12', last: '2026-01-10', available: true, phone: '+91 98201 44512' },
  { id: 'd2', name: 'Meera Shah', group: 'A+', city: 'Pune', gender: 'Female', dob: '1994-08-20', last: '2025-11-12', available: true, phone: '+91 98765 12489' }
];
const defaultRequests = [{ id: 'req-1', group: 'O-', units: 2, confirmed: 1, hospital: 'Ruby Hall Clinic', city: 'Pune', deadline: '2026-10-25T18:00', status: 'PARTIALLY_FILLED', requester: 'You', created: 'Just now', matched: ['d1'] }];
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
const dataSlice = createSlice({
  name: 'data',
    initialState: { profile: read('dd-profile', defaultProfile), donors: read('dd-donors', defaultDonors), requests: read('dd-requests', defaultRequests), notifications: [], dashboard: { activeDonors: 0, responseRate: 0, livesSupported: 0, openRequests: 0 }, hydrated: false },
  reducers: {
    setProfileState: (state, action) => { state.profile = action.payload; },
    setDonorsState: (state, action) => { state.donors = action.payload; },
    setRequestsState: (state, action) => { state.requests = action.payload; },
    setHydrated: (state, action) => { state.hydrated = action.payload; },
    setNotificationsState: (state, action) => { state.notifications = action.payload; },
    setDashboardState: (state, action) => { state.dashboard = action.payload; },
    markNotificationReadState: (state, action) => { const notification = state.notifications.find(item => item._id === action.payload); if (notification) notification.readAt = new Date().toISOString(); },
    markAllNotificationsReadState: state => { state.notifications.forEach(notification => { notification.readAt = new Date().toISOString(); }); }
  }
});
export const { setProfileState, setDonorsState, setRequestsState, setHydrated, setNotificationsState, setDashboardState, markNotificationReadState, markAllNotificationsReadState } = dataSlice.actions;
export const store = configureStore({ reducer: { ui: uiSlice.reducer, auth: authSlice.reducer, data: dataSlice.reducer } });
