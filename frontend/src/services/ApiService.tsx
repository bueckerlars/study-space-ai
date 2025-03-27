import axios from 'axios';
import { Source } from '../types/Source';

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

// Source API instance
const sourceApi = axios.create({
  baseURL: `${API_BASE_URL}/api/sources`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const ollamaApi = axios.create({
  baseURL: `${API_BASE_URL}/api/ollama`,
  headers: {
    'Content-Type': 'application/json',
  },
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

export const getProjectByIdRequest = (authToken: string, projectId: string) => {
  return projectApi.get(`/${projectId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const updateProjectRequest = (authToken: string, projectId: string, data: { name?: string, description?: string }) => {
  return projectApi.put(`/${projectId}`, data, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const deleteProjectRequest = (authToken: string, projectId: string) => {
  return projectApi.delete(`/${projectId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getProjectFilesRequest = (authToken: string, projectId: string) => {
  return projectApi.get(`/${projectId}/files`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// File API functions
export const uploadFileRequest = (authToken: string, file: File, userId: number, projectId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId.toString());
  formData.append('project_id', projectId);
  
  return fileApi.post('/upload', formData, {
    headers: { 
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'multipart/form-data'
    },
  });
};

export const getFilesByProjectRequest = (authToken: string, projectId: string) => {
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

// Source API functions
export const createSourceRequest = (authToken: string, sourceData: Partial<Source>) => {
  return sourceApi.post('/', sourceData, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getAllSourcesRequest = (authToken: string) => {
  return sourceApi.get('/', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getSourceByIdRequest = (authToken: string, sourceId: string) => {
  return sourceApi.get(`/${sourceId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getSourcesByStatusRequest = (authToken: string, status: string) => {
  return sourceApi.get(`/status/${status}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const updateSourceRequest = (authToken: string, sourceId: string, sourceData: Partial<Source>) => {
  return sourceApi.put(`/${sourceId}`, sourceData, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const updateSourceStatusRequest = (authToken: string, sourceId: string, status: string) => {
  return sourceApi.patch(`/${sourceId}/status`, { status }, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const deleteSourceRequest = (authToken: string, sourceId: string) => {
  return sourceApi.delete(`/${sourceId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getSourcesByProjectRequest = (authToken: string, projectId: string) => {
  return sourceApi.get(`/project/${projectId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const processOcrRequest = (authToken: string, sourceId: string) => {
  return sourceApi.post(`/process-ocr/${sourceId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// Ollama API functions
export const summarizeRequest = (authToken: string, sourceId: string) => {
  return ollamaApi.post(`/summarize/${sourceId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    withCredentials: true,
  });
};

export const generateProjectTitleRequest = (authToken: string, projectId: string) => {
  return ollamaApi.post(`/generate-project-title/${projectId}`, {
    headers: { 
      Authorization: `Bearer ${authToken}`
    },
    withCredentials: true,
  });
};

export const getModelsRequest = (authToken: string) => {
  return ollamaApi.get('/models', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};
