// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "merm-estate-5c1d1.firebaseapp.com",
  projectId: "merm-estate-5c1d1",
  storageBucket: "merm-estate-5c1d1.appspot.com",
  messagingSenderId: "593409455996",
  appId: "1:593409455996:web:8d3616de54792f8a4f96f9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);