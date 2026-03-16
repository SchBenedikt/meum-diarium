import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project: antike-34338
const firebaseConfig = {
  apiKey: "AIzaSyAVK8co1n_UyEAYiYa4w48tMtCXj8qivAo",
  authDomain: "antike-34338.firebaseapp.com",
  projectId: "antike-34338",
  storageBucket: "antike-34338.firebasestorage.app",
  messagingSenderId: "731698249474",
  appId: "1:731698249474:web:2beca0c9f51ce2048b4c1b",
  measurementId: "G-V7ZZ8P01B5",
};

// Prevent re-initializing on hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app;
