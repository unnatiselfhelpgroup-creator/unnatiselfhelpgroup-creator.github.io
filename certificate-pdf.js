window.generateCertificatePDF = function (data) {

const { jsPDF } = window.jspdf;

const doc =
new jsPDF(
"landscape",
"mm",
"a4"
);

const pageWidth =
doc.internal.pageSize.getWidth();

const pageHeight =
doc.internal.pageSize.getHeight();

// ====================
// Background
// ====================
doc.setFillColor(
255,
255,
255
);

doc.rect(
0,
0,
pageWidth,
pageHeight,
"F"
);

// ====================
// Golden Border
// ====================

doc.setDrawColor(
212,
175,
55
);

doc.setLineWidth(2);

doc.rect(
10,
10,
pageWidth - 20,
pageHeight - 20
);

doc.setLineWidth(0.7);

doc.rect(
15,
15,
pageWidth - 30,
pageHeight - 30
);

// ====================
// Logo
// ====================

try{

doc.addImage(
"ngologo.png",
"PNG",
20,
18,
25,
25
);

}catch(e){}

// ====================
// Header
// ====================

doc.setFontSize(24);

doc.setTextColor(
7,
27,
52
);

doc.text(
"उन्नति स्वयं सहायता समिति",
pageWidth / 2,
28,
{
align:"center"
}
);

doc.setFontSize(13);

doc.text(
"UNNATI SAWAYE SAHAYATA SAMITI",
pageWidth / 2,
38,
{
align:"center"
}
);

doc.setFontSize(18);

doc.setTextColor(
128,
0,
0
);

doc.text(
"सामाजिक सेवा एवं अनुभव प्रमाण पत्र",
pageWidth / 2,
55,
{
align:"center"
}
);

doc.setFontSize(12);

doc.setTextColor(
0,
0,
0
);

doc.text(
"VOLUNTEER EXPERIENCE CERTIFICATE",
pageWidth / 2,
64,
{
align:"center"
}
);

// ====================
// Certificate No
// ====================

const certNo =
data.certificate_no ||
(
"CERT-" +
Date.now()
);

const date =
new Date()
.toLocaleDateString(
"hi-IN"
);

doc.setFontSize(11);

doc.text(
`प्रमाण पत्र संख्या : ${certNo}`,
20,
80
);

doc.text(
`दिनांक : ${date}`,
220,
80
);

// ====================
// Details
// ====================

doc.setFontSize(14);

doc.text(
`यह प्रमाणित किया जाता है कि श्री/सुश्री : ${data.name || ""}`,
20,
100
);

doc.text(
`पिता/पति : ${data.father_name || ""}`,
20,
115
);

doc.text(
`वॉलंटियर आईडी : ${data.volunteer_id || "-"}`,
20,
130
);

doc.text(
`सेवा अवधि : ${data.duration || ""}`,
20,
145
);

doc.text(
`सामाजिक कार्य : ${data.activity_type || "सामाजिक सेवा"}`,
20,
160
);

// ====================
// Work Details
// ====================

const work =
data.work_details ||
"सामाजिक सेवा कार्य";

const lines =
doc.splitTextToSize(
work,
220
);

doc.setFontSize(12);

doc.text(
lines,
20,
175
);

// ====================
// Appreciation
// ====================

doc.setFontSize(13);

doc.text(
"संस्था इनके समाज, गौ-संरक्षण, मानव सेवा एवं राष्ट्र निर्माण में दिए गए योगदान की सराहना करती है तथा इनके उज्ज्वल भविष्य की मंगलकामना करती है।",
20,
205
);

// ====================
// Signature
// ====================
  try{
    doc.addImage(
        "signature.png",
        "PNG",
        x,
        y,
        width,
        height
    );
}catch(e){}
doc.text(
    "अधिकृत हस्ताक्षर",
    x,
    y
);

doc.save("certificate.pdf");
