import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, registerRequest, fetchUserRequest, refreshAccessTokenRequest, logoutRequest, changePasswordRequest } from '../services/ApiService';
import { User } from '../types';

// Define AuthContextType
interface AuthContextType {
  authToken?: string | null;
  user?: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
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
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await registerRequest(email, password, username);
      setAuthToken(response.data.accessToken);
      await fetchUser();
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const fetchUser = async () => {
    if (!authToken) return;
    
    try {
      const response = await fetchUserRequest(authToken);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetching user failed:', error);
      // If token is invalid, try to refresh it once
      try {
        await refreshAccessToken();
        const response = await fetchUserRequest(authToken);
        setUser(response.data);
      } catch (refreshError) {
        // If refresh fails, logout the user
        logout();
      }
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await refreshAccessTokenRequest();
      setAuthToken(response.data.accessToken);
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear auth state if refresh fails
      logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local auth state, even if the API call fails
      setAuthToken(null);
      setUser(null);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!authToken) {
      throw new Error('User is not authenticated');
    }

    try {
      await changePasswordRequest(authToken, oldPassword, newPassword);
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Try to get user data if we have a token
    if (authToken) {
      fetchUser();
      
      // Set up token refresh interval
      const refreshInterval = 4.5 * 60 * 1000; // Refresh every 4.5 minutes (slightly before 5min expiry)
      const interval = setInterval(refreshAccessToken, refreshInterval);
      
      return () => clearInterval(interval);
    } else {
      // Try to refresh the token on initial load to recover session
      refreshAccessToken().catch(() => {
        setLoading(false);
      });
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ user, authToken, loading, login, register, logout, changePassword }}>
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

