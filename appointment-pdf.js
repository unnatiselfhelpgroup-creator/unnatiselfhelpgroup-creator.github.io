// appointment-pdf.js — उन्नति स्वयं सहायता समिति
// Sequential Appointment Number: USS-2026-0001 format
// Version: 2.0 — 2-page with designation-based rules

window.generateAppointmentPDF = async function (data) {
    const date = new Date().toLocaleDateString("hi-IN");
    const year = new Date().getFullYear();

    const FEE_BY_DESIGNATION = {
        "ग्राम गौ-संयोजक":          "₹150",
        "ब्लॉक गौ-प्रभारी":          "₹500",
        "जिला गौ-समन्वयक":           "₹1100",
        "प्रदेश कार्यकारिणी सदस्य":   "₹2500",
        "राष्ट्रीय गौ-पदाधिकारी":     "₹5100 – ₹11000",
        "Volunteer":                   "₹700 (एकमुश्त)"
    };
    const designation = data.designation || "Volunteer";
    const fee         = data.fee || FEE_BY_DESIGNATION[designation] || "-";
    const volunteerId = data.volunteer_id || data.volunteerId || "-";

    // ── Sequential Letter Number (Firestore Counter) ──
    let letterNumber = "USS-" + year + "-XXXX";
    try {
        const { db } = await import("./firebase-config.js");
        const { doc, runTransaction } = await import(
            "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"
        );
        const counterRef = doc(db, "Counters", "AppointmentLetters_" + year);
        const newCount = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            const current = counterDoc.exists() ? (counterDoc.data().count || 0) : 0;
            const next = current + 1;
            transaction.set(counterRef, { count: next, year: year });
            return next;
        });
        letterNumber = "USS-" + year + "-" + String(newCount).padStart(4, "0");
    } catch (e) {
        console.warn("Counter fallback:", e.message);
        letterNumber = "USS-" + year + "-" + Date.now().toString().slice(-6);
    }

    // ── पद के अनुसार नियम ──
    const getRules = (des) => {
        const common = [
            "संस्था के संविधान, उद्देश्यों एवं आचार संहिता का पूर्ण पालन करना अनिवार्य है।",
            "संस्था की गोपनीयता बनाए रखना एवं किसी भी प्रकार की आंतरिक जानकारी को बाहर साझा न करना।",
            "संस्था के नाम का दुरुपयोग किसी व्यक्तिगत या व्यावसायिक हित के लिए नहीं किया जाएगा।",
            "नियुक्ति पत्र अहस्तांतरणीय है — यह किसी अन्य को हस्तांतरित नहीं किया जा सकता।"
        ];
        const byDes = {
            "ग्राम गौ-संयोजक": [
                "ग्राम स्तर पर गौ-सेवा के प्रचार-प्रसार हेतु प्रतिबद्ध रहना।",
                "स्थानीय स्तर पर गौ-माता सुरक्षा हेतु जन-जागरण अभियान चलाना।",
                "अपनी मासिक रिपोर्ट ब्लॉक गौ-प्रभारी को नियमित रूप से प्रेषित करना।",
                "ग्राम के निराश्रित पशुओं की देखभाल एवं पुनर्वास हेतु सहयोग करना।"
            ],
            "ब्लॉक गौ-प्रभारी": [
                "ब्लॉक स्तर पर ग्राम गौ-संयोजकों का मार्गदर्शन एवं समन्वय करना।",
                "ब्लॉक क्षेत्र में गौ-सेवा शिविर एवं जागरूकता कार्यक्रम आयोजित करना।",
                "जिला गौ-समन्वयक को नियमित प्रगति रिपोर्ट प्रेषित करना।"
            ],
            "जिला गौ-समन्वयक": [
                "पूरे जिले में गौ-सेवा गतिविधियों का समन्वय एवं पर्यवेक्षण करना।",
                "ब्लॉक प्रभारियों के कार्यों की समीक्षा और आवश्यक मार्गदर्शन देना।",
                "जिला स्तर पर संस्था की गतिविधियों को सुचारू रूप से संचालित करना।",
                "जिले में गौ-आश्रय स्थलों की स्थापना हेतु प्रशासन से समन्वय करना।"
            ],
            "प्रदेश कार्यकारिणी सदस्य": [
                "प्रदेश स्तर पर संस्था की नीतियों के क्रियान्वयन में सहभागिता।",
                "जिला समन्वयकों से नियमित संपर्क एवं समीक्षा।",
                "प्रदेश कार्यकारिणी की बैठकों में नियमित उपस्थिति।"
            ],
            "राष्ट्रीय गौ-पदाधिकारी": [
                "राष्ट्रीय स्तर पर गौ-सेवा एवं मानव सेवा के संकल्प को आगे बढ़ाना।",
                "संस्था की राष्ट्रीय नीतियों के निर्माण एवं क्रियान्वयन में सहयोग।",
                "अन्य राष्ट्रीय संस्थाओं, सरकारी विभागों से समन्वय स्थापित करना।"
            ]
        };
        const extra = byDes[des] || [
            "संस्था द्वारा सौंपे गए सभी दायित्वों का निष्ठापूर्वक निर्वहन करना।",
            "गौ-माता संरक्षण एवं समाज सेवा के कार्यों में सक्रिय सहभागिता।"
        ];
        return [...common, ...extra].map((r, i) => `<li style="margin-bottom:8px;">${r}</li>`).join('');
    };

    // QR for verification
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" +
        encodeURIComponent("https://unnatiselfhelpgroup-creator.github.io/certificate-verification.html?id=" + (data.doc_id || volunteerId));

    const pageStyle = `
        <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Arial', sans-serif; }
        .page {
            width: 794px;
            min-height: 1122px;
            padding: 36px 42px;
            background: #fffcf0;
            border: 12px double #d4af37;
            position: relative;
            page-break-after: always;
        }
        .page2 { page-break-before: always; }
        .logo { width: 100px; display: block; margin: 0 auto 8px; }
        .org-name { text-align:center; color:#071b34; font-size:22px; font-weight:bold; }
        .org-sub  { text-align:center; color:#555; font-size:13px; margin:4px 0 2px; }
        .org-ids  { text-align:center; color:#888; font-size:11px; margin-bottom:12px; }
        .doc-title {
            text-align:center; font-size:20px; font-weight:bold;
            color:#071b34; border-bottom:2px solid #d4af37;
            display:inline-block; padding-bottom:4px; margin:0 auto 18px;
        }
        .title-wrap { text-align:center; }
        .meta-box {
            display:flex; justify-content:space-between;
            background:#fffde7; padding:9px 14px; border-radius:8px;
            margin-bottom:18px; font-size:14px;
        }
        .fields p { font-size:15px; line-height:1.85; margin-bottom:2px; }
        .body-text {
            background:#f9f9f9; padding:14px 16px; border-radius:8px;
            border-left:4px solid #d4af37; font-size:14px; line-height:1.75;
            margin-top:16px;
        }
        .footer-row {
            position:absolute; bottom:38px; left:42px; right:42px;
            display:flex; justify-content:space-between; align-items:flex-end;
        }
        .sig-block { text-align:center; font-size:13px; }
        .qr-block  { text-align:center; font-size:11px; color:#888; }
        .rules-title {
            text-align:center; font-size:18px; font-weight:bold;
            color:#071b34; border-bottom:2px solid #d4af37;
            display:inline-block; padding-bottom:4px; margin-bottom:18px;
        }
        ul.rules { padding-left:20px; font-size:14px; line-height:1.8; color:#222; }
        .declaration {
            background:#fff8e1; padding:14px 16px; border-radius:8px;
            border-left:4px solid #c8860a; font-size:13.5px; line-height:1.7;
            margin-top:20px;
        }
        </style>
    `;

    const element = document.createElement("div");
    element.innerHTML = pageStyle + `

    <!-- PAGE 1: Appointment Letter -->
    <div class="page">
        <img src="ngologo.png" class="logo" onerror="this.style.display='none'">
        <div class="org-name">उन्नति स्वयं सहायता समिति</div>
        <div class="org-sub">गौ सेवा • मानव सेवा • राष्ट्र सेवा</div>
        <div class="org-ids">नीति आयोग ID: UA/2016/0108273 | PAN: AAATU7133Q | CSR: CSR00102587</div>

        <div class="title-wrap">
            <span class="doc-title">नियुक्ति पत्र (Appointment Letter)</span>
        </div>

        <div class="meta-box">
            <span><strong>पत्र संख्या:</strong>
                <span style="color:#c8860a;font-weight:bold;font-size:15px;">&nbsp;${letterNumber}</span>
            </span>
            <span><strong>दिनांक:</strong> ${date}</span>
        </div>

        <div class="fields">
            <p><strong>नाम:</strong> ${data.name || "-"}</p>
            <p><strong>पिता / पति का नाम:</strong> ${data.father_name || "-"}</p>
            <p><strong>मोबाइल:</strong> ${data.mobile || "-"}</p>
            <p><strong>पद (Designation):</strong> ${designation}</p>
            <p><strong>सहयोग राशि:</strong> ${fee}</p>
            <p><strong>Volunteer ID:</strong> ${volunteerId}</p>
        </div>

        <div class="body-text">
            <p>महोदय/महोदया,</p><br>
            <p>आपकी सामाजिक सेवा एवं राष्ट्र निर्माण के प्रति गहन समर्पण को देखते हुए आपको
            <strong>उन्नति स्वयं सहायता समिति</strong> के अंतर्गत
            <strong>${designation}</strong> पद पर नियुक्त किया जाता है।</p><br>
            <p>यह नियुक्ति <strong>तत्काल प्रभाव</strong> से लागू होगी। आपसे अपेक्षा है कि
            आप संस्था के नियमों, उद्देश्यों एवं आचार संहिता का पालन करते हुए अपने
            कार्यक्षेत्र में पूर्ण निष्ठा एवं ईमानदारी के साथ सेवा कार्य करेंगे।</p><br>
            <p>उपरोक्त सहयोग राशि <strong>(${fee})</strong> पूर्णतः
            <strong>Non-Refundable</strong> है तथा यह आईडी कार्ड, प्रशासनिक एवं
            तकनीकी सेवाओं के व्यय हेतु है।</p>
        </div>

        <div class="footer-row">
            <div class="qr-block">
                <img src="${qrUrl}" width="75" onerror="this.style.display='none'"><br>
                सत्यापन हेतु स्कैन करें
            </div>
            <div class="sig-block">
                <img src="signature.png" height="48" style="margin-bottom:4px;" onerror="this.style.display='none'"><br>
                <strong>अधिकृत हस्ताक्षर</strong><br>
                राष्ट्रीय सचिव<br>
                उन्नति स्वयं सहायता समिति
            </div>
        </div>
    </div>

    <!-- PAGE 2: Rules & Declaration -->
    <div class="page page2">
        <img src="ngologo.png" class="logo" onerror="this.style.display='none'">
        <div class="org-name">उन्नति स्वयं सहायता समिति</div>
        <div class="org-sub">नियुक्ति पत्र — पृष्ठ 2</div>
        <div style="height:14px;"></div>

        <div class="title-wrap">
            <span class="rules-title">नियम एवं शर्तें (Terms &amp; Conditions)</span>
        </div>

        <ul class="rules">${getRules(designation)}</ul>

        <div class="declaration">
            <strong>घोषणा (Declaration):</strong><br><br>
            मैं, <strong>${data.name || "______"}</strong>, पद
            <strong>${designation}</strong> के रूप में नियुक्त होते हुए घोषणा करता/करती हूँ
            कि मैंने उपरोक्त सभी नियम एवं शर्तें पढ़ी और समझी हैं तथा इनका पालन करने की
            शपथ लेता/लेती हूँ। किसी भी प्रकार के उल्लंघन पर संस्था मेरी नियुक्ति
            <strong>तत्काल प्रभाव से समाप्त</strong> करने हेतु स्वतंत्र होगी।
        </div>

        <div style="margin-top:40px; display:flex; justify-content:space-between; font-size:13px;">
            <div>
                <p>हस्ताक्षर: _____________________</p>
                <p style="margin-top:6px;">दिनांक: ${date}</p>
                <p style="margin-top:6px;">स्थान: ____________________</p>
            </div>
            <div style="text-align:right;">
                <p style="color:#888;">पत्र संख्या: <strong>${letterNumber}</strong></p>
                <p style="color:#888; margin-top:4px;">Volunteer ID: <strong>${volunteerId}</strong></p>
                <p style="color:#888; margin-top:4px; font-size:11px;">
                    Website: unnatiselfhelpgroup-creator.github.io
                </p>
            </div>
        </div>
    </div>
    `;

    const opt = {
        margin:     5,
        filename:   `${data.name || "Appointment"}-${letterNumber}.pdf`,
        image:      { type: "jpeg", quality: 0.98 },
        html2canvas:{ scale: 2, useCORS: true },
        jsPDF:      { unit: "mm", format: "a4", orientation: "portrait" }
    };

    await html2pdf().set(opt).from(element).save();
};
