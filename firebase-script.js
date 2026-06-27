// =============================================
// firebase-script.js — Firebase v10.12.2
// उन्नति स्वयं सहायता समिति
// =============================================
import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// EmailJS Notification
export async function sendEmailNotification(data, docId, collectionName, formLabel) {
    try {
        const templateParams = {
            user_name:   data.name || "",
            user_email:  data.email || "",
            name:        data.name || "",
            mobile:      data.mobile || "",
            email:       data.email || "",
            designation: data.designation || formLabel || "-",
            doc_id:      docId,
            type:        collectionName
        };
        if (typeof emailjs !== "undefined") {
            await emailjs.send("service_63pefgf", "template_wvzbj7p", templateParams);
        }
    } catch (error) {
        console.error("Email Error:", error);
    }
}

// Form Submit Handler
const form = document.querySelector("form");
if (form) {
    const collectionName = form.dataset.collection || "Appointments";
    const formLabel = form.dataset.formLabel || collectionName;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        try {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "कृपया प्रतीक्षा करें..."; }
            const data = Object.fromEntries(new FormData(form).entries());
            data.status = "Pending";
            data.createdAt = serverTimestamp();
            const docRef = await addDoc(collection(db, collectionName), data);
            await sendEmailNotification(data, docRef.id, collectionName, formLabel);
            alert("आवेदन सफलतापूर्वक सबमिट हो गया।");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("आवेदन सबमिट नहीं हो सका। कृपया पुनः प्रयास करें।");
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "सबमिट करें"; }
        }
    };
}
