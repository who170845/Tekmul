//import { defineStore } from "pinia";
//import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  querySnapshot,
  getDocs
} from "firebase/firestore";

// isikan firebaseConfig disini


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFWx5nUYaq8zkOLtX2RgryLdhVhzAHUsI",
  authDomain: "tekmulstt.firebaseapp.com",
  projectId: "tekmulstt",
  storageBucket: "tekmulstt.appspot.com",
  messagingSenderId: "226752579661",
  appId: "1:226752579661:web:8402d53411ac08cc29b404"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};