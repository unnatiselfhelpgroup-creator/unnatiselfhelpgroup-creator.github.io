window.generateCertificatePDF = function (data) {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF("landscape");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // =====================
  // Golden Border
  // =====================

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setLineWidth(1);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // =====================
  // Heading
  // =====================

  doc.setFontSize(24);
  doc.setTextColor(128, 0, 0);

  doc.text(
    "उन्नति स्वयं सहायता समिति",
    pageWidth / 2,
    30,
    { align: "center" }
  );

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);

  doc.text(
    "प्रमाण पत्र : सामाजिक सेवा एवं योगदान",
    pageWidth / 2,
    45,
    { align: "center" }
  );

  // =====================
  // Certificate Details
  // =====================

  doc.setFontSize(12);

  const certNo =
    "CERT-" +
    Date.now();

  const date =
    new Date().toLocaleDateString("hi-IN");

  doc.text(
    `प्रमाण पत्र संख्या : ${certNo}`,
    20,
    65
  );

  doc.text(
    `दिनांक : ${date}`,
    220,
    65
  );

  // =====================
  // Main Text
  // =====================

  doc.setFontSize(14);

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
    `किए गए सामाजिक कार्य :`,
    20,
    150
  );

  doc.setFontSize(12);

  const work =
    data.work_details ||
    "सामाजिक सेवा कार्य";

  const lines =
    doc.splitTextToSize(
      work,
      220
    );

  doc.text(
    lines,
    20,
    162
  );

  // =====================
  // Appreciation Text
  // =====================

  doc.setFontSize(13);

  doc.text(
    "संस्था इनके उज्ज्वल भविष्य की कामना करती है तथा समाज के प्रति इनके सेवा भाव की सराहना करती है।",
    20,
    190
  );

  // =====================
  // NITI Aayog ID
  // =====================

  doc.setFontSize(12);

  doc.text(
    "NITI Aayog Unique ID : UA-2016/0108273",
    20,
    205
  );

  // =====================
  // Signature Text
  // =====================

  doc.setFontSize(12);

  doc.text(
    "अधिकृत हस्ताक्षर एवं मुहर",
    205,
    215
  );

  doc.text(
    "राष्ट्रीय सचिव",
    218,
    222
  );

  doc.text(
    "उन्नति स्वयं सहायता समिति",
    198,
    228
  );

  // =====================
  // Footer Disclaimer
  // =====================

  doc.setFontSize(9);

  doc.text(
    "यह प्रमाण पत्र संस्था द्वारा स्वैच्छिक सामाजिक सेवा के अनुभव हेतु जारी किया गया है।",
    pageWidth / 2,
    205,
    {
      align: "center"
    }
  );

  doc.text(
    "यह किसी भी सरकारी नौकरी या सरकारी लाभ की गारंटी नहीं देता।",
    pageWidth / 2,
    212,
    {
      align: "center"
    }
  );

  // =====================
  // Save PDF
  // =====================

  doc.save(
    `${data.name || "Certificate"}-Certificate.pdf`
  );

};
