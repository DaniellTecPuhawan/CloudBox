// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD22DFXDMTBTye5TEYAiremR4fWkfNyFrQ",
  authDomain: "world-of-art-app.firebaseapp.com",
  projectId: "world-of-art-app",
  storageBucket: "world-of-art-app.appspot.com",
  messagingSenderId: "379083289992",
  appId: "1:379083289992:web:ecbc4519bbc5ce320df63d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const ImageDb = getStorage(app)
const UserDb = getStorage(app)
export {ImageDb, UserDb}

