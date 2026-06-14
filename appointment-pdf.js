window.generateAppointmentPDF = function (data) {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");

    // Golden Border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);

    doc.setLineWidth(0.5);
    doc.rect(13, 13, 184, 271);

    // Header
    doc.setFillColor(7, 27, 52);
    doc.rect(13, 13, 184, 28, "F");

    // Logo
    try {
        doc.addImage(
            "ngologo.png",
            "PNG",
            18,
            17,
            20,
            20
        );
    } catch (e) {
        console.log("Logo not found");
    }

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(18);
    doc.text(
        "UNNATI SAWAYE SAHAYATA SAMITI",
        105,
        24,
        { align: "center" }
    );

    doc.setFontSize(10);

    doc.text(
        "Registered Office : Haldoochaud Dina, Haldwani, District Nainital (Uttarakhand)",
        105,
        31,
        { align: "center" }
    );

    doc.text(
        "NITI Aayog Unique ID : US-2016/0108273",
        105,
        37,
        { align: "center" }
    );

    // Title
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(20);
    doc.text(
        "OFFICIAL APPOINTMENT LETTER",
        105,
        55,
        { align: "center" }
    );

    doc.setFontSize(12);

    doc.text(
        "GAU MATA RASHTRA MATA SAMMAN ABHIYAN",
        105,
        63,
        { align: "center" }
    );

    // Appointment Number
    const appointNo =
        "USS-APP-" +
        new Date().getFullYear() +
        "-" +
        Math.floor(
            Math.random() * 100000
        );

    doc.setFontSize(11);

    doc.text(
        "Appointment No : " + appointNo,
        20,
        80
    );

    doc.text(
        "Date : " +
        new Date().toLocaleDateString(),
        145,
        80
    );

    // Main Content
    doc.setFontSize(12);

    let y = 100;

    doc.text("To,", 20, y);

    y += 12;

    doc.text(
        data.name || "",
        20,
        y
    );

    y += 10;

    doc.text(
        "S/o / W/o : " +
        (data.father_name || ""),
        20,
        y
    );

    y += 10;

    doc.text(
        "Address : " +
        (data.address || ""),
        20,
        y
    );

    y += 20;

    const paragraph =
        `Dear ${data.name || "Member"},
You are hereby appointed as ${data.designation || "Volunteer"} in Unnati Swayam Sahayata Samiti under the Gau Mata Rashtramata Samman Abhiyan. Your contribution towards social service, cow protection, awareness campaigns and organisational activities is highly appreciated.`;

    const lines =
        doc.splitTextToSize(
            paragraph,
            165
        );

    doc.text(
        lines,
        20,
        y
    );

    y += 45;

    doc.text(
        "Mobile : " +
        (data.mobile || ""),
        20,
        y
    );

    y += 10;

    doc.text(
        "Email : " +
        (data.email || ""),
        20,
        y
    );

    y += 10;

    doc.text(
        "Designation : " +
        (data.designation || "Volunteer"),
        20,
        y
    );

    y += 30;

    // Official Seal
    doc.circle(
        45,
        y,
        18
    );

    doc.setFontSize(9);

    doc.text(
        "OFFICIAL",
        33,
        y - 2
    );

    doc.text(
        "SEAL",
        38,
        y + 5
    );

    // Signature
    try {
        doc.addImage(
            "signature.png",
            "PNG",
            130,
            y - 18,
            35,
            15
        );
    } catch (e) {
        console.log(
            "Signature not found"
        );
    }

    doc.line(
        125,
        y,
        180,
        y
    );

    doc.text(
        "Authorized Signature",
        135,
        y + 10
    );

    // Footer
    doc.setFontSize(9);

    doc.text(
        "This appointment letter is digitally generated and does not require a physical signature.",
        105,
        280,
        {
            align: "center"
        }
    );

    // Save PDF
    doc.save(
        `${data.name || "Member"}-Appointment-Letter.pdf`
    );

};
