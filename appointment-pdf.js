window.generateAppointmentPDF = function (data) {
    const volunteerId = data.volunteer_id || data.volunteerId || "---";
    const date = "26/6/2026";
    const designation = data.designation || "---";
    
    // यहाँ आपके सभी विस्तृत नियम हैं
    const rules = [
        "संस्था की गरिमा और आचार संहिता का पूर्ण पालन करना अनिवार्य है।",
        "अपने नियुक्त कार्यक्षेत्र (ग्राम/ब्लॉक/जिला/राज्य) में गौ-सेवा के प्रचार-प्रसार हेतु प्रतिबद्ध रहें।",
        "अपने कार्यों की साप्ताहिक रिपोर्ट अपने वरिष्ठ पदाधिकारी को प्रस्तुत करें।",
        "किसी भी गतिविधि में संस्था के नियमों का उल्लंघन होने पर नियुक्ति तत्काल रद्द की जा सकती है।",
        "संस्था की किसी भी गोपनीय रणनीति को बाहरी व्यक्तियों से साझा न करें।",
        "संस्था के नाम का दुरुपयोग करने पर कानूनी कार्यवाही की जाएगी।",
        "यह नियुक्ति पूर्णतः स्वैच्छिक एवं सामाजिक सेवा के उद्देश्य से है।"
    ];

    const element = document.createElement('div');
    element.innerHTML = `
    <style>
        .page { width: 794px; padding: 40px; background: #fffcf0; border: 15px double #d4af37; box-sizing: border-box; font-family: 'Arial', sans-serif; min-height: 1122px; }
        .logo { width: 150px; display: block; margin: 0 auto 10px; }
        .org-name { text-align: center; font-size: 26px; font-weight: bold; color: #071b34; }
        .org-tag { text-align: center; font-size: 16px; color: #333; margin-bottom: 20px; }
        .title { text-align: center; font-size: 22px; font-weight: bold; text-decoration: underline; margin: 30px 0; }
        .content { font-size: 16px; line-height: 1.8; text-align: justify; color: #000; }
        .signature-area { margin-top: 100px; text-align: right; }
        .page-break { page-break-before: always; }
        ul { padding-left: 30px; }
        li { margin-bottom: 10px; }
    </style>

    <!-- पेज 1 -->
    <div class="page">
        <img src="https://unnatiselfhelpgroup-creator.github.io/logo.png" class="logo">
        <div class="org-name">उन्नति स्वयं सहायता समिति</div>
        <div class="org-tag">(NITI Aayog Registered Organization) | गौ सेवा • मानव सेवा • राष्ट्र सेवा</div>
        <div class="title">नियुक्ति पत्र (Appointment Letter)</div>
        
        <div class="content">
            <p><b>पत्र संख्या:</b> USS/APP/2026/1782445816666 &nbsp;&nbsp;&nbsp; <b>दिनांक:</b> ${date}</p>
            <p><b>नाम:</b> ${data.name || "-"}</p>
            <p><b>पिता/पति का नाम:</b> ${data.father_name || "-"}</p>
            <p><b>मोबाइल:</b> ${data.mobile || "-"}</p>
            <p><b>पद:</b> ${designation}</p>
            <p><b>सहयोग राशि:</b> ₹${data.fee || "-"}</p>
            <p><b>Volunteer ID:</b> ${volunteerId}</p>
            <br>
            <p>महोदय/महोदया, आपकी सामाजिक सेवा एवं राष्ट्र निर्माण के प्रति समर्पण को देखते हुए आपको उन्नति स्वयं सहायता समिति के अंतर्गत <b>${designation}</b> पद पर नियुक्त किया जाता है।</p>
            <p>यह नियुक्ति तत्काल प्रभाव से लागू होगी। आपसे अपेक्षा है कि आप संस्था के संविधान, उद्देश्यों एवं आचार संहिता का पालन करते हुए अपने निर्धारित कार्यक्षेत्र में निष्ठा, ईमानदारी एवं अनुशासन के साथ सेवा कार्य करेंगे।</p>
            <p>उपरोक्त सहयोग राशि Non-Refundable है तथा आईडी कार्ड, प्रशासनिक एवं तकनीकी सेवाओं हेतु है।</p>
        </div>

        <div class="signature-area">
            <img src="https://unnatiselfhelpgroup-creator.github.io/signature.png" width="180">
            <p><b>राष्ट्रीय सचिव</b></p>
        </div>
    </div>

    <!-- पेज 2 -->
    <div class="page page-break">
        <div class="title">नियम एवं शर्तें</div>
        <div class="content">
            <ul>${rules.map(r => `<li>${r}</li>`).join('')}</ul>
            <br><br>
            <p><b>घोषणा:</b> मैं उपरोक्त सभी नियमों और शर्तों से सहमत हूँ और संस्था के प्रति अपनी जिम्मेदारी का निर्वहन करने का वचन देता हूँ।</p>
        </div>
    </div>
    `;

    const opt = {
        margin: 0,
        filename: `${data.name}_Appointment_Letter.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};
