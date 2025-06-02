import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBUA4umT7toQcZGn6u3Csf5cnzS2mCx280",
  authDomain: "sp2025-inf124.firebaseapp.com",
  projectId: "sp2025-inf124",
  storageBucket: "sp2025-inf124.firebasestorage.app",
  messagingSenderId: "489605456999",
  appId: "1:489605456999:web:e4ffae8ef51eaa692720c2",
  measurementId: "G-WN7L311ZB0"
};

const firebaseApp = initializeApp(firebaseConfig); 

const auth = getAuth(firebaseApp); 
const firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, firestore }; 