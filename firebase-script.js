import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form = document.querySelector("form");
if (form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector("button");
        btn.disabled = true;
        btn.innerText = "सबमिट हो रहा है...";
        try {
            const data = Object.fromEntries(new FormData(form).entries());
            data.status = "pending";
            data.createdAt = serverTimestamp();
            await addDoc(collection(db, "StudentRegistrations"), data);
            alert("पंजीकरण सफल!");
            window.location.reload();
        } catch (err) {
            alert("त्रुटि हुई, कृपया पुनः प्रयास करें।");
            btn.disabled = false;
        }
    };
}
