import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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

window.checkCert = async function () {
    const certInput = document.getElementById("certInput");
    const result = document.getElementById("resultBox");
    
    if (!certInput) return;
    
    const certNo = certInput.value.trim();

    if (!certNo) {
        alert("कृपया प्रमाणपत्र संख्या दर्ज करें।");
        return;
    }

    // लोडिंग स्टेट दिखाएँ
    result.style.display = "block";
    result.innerHTML = "सत्यापित किया जा रहा है...";

    try {
        const ref = doc(db, "Certificates", certNo);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const d = snap.data();
            result.className = "result valid";
            result.innerHTML = `
                <h3>✅ प्रमाणपत्र मान्य है</h3>
                <p><b>प्रमाणपत्र संख्या :</b> ${certNo}</p>
                <p><b>नाम :</b> ${d.name || "N/A"}</p>
                <p><b>पिता/पति का नाम :</b> ${d.father_name || "N/A"}</p>
                <p><b>वॉलंटियर आईडी :</b> ${d.volunteer_id || "N/A"}</p>
                <p><b>सेवा अवधि :</b> ${d.duration || "N/A"}</p>
                <p><b>सामाजिक कार्य :</b> ${d.work_details || "N/A"}</p>
                <p><b>जारी तिथि :</b> ${d.issueDate || "N/A"}</p>
                <p><b>स्थिति :</b> ${d.status || "Verified"}</p>
                <p><b>NITI Aayog Unique ID :</b> US-2016/0108273</p>
            `;
        } else {
            result.className = "result invalid";
            result.innerHTML = `<h3>❌ प्रमाणपत्र संख्या उपलब्ध नहीं है</h3><p>कृपया सही Certificate Number दर्ज करें।</p>`;
        }
    } catch (error) {
        console.error("Verification Error:", error);
        result.className = "result invalid";
        result.innerHTML = `<h3>❌ Error</h3><p>सत्यापन सेवा अभी उपलब्ध नहीं है। कृपया बाद में प्रयास करें।</p>`;
    }
};
