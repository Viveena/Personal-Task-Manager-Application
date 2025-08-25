import React, { createContext, useState, useEffect, type ReactNode, type JSX } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (username: string, email: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
  changePassword: async () => false,
});

interface Props {
  children: ReactNode;
}

// **Set your deployed backend URL here**
const API_URL = "https://personal-task-manager-application.onrender.com";

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get<User>(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err: any) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post<User>(`${API_URL}/api/auth/login`, { email, password });
      setUser(res.data);
      return true;
    } catch (err: any) {
      console.error('Login error:', err.response?.data?.message || err.message);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post<User>(`${API_URL}/api/auth/register`, { username, email, password });
      setUser(res.data);
      return true;
    } catch (err: any) {
      console.error('Registration error:', err.response?.data?.message || err.message);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.get(`${API_URL}/api/auth/logout`);
    } catch (err: any) {
      console.error('Logout error:', err.response?.data?.message || err.message);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (username: string, email: string): Promise<boolean> => {
    try {
      const res = await axios.put<User>(`${API_URL}/api/auth/profile`, { username, email });
      setUser(res.data);
      return true;
    } catch (err: any) {
      console.error('Profile update error:', err.response?.data?.message || err.message);
      return false;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await axios.put(`${API_URL}/api/auth/change-password`, { oldPassword, newPassword });
      return true;
    } catch (err: any) {
      console.error('Password change error:', err.response?.data?.message || err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
