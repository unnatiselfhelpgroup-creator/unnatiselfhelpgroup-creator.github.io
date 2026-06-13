import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
Timestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

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

// EmailJS Initialize
emailjs.init("AvD_f76bB4qjYnGb0");

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
  // Save in Firestore
  await addDoc(collection(db, collectionName), data);

  // Send Email Notification
  await emailjs.send(
    "service_63pefgf",
    "template_6cetpmr",
    {
      title: "नया आवेदन प्राप्त हुआ",
      form_type: collectionName,
      name: data.name || "",
      father_name: data.father_name || "",
      mobile: data.mobile || "",
      email: data.email || "",
      address: data.address || "",
      volunteer_id: data.volunteer_id || "",
      designation: data.designation || "",
      college: data.college || "",
      duration: data.duration || "",
      work_details: data.work_details || "",
      hours: data.hours || ""
    }
  );

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

// Donations
saveData("donationForm", "Donations");
