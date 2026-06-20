import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// फॉर्म सबमिट होते ही ईमेल भेजने वाला फंक्शन
export async function sendEmailNotification(data, docId) {
    const templateParams = {
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        designation: data.designation,
        doc_id: docId // यह सबसे जरूरी है
    };
    // EmailJS का उपयोग करें
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams);
}

// बाकी आपका पुराना सबमिट कोड...
const form = document.querySelector("form");
if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        data.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, "Appointments"), data);
        await sendEmailNotification(data, docRef.id); // यहाँ ईमेल ट्रिगर होगा
        alert("आवेदन सबमिट हो गया!"); window.location.reload();
    };
}
