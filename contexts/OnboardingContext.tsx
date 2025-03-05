import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { usersService, UserProfile } from '@/services/users';
import { useAuth } from './AuthContext';

type OnboardingData = {
  name: string;
  gender: UserProfile['gender'];
  birthdate: string;
};

type OnboardingContextType = {
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  saveUserProfile: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'hasCompletedOnboarding';
const ONBOARDING_DATA_KEY = 'onboardingData';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    gender: 'prefer_not_to_say',
    birthdate: '',
  });
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    checkOnboardingStatus();
    loadOnboardingData();
  }, []);

  useEffect(() => {
    if (isOnboarded === null) return;

    const inAuthGroup = segments[0] === 'onboarding';

    if (!isOnboarded && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (isOnboarded && inAuthGroup) {
      router.replace('/');
    }
  }, [isOnboarded, segments]);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      setIsOnboarded(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboarded(false);
    }
  };

  const loadOnboardingData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(ONBOARDING_DATA_KEY);
      if (savedData) {
        setOnboardingData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  };

  const handleSetIsOnboarded = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(value));
      setIsOnboarded(value);
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  const updateOnboardingData = async (data: Partial<OnboardingData>) => {
    try {
      const newData = { ...onboardingData, ...data };
      await AsyncStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(newData));
      setOnboardingData(newData);
    } catch (error) {
      console.error('Error updating onboarding data:', error);
    }
  };

  const saveUserProfile = async () => {
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      await usersService.saveProfile({
        phoneNumber: user.phoneNumber || '',
        name: onboardingData.name,
        gender: onboardingData.gender,
        birthdate: onboardingData.birthdate,
      });

      // Clear onboarding data from storage after successful save
      await AsyncStorage.removeItem(ONBOARDING_DATA_KEY);
      
      // Set onboarding as complete
      await handleSetIsOnboarded(true);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarded: isOnboarded ?? false,
        setIsOnboarded: handleSetIsOnboarded,
        onboardingData,
        updateOnboardingData,
        saveUserProfile,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}