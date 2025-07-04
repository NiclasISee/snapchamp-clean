// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
 