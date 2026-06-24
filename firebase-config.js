import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCNEZ03VUTOD-eJjPsMP4b0Ykh4eiigqPQ",
    authDomain: "ngo-certificate-system.firebaseapp.com",
    projectId: "ngo-certificate-system",
    storageBucket: "ngo-certificate-system.firebasestorage.app",
    messagingSenderId: "664351169113",
    appId: "1:664351169113:web:3c476e199d369615c6ef48"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// storage export हटाया — Base64 Firestore में save होगी (paid plan नहीं चाहिए)
