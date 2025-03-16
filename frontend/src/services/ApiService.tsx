import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://study-space-ai-backend-1:5066',
  baseURL: 'http://localhost:5066/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

export const loginRequest = (email: string, password: string) => {
  return api.post('/login', { email, password });
};

export const registerRequest = (email: string, password: string, username: string) => {
  return api.post('/register', { email, password, username });
};

export const fetchUserRequest = (authToken: string | null) => {
  return api.get('/me', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const refreshAccessTokenRequest = () => {
  return api.post('/refresh');
};

export const logoutRequest = () => {
  return api.post('/logout');
};
