window.generateAppointmentPDF = function (data) {
    const volunteerId = data.volunteer_id || data.volunteerId || "---";
    const date = "26/6/2026";
    const designation = data.designation || "---";
    const fee = data.fee || "---";

    // पद के अनुसार विस्तृत नियम
    const getRules = (des) => {
        let rules = ["संस्था के संविधान, उद्देश्यों एवं आचार संहिता का पूर्ण पालन करना अनिवार्य है।", "संस्था की गोपनीयता बनाए रखना।"];
        if (des === "ग्राम गौ-संयोजक") {
            rules.push("ग्राम स्तर पर गौ-सेवा के प्रचार-प्रसार हेतु प्रतिबद्ध रहना।", "स्थानीय स्तर पर गौ-माता सुरक्षा हेतु जन-जागरण अभियान चलाना।", "अपनी रिपोर्ट ब्लॉक गौ-प्रभारी को प्रतिमाह प्रेषित करना।");
        } else if (des === "जिला गौ-समन्वयक") {
            rules.push("पूरे जिले में गौ-सेवा गतिविधियों का समन्वय करना।", "ब्लॉक प्रभारियों के कार्यों की समीक्षा और मार्गदर्शन करना।", "जिला स्तर पर संस्था की गतिविधियों को सुचारू रूप से संचालित करना।");
        } else {
            rules.push("संस्था द्वारा सौंपे गए सभी दायित्वों का निष्ठापूर्वक निर्वहन करना।", "राष्ट्रीय स्तर पर गौ-सेवा एवं मानव सेवा के संकल्प को आगे बढ़ाना।");
        }
        return rules.map(r => `<li>${r}</li>`).join('');
    };

    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://unnatiselfhelpgroup-creator.github.io/verify.html?id=" + data.doc_id;

    const element = document.createElement('div');
    element.innerHTML = `
    <style>
        .page { width: 794px; padding: 40px; background: #fffcf0; border: 15px double #d4af37; box-sizing: border-box; font-family: 'Arial', sans-serif; height: 1122px; position: relative; }
        .logo { width: 130px; display: block; margin: 0 auto; }
        .header { text-align: center; color: #071b34; }
        .title { text-align: center; font-size: 24px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
        .content { font-size: 16px; line-height: 1.6; text-align: justify; margin-bottom: 20px; }
        .footer-sig { position: absolute; bottom: 50px; right: 50px; text-align: center; }
        .qr-code { position: absolute; bottom: 50px; left: 50px; }
        .page-break { page-break-before: always; }
    </style>

    <div class="page">
        <img src="https://unnatiselfhelpgroup-creator.github.io/logo.png" class="logo">
        <div class="header">
            <h1>उन्नति स्वयं सहायता समिति</h1>
            <p>(NITI Aayog Registered Organization) | गौ सेवा • मानव सेवा • राष्ट्र सेवा</p>
        </div>
        <div class="title">नियुक्ति पत्र (Appointment Letter)</div>
        <div class="content">
            <p><b>पत्र संख्या:</b> USS/APP/2026/1782445816666 &nbsp;&nbsp; <b>दिनांक:</b> ${date}</p>
            <p><b>नाम:</b> ${data.name}</p>
            <p><b>पिता/पति का नाम:</b> ${data.father_name}</p>
            <p><b>पद:</b> ${designation}</p>
            <p><b>Volunteer ID:</b> ${volunteerId}</p>
            <br>
            <p>महोदय/महोदया, आपकी सामाजिक सेवा एवं राष्ट्र निर्माण के प्रति समर्पण को देखते हुए आपको उन्नति स्वयं सहायता समिति के अंतर्गत <b>${designation}</b> पद पर नियुक्त किया जाता है।</p>
            <p>यह नियुक्ति तत्काल प्रभाव से लागू होगी। आपसे अपेक्षा है कि आप संस्था के नियमों का पालन करते हुए अपने कार्यक्षेत्र में निष्ठा के साथ सेवा कार्य करेंगे। उपरोक्त सहयोग राशि (₹${fee}) Non-Refundable है।</p>
        </div>
        <div class="qr-code"><img src="${qrUrl}" width="80"></div>
        <div class="footer-sig">
            <img src="https://unnatiselfhelpgroup-creator.github.io/signature.png" width="140"><br>
            <b>राष्ट्रीय सचिव</b>
        </div>
    </div>

    <div class="page page-break">
        <div class="title">नियम एवं शर्तें (Terms & Conditions)</div>
        <div class="content">
            <ul style="padding-left: 20px; font-size: 16px;">${getRules(designation)}</ul>
            <br><br>
            <p><b>घोषणा:</b> मैं, ${data.name}, पद ${designation} के रूप में संस्था के सभी नियमों का पालन करने की शपथ लेता हूँ। किसी भी प्रकार के उल्लंघन पर संस्था मेरी नियुक्ति तत्काल प्रभाव से समाप्त करने हेतु स्वतंत्र होगी।</p>
        </div>
    </div>
    `;

    const opt = {
        margin: 0,
        filename: `${data.name}_नियुक्ति_पत्र.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};

