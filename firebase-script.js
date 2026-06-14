import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc
}
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const storage = getStorage(app);

window.db = db;

// EmailJS Initialize
emailjs.init("AvD_f76bB4qjYnGb0");


// Common Function
function saveData(formId, collectionName) {

  const form = document.getElementById(formId);

  if (!form) return;

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Common Fields
    data.status = "pending";
    data.createdAt = Timestamp.now();

    try {

      // Auto Volunteer ID
      if (!data.volunteer_id) {
        data.volunteer_id = "USHS-" + Date.now();
      }

      // Auto ID Number
      if (!data.id_number) {
        data.id_number =
          "ID-" +
          Math.floor(100000 + Math.random() * 900000);
      }

      // ID Card Form
      if (formId === "idCardForm") {

        data.cardIssued = false;

        const photoFile =
          form.querySelector('input[name="photo"]')
          ?.files[0];

        if (photoFile) {

          // 2MB Limit
          if (photoFile.size > 2 * 1024 * 1024) {
            alert("फोटो 2MB से कम रखें।");
            return;
          }

          // Only Images
          if (!photoFile.type.startsWith("image/")) {
            alert("केवल Image File अपलोड करें।");
            return;
          }

          const fileName =
            `idcards/${Date.now()}_${photoFile.name}`;

          const storageRef =
            ref(storage, fileName);

          await uploadBytes(
            storageRef,
            photoFile
          );

          data.photoURL =
            await getDownloadURL(storageRef);
        }
      }

      // Save in Firestore
      await addDoc(
        collection(db, collectionName),
        data
      );

      // Email Notification
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
          hours: data.hours || "",
          id_number: data.id_number || ""
        }
      );

      alert("✅ आवेदन सफलतापूर्वक जमा हो गया।");

      form.reset();

    } catch (error) {

      console.error(error);

      alert(
        "❌ Error : " + error.message
      );
    }

  });
}


// Appointment Form
saveData(
  "appointmentForm",
  "Appointments"
);

// Certificate Request Form
saveData(
  "certRequestForm",
  "CertificateRequests"
);

// ID Card Form
saveData(
  "idCardForm",
  "IDCards"
);

// Student Registration Form
saveData(
  "studentRegForm",
  "Students"
);

// Daily Report Form
saveData(
  "dailyReportForm",
  "DailyReports"
);

// Donation Form
saveData(
  "donationForm",
  "Donations"
);
// =========================
// VERIFY / REJECT / DELETE
// =========================

async function sendMail(
  name,
  email,
  subject,
  message
){

  try{

    await emailjs.send(
      "service_63pefgf",
      "template_6cetpmr",
      {
        name:name,
        email:email,
        subject:subject,
        message:message
      }
    );

  }
  catch(error){

    console.log(error);

  }

}

window.verifyApplication =
async function(
  collectionName,
  docId,
  name,
  email
  data
){

  try{

    await updateDoc(
      doc(db,collectionName,docId),
      {
        status:"verified"
      }
    );

    await sendMail(
      name,
      email,
      "आवेदन सत्यापित",
      "आपका आवेदन सफलतापूर्वक Verified कर दिया गया है।"
    );

    alert("✅ Application Verified");

    location.reload();

  }
  catch(error){

    console.log(error);

  }

};

window.rejectApplication =
async function(
  collectionName,
  docId,
  name,
  email
){

  try{

    await updateDoc(
      doc(db,collectionName,docId),
      {
        status:"rejected"
      }
    );

    await sendMail(
      name,
      email,
      "आवेदन अस्वीकृत",
      "आपका आवेदन Rejected कर दिया गया है।"
    );

    alert("❌ Application Rejected");

    location.reload();

  }
  catch(error){

    console.log(error);

  }

};

window.deleteApplication =
async function(
  collectionName,
  docId
){

  if(
    confirm("क्या आप आवेदन हटाना चाहते हैं?")
  ){

    await deleteDoc(
      doc(db,collectionName,docId)
    );

    alert("🗑️ Application Deleted");

    location.reload();

  }

};
