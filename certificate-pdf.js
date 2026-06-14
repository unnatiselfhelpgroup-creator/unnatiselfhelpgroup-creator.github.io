window.generateCertificatePDF = function(data){

const { jsPDF } = window.jspdf;

const doc = new jsPDF("landscape");

// =====================
// Golden Border
// =====================
doc.setDrawColor(212, 175, 55);
doc.setLineWidth(3);
doc.rect(10, 10, 277, 190);

doc.setLineWidth(1);
doc.rect(15, 15, 267, 180);

// =====================
// Logo (यदि logo.png मौजूद है)
// =====================
try{
doc.addImage(
"logo.png",
"PNG",
20,
15,
25,
25
);
}catch(e){
console.log("Logo not found");
}

// =====================
// Title
// =====================
doc.setFontSize(24);
doc.text(
"उन्नति स्वयं सहायता समिति",
148,
30,
{
align:"center"
}
);

doc.setFontSize(18);
doc.text(
"प्रमाण पत्र : सामाजिक सेवा एवं योगदान",
148,
45,
{
align:"center"
}
);

// =====================
// Certificate Number & Date
// =====================
doc.setFontSize(12);

doc.text(
`प्रमाण पत्र संख्या : CERT-${Date.now()}`,
20,
65
);

doc.text(
`दिनांक : ${new Date().toLocaleDateString("hi-IN")}`,
225,
65
);

// =====================
// Certificate Body
// =====================
doc.setFontSize(13);

doc.text(
`यह प्रमाणित किया जाता है कि श्री/सुश्री : ${data.name || ""}`,
20,
90
);

doc.text(
`पुत्र/पुत्री : ${data.father_name || ""}`,
20,
105
);

doc.text(
`वॉलंटियर आईडी : ${data.volunteer_id || ""}`,
20,
120
);

doc.text(
`सेवा अवधि : ${data.duration || ""}`,
20,
135
);

doc.text(
`सामाजिक कार्य : ${data.work_details || ""}`,
20,
150
);

doc.text(
"अभ्यर्थी ने सामाजिक सेवा कार्यक्रम में सक्रिय योगदान दिया है तथा समाज सेवा के क्षेत्र में उल्लेखनीय कार्य किया है।",
20,
168
);

doc.text(
"NITI Aayog Unique ID : US-2016 / 0108273",
20,
185
);

// =====================
// Stamp Image
// =====================
try{
doc.addImage(
"stamp.png",
"PNG",
40,
190,
35,
35
);
}catch(e){
console.log("Stamp not found");
}

// =====================
// Signature Image
// =====================
try{
doc.addImage(
"signature.png",
"PNG",
220,
190,
40,
20
);
}catch(e){
console.log("Signature not found");
}

// =====================
// Labels
// =====================
doc.setFontSize(11);

doc.text(
"संस्था की आधिकारिक मुहर",
35,
230
);

doc.text(
"अधिकृत हस्ताक्षर",
220,
230
);

// =====================
// Save PDF
// =====================
doc.save(
`${data.name || "Certificate"}-Certificate.pdf`
);

};
