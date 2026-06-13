import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNEZ03VUTOD-eJjPsMP4b0Ykh4eiigqPQ",
  authDomain: "ngo-certificate-system.firebaseapp.com",
  projectId: "ngo-certificate-system",
  storageBucket: "ngo-certificate-system.firebasestorage.app",
  messagingSenderId: "664351169113",
  appId: "1:664351169113:web:3c476e199d369615c6ef48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  data.status = "pending"; 
  data.createdAt = new Date();

  try {
    await addDoc(collection(db, "Submissions"), data);
    alert("आवेदन जमा हो गया! वेरिफिकेशन के बाद संपर्क किया जाएगा।");
    e.target.reset();
  } catch (e) { alert("Error: " + e.message); }
});
