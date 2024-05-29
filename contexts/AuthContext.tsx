import { useContext, useState, useEffect, createContext, useMemo } from "react"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"

import { FIREBASE_AUTH as auth } from "../firebase.config";

const AuthContext = createContext<any>({
  userSignIn: () => null,
  userSignUp: () => null,
  userSignOut: () => null,
  userVerify: () => null,
  userResetPassword: () => null,
  currentUser: null,
  isLoading: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsloading] = useState(true);

  const userSignUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userSignIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const userSignOut = () => {
    return signOut(auth);
  };

  const userVerify = () => {
    return sendEmailVerification(currentUser);
  };

  const userResetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsloading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userSignIn,
    userSignUp,
    userSignOut,
    userVerify,
    userResetPassword,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}
