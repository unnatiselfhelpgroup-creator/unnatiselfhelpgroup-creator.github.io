import { auth }
from "./firebase-config.js";

import {
signInWithEmailAndPassword,
signOut
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// ======================
// LOGIN
// ======================

async function login() {

const email =
document.getElementById("email")
.value.trim();

const password =
document.getElementById("password")
.value.trim();

if (!email || !password) {
alert("❌ Email और Password दर्ज करें");
return;
}

try {

await signInWithEmailAndPassword(
auth,
email,
password
);

alert("✅ Login Successful");

window.location.href =
"admin-dashboard.html";

}
catch (error) {

console.log(error);

alert(
"❌ Login Failed : " +
error.message
);

}

}

// ======================
// LOGOUT
// ======================

async function logout() {

try {

await signOut(auth);

alert("✅ Logout Successful");

window.location.href =
"admin-login.html";

}
catch (error) {

console.log(error);

alert(
"❌ Logout Error : " +
error.message
);

}

}

window.login = login;
window.logout = logout;
