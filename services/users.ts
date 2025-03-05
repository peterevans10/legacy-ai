import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '@/config/firebase';

const firestore = getFirestore();

export interface UserProfile {
  id: string;
  phoneNumber: string;
  name: string;
  username: string | null;
  email: string | null;
  profilePhotoUrl: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthdate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export const usersService = {
  /**
   * Check if a username is already taken
   */
  async isUsernameTaken(username: string): Promise<boolean> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  /**
   * Check if an email is already taken
   */
  async isEmailTaken(email: string): Promise<boolean> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  /**
   * Create or update a user profile
   */
  async saveProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('No authenticated user found');
    }

    // Check username uniqueness if provided
    if (profile.username) {
      const isTaken = await this.isUsernameTaken(profile.username);
      if (isTaken) {
        throw new Error('Username is already taken');
      }
    }

    // Check email uniqueness if provided
    if (profile.email) {
      const isTaken = await this.isEmailTaken(profile.email);
      if (isTaken) {
        throw new Error('Email is already taken');
      }
    }

    const userRef = doc(firestore, 'users', userId);
    const now = new Date().toISOString();
    
    // Check if user exists to determine if this is create or update
    const userDoc = await getDoc(userRef);
    const isNewUser = !userDoc.exists();

    await setDoc(userRef, {
      id: userId,
      ...profile,
      // Initialize empty fields for new users
      username: profile.username || null,
      email: profile.email || null,
      profilePhotoUrl: profile.profilePhotoUrl || null,
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
