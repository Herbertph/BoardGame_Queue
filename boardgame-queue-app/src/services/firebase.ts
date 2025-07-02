
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbSYqexa_uAK6dZLr3aPz8iad924OGz0c",
  authDomain: "boardgamequeue.firebaseapp.com",
  projectId: "boardgamequeue",
  storageBucket: "boardgamequeue.firebasestorage.app",
  messagingSenderId: "651091766748",
  appId: "1:651091766748:web:661ed2fa795f1a0c63f319"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };