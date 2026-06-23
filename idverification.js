import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// =====================
// ID Verification Function
// =====================
window.verifyID = async function () {
    const idInput = document.getElementById("idInput");
    const result = document.getElementById("resultBox");

    if (!idInput) return;

    const volunteerID = idInput.value.trim();

    if (!volunteerID) {
        alert("कृपया वॉलंटियर ID दर्ज करें।");
        return;
    }

    // लोडिंग स्थिति दिखाएँ
    result.style.display = "block";
    result.innerHTML = "<h3>⏳ सत्यापन किया जा रहा है...</h3>";

    try {
        const q = query(collection(db, "IDcard"), where("volunteer_id", "==", volunteerID));
        const snap = await getDocs(q);

        if (!snap.empty) {
            const data = snap.docs[0].data();
            const status = data.status || "Verified";

            result.innerHTML = `
                <h3 style="color:#00ff99;">✅ ID कार्ड मान्य है</h3>
                <p><b>नाम :</b> ${data.name || "-"}</p>
                <p><b>पिता का नाम :</b> ${data.father_name || "-"}</p>
                <p><b>पद :</b> ${data.designation || "-"}</p>
                <p><b>मोबाइल :</b> ${data.mobile || "-"}</p>
                <p><b>ईमेल :</b> ${data.email || "-"}</p>
                <p><b>पता :</b> ${data.address || "-"}</p>
                <p><b>वॉलंटियर ID :</b> ${data.volunteer_id || "-"}</p>
                <p><b>स्थिति :</b> ${status}</p>
                ${data.photoURL ? `<img src="${data.photoURL}" style="width:120px; height:140px; object-fit:cover; border:2px solid #d4af37; border-radius:10px; margin-top:15px;">` : ""}
            `;
        } else {
            result.innerHTML = `
                <h3 style="color:red;">❌ यह वॉलंटियर ID उपलब्ध नहीं है।</h3>
                <p>कृपया ID पुनः जांचें।</p>
            `;
        }
    } catch (error) {
        console.error("Verification Error:", error);
        result.innerHTML = `
            <h3 style="color:red;">❌ Verification Error</h3>
            <p>सेवा अभी उपलब्ध नहीं है, कृपया बाद में प्रयास करें।</p>
        `;
    }
};
