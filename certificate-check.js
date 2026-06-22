import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

window.checkCert = async function () {
    const certInput = document.getElementById("certInput");
    const result    = document.getElementById("resultBox");
    const certNo    = certInput?.value.trim();

    if (!certNo) { alert("कृपया प्रमाण पत्र नंबर दर्ज करें।"); return; }
    if (!result) return;

    result.style.display = "block";
    result.innerHTML = "🔍 सत्यापित किया जा रहा है...";

    try {
        const snap = await getDoc(doc(db, "Certificates", certNo));
        if (snap.exists()) {
            const d = snap.data();
            result.innerHTML = `
                <h3 style="color:#00a651">✅ प्रमाण पत्र मान्य है</h3>
                <p><b>नाम:</b> ${d.name || "—"}</p>
                <p><b>Volunteer ID:</b> ${d.volunteer_id || "—"}</p>
                <p><b>पद:</b> ${d.designation || "—"}</p>`;
        } else {
            result.innerHTML = `<h3 style="color:#e74c3c">❌ यह प्रमाण पत्र अमान्य है।</h3>`;
        }
    } catch (e) {
        result.innerHTML = `<p style="color:red">त्रुटि हुई: ${e.message}</p>`;
    }
};
