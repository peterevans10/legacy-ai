import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

// Get Firebase config from environment variables
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebase.apiKey,
  authDomain: Constants.expoConfig?.extra?.firebase.authDomain,
  projectId: Constants.expoConfig?.extra?.firebase.projectId,
  storageBucket: Constants.expoConfig?.extra?.firebase.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebase.messagingSenderId,
  appId: Constants.expoConfig?.extra?.firebase.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
