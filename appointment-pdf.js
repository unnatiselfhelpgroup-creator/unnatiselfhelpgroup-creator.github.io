window.generateAppointmentPDF = function(data){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.setFontSize(18);
doc.text(
"UNNATI SAWAYE SAHAYATA SAMITI",
20,
20
);

doc.setFontSize(12);

doc.text(
`Name : ${data.name}`,
20,
45
);

doc.text(
`Father Name : ${data.father_name}`,
20,
60
);

doc.text(
`Address : ${data.address}`,
20,
75
);

doc.text(
`Mobile : ${data.mobile}`,
20,
90
);

doc.text(
`Email : ${data.email}`,
20,
105
);

doc.text(
"Your Appointment Application has been Verified.",
20,
130
);

doc.save(
`${data.name}-Appointment.pdf`
);

};
