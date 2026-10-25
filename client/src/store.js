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

const defaultProfile = { name: '', email: '', phone: '', group: 'A+', city: '', state: '', gender: 'Other', dob: '', last: '', available: true };
const defaultDonors = [];
const defaultRequests = [];
if (localStorage.getItem('dd-data-version') !== 'empty-v3') { ['dd-profile', 'dd-donors', 'dd-requests', 'dd-session'].forEach(key => localStorage.removeItem(key)); localStorage.setItem('dd-data-version', 'empty-v3'); }
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
