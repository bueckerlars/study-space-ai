import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest, fetchUserRequest, refreshAccessTokenRequest, logoutRequest } from '../services/ApiService';
import { User } from '../../../shared/types';

// Define AuthContextType
interface AuthContextType {
  authToken?: string | null;
  user?: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginRequest(email, password);
      setAuthToken(response.data.accessToken);
      await fetchUser();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await registerRequest(email, password, username);
      setAuthToken(response.data.accessToken);
      await fetchUser();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetchUserRequest(authToken);
      setUser(response.data);
    } catch (error) {
      console.error('Fetching user failed:', error);
      logout();
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await refreshAccessTokenRequest();
      setAuthToken(response.data.accessToken);
    } catch (error) {
      logout();
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (authToken) {
      fetchUser();
      const interval = setInterval(refreshAccessToken, 5 * 60 * 1000); // Refresh token every 5 minutes
      return () => clearInterval(interval);
    }
    setLoading(false);
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ user, authToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

