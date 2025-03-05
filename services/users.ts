import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '@/config/firebase';

const firestore = getFirestore();

export interface UserProfile {
  id: string;
  phoneNumber: string;
  name: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthdate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export const usersService = {
  /**
   * Create or update a user profile
   */
  async saveProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    const userRef = doc(firestore, 'users', userId);
    const now = new Date().toISOString();
    
    // Check if user exists to determine if this is create or update
    const userDoc = await getDoc(userRef);
    const isNewUser = !userDoc.exists();

    await setDoc(userRef, {
      id: userId,
      ...profile,
      createdAt: isNewUser ? now : userDoc.data()?.createdAt,
      updatedAt: now,
    });
  },

  /**
   * Get a user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as UserProfile;
  },

  /**
   * Get the current user's profile
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return null;
    }

    return this.getProfile(userId);
  },
};
