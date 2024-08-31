import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
  authDomain: "leader-board-3a666.firebaseapp.com",
  projectId: "leader-board-3a666",
  storageBucket: "leader-board-3a666.appspot.com",
  messagingSenderId: "996296911968",
  appId: "1:996296911968:web:483ebd5820faa2bf456705",
  measurementId: "G-RKYCQ8ZJLN"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);