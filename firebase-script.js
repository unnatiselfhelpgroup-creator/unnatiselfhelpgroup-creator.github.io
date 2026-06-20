import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


// =======================
// Email Notification
// =======================
export async function sendEmailNotification(data, docId) {
    try {

        const templateParams = {
            name: data.name || "",
            mobile: data.mobile || "",
            email: data.email || "",
            designation: data.designation || "",
            doc_id: docId
        };

        // EmailJS तभी चलेगा जब SDK लोड हो
        if (typeof emailjs !== "undefined") {
            await emailjs.send(
                "YOUR_SERVICE_ID",
                "YOUR_TEMPLATE_ID",
                templateParams
            );
        }

    } catch (error) {
        console.error("Email Error:", error);
    }
}


// =======================
// Form Submit
// =======================
const form = document.querySelector("form");

if (form) {

    form.onsubmit = async (e) => {

        e.preventDefault();

        const submitBtn =
            form.querySelector(
                'button[type="submit"]'
            );

        try {

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText =
                    "कृपया प्रतीक्षा करें...";
            }

            const data =
                Object.fromEntries(
                    new FormData(form).entries()
                );

            data.status = "Pending";
            data.createdAt =
                serverTimestamp();

            const docRef =
                await addDoc(
                    collection(
                        db,
                        "Appointments"
                    ),
                    data
                );

            await sendEmailNotification(
                data,
                docRef.id
            );

            alert(
                "आवेदन सफलतापूर्वक सबमिट हो गया।"
            );

            window.location.reload();

        } catch (error) {

            console.error(error);

            alert(
                "आवेदन सबमिट नहीं हो सका। कृपया पुनः प्रयास करें।"
            );

        } finally {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText =
                    "सबमिट करें";
            }
        }
    };
}
