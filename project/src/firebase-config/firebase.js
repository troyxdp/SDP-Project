// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0gjdLAsXfSUtQUY0vtu0awHBLXWEbwng",
  authDomain: "sdp-project-b28aa.firebaseapp.com",
  projectId: "sdp-project-b28aa",
  storageBucket: "sdp-project-b28aa.appspot.com",
  messagingSenderId: "780419645545",
  appId: "1:780419645545:web:f52790702cc23f5b8e22f8"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
