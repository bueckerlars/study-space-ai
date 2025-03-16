import axios from 'axios';

const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
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
