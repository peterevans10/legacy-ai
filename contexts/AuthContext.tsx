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
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebase.apiKey,
  authDomain: Constants.expoConfig?.extra?.firebase.authDomain,
  projectId: Constants.expoConfig?.extra?.firebase.projectId,
  storageBucket: Constants.expoConfig?.extra?.firebase.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebase.messagingSenderId,
  appId: Constants.expoConfig?.extra?.firebase.appId,
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
