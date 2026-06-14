import { db } from "./firebase-config.js";

import {
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// EMAILJS INIT
// =========================

emailjs.init("AvD_f76bB4qjYnGb0");

// =========================
// EMAIL FUNCTION
// =========================

async function sendMail(
  name,
  email,
  subject,
  message
) {
  try {

    await emailjs.send(
      "service_63pefgf",
      "template_6cetpmr",
      {
        name: name,
        email: email,
        subject: subject,
        message: message
      }
    );

  } catch (error) {

    console.log(error);
    alert("Email Error : " + error.message);

  }
}

// =========================
// VERIFY APPLICATION
// =========================

window.verifyApplication =
async function (
  collectionName,
  docId,
  name,
  email,
  data
) {

  try {

    await updateDoc(
      doc(
        db,
        collectionName,
        docId
      ),
      {
        status: "verified",
        verifiedAt:
        new Date().toISOString()
      }
    );

    // PDF Generate
    if (
      window.generateAppointmentPDF &&
      data
    ) {
      window.generateAppointmentPDF(data);
    }

    await sendMail(
      name,
      email,
      "आवेदन सत्यापित",
      "आपका आवेदन सफलतापूर्वक Verified कर दिया गया है।"
    );

    alert("✅ Application Verified");

    location.reload();

  } catch (error) {

    console.log(error);
    alert(
      "Verify Error : " +
      error.message
    );

  }
};

// =========================
// REJECT APPLICATION
// =========================

window.rejectApplication =
async function (
  collectionName,
  docId,
  name,
  email
) {

  try {

    await updateDoc(
      doc(
        db,
        collectionName,
        docId
      ),
      {
        status: "rejected",
        rejectedAt:
        new Date().toISOString()
      }
    );

    await sendMail(
      name,
      email,
      "आवेदन अस्वीकृत",
      "आपका आवेदन Rejected कर दिया गया है।"
    );

    alert(
      "❌ Application Rejected"
    );

    location.reload();

  } catch (error) {

    console.log(error);
    alert(
      "Reject Error : " +
      error.message
    );

  }
};

// =========================
// DELETE APPLICATION
// =========================

window.deleteApplication =
async function (
  collectionName,
  docId
) {

  const ok =
  confirm(
    "क्या आप आवेदन हटाना चाहते हैं?"
  );

  if (!ok) return;

  try {

    await deleteDoc(
      doc(
        db,
        collectionName,
        docId
      )
    );

    alert(
      "🗑️ Application Deleted"
    );

    location.reload();

  } catch (error) {

    console.log(error);
    alert(
      "Delete Error : " +
      error.message
    );

  }
};
