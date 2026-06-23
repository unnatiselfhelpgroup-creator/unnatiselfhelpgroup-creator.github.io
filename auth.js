import { auth } from "./firebase-config.js";

import {
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// =======================
// Admin Login
// =======================
async function login() {

const email =
    document.getElementById("email")
    ?.value
    .trim();

const password =
    document.getElementById("password")
    ?.value
    .trim();

if (!email || !password) {
    alert(
        "कृपया Email और Password दर्ज करें"
    );
    return;
}

try {

    const loginBtn =
        document.querySelector("button");

    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerText =
            "कृपया प्रतीक्षा करें...";
    }

    await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    window.location.href =
        "admin-dashboard.html";

} catch (error) {

    console.error(
        "Login Error:",
        error
    );

    switch (error.code) {

        case "auth/invalid-credential":
            alert(
                "गलत Email या Password।"
            );
            break;

        case "auth/user-not-found":
            alert(
                "यह Email पंजीकृत नहीं है।"
            );
            break;

        case "auth/too-many-requests":
            alert(
                "अधिक प्रयास किए गए हैं। कृपया कुछ देर बाद पुनः प्रयास करें।"
            );
            break;

        default:
            alert(
                "Login Failed. कृपया पुनः प्रयास करें।"
            );
    }

    const loginBtn =
        document.querySelector("button");

    if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerText = "Login";
    }
}

}

// =======================
// Logout
// =======================
async function logout() {

try {

    await signOut(auth);

    window.location.href =
        "admin-login.html";

} catch (error) {

    console.error(
        "Logout Error:",
        error
    );

    alert(
        "Logout Error: " +
        error.message
    );
}

}

// =======================
// Enter Key Login Support
// =======================
document.addEventListener(
"keydown",
(e) => {
if (e.key === "Enter") {
login();
}
}
);

// =======================
// Global Functions
// =======================
window.login = login;
window.logout = logout;
