import axios from 'axios';

// Base API URLs
const API_BASE_URL = 'http://localhost:5066';

// Auth API instance
const authApi = axios.create({
  // baseURL: 'http://study-space-ai-backend-1:5066',
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Project API instance
const projectApi = axios.create({
  baseURL: `${API_BASE_URL}/api/projects`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// File API instance
const fileApi = axios.create({
  baseURL: `${API_BASE_URL}/api/files`,
  withCredentials: true,
});

// Auth API functions
export const loginRequest = (email: string, password: string) => {
  return authApi.post('/login', { email, password });
};

export const registerRequest = (email: string, password: string, username: string) => {
  return authApi.post('/register', { email, password, username });
};

export const fetchUserRequest = (authToken: string | null) => {
  return authApi.get('/me', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const refreshAccessTokenRequest = () => {
  return authApi.post('/refresh');
};

export const logoutRequest = () => {
  return authApi.post('/logout');
};

// Project API functions
export const createProjectRequest = (authToken: string, name: string, description?: string) => {
  return projectApi.post('/', { name, description }, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getUserProjectsRequest = (authToken: string) => {
  return projectApi.get('/', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getProjectByIdRequest = (authToken: string, projectId: number) => {
  return projectApi.get(`/${projectId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const updateProjectRequest = (authToken: string, projectId: number, data: { name?: string, description?: string }) => {
  return projectApi.put(`/${projectId}`, data, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const deleteProjectRequest = (authToken: string, projectId: number) => {
  return projectApi.delete(`/${projectId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getProjectFilesRequest = (authToken: string, projectId: number) => {
  return projectApi.get(`/${projectId}/files`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// File API functions
export const uploadFileRequest = (authToken: string, file: File, userId: number, projectId: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId.toString());
  formData.append('project_id', projectId.toString());
  
  return fileApi.post('/upload', formData, {
    headers: { 
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'multipart/form-data'
    },
  });
};

export const getFilesByProjectRequest = (authToken: string, projectId: number) => {
  return fileApi.get(`/project/${projectId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getFilesByUserRequest = (authToken: string, userId: number) => {
  return fileApi.get(`/user/${userId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getFileByIdRequest = (authToken: string, fileId: string) => {
  return fileApi.get(`/${fileId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getFileContentRequest = (authToken: string, fileId: string) => {
  return fileApi.get(`/${fileId}/content`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const downloadFileRequest = (authToken: string, fileId: string) => {
  return fileApi.get(`/${fileId}/download`, {
    headers: { Authorization: `Bearer ${authToken}` },
    responseType: 'blob',
  });
};

export const deleteFileRequest = (authToken: string, fileId: string) => {
  return fileApi.delete(`/${fileId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};
