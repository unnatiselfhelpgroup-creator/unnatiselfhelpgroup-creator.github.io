window.generateCertificatePDF = async function (data) { // यहाँ 'async' जोड़ा गया है
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape", "mm", "a4");
    
    // [सर्टिफिकेट डिज़ाइन का कोड वही रहेगा जो आपने दिया है...]
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setLineWidth(0.7);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
    try { doc.addImage("ngologo.png", "PNG", 20, 18, 25, 25); } catch (e) {}
    doc.setFontSize(24);
    doc.text("उन्नति स्वयं सहायता समिति", pageWidth / 2, 28, { align: "center" });
    doc.setFontSize(13);
    doc.text("UNNATI SAWAYE SAHAYATA SAMITI", pageWidth / 2, 38, { align: "center" });
    doc.setFontSize(18);
    doc.setTextColor(128, 0, 0);
    doc.text("सामाजिक सेवा एवं अनुभव प्रमाण पत्र", pageWidth / 2, 55, { align: "center" });
    
    const certNo = data.certificate_no || ("CERT-" + Date.now());
    const date = new Date().toLocaleDateString("hi-IN");
    doc.setFontSize(11);
    doc.setTextColor(0,0,0);
    doc.text(`प्रमाण पत्र संख्या : ${certNo}`, 20, 80);
    doc.text(`दिनांक : ${date}`, 220, 80);
    doc.setFontSize(14);
    doc.text(`नाम : ${data.name || ""}`, 20, 100);
    doc.text(`पिता : ${data.father_name || ""}`, 20, 115);
    doc.text(`आईडी : ${data.volunteer_id || "-"}`, 20, 130);
    doc.text(`अवधि : ${data.duration || ""}`, 20, 145);
    doc.text(`कार्य : ${data.activity_type || "सामाजिक सेवा"}`, 20, 160);
    doc.text(doc.splitTextToSize(data.work_details || "", 220), 20, 175);

    // 1. फाइल सेव करें
    doc.save(`${data.name || "Volunteer"}-Certificate.pdf`);

    // 2. डेटाबेस में रिकॉर्ड करें (इम्पोर्ट्स को फाइल के सबसे ऊपर रखें)
    try {
        const { db } = await import("./firebase-config.js");
        const { doc: fireDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
        
        await setDoc(fireDoc(db, "Certificates", certNo), {
            name: data.name,
            father_name: data.father_name,
            volunteer_id: data.volunteer_id,
            duration: data.duration,
            issueDate: date,
            status: "Verified"
        });
        console.log("Certificate saved to database!");
    } catch (err) {
        console.error("Database save error:", err);
    }
};
