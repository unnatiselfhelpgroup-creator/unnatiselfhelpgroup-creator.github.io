// ====================
// Signature
// ====================

try {

doc.addImage(
"signature.png",
"PNG",
220,
215,
35,
15
);

} catch (e) {}

// Signature Text

doc.setFontSize(12);

doc.text(
"अधिकृत हस्ताक्षर",
230,
238
);

doc.text(
"राष्ट्रीय सचिव",
233,
246
);

doc.text(
"उन्नति स्वयं सहायता समिति",
214,
254
);

// ====================
// Footer
// ====================

doc.setFontSize(10);

doc.setTextColor(
7,
27,
52
);

doc.text(
"गौ सेवा • मानव सेवा • राष्ट्र सेवा 🇮🇳🐄❤️",
pageWidth / 2,
pageHeight - 15,
{
align: "center"
}
);

// ====================
// Save PDF
// ====================

doc.save(
"${data.name || "Volunteer"}-Experience-Certificate.pdf"
);

};
