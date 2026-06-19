window.generateAppointmentPDF = function (data) {
    const { jsPDF } = window.jspdf;
    const volunteerId = data.volunteer_id || data.volunteerId || "-";

    const qrText = `Name : ${data.name || ""}
Volunteer ID : ${volunteerId}
Post : ${data.designation || "Volunteer"}
Organisation : उन्नति स्वयं सहायता समिति`;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper: Golden Border
    const drawBorder = (d) => {
        d.setDrawColor(212, 175, 55);
        d.setLineWidth(2);
        d.rect(8, 8, pageWidth - 16, pageHeight - 16);
        d.setLineWidth(0.7);
        d.rect(12, 12, pageWidth - 24, pageHeight - 24);
    };

    // PAGE 1
    drawBorder(doc);
    
    // Logo & Header
    try { doc.addImage("ngologo.png", "PNG", 15, 15, 25, 25); } catch (e) { console.warn("Logo not found"); }
    
    doc.setFontSize(18);
    doc.setTextColor(7, 27, 52);
    doc.text("उन्नति स्वयं सहायता समिति", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(11);
    doc.text("गौ सेवा • मानव सेवा • राष्ट्र सेवा 🇮🇳🐄❤️", pageWidth / 2, 34, { align: "center" });
    doc.setFontSize(16);
    doc.text("नियुक्ति पत्र (Appointment Letter)", pageWidth / 2, 48, { align: "center" });

    // Details
    const appointmentNo = "USS/APP/" + new Date().getFullYear() + "/" + Date.now();
    const date = new Date().toLocaleDateString("hi-IN");

    doc.setFontSize(11);
    doc.text(`पत्र संख्या : ${appointmentNo}`, 20, 65);
    doc.text(`दिनांक : ${date}`, 140, 65);

    let y = 82;
    doc.setFontSize(12);
    const fields = [
        { label: "नाम", val: data.name },
        { label: "पिता/पति", val: data.father_name },
        { label: "मोबाइल", val: data.mobile },
        { label: "ईमेल", val: data.email },
        { label: "पता", val: data.address },
        { label: "पद", val: data.designation },
        { label: "Volunteer ID", val: volunteerId }
    ];

    fields.forEach(f => {
        doc.text(`${f.label} : ${f.val || "-"}`, 20, y);
        y += 10;
    });

    // Images
    try { if (data.photoURL) doc.addImage(data.photoURL, "JPEG", 145, 72, 35, 40); } catch (e) {}
    try {
        const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(qrText);
        doc.addImage(qrUrl, "PNG", 145, 118, 35, 35);
    } catch (e) {}

    // Body Text
    y += 8;
    const para1 = `महोदय/महोदया, आपकी सामाजिक सेवा, जनहित कार्यों के प्रति समर्पण, गौ-संरक्षण, मानव सेवा एवं राष्ट्र निर्माण के प्रति आपकी सकारात्मक सोच एवं योगदान को दृष्टिगत रखते हुए आपको उन्नति स्वयं सहायता समिति के अंतर्गत ${data.designation || "Volunteer"} पद पर नियुक्त किया जाता है।`;
    doc.text(doc.splitTextToSize(para1, 165), 20, y);
    
    y += 35;
    const para2 = `आपकी नियुक्ति तत्काल प्रभाव से लागू होगी तथा आप संस्था के संविधान, नियमों एवं दिशा-निर्देशों के अनुरूप सामाजिक, जनहित, गौ-संरक्षण एवं संगठनात्मक गतिविधियों में सक्रिय सहयोग प्रदान करेंगे।`;
    doc.text(doc.splitTextToSize(para2, 165), 20, y);

    // Footer
    doc.setFontSize(9);
    doc.text(`Volunteer ID : ${volunteerId}`, pageWidth / 2, 266, { align: "center" });
    doc.text("उन्नति स्वयं सहायता समिति", pageWidth / 2, 275, { align: "center" });

    // PAGE 2
    doc.addPage();
    drawBorder(doc);
    doc.setFontSize(16);
    doc.text("संस्था के दायित्व एवं आचार संहिता", pageWidth / 2, 28, { align: "center" });

    let yy = 50;
    doc.setFontSize(12);
    const rules = [
        "1. संस्था की गरिमा एवं अनुशासन बनाए रखना।",
        "2. गौ-संरक्षण, मानव सेवा एवं राष्ट्र सेवा के उद्देश्यों को बढ़ावा देना।",
        "3. संस्था के संविधान एवं दिशा-निर्देशों का पालन करना।",
        "4. किसी भी अवैध, अनैतिक या संस्था-विरोधी गतिविधि में शामिल न होना।",
        "5. संस्था की अनुमति के बिना वित्तीय अथवा प्रशासनिक प्रतिनिधित्व न करना।",
        "6. सामाजिक सद्भाव एवं जनहित कार्यक्रमों में सक्रिय सहभागिता करना।"
    ];
    rules.forEach((r) => { doc.text(r, 20, yy); yy += 18; });

    yy += 15;
    const decl = "यह नियुक्ति पत्र संस्था की स्वैच्छिक सामाजिक एवं जनसेवा गतिविधियों हेतु जारी किया गया है। यह किसी सरकारी नौकरी, वेतन, मानदेय अथवा सरकारी लाभ की गारंटी नहीं देता।";
    doc.text(doc.splitTextToSize(decl, 165), 20, yy);

    // Signature
    yy += 40;
    try { doc.addImage("signature.png", "PNG", 135, yy, 40, 18); } catch (e) {}
    doc.setFontSize(11);
    doc.text("अधिकृत हस्ताक्षर", 145, yy + 24);
    doc.text("राष्ट्रीय सचिव", 147, yy + 31);
    doc.text("उन्नति स्वयं सहायता समिति", 127, yy + 38);

    doc.save(`${data.name || "Member"}-Appointment-Letter.pdf`);
};
