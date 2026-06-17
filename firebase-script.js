import { db } from "./firebase-config.js";

import {
addDoc,
collection,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

div.querySelector(".print").onclick = () => {

const printWindow = window.open("", "_blank");

printWindow.document.write(`

<html>
<head>
<title>Appointment Letter</title>
<style>
body{
  font-family: Arial;
  padding:30px;
  line-height:1.8;
}
h2{
  text-align:center;
}
</style>
</head><body><h2>Appointment Letter</h2><p><b>Name :</b> ${data.name || ""}</p>
<p><b>Father :</b> ${data.father_name || ""}</p>
<p><b>Mobile :</b> ${data.mobile || ""}</p>
<p><b>Email :</b> ${data.email || ""}</p>
<p><b>Address :</b> ${data.address || ""}</p>
<p><b>District :</b> ${data.district || ""}</p>
<p><b>State :</b> ${data.state || ""}</p><br><p>
<p>
प्रिय ${data.name || "Member"},
</p>

<p>
आपको उन्नति स्वयं सहायता समिति में
<b>${data.designation || "Volunteer"}</b>
के पद पर नियुक्त किया जाता है।
</p>

<p>
आपकी नियुक्ति गौ माता राष्ट्रमाता सम्मान अभियान, सामाजिक सेवा, गौ संरक्षण,
जन-जागरूकता अभियान एवं संगठनात्मक गतिविधियों के संचालन हेतु की जाती है।
</p>

<p>
हमें पूर्ण विश्वास है कि आप अपने दायित्वों का निष्ठापूर्वक निर्वहन करते हुए
संगठन को नई ऊँचाइयों तक पहुँचाने में महत्वपूर्ण योगदान देंगे।
</p>
</p>
<p style="text-align:right;">
<img src="signature.png" width="120"><br>
<b>अधिकृत हस्ताक्षर</b><br>
उन्नति स्वयं सहायता समिति
</p>
</body>
</html>
const form = document.getElementById("studentRegForm");
const successBox = document.getElementById("studentSuccess");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: form.name.value,
        father_name: form.father_name.value,
        email: form.email.value,
        mobile: form.mobile.value,
        college: form.college.value,
        course: form.course.value,
        address: form.address.value,
        social_work: form.social_work.value,
duration: form.duration.value,
paymentStatus: "Pending",
adminApproved: false,
dailyReportEnabled: false,
certificateEnabled: false,
completedDays: 0,
status: "Pending",
        createdAt: serverTimestamp()
      };

      await addDoc(
        collection(db, "StudentRegistrations"),
        data
      );
      window.location.href =
"payment.html?type=student700";
if (window.generateAppointmentPDF) {
    window.generateAppointmentPDF(data);
}
      form.reset();

      if (successBox) {
        successBox.style.display = "block";
        successBox.scrollIntoView({
          behavior: "smooth"
        });
      }

    } catch (err) {
      console.log(err);
      alert("डेटा सेव नहीं हो सका");
    }
  });
}
