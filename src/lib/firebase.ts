// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGSqUWqK5RoQmbSonbWwWSAIf0uHA8G5U",
    authDomain: "ecocoin-market.firebaseapp.com",
    projectId: "ecocoin-market",
    storageBucket: "ecocoin-market.firebasestorage.app",
    messagingSenderId: "77847710747",
    appId: "1:77847710747:web:2be9652fbbf43d1fc97cbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
