import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsVrUSXfW6en3OTRjuCz7a_hC_a2j2PzU",
  authDomain: "legacy-ai-b430f.firebaseapp.com",
  projectId: "legacy-ai-b430f",
  storageBucket: "legacy-ai-b430f.firebasestorage.app",
  messagingSenderId: "262440557476",
  appId: "1:262440557476:web:888c14e0e014c6c25d3f31",
  measurementId: "G-QFQBN91NYS"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const firebaseAuth = auth();
export default app;
