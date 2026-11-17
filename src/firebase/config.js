import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBms5IpBWj53liLTOTJmLWDNRj680txto4",
  authDomain: "mi-ferreteria-react.firebaseapp.com",
  projectId: "mi-ferreteria-react",
  storageBucket: "mi-ferreteria-react.firebasestorage.app",
  messagingSenderId: "857287359749",
  appId: "1:857287359749:web:7cc3f8a4fd045465d24b6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);