window.generateIDCardPDF = async function (data) {

const { jsPDF } = window.jspdf;

const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [54, 85]
});

// ==========================
// Background
// ==========================
doc.setFillColor(255, 255, 255);
doc.rect(0, 0, 85, 54, "F");

// ==========================
// Golden Border
// ==========================
doc.setDrawColor(212, 175, 55);
doc.setLineWidth(1);
doc.rect(2, 2, 81, 50);

doc.setLineWidth(0.4);
doc.rect(4, 4, 77, 46);

// ==========================
// Header
// ==========================
doc.setFillColor(7, 27, 52);
doc.rect(4, 4, 77, 14, "F");

// ==========================
// NGO Logo
// ==========================
try {
    doc.addImage(
        "ngologo.png",
        "PNG",
        6,
        6,
        8,
        8
    );
} catch (e) {
    console.log("Logo not found");
}

// ==========================
// NGO Name
// ==========================
doc.setTextColor(255, 255, 255);

doc.setFontSize(5.5);
doc.text(
    "UNNATI SAWAYE SAHAYATA SAMITI",
    42.5,
    8.5,
    { align: "center" }
);

doc.setFontSize(4);
doc.text(
    "उन्नति स्वयं सहायता समिति",
    42.5,
    11.5,
    { align: "center" }
);

doc.setFontSize(3.5);
doc.text(
    "Official Membership Identity Card",
    42.5,
    14,
    { align: "center" }
);

doc.setFontSize(3);
doc.text(
    "NITI Aayog Unique ID : UA-2016/0108273",
    42.5,
    16.5,
    { align: "center" }
);

doc.setTextColor(0, 0, 0);

// ==========================
// Member Photo
// ==========================
if (data.photoURL) {

    try {

        const response =
            await fetch(data.photoURL);

        const blob =
            await response.blob();

        const base64 =
            await new Promise((resolve) => {

                const reader =
                    new FileReader();

                reader.onloadend =
                    () => resolve(reader.result);

                reader.readAsDataURL(blob);

            });

        doc.addImage(
            base64,
            "JPEG",
            6,
            20,
            18,
            20
        );

    } catch (e) {
        console.log("Photo Load Failed");
    }
}

// ==========================
// Member Details
// ==========================
doc.setFontSize(4);

doc.text(
    `Name : ${data.name || ""}`,
    27,
    23
);

doc.text(
    `Father : ${data.father_name || ""}`,
    27,
    28
);

doc.text(
    `Designation : ${data.designation || ""}`,
    27,
    33
);

doc.text(
    `Mobile : ${data.mobile || ""}`,
    27,
    38
);

doc.text(
    `Volunteer ID : ${data.volunteer_id || ""}`,
    27,
    43
);

// ==========================
// Address
// ==========================
let address =
    data.address || "";

if (address.length > 45) {
    address =
        address.substring(0, 45) + "...";
}

doc.setFontSize(3);

doc.text(
    `Address : ${address}`,
    6,
    47
);

// ==========================
// Official Seal
// ==========================
try {

    doc.addImage(
        "signature.png",
        "PNG",
        8,
        42,
        14,
        8
    );

} catch (e) {

    doc.setDrawColor(180);
    doc.circle(18, 47, 5);

    doc.setFontSize(2.5);

    doc.text(
        "OFFICIAL",
        14,
        46
    );

    doc.text(
        "SEAL",
        15,
        48
    );
}

// ==========================
// Signature
// ==========================
try {

    doc.addImage(
        "signature.png",
        "PNG",
        58,
        41,
        18,
        8
    );

} catch (e) {

    doc.line(
        57,
        47,
        78,
        47
    );

    doc.setFontSize(2.5);

    doc.text(
        "Authorized Signature",
        58,
        50
    );
}

// ==========================
// Footer
// ==========================
doc.setFontSize(2.8);

doc.text(
    "UNNATI SAWAYE SAHAYATA SAMITI",
    42.5,
    52,
    {
        align: "center"
    }
);

// ==========================
// Save PDF
// ==========================
doc.save(
    `${data.name || "Member"}-ID-Card.pdf`
);

};
