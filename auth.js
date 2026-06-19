import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// ======================
// LOGIN FUNCTION
// ======================
async function login() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
        alert("❌ Error: Input fields missing!");
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("❌ कृपया Email और Password दर्ज करें");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ Login Successful");
        window.location.href = "admin-dashboard.html";
    } catch (error) {
        console.error("Login Error:", error);
        alert("❌ Login Failed: " + error.message);
    }
}

// ======================
// LOGOUT FUNCTION
// ======================
async function logout() {
    try {
        await signOut(auth);
        alert("✅ Logout Successful");
        window.location.href = "admin-login.html";
    } catch (error) {
        console.error("Logout Error:", error);
        alert("❌ Logout Error: " + error.message);
    }
}

// Exporting functions to global window object for HTML onclick access
window.login = login;
window.logout = logout;
