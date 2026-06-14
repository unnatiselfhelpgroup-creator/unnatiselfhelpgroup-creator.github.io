function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (
    email === "unnatiselfhelpgroup@gmail.com" &&
    password === "Vinod@1981"
  ) {
    window.location.href = "admin-dashboard.html";
  } else {
    alert("❌ गलत Email या Password");
  }
}
