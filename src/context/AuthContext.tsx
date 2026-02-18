import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

interface AuthContextType {
  // Admin auth (existing)
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  
  // User auth (new)
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const ADMIN_PASSWORD = 'benedikt';
const ADMIN_AUTH_KEY = 'meum_diarium_admin_auth';
const USER_AUTH_KEY = 'meum_diarium_user_auth';
const USER_TOKEN_KEY = 'meum_diarium_user_token';

// Helper functions
const verifyToken = (token: string): string | null => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded.userId;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem(ADMIN_AUTH_KEY);
    return stored === 'true';
  });

  // User auth state
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(USER_TOKEN_KEY);
  });
  const [isLoading, setIsLoading] = useState(false);

  // Admin auth functions
  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  // User auth functions
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(USER_AUTH_KEY, JSON.stringify(data.user));
        localStorage.setItem(USER_TOKEN_KEY, data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_AUTH_KEY);
    localStorage.removeItem(USER_TOKEN_KEY);
    
    // Call logout endpoint to invalidate token on server
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {
      // Ignore errors during logout
    });
  };

  const register = async (userData: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(USER_AUTH_KEY, JSON.stringify(updatedUser));
    }
  };

  // Verify token on mount
  useEffect(() => {
    const verifyStoredToken = async () => {
      if (token && !user) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem(USER_AUTH_KEY, JSON.stringify(data.user));
          } else {
            // Token invalid, clear it
            setToken(null);
            localStorage.removeItem(USER_TOKEN_KEY);
          }
        } catch (error) {
          console.error('Token verification error:', error);
          setToken(null);
          localStorage.removeItem(USER_TOKEN_KEY);
        }
      }
    };

    verifyStoredToken();
  }, [token, user]);

  // Sync admin auth state to localStorage
  useEffect(() => {
    localStorage.setItem(ADMIN_AUTH_KEY, isAdminAuthenticated.toString());
  }, [isAdminAuthenticated]);

  return (
    <AuthContext.Provider value={{
      isAdminAuthenticated,
      adminLogin,
      adminLogout,
      user,
      token,
      isLoading,
      login,
      logout,
      register,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
