import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA0I_hNFT72VZFkl9yBhs_Npz7sIGEGq-o",
  authDomain: "mitsride.firebaseapp.com",
  databaseURL: "https://mitsride-default-rtdb.firebaseio.com/",
  projectId: "mitsride",
  storageBucket: "mitsride.firebasestorage.app",
  messagingSenderId: "286272552061",
  appId: "1:286272552061:web:382cfad1a1ecf923760514",
  measurementId: "G-M4BYJNH8F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

// Log initialization for debugging
console.log("Firebase initialized:", {
  app: app.name,
  projectId: firebaseConfig.projectId,
  databaseURL: firebaseConfig.databaseURL
});
