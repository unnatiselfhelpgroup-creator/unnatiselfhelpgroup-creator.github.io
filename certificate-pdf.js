window.generateCertificatePDF = function(data){

const { jsPDF } = window.jspdf;

const doc = new jsPDF("landscape");

doc.setFontSize(24);
doc.text(
"उन्नति स्वयं सहायता समिति",
148,
25,
{align:"center"}
);

doc.setFontSize(18);
doc.text(
"प्रमाण पत्र : सामाजिक सेवा एवं योगदान",
148,
40,
{align:"center"}
);

doc.setFontSize(12);

doc.text(
"प्रमाण पत्र संख्या : CERT-${Date.now()}",
20,
60
);

doc.text(
"दिनांक : ${new Date().toLocaleDateString("hi-IN")}",
230,
60
);

doc.text(
"यह प्रमाणित किया जाता है कि श्री/सुश्री : ${data.name}",
20,
85
);

doc.text(
"पुत्र/पुत्री : ${data.father_name}",
20,
100
);

doc.text(
"वॉलंटियर आईडी : ${data.volunteer_id}",
20,
115
);

doc.text(
"सेवा अवधि : ${data.duration}",
20,
130
);

doc.text(
"सामाजिक कार्य : ${data.work_details}",
20,
145
);

doc.text(
"अभ्यर्थी ने सामाजिक सेवा कार्यक्रम में सक्रिय योगदान दिया है।",
20,
165
);

doc.text(
"NITI Aayog Unique ID : US-2016 / 0108273",
20,
185
);

doc.text(
"संस्था की आधिकारिक मुहर",
40,
205
);

doc.text(
"अधिकृत हस्ताक्षर",
220,
205
);

doc.save(
"${data.name}-Certificate.pdf"
);

};
