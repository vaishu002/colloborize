// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { onSnapshot } from 'firebase/firestore'; // Import onSnapshot here
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAv8LgJ6BB2RLCwq-FeLVEom2465maPRFc",
  authDomain: "slack-clone-570a3.firebaseapp.com",
  projectId: "slack-clone-570a3",
  storageBucket: "slack-clone-570a3.appspot.com",
  messagingSenderId: "309913047855",
  appId: "1:309913047855:web:8f8acd4b0505d77e3c47da",
  measurementId: "G-Q644Z1E5PJ"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp);

export { auth, provider, db, storage,onSnapshot }; // Export onSnapshot
