import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// isikan firebaseConfig disini
const firebaseConfig = {
    apiKey: "AIzaSyDFWx5nUYaq8zkOLtX2RgryLdhVhzAHUsI",
    authDomain: "tekmulstt.firebaseapp.com",
    projectId: "tekmulstt",
    storageBucket: "tekmulstt.appspot.com",
    messagingSenderId: "226752579661",
    appId: "1:226752579661:web:8402d53411ac08cc29b404"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export const db = firebaseApp.firestore();