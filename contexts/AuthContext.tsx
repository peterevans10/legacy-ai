import React, { createContext, useState, useContext, useEffect } from 'react';
import { firebaseAuth } from '@/config/firebase';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  verificationId: string;
  setVerificationId: (id: string) => void;
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>;
  confirmCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    try {
      const confirmation = await firebaseAuth.signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  };

  const confirmCode = async (code: string) => {
    try {
      const credential = firebaseAuth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      await firebaseAuth.signInWithCredential(credential);
    } catch (error) {
      console.error('Error confirming code:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuth.signOut();
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
    signInWithPhoneNumber,
    confirmCode,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
