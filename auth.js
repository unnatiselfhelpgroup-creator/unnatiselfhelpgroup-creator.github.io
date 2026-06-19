import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) { alert("कृपया Email और Password दर्ज करें"); return; }
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "admin-dashboard.html";
    } catch (error) { alert("Login Failed: " + error.message); }
}

async function logout() {
    try {
        await signOut(auth);
        window.location.href = "admin-login.html";
    } catch (error) { alert("Logout Error: " + error.message); }
}
window.login = login;
window.logout = logout;
