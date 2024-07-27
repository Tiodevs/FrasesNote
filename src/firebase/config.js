// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSsmuNp8iA0ZrMPbe51T5dMswcAvozuhc",
  authDomain: "frasesnote.firebaseapp.com",
  projectId: "frasesnote",
  storageBucket: "frasesnote.appspot.com",
  messagingSenderId: "76687231558",
  appId: "1:76687231558:web:34bfd9a0e702f22774d847"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export {db}