import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0I_hNFT72VZFkl9yBhs_Npz7sIGEGq-o",
  authDomain: "mitsride.firebaseapp.com",
  projectId: "mitsride",
  storageBucket: "mitsride.firebasestorage.app",
  messagingSenderId: "286272552061",
  appId: "1:286272552061:web:382cfad1a1ecf923760514",
  measurementId: "G-M4BYJNH8F3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
