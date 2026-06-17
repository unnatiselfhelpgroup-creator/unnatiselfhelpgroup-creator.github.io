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
<title>volunteer Registration</title>
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
</head><body><h2>volunteer Registration</h2><p><b>Name :</b> ${data.name || ""}</p>
<p><b>Father :</b> ${data.father_name || ""}</p>
<p><b>Mobile :</b> ${data.mobile || ""}</p>
<p><b>Email :</b> ${data.email || ""}</p>
<p><b>Address :</b> ${data.address || ""}</p>
<p><b>District :</b> ${data.district || ""}</p>
<p><b>State :</b> ${data.state || ""}</p><br><p>
<p>
</p>
note: आप Volunteer Internship Program में प्रतिभागी के रूप में सम्मिलित हैं।
कार्य पूर्ण होने एवं Admin Approval के पश्चात आपको
Volunteer Internship Certificate प्रदान किया जाएगा।
</p>
</p>
आपका Volunteer Internship Program हेतु आवेदन सफलतापूर्वक प्राप्त एवं पंजीकृत हो चुका है।
सत्यापन के बाद आपको daily work report Dashboard/Internship संबंधी जानकारी प्रदान की जाएगी।
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
orientationCompleted: false,
internId: "",
Admin Approval के बाद आपको Daily Work Report Dashboard की Access प्रदान की जाएगी।

कार्यक्रम पूर्ण होने पर अनुभव एवं प्रमाण पत्र उपलब्ध कराया जाएगा।
        createdAt: serverTimestamp()
      };
emailjs.send(
  "service_63pefgf",
  "template_wvzbj7p",
  {
    user_name: form.name.value,
    user_email: form.email.value,
    subject: "आवेदन प्राप्ति - उन्नति स्वयं सहायता समिति",
    message:
      "प्रिय " + form.name.value +
      ",\n\nआपका आवेदन सफलतापूर्वक प्राप्त हो गया है।" +
      "\n\nनाम: " + form.name.value +
      "\nपिता का नाम: " + form.father_name.value +
      "\nमोबाइल: " + form.mobile.value +
      "\nकॉलेज: " + form.college.value +
      "\nकोर्स: " + form.course.value +
      "\nअवधि: " + form.duration.value +
      "\n\nआपका आवेदन अभी Pending स्थिति में है।"+
      फीस जमा एवं Admin Approval के बाद आपको Daily Work Report Dashboard की Access प्रदान की जाएगी।

कार्यक्रम पूर्ण होने पर अनुभव एवं प्रमाण पत्र उपलब्ध कराया जाएगा।
      "\n\nधन्यवाद\nउन्नति स्वयं सहायता समिति"
  },
  "AvD_f76bB4qjYnGb0"
)
.then(() => {
  console.log("Email Sent Successfully");
})
.catch((error) => {
  console.error("Email Error:", error);
});
      sessionStorage.setItem(
  "pendingStudentData",
  JSON.stringify(data)
);

window.location.href =
"payment.html?type=student700";

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
