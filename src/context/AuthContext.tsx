import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/services/finOpsApi';

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'viewer';
  is_active: boolean;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  register: (email: string, password: string, orgSlug: string, orgAdminName: string, role?: 'viewer' | 'admin' | 'owner') => Promise<void>;
  registerOrg: (orgName: string, orgSlug: string, orgPlan: string, adminEmail: string, adminPassword: string, adminName: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      
      // Store tokens and user
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage regardless of API call success
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const data = await authApi.refreshToken(refreshTokenValue);
      
      // Update tokens and user
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
    } catch (error) {
      // If refresh fails, logout
      await logout();
      throw error;
    }
  };

  const register = async (email: string, password: string, orgSlug: string, orgAdminName: string, role: 'viewer' | 'admin' | 'owner' = 'viewer') => {
    setIsLoading(true);
    try {
      const data = await authApi.register(email, password, orgSlug, orgAdminName, role);
      setUser(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerOrg = async (orgName: string, orgSlug: string, orgPlan: string, adminEmail: string, adminPassword: string, adminName: string) => {
    setIsLoading(true);
    try {
      await authApi.registerOrg(orgName, orgSlug, orgPlan, adminEmail, adminPassword, adminName);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshToken,
        register,
        registerOrg,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
