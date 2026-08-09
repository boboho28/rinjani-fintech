import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVQHz-Y8uXdB99Tzezxg_rOkhKvScHXMo",
  authDomain: "togelup-management-2a1d8.firebaseapp.com",
  projectId: "togelup-management-2a1d8",
  storageBucket: "togelup-management-2a1d8.firebasestorage.app",
  messagingSenderId: "924609594502",
  appId: "1:924609594502:web:d484d4b3030ec42db57d07",
  measurementId: "G-R5LD81E2BC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
