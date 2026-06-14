function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // अपना Admin Email और Password यहाँ डालें
  if (
    email === "unnatiselfhelpgroup@gmail.com" &&
    password === "Vinod@1981"
  ) {
    window.location.href = "admin-dashboard.html";
  } else {
    alert("❌ गलत Email या Password");
  }
}
