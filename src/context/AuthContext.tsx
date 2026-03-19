import React, { createContext, useContext, useState } from 'react';

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
  // Admin auth (password-protected CMS access)
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;

  // User auth (simplified)
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
const USER_PROFILE_KEY = 'meum_diarium_user_profile';

/** Create a mock user */
function createMockUser(email: string, username?: string, displayName?: string): User {
  const now = new Date().toISOString();
  const defaultName = email.split('@')[0] ?? 'user';
  return {
    id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
    email,
    username: username ?? defaultName,
    displayName: displayName ?? username ?? defaultName,
    createdAt: now,
    updatedAt: now,
    isActive: true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  // Mock user state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync admin auth state to localStorage
  useState(() => {
    localStorage.setItem(ADMIN_AUTH_KEY, isAdminAuthenticated.toString());
  });

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

  // Mock auth functions
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email && password.length >= 6) {
        const mockUser = createMockUser(email);
        setUser(mockUser);
        setToken('mock-token-' + Math.random().toString(36).substr(2, 9));
        return { success: true };
      } else {
        return { success: false, error: 'Ungültige Anmeldedaten.' };
      }
    } catch (error: any) {
      return { success: false, error: 'Anmeldung fehlgeschlagen.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_PROFILE_KEY);
  };

  const register = async (userData: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (userData.email && userData.username && userData.password.length >= 6) {
        const mockUser = createMockUser(userData.email, userData.username, userData.displayName);
        setUser(mockUser);
        setToken('mock-token-' + Math.random().toString(36).substr(2, 9));
        
        // Store extra profile info
        const profileExtra = { username: userData.username, displayName: userData.displayName };
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileExtra));
        
        return { success: true };
      } else {
        return { success: false, error: 'Das Passwort ist zu schwach (mind. 6 Zeichen).' };
      }
    } catch (error: any) {
      return { success: false, error: 'Registrierung fehlgeschlagen.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      // Persist extra profile info
      const profileExtra = {
        username: updatedUser.username,
        bio: updatedUser.bio,
        preferences: updatedUser.preferences,
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileExtra));
    }
  };

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
