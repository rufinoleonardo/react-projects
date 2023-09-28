import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAUioMfjQtP4VdYp0afTINHhnKLmU4ETo",
  authDomain: "sistema-chamados-b7600.firebaseapp.com",
  projectId: "sistema-chamados-b7600",
  storageBucket: "sistema-chamados-b7600.appspot.com",
  messagingSenderId: "24111354463",
  appId: "1:24111354463:web:53f4fc1d5b4d626dc741ea",
  measurementId: "G-KXEK7FS24X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
