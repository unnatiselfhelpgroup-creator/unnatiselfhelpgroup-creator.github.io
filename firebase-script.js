div.querySelector(".pdf").onclick = () => {
if (window.generateAppointmentPDF) {
window.generateAppointmentPDF({
...data,
designation: data.designation || "Volunteer"
});
} else {
alert("appointment-pdf.js load नहीं हुआ।");
}
};

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
Dear ${data.name || "Member"},
</p><p>
You are hereby appointed as
<b>${data.designation || "Volunteer"}</b>
in Unnati Sawaye Sahayata Samiti under the Gau Mata Rashtramata Samman Abhiyan.
</p><p>
Your contribution towards social service, cow protection, awareness campaigns and organisational activities is highly appreciated.
</p></body>
</html>
`);printWindow.document.close();
printWindow.focus();
printWindow.print();
};
