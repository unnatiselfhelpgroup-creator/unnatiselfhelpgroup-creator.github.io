import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form = document.getElementById("studentRegForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. UI Feedback: बटन को डिसेबल करें
        const submitBtn = form.querySelector("button");
        submitBtn.disabled = true;
        submitBtn.innerText = "सबमिट हो रहा है...";

        try {
            // 2. फॉर्म डेटा इकट्ठा करें
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.createdAt = serverTimestamp();
            data.status = "pending";

            // 3. Firestore में डेटा सेव करें
            await addDoc(collection(db, "StudentRegistrations"), data);

            // 4. सेशन में डेटा सेव करें (पेमेंट पेज के लिए)
            sessionStorage.setItem("pendingStudentData", JSON.stringify(data));

            // 5. रसीद प्रिंट विंडो (सबमिट होने के बाद)
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
                <html>
                <head><title>Registration Receipt</title></head>
                <body style="font-family:Arial; padding:30px; line-height:1.6;">
                    <h2 style="text-align:center;">उन्नति स्वयं सहायता समिति</h2>
                    <p><b>नाम:</b> ${data.name}</p>
                    <p><b>मोबाइल:</b> ${data.mobile}</p>
                    <p><b>कोर्स:</b> ${data.course}</p>
                    <hr>
                    <p>आपका पंजीकरण सफलतापूर्वक प्राप्त हो गया है।</p>
                    <p>फीस भुगतान के बाद आपको डैशबोर्ड का एक्सेस मिलेगा।</p>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();

            // 6. पेमेंट पेज पर रीडायरेक्ट करें
            window.location.href = "payment.html?type=student700";

        } catch (err) {
            console.error("Submission Error:", err);
            alert("सबमिशन फेल हो गया, कृपया इंटरनेट चेक करें।");
            submitBtn.disabled = false;
            submitBtn.innerText = "पंजीकरण करें";
        }
    });
}
