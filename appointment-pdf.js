const paragraph =
"Dear ${data.name || "Member"}, You are hereby appointed as ${data.designation || "Volunteer"} in Unnati Sawaye Sahayata Samiti under the Gau Mata Rashtramata Samman Abhiyan. Your contribution towards social service, cow protection, awareness campaigns and organisational activities is highly appreciated.";

const lines =
doc.splitTextToSize(
paragraph,
165
);

doc.text(
lines,
20,
y
);

doc.save(
"${data.name || "Member"}-Appointment-Letter.pdf"
);
