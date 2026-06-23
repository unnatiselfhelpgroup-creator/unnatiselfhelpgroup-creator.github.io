// ============================================================
// idcard-pdf.js — उन्नति स्वयं सहायता समिति
// आधिकारिक सदस्यता पहचान पत्र — Image 4 format के अनुसार
// CR80 Standard: 86 x 54 mm (landscape) — Front + Back
// ============================================================
window.generateIDCardPDF = async function (data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [54, 86] });
    const W = 86, H = 54;

    // ════════════════ FRONT SIDE ════════════════
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    // Gold double border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.rect(1.5, 1.5, W - 3, H - 3);
    doc.setLineWidth(0.3);
    doc.rect(3, 3, W - 6, H - 6);

    // Dark blue header bar
    doc.setFillColor(7, 27, 52);
    doc.rect(3, 3, W - 6, 13, "F");

    // Tagline in header
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(3.8);
    doc.setFont("helvetica", "bold");
    doc.text("गौ माता - राष्ट्रमाता सेवा में समर्पित", W / 2, 7.5, { align: "center" });

    // Logo left
    try { doc.addImage("ngologo.png", "PNG", 5, 4, 9, 9); } catch (e) {}

    // Org name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5.2);
    doc.setFont("helvetica", "bold");
    doc.text("उन्नति स्वयं सहायता समिति", W / 2, 12, { align: "center" });

    // Card type subtitle
    doc.setFontSize(3);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("UNNATI SAWAYE SAHAYATA SAMITI", W / 2, 14.5, { align: "center" });

    // Card Title
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(4.5);
    doc.setFont("helvetica", "bold");
    doc.text("आधिकारिक सदस्यता पहचान पत्र (ID Card)", W / 2, 20, { align: "center" });

    // Email
    doc.setTextColor(30, 100, 200);
    doc.setFontSize(2.8);
    doc.setFont("helvetica", "normal");
    doc.text("ईमेल आईडी: unnatiselfhelpgroup@gmail.com", W / 2, 23, { align: "center" });

    // Separator
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.line(4, 24.5, W - 4, 24.5);

    // Photo box
    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.4);
    doc.rect(5, 26, 16, 19);
    if (data.photoURL) {
        try {
            const resp = await fetch(data.photoURL);
            const blob = await resp.blob();
            const b64 = await new Promise(res => {
                const r = new FileReader();
                r.onloadend = () => res(r.result);
                r.readAsDataURL(blob);
            });
            doc.addImage(b64, "JPEG", 5, 26, 16, 19);
        } catch (e) {
            doc.setFontSize(3);
            doc.setTextColor(150, 150, 150);
            doc.text("PHOTO", 13, 36, { align: "center" });
        }
    } else {
        doc.setFontSize(3);
        doc.setTextColor(150, 150, 150);
        doc.text("PHOTO", 13, 36, { align: "center" });
    }

    // Details right of photo
    const fields = [
        { label: "सदस्य का नाम", value: data.name || "—" },
        { label: "पद",            value: data.designation || "—" },
        { label: "पिता/पति",      value: data.father_name || "—" },
        { label: "कार्य क्षेत्र",  value: data.address ? data.address.substring(0, 22) : "—" },
        { label: "मोबाइल",        value: data.mobile || "—" },
    ];
    fields.forEach((f, i) => {
        const y = 28.5 + i * 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(3.5);
        doc.setTextColor(7, 27, 52);
        doc.text(`${f.label}:`, 24, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(String(f.value), 44, y);
    });

    // Bottom separator
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.line(4, 46.5, W - 4, 46.5);

    // Niti Aayog line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(2.8);
    doc.setTextColor(7, 27, 52);
    doc.text("नीति आयोग यूनिक आईडी: UA/2016/0108273", 5, 49);

    // Note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(2.2);
    doc.setTextColor(100, 100, 100);
    doc.text("नोट: यह पहचान पत्र उन्नति स्वयं सहायता समिति की आधिकारिक संपत्ति है।", 5, 51.5);

    // Signature
    try { doc.addImage("signature.png", "PNG", 60, 44, 18, 6); } catch (e) {}
    doc.setFont("helvetica", "bold");
    doc.setFontSize(2.3);
    doc.setTextColor(0, 0, 0);
    doc.text("हस्ताक्षर", W - 16, 51.5, { align: "center" });

    // ════════════════ BACK SIDE ════════════════
    doc.addPage([54, 86], "landscape");

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.rect(1.5, 1.5, W - 3, H - 3);

    // Dark header
    doc.setFillColor(7, 27, 52);
    doc.rect(3, 3, W - 6, 11, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.setFont("helvetica", "bold");
    doc.text("उन्नति स्वयं सहायता समिति", W / 2, 8.5, { align: "center" });
    doc.setFontSize(3);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    doc.text("Official Member ID Card — Back", W / 2, 12.5, { align: "center" });

    // Volunteer ID highlight box
    doc.setFillColor(255, 248, 220);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.6);
    doc.rect(10, 17, W - 20, 12, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.5);
    doc.setTextColor(7, 27, 52);
    doc.text("Volunteer ID:", W / 2, 21.5, { align: "center" });

    doc.setFontSize(7);
    doc.setTextColor(150, 0, 0);
    doc.text(data.volunteer_id || "USSS-XXXXXXX", W / 2, 27, { align: "center" });

    // Rules
    doc.setFont("helvetica", "normal");
    doc.setFontSize(3);
    doc.setTextColor(30, 30, 30);
    const rules = [
        "• यह कार्ड हस्तांतरणीय नहीं है।",
        "• इस कार्ड का दुरुपयोग दंडनीय है।",
        "• खोने पर तुरंत संस्था को सूचित करें।",
        "• सभी गतिविधियाँ संविधान के दायरे में होंगी।"
    ];
    rules.forEach((r, i) => doc.text(r, 7, 34 + i * 4.2));

    // Contact footer
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.line(4, 50, W - 4, 50);

    doc.setFontSize(2.8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(7, 27, 52);
    doc.text("📱 +91 9410332400  |  📧 unnatiselfhelpgroup@gmail.com", W / 2, 52.2, { align: "center" });

    doc.save(`${data.name || "Member"}-ID-Card.pdf`);
};
