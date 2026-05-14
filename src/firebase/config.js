import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQw-4OsExpCIjGOwRGkDzPnAv8D0RisgY",
  authDomain: "cargapro-94ada.firebaseapp.com",
  projectId: "cargapro-94ada",
  storageBucket: "cargapro-94ada.firebasestorage.app",
  messagingSenderId: "566899295949",
  appId: "1:566899295949:web:dffb0a8831477ab0f00b84"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);