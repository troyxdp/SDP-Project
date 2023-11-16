// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO31_skDnbuKiJY8riPgJEjfIg8BDtQ90",
  authDomain: "sdp-project-final.firebaseapp.com",
  projectId: "sdp-project-final",
  storageBucket: "sdp-project-final.appspot.com",
  messagingSenderId: "422366320836",
  appId: "1:422366320836:web:6bb1e756b6b01b59155191",
  measurementId: "G-NG4HXHBCY2"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
