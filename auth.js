// =============================================
// auth.js — उन्नति स्वयं सहायता समिति
// Shared login/logout helpers
// Firebase v10.12.2 — matches firebase-config.js across the whole site
// =============================================
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function login() {
    const email    = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const errMsg   = document.getElementById("errMsg");

    if (errMsg) errMsg.textContent = "";

    if (!email || !password) {
        const msg = "कृपया Email और Password दर्ज करें";
        if (errMsg) errMsg.textContent = msg; else alert(msg);
        return;
    }

    const loginBtn = document.getElementById("loginBtn") || document.querySelector("button");
    if (loginBtn) { loginBtn.disabled = true; loginBtn.innerText = "कृपया प्रतीक्षा करें..."; }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace("admin-dashboard.html");
    } catch (error) {
        const msgs = {
            "auth/invalid-credential": "गलत Email या Password।",
            "auth/user-not-found":     "यह Email पंजीकृत नहीं है।",
            "auth/wrong-password":     "गलत Password।",
            "auth/too-many-requests":  "अधिक प्रयास हो गए। कृपया कुछ देर बाद पुनः प्रयास करें।",
            "auth/network-request-failed": "Internet connection जांचें।"
        };
        const msg = msgs[error.code] || "Login विफल। कृपया पुनः प्रयास करें।";
        if (errMsg) errMsg.textContent = msg; else alert(msg);
        if (loginBtn) { loginBtn.disabled = false; loginBtn.innerText = "Login"; }
    }
}

async function logout() {
    try {
        await signOut(auth);
        window.location.replace("admin-login.html");
    } catch (error) {
        alert("Logout Error: " + error.message);
    }
}

document.addEventListener("keydown", (e) => { if (e.key === "Enter") login(); });
window.login  = login;
window.logout = logout;
