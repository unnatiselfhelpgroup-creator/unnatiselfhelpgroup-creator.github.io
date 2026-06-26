window.generateAppointmentPDF = function (data) {
    const volunteerId = data.volunteer_id || data.volunteerId || "---";
    const date = "26/6/2026"; 
    const designation = data.designation || "---";
    const fee = data.fee || "---";

    // नियम एवं शर्तों का लॉजिक
    const getRules = (designation) => {
        let rules = "<li>संस्था की गरिमा और आचार संहिता का पूर्ण पालन करना अनिवार्य है।</li>";
        rules += "<li>अपने नियुक्त कार्यक्षेत्र में गौ-सेवा के प्रचार-प्रसार हेतु प्रतिबद्ध रहें।</li>";
        rules += "<li>अपने कार्यों की साप्ताहिक रिपोर्ट अपने वरिष्ठ पदाधिकारी को प्रस्तुत करें।</li>";
        rules += "<li>किसी भी गतिविधि में संस्था के नियमों का उल्लंघन होने पर नियुक्ति तत्काल रद्द की जा सकती है।</li>";
        
        if (designation === "ग्राम गौ-संयोजक") rules += "<li>ग्राम स्तर पर 'गौ माता राष्ट्र माता जन-जागरण अभियान' का नेतृत्व करना।</li>";
        if (designation === "जिला गौ-समन्वयक") rules += "<li>जिला स्तर पर अभियान का नेतृत्व और ब्लॉक प्रभारियों का मार्गदर्शन।</li>";
        return rules;
    };

    const element = document.createElement('div');
    element.innerHTML = `
    <style>
        .page { width: 794px; padding: 40px; background: #fffcf0; border: 15px double #d4af37; box-sizing: border-box; font-family: 'Arial', sans-serif; }
        .logo { width: 150px; display: block; margin: 0 auto 10px; }
        .org-name { text-align: center; font-size: 24px; font-weight: bold; color: #071b34; }
        .header-sub { text-align: center; font-size: 14px; margin-bottom: 20px; }
        .title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
        .content { font-size: 16px; line-height: 1.6; text-align: justify; }
        .signature-area { margin-top: 60px; text-align: right; }
        .page-break { page-break-before: always; }
    </style>

    <!-- पेज 1: नियुक्ति पत्र -->
    <div class="page">
        <img src="https://unnatiselfhelpgroup-creator.github.io/logo.png" class="logo">
        <div class="org-name">उन्नति स्वयं सहायता समिति</div>
        <div class="header-sub">(NITI Aayog Registered Organization) | गौ सेवा • मानव सेवा • राष्ट्र सेवा</div>
        <div class="title">नियुक्ति पत्र (Appointment Letter)</div>
        
        <div class="content">
            <p><b>पत्र संख्या:</b> USS/APP/2026/1782445816666</p>
            <p><b>दिनांक:</b> ${date}</p>
            <p><b>नाम:</b> ${data.name || "-"}</p>
            <p><b>पिता/पति का नाम:</b> ${data.father_name || "-"}</p>
            <p><b>मोबाइल:</b> ${data.mobile || "-"}</p>
            <p><b>पद:</b> ${designation}</p>
            <p><b>सहयोग राशि:</b> ${fee}</p>
            <p><b>Volunteer ID:</b> ${volunteerId}</p>
            <br>
            <p>महोदय/महोदया, आपकी सामाजिक सेवा एवं राष्ट्र निर्माण के प्रति समर्पण को देखते हुए आपको उन्नति स्वयं सहायता समिति के अंतर्गत <b>${designation}</b> पद पर नियुक्त किया जाता है।</p>
            <p>आपकी नियुक्ति तत्काल प्रभाव से लागू होगी। उपरोक्त सहयोग राशि Non-Refundable है तथा आईडी कार्ड, प्रशासनिक एवं तकनीकी सेवाओं हेतु है।</p>
        </div>

        <div class="signature-area">
            <img src="https://unnatiselfhelpgroup-creator.github.io/signature.png" width="150">
            <p><b>राष्ट्रीय सचिव</b></p>
        </div>
    </div>

    <!-- पेज 2: नियम और शर्तें -->
    <div class="page page-break">
        <div class="title">नियम एवं शर्तें</div>
        <div class="content">
            <ul>${getRules(designation)}</ul>
        </div>
    </div>
    `;

    const opt = {
        margin: 0,
        filename: `${data.name}_Appointment.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};
