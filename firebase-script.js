import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form = document.querySelector("form");

if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector("button");
        btn.disabled = true;
        btn.innerText = "सबमिट हो रहा है...";
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // 1. रिपोर्ट डेटाबेस में सेव करें
            data.createdAt = serverTimestamp();
            await addDoc(collection(db, "DailyReports"), data);
            
            // 2. उसी ईमेल की कुल रिपोर्ट्स गिनें
            const q = query(collection(db, "DailyReports"), where("email", "==", data.email));
            const snap = await getDocs(q);
            const count = snap.size;
            
            // 3. पात्रता लॉजिक: यदि रिपोर्ट 15 या उससे ज्यादा हो जाए
            if (count >= 15) {
                const userQ = query(collection(db, "StudentRegistrations"), where("email", "==", data.email));
                const userSnap = await getDocs(userQ);
                if (!userSnap.empty) {
                    await updateDoc(doc(db, "StudentRegistrations", userSnap.docs[0].id), {
                        eligibleForCertificate: true,
                        totalReports: count
                    });
                }
            }

            alert("पंजीकरण और रिपोर्ट सबमिट सफल! कुल रिपोर्ट: " + count);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("त्रुटि हुई, कृपया पुनः प्रयास करें।");
            btn.disabled = false;
            btn.innerText = "📤 दैनिक रिपोर्ट सबमिट करें";
        }
    };
}
