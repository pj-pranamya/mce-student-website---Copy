import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFmroREHf5VAhqbNAxzD5LyvLryH01ZbQ",
  authDomain: "mce-student-website-e0faa.firebaseapp.com",
  projectId: "mce-student-website-e0faa",
  storageBucket: "mce-student-website-e0faa.appspot.com",
  messagingSenderId: "573648014564",
  appId: "1:573648014564:web:84480b82f2510bc34f70f1",
  measurementId: "G-GR9BCMCL36",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
