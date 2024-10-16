import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where, serverTimestamp, arrayUnion, updateDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: "chat-app-98f56.firebaseapp.com",
    projectId: "chat-app-98f56",
    storageBucket: "chat-app-98f56.appspot.com",
    messagingSenderId: "649498295067",
    appId: "1:649498295067:web:6ca0398d5e0784f1c1f1be",
    measurementId: "G-VK6DE2TZSJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

export { app, auth, createUserWithEmailAndPassword, db, doc, setDoc, storage, ref, uploadBytesResumable, getDownloadURL, signInWithEmailAndPassword, onAuthStateChanged, getDoc, onSnapshot, collection, query, where, serverTimestamp, arrayUnion, updateDoc, getDocs }