import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';



const firebaseConfig = {
  apiKey: "AIzaSyC0k7lWqb1U1k-U8Z3wiTF_I7PSMZlJwNM",
  authDomain: "vshop-cf953.firebaseapp.com",
  projectId: "vshop-cf953",
  storageBucket: "vshop-cf953.appspot.com",
  messagingSenderId: "759897574354",
  appId: "1:759897574354:web:212b8dbc93ad4b878ad60b"
};


const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);