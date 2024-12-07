import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "the-notes-app-cfe0c.firebaseapp.com",
  projectId: "the-notes-app-cfe0c",
  storageBucket: "the-notes-app-cfe0c.appspot.com",
  messagingSenderId: "352919141780",
  appId: "1:352919141780:web:2ad4ca6348b40264bce381"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
