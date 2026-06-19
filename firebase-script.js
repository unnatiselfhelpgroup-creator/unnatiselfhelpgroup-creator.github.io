import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
const form = document.querySelector("form");
if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, "DailyReports"), data);
        const count = (await getDocs(query(collection(db, "DailyReports"), where("email", "==", data.email)))).size;
        if (count >= 15) {
            const userSnap = await getDocs(query(collection(db, "StudentRegistrations"), where("email", "==", data.email)));
            if (!userSnap.empty) await updateDoc(doc(db, "StudentRegistrations", userSnap.docs[0].id), { eligibleForCertificate: true });
        }
        alert("सफलतापूर्वक सबमिट किया गया!"); window.location.reload();
    };
}
