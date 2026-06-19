window.generateIDCardPDF = async function (data) {
    const { jsPDF } = window.jspdf;
    
    // ID Card का स्टैंडर्ड साइज (86x54mm)
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [54, 86]
    });

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 86, 54, "F");

    // Gold Border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.2);
    doc.rect(2, 2, 82, 50);
    doc.setLineWidth(0.4);
    doc.rect(4, 4, 78, 46);

    // Header Background
    doc.setFillColor(7, 27, 52);
    doc.rect(4, 4, 78, 13, "F");

    // Logo & Header Text
    try { doc.addImage("ngologo.png", "PNG", 6, 6, 8, 8); } catch (e) {}
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text("उन्नति स्वयं सहायता समिति", 43, 8, { align: "center" });
    doc.setFontSize(3);
    doc.text("UNNATI SAWAYE SAHAYATA SAMITI", 43, 11, { align: "center" });
    doc.setFontSize(2.8);
    doc.text("Official Membership Identity Card", 43, 13.5, { align: "center" });

    doc.setTextColor(0, 0, 0);

    // Photo
    if (data.photoURL) {
        try {
            const response = await fetch(data.photoURL);
            const blob = await response.blob();
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            doc.addImage(base64, "JPEG", 6, 19, 18, 20);
        } catch (e) { console.warn("Photo loading failed"); }
    }

    // Details
    doc.setFontSize(3.8);
    doc.text(`Name : ${data.name || ""}`, 27, 23);
    doc.text(`Father : ${data.father_name || ""}`, 27, 28);
    doc.text(`Post : ${data.designation || ""}`, 27, 33);
    doc.text(`Mobile : ${data.mobile || ""}`, 27, 38);
    doc.text(`ID : ${data.volunteer_id || "-"}`, 27, 43);

    // Footer Text
    doc.setFontSize(2.5);
    doc.text("गौ सेवा • मानव सेवा • राष्ट्र सेवा 🇮🇳🐄❤️", 43, 47, { align: "center" });

    // Signature
    try { doc.addImage("signature.png", "PNG", 58, 40, 18, 8); } catch (e) {}
    doc.setFontSize(2.3);
    doc.text("राष्ट्रीय सचिव", 62, 50);
    doc.text("उन्नति स्वयं सहायता समिति", 50, 52);

    // Save
    doc.save(`${data.name || "Member"}-ID-Card.pdf`);
};
