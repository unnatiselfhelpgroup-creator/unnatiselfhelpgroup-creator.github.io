function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("✅ Login Successful");
      window.location.href = "admin-dashboard.html";
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
}
