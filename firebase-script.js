import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCNEZ03VUTOD-eJjPsMP4b0Ykh4eiigqPQ",
  authDomain: "ngo-certificate-system.firebaseapp.com",
  projectId: "ngo-certificate-system",
  storageBucket: "ngo-certificate-system.firebasestorage.app",
  messagingSenderId: "664351169113",
  appId: "1:664351169113:web:3c476e199d369615c6ef48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Common Function
async function saveData(formId, collectionName) {
  const form = document.getElementById(formId);

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.status = "pending";
    data.createdAt = Timestamp.now();

    try {
      await addDoc(collection(db, collectionName), data);

      alert("✅ आवेदन सफलतापूर्वक जमा हो गया।");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("❌ Error : " + error.message);
    }
  });
}

// Appointment Form
saveData("appointmentForm", "Appointments");

// Experience Certificate Request
saveData("certRequestForm", "CertificateRequests");

// ID Card Form
saveData("idCardForm", "IDCards");

// Student Registration
saveData("studentRegForm", "Students");

// Daily Report
saveData("dailyReportForm", "DailyReports");
