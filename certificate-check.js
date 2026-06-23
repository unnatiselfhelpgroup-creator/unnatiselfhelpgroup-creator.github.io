import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

window.checkCert = async function () {
    const certInput = document.getElementById("certInput");
    const result = document.getElementById("resultBox");
    const certNo = certInput.value.trim();
    if (!certNo) { alert("कृपया नंबर दर्ज करें।"); return; }
    result.style.display = "block";
    result.innerHTML = "सत्यापित किया जा रहा है...";
    try {
        const snap = await getDoc(doc(db, "Certificates", certNo));
        if (snap.exists()) {
            const d = snap.data();
            result.innerHTML = `<h3>✅ मान्य है</h3><p>नाम: ${d.name}</p><p>ID: ${d.volunteer_id}</p>`;
        } else {
            result.innerHTML = `<h3>❌ अमान्य है</h3>`;
        }
    } catch (e) { result.innerHTML = "त्रुटि हुई।"; }
};
