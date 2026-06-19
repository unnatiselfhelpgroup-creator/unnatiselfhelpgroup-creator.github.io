window.generateAppointmentPDF = function (data) {
    const { jsPDF } = window.jspdf;
    
    // PDF इनिशियलाइज़ेशन
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const volunteerId = data.volunteer_id || data.volunteerId || "-";

    // हिंदी फॉन्ट के लिए फिक्स (यदि Roboto काम न करे, तो यह डिफॉल्ट रेंडरिंग करेगा)
    doc.setFont("helvetica");

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
    
    // Logo & Header (सुनिश्चित करें कि ngologo.png उसी फोल्डर में है)
    try { doc.addImage("ngologo.png", "PNG", 15, 15, 25, 25); } catch (e) {}
    
    doc.setFontSize(18);
    doc.setTextColor(7, 27, 52);
    doc.text("Unnati Swayam Sahayata Samiti", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(14);
    doc.text("Appointment Letter", pageWidth / 2, 45, { align: "center" });

    // Details
    const appointmentNo = "USS/APP/" + new Date().getFullYear() + "/" + Date.now();
    const date = new Date().toLocaleDateString("hi-IN");

    doc.setFontSize(11);
    doc.text(`पत्र संख्या : ${appointmentNo}`, 20, 65);
    doc.text(`दिनांक : ${date}`, 140, 65);

    let y = 85;
    doc.setFontSize(12);
    const fields = [
        { label: "Name", val: data.name },
        { label: "Father/Husband", val: data.father_name },
        { label: "Mobile", val: data.mobile },
        { label: "Email", val: data.email },
        { label: "Post", val: data.designation },
        { label: "Volunteer ID", val: volunteerId }
    ];

    fields.forEach(f => {
        doc.text(`${f.label} : ${f.val || "-"}`, 20, y);
        y += 10;
    });

    // QR & Photo
    try { if (data.photoURL) doc.addImage(data.photoURL, "JPEG", 150, 70, 35, 40); } catch (e) {}
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(volunteerId);
    try { doc.addImage(qrUrl, "PNG", 150, 115, 35, 35); } catch (e) {}

    // Body Text (हिंदी अक्षरों के लिए हम English/Roman script या साफ फॉन्ट का उपयोग कर रहे हैं)
    y += 20;
    const para1 = `This is to certify that ${data.name || "Member"} is appointed as ${data.designation || "Volunteer"} under Unnati Swayam Sahayata Samiti. Your dedication towards social service and Gaurakshan is appreciated.`;
    doc.text(doc.splitTextToSize(para1, 165), 20, y);
    
    y += 35;
    const para2 = `Your appointment is effective immediately. You are expected to follow the rules and constitution of the organization diligently.`;
    doc.text(doc.splitTextToSize(para2, 165), 20, y);

    // PAGE 2
    doc.addPage();
    drawBorder(doc);
    doc.setFontSize(16);
    doc.text("Rules & Regulations", pageWidth / 2, 30, { align: "center" });

    let yy = 50;
    const rules = [
        "1. Maintain discipline and dignity of the organization.",
        "2. Promote the objectives of Gau-Sanrakshan and social service.",
        "3. Follow the constitution and guidelines of the organization.",
        "4. Do not engage in any illegal or anti-organizational activity.",
        "5. Do not represent the organization financially without permission.",
        "6. Actively participate in social welfare programs."
    ];
    doc.setFontSize(12);
    rules.forEach((r) => { doc.text(r, 20, yy); yy += 15; });

    // Signature
    yy += 50;
    try { doc.addImage("signature.png", "PNG", 140, yy, 40, 15); } catch (e) {}
    doc.text("Authorized Signatory", 145, yy + 20);
    doc.text("National Secretary", 148, yy + 27);

    doc.save(`${data.name || "Member"}-Appointment.pdf`);
};
