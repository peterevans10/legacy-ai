import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '@/config/firebase';
import {
  PhoneAuthProvider,
  signInWithCredential,
  User,
  onAuthStateChanged,
  ApplicationVerifier,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth as firebaseAuthApp } from '@/config/firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBsVrUSXfW6en3OTRjuCz7a_hC_a2j2PzU",
  authDomain: "legacy-ai-b430f.firebaseapp.com",
  projectId: "legacy-ai-b430f",
  storageBucket: "legacy-ai-b430f.firebasestorage.app",
  messagingSenderId: "262440557476",
  appId: "1:262440557476:web:888c14e0e014c6c25d3f31",
  measurementId: "G-QFQBN91NYS"
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  verificationId: string;
  setVerificationId: (id: string) => void;
  recaptchaVerifier: React.RefObject<FirebaseRecaptchaVerifierModal>;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>;
  confirmCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const recaptchaVerifier = React.useRef<FirebaseRecaptchaVerifierModal>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    try {
      if (!recaptchaVerifier.current) {
        throw new Error('reCAPTCHA verifier is not initialized');
      }

      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current as ApplicationVerifier
      );
      setVerificationId(verificationId);
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  };

  const confirmCode = async (code: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error('Error confirming code:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    phoneNumber,
    setPhoneNumber,
    verificationId,
    setVerificationId,
    recaptchaVerifier,
    signInWithPhoneNumber,
    confirmCode,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
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
