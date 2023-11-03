// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
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
export {firebaseConfig}
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db =  getFirestore(app);
export const provider = new GoogleAuthProvider();