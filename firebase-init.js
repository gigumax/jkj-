// Firebase initialization for Explore & Build 3D multiplayer
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
    getFirestore, collection, doc, setDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, getDocs, serverTimestamp,
    addDoc, orderBy, limit
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
    getAuth, signInAnonymously, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyB1pneg4dO0cF1SMcaZpLWnUbwJ_02FW1Y",
    authDomain: "explore-build-3d.firebaseapp.com",
    projectId: "explore-build-3d",
    storageBucket: "explore-build-3d.firebasestorage.app",
    messagingSenderId: "476462257328",
    appId: "1:476462257328:web:5dc778aa28d7b509335775"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
    db, auth, collection, doc, setDoc, updateDoc, deleteDoc,
    onSnapshot, query, where, getDocs, serverTimestamp,
    addDoc, orderBy, limit, signInAnonymously, onAuthStateChanged
};
