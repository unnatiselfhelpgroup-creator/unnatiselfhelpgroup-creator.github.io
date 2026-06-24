// appointment-pdf.js — उन्नति स्वयं सहायता समिति
// Sequential Appointment Number: USS-2026-0001 format

window.generateAppointmentPDF = async function (data) {
    const date = new Date().toLocaleDateString("hi-IN");
    const year = new Date().getFullYear();

    const FEE_BY_DESIGNATION = {
        "ग्राम गौ-संयोजक": "₹150",
        "ब्लॉक गौ-प्रभारी": "₹500",
        "जिला गौ-समन्वयक": "₹1100",
        "प्रदेश कार्यकारिणी सदस्य": "₹2500",
        "राष्ट्रीय गौ-पदाधिकारी": "₹5100 – ₹11000",
        "Volunteer": "₹700 (एकमुश्त)"
    };
    const designation = data.designation || "Volunteer";
    const fee = data.fee || FEE_BY_DESIGNATION[designation] || "-";
    const volunteerId = data.volunteer_id || data.volunteerId || "-";

    // ── Sequential Letter Number (Firestore Counter) ──
    let letterNumber = "USS-" + year + "-XXXX"; // Fallback
    try {
        const { db } = await import("./firebase-config.js");
        const { doc, runTransaction } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");

        const counterRef = doc(db, "Counters", "AppointmentLetters_" + year);
        const newCount = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            const current = counterDoc.exists() ? (counterDoc.data().count || 0) : 0;
            const next = current + 1;
            transaction.set(counterRef, { count: next, year: year });
            return next;
        });
        // USS-2026-0001 format
        letterNumber = "USS-" + year + "-" + String(newCount).padStart(4, "0");
    } catch (e) {
        // Firestore unavailable - timestamp fallback
        console.warn("Counter fallback:", e.message);
        letterNumber = "USS-" + year + "-" + Date.now().toString().slice(-6);
    }

    const element = document.createElement("div");
    element.style.width = "794px";
    element.style.padding = "40px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "Arial, sans-serif";

    element.innerHTML = `
        <div style="border: 5px double #d4af37; padding: 30px;">
            <div style="text-align:center;">
                <img src="ngologo.png" width="80" style="margin-bottom:10px;" onerror="this.style.display='none'">
                <h1 style="color:#071b34; margin:0; font-size:22px;">उन्नति स्वयं सहायता समिति</h1>
                <p style="color:#555; margin:4px 0;">गौ सेवा • मानव सेवा • राष्ट्र सेवा</p>
                <p style="color:#888; font-size:12px;">नीति आयोग ID: UA/2016/0108273 | PAN: AAATU7133Q | CSR: CSR00102587</p>
                <h2 style="border-bottom: 2px solid #d4af37; display:inline-block; padding-bottom:5px; color:#071b34;">
                    नियुक्ति पत्र (Appointment Letter)
                </h2>
            </div>

            <div style="display:flex; justify-content:space-between; margin-top:20px; background:#fffde7; padding:10px 15px; border-radius:8px;">
                <p style="margin:0;"><strong>पत्र संख्या:</strong>
                    <span style="color:#d4af37; font-size:16px; font-weight:bold;">${letterNumber}</span>
                </p>
                <p style="margin:0;"><strong>दिनांक:</strong> ${date}</p>
            </div>

            <div style="margin-top:20px; line-height:1.9;">
                <p><strong>नाम:</strong> ${data.name || "-"}</p>
                <p><strong>पिता/पति का नाम:</strong> ${data.father_name || "-"}</p>
                <p><strong>मोबाइल:</strong> ${data.mobile || "-"}</p>
                <p><strong>पद (Designation):</strong> ${designation}</p>
                <p><strong>सहयोग राशि:</strong> ${fee}</p>
                <p><strong>Volunteer ID:</strong> ${volunteerId}</p>
            </div>

            <div style="margin-top:20px; line-height:1.7; background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid #d4af37;">
                <p>महोदय/महोदया,</p>
                <p>आपकी सामाजिक सेवा एवं राष्ट्र निर्माण के प्रति समर्पण को देखते हुए आपको उन्नति स्वयं सहायता समिति के अंतर्गत
                <strong>${designation}</strong> पद पर नियुक्त किया जाता है।</p>
                <p>आपकी नियुक्ति तत्काल प्रभाव से लागू होगी। उपरोक्त सहयोग राशि <strong>Non-Refundable</strong> है तथा
                आईडी कार्ड, प्रशासनिक एवं तकनीकी सेवाओं हेतु है।</p>
            </div>

            <div style="margin-top:50px; display:flex; justify-content:space-between; align-items:flex-end;">
                <div>
                    <p style="font-size:12px; color:#888;">यह पत्र संख्या <strong>${letterNumber}</strong> के साथ आधिकारिक रूप से जारी किया गया है।</p>
                    <p style="font-size:12px; color:#888;">Website: https://unnatiselfhelpgroup-creator.github.io</p>
                </div>
                <div style="text-align:right;">
                    <img src="signature.png" height="50" style="margin-bottom:5px;" onerror="this.style.display='none'"><br>
                    <strong>अधिकृत हस्ताक्षर</strong><br>
                    राष्ट्रीय सचिव<br>
                    उन्नति स्वयं सहायता समिति
                </div>
            </div>
        </div>
    `;

    const opt = {
        margin: 5,
        filename: `${data.name || "Appointment"}-${letterNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();
};
