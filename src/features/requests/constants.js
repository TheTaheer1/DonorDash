export const groups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
export const compatibility = { 'O-': ['O-'], 'O+': ['O+', 'O-'], 'A-': ['A-', 'O-'], 'A+': ['A+', 'A-', 'O+', 'O-'], 'B-': ['B-', 'O-'], 'B+': ['B+', 'B-', 'O+', 'O-'], 'AB-': ['AB-', 'A-', 'B-', 'O-'], 'AB+': groups };
export const seedDonors = [
  { id: 'd1', name: 'Aarav Mehta', group: 'O-', city: 'Pune', gender: 'Male', dob: '1998-04-12', last: '2026-01-10', available: true, phone: '+91 98201 44512' },
  { id: 'd2', name: 'Meera Shah', group: 'A+', city: 'Pune', gender: 'Female', dob: '1994-08-20', last: '2025-11-12', available: true, phone: '+91 98765 12489' }
];
export const seedRequests = [{ id: 'req-1', group: 'O-', units: 2, confirmed: 1, hospital: 'Ruby Hall Clinic', city: 'Pune', deadline: '2026-10-25T18:00', status: 'PARTIALLY_FILLED', requester: 'You', created: 'Just now', matched: ['d1'] }];
export const age = dob => Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);
export const daysSince = date => Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
