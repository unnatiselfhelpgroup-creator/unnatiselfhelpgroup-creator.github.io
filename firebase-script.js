import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
// ✅ Version 12.14.0 — firebase-config.js के साथ match


// =======================
// Email Notification
// इस्तेमाल होने वाला EmailJS टेम्पलेट ("Contact Us" / template_wvzbj7p) इन वेरिएबल्स
// की अपेक्षा रखता है: name, mobile, email, designation, doc_id, type
// (और From Name / Reply To के लिए user_name, user_email)
// =======================
export async function sendEmailNotification(data, docId, collectionName, formLabel) {
    try {

        const templateParams = {
            user_name: data.name || "",
            user_email: data.email || "",
            name: data.name || "",
            mobile: data.mobile || "",
            email: data.email || "",
            designation: data.designation || formLabel || "-",
            doc_id: docId,
            // यह वही कलेक्शन नाम है जिसमें डेटा सेव हुआ — Approve/Reject बटन इसी
            // value को admin-action.html?type=... में भेजते हैं ताकि सही कलेक्शन अपडेट हो
            type: collectionName
        };

        // EmailJS तभी चलेगा जब SDK लोड हो (हर फॉर्म पेज में EmailJS SDK <script> टैग जोड़ा गया है)
        if (typeof emailjs !== "undefined") {
            await emailjs.send(
                "service_63pefgf",
                "template_wvzbj7p",
                templateParams
            );
        } else {
            console.warn("EmailJS SDK लोड नहीं है, नोटिफिकेशन ईमेल नहीं भेजी जा सकी।");
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

    // हर फॉर्म अपने HTML में data-collection="Certificates" / "DailyReports" / "IDcard" / "Appointments"
    // जैसा एक attribute देता है ताकि डेटा सही Firestore कलेक्शन में जाए।
    const collectionName = form.dataset.collection || "Appointments";
    const formLabel = form.dataset.formLabel || collectionName;

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
                        collectionName
                    ),
                    data
                );

            await sendEmailNotification(
                data,
                docRef.id,
                collectionName,
                formLabel
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
