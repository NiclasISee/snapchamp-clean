// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAf0Z9k3WTM_w-idLov2MV8t8rADqRKZcQ",
  authDomain: "camunity-fa0f4.firebaseapp.com",
  projectId: "camunity-fa0f4",
  storageBucket: "camunity-fa0f4.appspot.com",
  messagingSenderId: "1090967479806",
  appId: "1:1090967479806:web:1748d6d5194db5dc638caf",
  measurementId: "G-E1PQFLGC1X"
};

const app = initializeApp(firebaseConfig);

// Dienste exportieren
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
 