import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh8UrrajjEBybojie6PMj-wM32nIQ-UYY",
  authDomain: "quicknotes-da0da.firebaseapp.com",
  projectId: "quicknotes-da0da",
  storageBucket: "quicknotes-da0da.firebasestorage.app",
  messagingSenderId: "270773792227",
  appId: "1:270773792227:web:29314ba0728302b74b44d6",
  measurementId: "G-EB820PNPNR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);