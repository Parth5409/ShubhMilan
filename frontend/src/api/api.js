import axios from 'axios';

// Create axios instance with base URL
export const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * POST /auth/register
 */
export const register = async (email, password, role = "user") => {
  const response = await api.post('/auth/register', { email, password, role });
  return response.data;
};

/**
 * POST /auth/login
 * Returns { access_token, token_type, user }
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const data = response.data;
  // Save token to localStorage
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
  }
  // Get user info
  const user = await getMe();
  return { access_token: data.access_token, token_type: data.token_type, user };
};

/**
 * GET /auth/me
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * GET /users/:user_id
 */
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

/**
 * PUT /users/:user_id
 */
export const updateUserProfile = async (userId, updates) => {
  const response = await api.put(`/users/${userId}`, updates);
  return response.data;
};

/**
 * POST /users/upload-id
 */
export const uploadIdForVerification = async (userId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/users/upload-id`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * POST /users/upload-photo
 */
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/users/upload-photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ─── AI ──────────────────────────────────────────────────────────────────────

/**
 * POST /ai/enhance-bio
 */
export const enhanceBio = async (rawText) => {
  const response = await api.post('/ai/enhance-bio', { raw_text: rawText });
  return response.data;
};

/**
 * POST /ai/icebreakers
 */
export const getIcebreakers = async (targetId) => {
  const response = await api.post('/ai/icebreakers', { target_id: targetId });
  return response.data;
};

/**
 * POST /ai/generate-astrology
 */
export const generateAstrology = async (dob, time, place) => {
  const response = await api.post('/ai/generate-astrology', { dob, time, place });
  return response.data;
};

// ─── Matches ─────────────────────────────────────────────────────────────────

/**
 * POST /matches
 */
export const getMatches = async (query = "") => {
  const response = await api.post('/matches', { raw: query });
  return response.data;
};

// ─── Interests ───────────────────────────────────────────────────────────────

/**
 * POST /interests
 */
export const sendInterest = async (receiverId, message = "") => {
  const response = await api.post('/interests', { receiver_id: receiverId, message });
  return response.data;
};

/**
 * GET /interests/sent
 */
export const getSentInterests = async () => {
  const response = await api.get('/interests/sent');
  return response.data;
};

/**
 * GET /interests/received
 */
export const getReceivedInterests = async () => {
  const response = await api.get('/interests/received');
  return response.data;
};

/**
 * PATCH /interests/:id?status=accepted|declined
 */
export const respondToInterest = async (interestId, status) => {
  const response = await api.patch(`/interests/${interestId}?status=${status}`);
  return response.data;
};

// ─── Admin ───────────────────────────────────────────────────────────────────

/**
 * GET /admin/pending-verifications
 */
export const getPendingVerifications = async () => {
  const response = await api.get('/admin/pending-verifications');
  return response.data;
};

/**
 * PATCH /admin/verify/:user_id?action=approve|reject
 */
export const verifyUser = async (userId, action) => {
  const response = await api.patch(`/admin/verify/${userId}?action=${action}`);
  return response.data;
};

/**
 * DELETE /admin/users/:user_id
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};