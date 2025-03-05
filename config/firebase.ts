import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
