import {
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
auth
}
from "./firebase-config.js";

function login() {

const email =
document.getElementById("email")
.value.trim();

const password =
document.getElementById("password")
.value.trim();

signInWithEmailAndPassword(
auth,
email,
password
)
.then(() => {

alert("✅ Login Successful");

window.location.href =
  "admin-dashboard.html";

})
.catch((error) => {

alert("❌ " + error.message);

});

}

window.login = login;
