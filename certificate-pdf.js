// ============================================================
// certificate-pdf.js — उन्नति स्वयं सहायता समिति
// Volunteer Experience Certificate — Image 3 format के अनुसार
// ============================================================
window.generateCertificatePDF = async function (data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape", "mm", "a4");
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    // ── BACKGROUND ──
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    // Outer gold border (double)
    doc.setDrawColor(180, 130, 30);
    doc.setLineWidth(3);
    doc.rect(8, 8, W - 16, H - 16);
    doc.setLineWidth(0.8);
    doc.rect(12, 12, W - 24, H - 24);

    // Corner decorations
    const corners = [[14,14],[W-14,14],[14,H-14],[W-14,H-14]];
    doc.setFillColor(212, 175, 55);
    corners.forEach(([x,y]) => { doc.circle(x, y, 3, "F"); });

    // ── HEADER ──
    try { doc.addImage("ngologo.png", "PNG", 18, 16, 28, 28); } catch(e) {}
    try { doc.addImage("ngologo.png", "PNG", W - 46, 16, 28, 28); } catch(e) {}

    doc.setTextColor(7, 27, 52);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("उन्नति स्वयं सहायता समिति", W / 2, 24, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("UNNATI SAWAYE SAHAYATA SAMITI", W / 2, 31, { align: "center" });

    doc.setFontSize(9);
    doc.text("नीति आयोग NGO दर्पण ID: UA-2016/0108273 | PAN: AAATU7133Q | CSR: CSR00102587", W / 2, 37, { align: "center" });
    doc.text("हल्दूचौड़ दीना, हल्द्वानी रोड, लालकुआँ, जिला-नैनीताल (उत्तराखंड) | +91 9410332400", W / 2, 43, { align: "center" });

    // Divider
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.2);
    doc.line(15, 47, W - 15, 47);

    // ── CERTIFICATE TITLE ──
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(128, 0, 0);
    doc.text("VOLUNTEER EXPERIENCE CERTIFICATE", W / 2, 58, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(7, 27, 52);
    doc.text("सामाजिक सेवा अनुभव प्रमाण पत्र", W / 2, 66, { align: "center" });

    // Gold underline
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.8);
    doc.line(W/2 - 60, 68, W/2 + 60, 68);

    // ── CERTIFY LINE ──
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("This is to certify that:", 18, 78);

    // ── CANDIDATE DETAILS ──
    const certNo = data.certificate_no || ("CERT-" + Date.now());
    const issueDate = new Date().toLocaleDateString("hi-IN", {day:"2-digit", month:"2-digit", year:"numeric"});
    const startDate = data.start_date || "-";
    const endDate   = data.end_date   || "-";
    const totalDays = data.duration   || "-";

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`Name:`, 18, 88);
    doc.setFont("helvetica", "normal");
    doc.text(data.name || "——————————————", 45, 88);
    doc.line(44, 89, 160, 89);

    doc.setFont("helvetica", "bold");
    doc.text(`Volunteer ID:`, 18, 98);
    doc.setFont("helvetica", "normal");
    doc.text(data.volunteer_id || "——————————", 55, 98);
    doc.line(54, 99, 160, 99);

    // Right column
    doc.setFont("helvetica", "bold");
    doc.text("Cert. No.:", W - 110, 88);
    doc.setFont("helvetica", "normal");
    doc.text(certNo, W - 80, 88);

    doc.setFont("helvetica", "bold");
    doc.text("Issue Date:", W - 110, 98);
    doc.setFont("helvetica", "normal");
    doc.text(issueDate, W - 80, 98);

    // Serving line
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully served as a Volunteer in our organization.", 18, 110);

    // ── ACTIVITIES ──
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Activities:", 18, 122);
    doc.setFont("helvetica", "normal");
    const activities = [
        "- Cow Protection (Gau Seva) — बेसहारा गौवंश संरक्षण एवं सेवा",
        "- Environmental Protection — पर्यावरण संरक्षण अभियान",
        "- Social Awareness Campaign — सामाजिक जागरूकता एवं जन सेवा"
    ];
    activities.forEach((a, i) => doc.text(a, 22, 130 + i * 7));

    // ── DURATION ──
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Duration:", 18, 158);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${startDate}`, 22, 166);
    doc.text(`To:     ${endDate}`, 22, 173);

    doc.setFont("helvetica", "bold");
    doc.text(`Total Days: ${totalDays}`, 18, 182);

    // ── APPRECIATION ──
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(60, 60, 60);
    doc.text("We appreciate their valuable contribution to society.", 18, 192);

    // ── SIGNATURE ──
    try { doc.addImage("signature.png", "PNG", 18, 172, 35, 12); } catch(e) {}
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(18, 198, 80, 198);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text("Authorized Signatory", 18, 204);
    doc.text("National Secretary", 18, 210);
    doc.text("उन्नति स्वयं सहायता समिति", 18, 216);

    // QR code area (right side)
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.4);
    doc.rect(W - 50, 175, 30, 30);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Scan to Verify", W - 35, 209, { align: "center" });

    // ── FOOTER ──
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(15, H - 18, W - 15, H - 18);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(
        "Website: https://unnatiselfhelpgroup-creator.github.io  |  Email: unnatiselfhelpgroup@gmail.com  |  Ph: +91 9410332400",
        W / 2, H - 12, { align: "center" }
    );

    // ── SAVE + FIREBASE ──
    doc.save(`${data.name || "Volunteer"}-Certificate.pdf`);

    try {
        const { db } = await import("./firebase-config.js");
        const { doc: fireDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
        await setDoc(fireDoc(db, "Certificates", certNo), {
            name: data.name,
            father_name: data.father_name || "",
            volunteer_id: data.volunteer_id,
            duration: totalDays,
            start_date: startDate,
            end_date: endDate,
            certificate_no: certNo,
            issueDate: issueDate,
            status: "Verified"
        });
        console.log("Certificate saved to Firebase!");
    } catch(err) {
        console.error("Firebase save error:", err);
    }
};
