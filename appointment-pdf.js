window.generateAppointmentPDF =
function (data) {

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);
doc.text(
"Appointment Letter",
105,
20,
{
align: "center"
}
);

doc.setFontSize(12);

let y = 40;

doc.text(
`Name : ${data.name || ""}`,
20,
y
);

y += 10;

doc.text(
`Father : ${data.father_name || ""}`,
20,
y
);

y += 10;

doc.text(
`Mobile : ${data.mobile || ""}`,
20,
y
);

y += 10;

doc.text(
`Email : ${data.email || ""}`,
20,
y
);

y += 10;

doc.text(
`Address : ${data.address || ""}`,
20,
y
);

y += 20;

const paragraph =
`Dear ${data.name || "Member"}, You are hereby appointed as ${data.designation || "Volunteer"} in Unnati Sawaye Sahayata Samiti under the Gau Mata Rashtramata Samman Abhiyan. Your contribution towards social service, cow protection, awareness campaigns and organisational activities is highly appreciated.`;

const lines =
doc.splitTextToSize(
paragraph,
170
);

doc.text(
lines,
20,
y
);

doc.save(
`${data.name || "Member"}-Appointment-Letter.pdf`
);

};
