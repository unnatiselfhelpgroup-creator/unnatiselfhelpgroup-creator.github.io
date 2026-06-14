window.generateIDCardPDF = async function (data) {

const { jsPDF } = window.jspdf;

const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [85, 54]
});

// ==========================
// Background
// ==========================
doc.setFillColor(255, 255, 255);
doc.rect(0, 0, 85, 54, "F");

// Golden Border
doc.setDrawColor(212, 175, 55);
doc.setLineWidth(1);
doc.rect(2, 2, 81, 50);

doc.setLineWidth(0.4);
doc.rect(4, 4, 77, 46);

// ==========================
// Header
// ==========================
doc.setFillColor(7, 27, 52);
doc.rect(4, 4, 77, 12, "F");

// Logo
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

doc.setTextColor(255, 255, 255);

doc.setFontSize(6);
doc.text(
    "UNNATI SWAYAM SAHAYATA SAMITI",
    42.5,
    9,
    { align: "center" }
);

doc.setFontSize(4);

doc.text(
    "Official Membership Identity Card",
    42.5,
    12,
    { align: "center" }
);

doc.text(
    "NITI Aayog ID : US-2016/0108273",
    42.5,
    15,
    { align: "center" }
);

doc.setTextColor(0, 0, 0);

// ==========================
// Photo
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
                    () =>
                        resolve(reader.result);

                reader.readAsDataURL(blob);

            });

        doc.addImage(
            base64,
            "JPEG",
            6,
            18,
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
doc.setFontSize(5);

doc.text(
    `Name : ${data.name || ""}`,
    27,
    21
);

doc.text(
    `Father : ${data.father_name || ""}`,
    27,
    26
);

doc.text(
    `Designation : ${data.designation || ""}`,
    27,
    31
);

doc.text(
    `Mobile : ${data.mobile || ""}`,
    27,
    36
);

doc.text(
    `Volunteer ID : ${data.volunteer_id || ""}`,
    27,
    41
);

doc.setFontSize(4);

let address =
    data.address || "";

if (address.length > 40) {
    address =
        address.substring(0, 40) + "...";
}

doc.text(
    `Address : ${address}`,
    6,
    46
);

// ==========================
// Official Stamp
// ==========================
doc.setDrawColor(200);

doc.circle(
    18,
    49,
    5
);

doc.setFontSize(3);

doc.text(
    "OFFICIAL",
    14,
    48
);

doc.text(
    "STAMP",
    15,
    50
);

// ==========================
// Signature
// ==========================
try {

    doc.addImage(
        "signature.png",
        "PNG",
        58,
        42,
        15,
        6
    );

} catch (e) {
    console.log("Signature not found");
}

doc.line(
    55,
    48,
    78,
    48
);

doc.setFontSize(3);

doc.text(
    "Authorized Signature",
    56,
    51
);

// ==========================
// Footer
// ==========================
doc.setFontSize(3);

doc.text(
    "Unnati Swayam Sahayata Samiti",
    42.5,
    53,
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
