import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  // If auth is not configured, don't wait for it
  const [loading, setLoading] = useState(!!auth);

  function signup(email, password) {
    if (!auth) throw new Error('Firebase not configured');
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    if (!auth) throw new Error('Firebase not configured');
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (!auth) throw new Error('Firebase not configured');
    return signOut(auth);
  }

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
