import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

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

  // User auth via Firebase
  user: User | null;
  firebaseUser: FirebaseUser | null;
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

/** Convert a FirebaseUser to our User shape */
function toAppUser(fbUser: FirebaseUser, extra?: Partial<User>): User {
  return {
    id: fbUser.uid,
    email: fbUser.email ?? '',
    username: extra?.username ?? fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'user',
    displayName: fbUser.displayName ?? extra?.username ?? fbUser.email?.split('@')[0] ?? 'User',
    avatarUrl: fbUser.photoURL ?? undefined,
    createdAt: fbUser.metadata.creationTime ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: fbUser.metadata.lastSignInTime ?? undefined,
    isActive: true,
    ...extra,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  // Firebase user state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        setFirebaseUser(fbUser);
        setToken(idToken);

        // Merge stored username if available
        const stored = localStorage.getItem(USER_PROFILE_KEY);
        const extra: Partial<User> = stored ? JSON.parse(stored) : {};
        const appUser = toAppUser(fbUser, extra);
        setUser(appUser);
      } else {
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sync admin auth state to localStorage
  useEffect(() => {
    localStorage.setItem(ADMIN_AUTH_KEY, isAdminAuthenticated.toString());
  }, [isAdminAuthenticated]);

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

  // Firebase auth functions
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      const code: string = error?.code ?? '';
      const messages: Record<string, string> = {
        'auth/user-not-found': 'Kein Konto mit dieser E-Mail-Adresse gefunden.',
        'auth/wrong-password': 'Falsches Passwort.',
        'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
        'auth/user-disabled': 'Dieses Konto wurde deaktiviert.',
        'auth/too-many-requests': 'Zu viele Versuche. Bitte warte einen Moment.',
        'auth/invalid-credential': 'Ungültige Anmeldedaten.',
      };
      return { success: false, error: messages[code] ?? 'Anmeldung fehlgeschlagen.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const register = async (userData: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const displayName = userData.displayName?.trim() || userData.username;

      // Set displayName in Firebase profile
      await updateProfile(credential.user, { displayName });

      // Store username locally (Firebase doesn't have a username field)
      const profileExtra: Partial<User> = { username: userData.username };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileExtra));

      return { success: true };
    } catch (error: any) {
      const code: string = error?.code ?? '';
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'Diese E-Mail-Adresse wird bereits verwendet.',
        'auth/invalid-email': 'Ungültige E-Mail-Adresse.',
        'auth/weak-password': 'Das Passwort ist zu schwach (mind. 6 Zeichen).',
        'auth/operation-not-allowed': 'E-Mail/Passwort-Registrierung ist nicht aktiviert.',
      };
      return { success: false, error: messages[code] ?? 'Registrierung fehlgeschlagen.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Persist extra profile info
      const profileExtra: Partial<User> = {
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
      firebaseUser,
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
