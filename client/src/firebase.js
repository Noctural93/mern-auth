// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-26d32.firebaseapp.com",
  projectId: "mern-auth-26d32",
  storageBucket: "mern-auth-26d32.appspot.com",
  messagingSenderId: "740740578738",
  appId: "1:740740578738:web:df0b0ce51bd29d72fcf8ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);