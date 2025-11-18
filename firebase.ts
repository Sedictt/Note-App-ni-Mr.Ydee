import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkBhPCkP-6oFHyZDKPX_CT6OeMn2FzO2Q",
  authDomain: "aetheria-4a391.firebaseapp.com",
  projectId: "aetheria-4a391",
  storageBucket: "aetheria-4a391.appspot.com",
  messagingSenderId: "910312544469",
  appId: "1:910312544469:web:ca6e60f76cdda1fcfdea5c",
  measurementId: "G-JCW95DSCY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
