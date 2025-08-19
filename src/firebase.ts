// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCxoJbhUcPbqlhm4jt8351ebjogTITV1L4",
  authDomain: "sonargaon-b5f7e.firebaseapp.com",
  projectId: "sonargaon-b5f7e",
  storageBucket: "sonargaon-b5f7e.firebasestorage.app",
  messagingSenderId: "805582492378",
  appId: "1:805582492378:web:8b0f9e2b50be3b95674be3",
  measurementId: "G-D38VQ9MPRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;