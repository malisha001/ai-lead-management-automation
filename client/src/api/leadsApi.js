import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Leads ──────────────────────────────────────────────────────────────────────
export const submitLead = (data) => API.post('/leads', data);

export const getLeads = (params) => API.get('/leads', { params });

export const getLeadById = (id) => API.get(`/leads/${id}`);

export const updateLeadStatus = (id, status) =>
  API.patch(`/leads/${id}/status`, { status });

export const deleteLead = (id) => API.delete(`/leads/${id}`);

// ── Auth ───────────────────────────────────────────────────────────────────────
export const login = (credentials) => API.post('/auth/login', credentials);

export const getMe = () => API.get('/auth/me');

// ── Stats ──────────────────────────────────────────────────────────────────────
export const getStats = () => API.get('/stats');

export default API;
