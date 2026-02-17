import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCnfjDXFP-qP_yea4vbWvD5nzlmDcjeIlU",
    authDomain: "werwolf-11fc1.firebaseapp.com",
    databaseURL: "https://werwolf-11fc1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "werwolf-11fc1",
    storageBucket: "werwolf-11fc1.firebasestorage.app",
    messagingSenderId: "84361151372",
    appId: "1:84361151372:web:35c6205952fa8317cf0ca9"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);