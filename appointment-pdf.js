// =============================================
// appointment-pdf.js — नियुक्ति पत्र PDF Generator
// Logo और Signature के साथ
// =============================================
window.generateAppointmentPDF = function (data) {
    const volunteerId = data.volunteer_id || data.volunteerId || "-";
    const now = new Date();
    const dateStr = now.toLocaleDateString("hi-IN", {day:"2-digit", month:"long", year:"numeric"});
    const letterNo = "USS/APP/" + now.getFullYear() + "/" + Date.now();

    const FEE_BY_DESIGNATION = {
        "ग्राम गौ-संयोजक":          "₹150",
        "ब्लॉक गौ-प्रभारी":         "₹500",
        "जिला गौ-समन्वयक":          "₹1,100",
        "प्रदेश कार्यकारिणी सदस्य": "₹2,500",
        "राष्ट्रीय गौ-पदाधिकारी":   "₹5,100 – ₹11,000",
        "Volunteer (स्वयंसेवक)":    "₹700 (एकमुश्त)"
    };

    const designation = data.designation || "Volunteer";
    const fee = data.fee || FEE_BY_DESIGNATION[designation] || "-";

    const LOGO_URL = "https://unnatiselfhelpgroup-creator.github.io/ngologo.png";
    const SIGN_URL = "https://unnatiselfhelpgroup-creator.github.io/signature.png";

    const element = document.createElement('div');
    element.style.cssText = "width:794px;padding:0;background:white;font-family:'Arial',sans-serif;";

    element.innerHTML = `
    <div style="border:5px double #d4af37;padding:40px;min-height:1100px;position:relative;">

      <!-- ऊपर Logo + शीर्षक -->
      <div style="text-align:center;margin-bottom:16px;">
        <img src="${LOGO_URL}" alt="NGO Logo" style="width:80px;height:80px;border-radius:50%;border:3px solid #d4af37;margin-bottom:8px;" crossorigin="anonymous">
        <h1 style="color:#4a0404;font-size:20px;margin:0;">उन्नति स्वयं सहायता समिति</h1>
        <p style="color:#555;font-size:12px;margin:4px 0;">गौ सेवा • मानव सेवा • पर्यावरण संरक्षण • राष्ट्र सेवा</p>
        <p style="color:#777;font-size:11px;margin:2px 0;">NGO Darpan: UA/2016/0108273 | PAN: AAATU7133Q | Reg: UK0660892021006667</p>
        <p style="color:#777;font-size:11px;margin:2px 0;">Lalkuan, Nainital, Uttarakhand — 263139 | 📱 9410332400</p>
        <hr style="border:1.5px solid #d4af37;margin:12px 0;">
        <h2 style="color:#4a0404;font-size:16px;letter-spacing:2px;margin:0;">नियुक्ति पत्र (APPOINTMENT LETTER)</h2>
        <hr style="border:1px solid #d4af37;margin:10px 0;">
      </div>

      <!-- पत्र संख्या और दिनांक -->
      <div style="display:flex;justify-content:space-between;font-size:12px;color:#333;margin-bottom:20px;">
        <div><strong>पत्र संख्या:</strong> ${letterNo}</div>
        <div><strong>दिनांक:</strong> ${dateStr}</div>
      </div>

      <!-- आवेदक की जानकारी -->
      <div style="background:#fff8e1;border:1px solid #ffd700;border-radius:8px;padding:16px;margin-bottom:20px;">
        <h3 style="color:#4a0404;font-size:13px;margin-bottom:10px;border-bottom:1px solid #ffd700;padding-bottom:6px;">📋 नियुक्त व्यक्ति का विवरण</h3>
        <table style="width:100%;font-size:12px;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 8px;font-weight:600;width:40%;color:#4a0404;">नाम:</td>
            <td style="padding:5px 8px;">${data.name || "-"}</td>
          </tr>
          <tr style="background:#fffef5;">
            <td style="padding:5px 8px;font-weight:600;color:#4a0404;">पिता/पति का नाम:</td>
            <td style="padding:5px 8px;">${data.fatherName || data.father_name || "-"}</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:600;color:#4a0404;">मोबाइल:</td>
            <td style="padding:5px 8px;">${data.mobile || "-"}</td>
          </tr>
          <tr style="background:#fffef5;">
            <td style="padding:5px 8px;font-weight:600;color:#4a0404;">ईमेल:</td>
            <td style="padding:5px 8px;">${data.email || "-"}</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:600;color:#4a0404;">पता:</td>
            <td style="padding:5px 8px;">${data.address || "-"}</td>
          </tr>
          <tr style="background:#fffef5;">
            <td style="padding:5px 8px;font-weight:600;color:#4a0404;">पद (Designation):</td>
            <td style="padding:5px 8px;font-weight:700;color:#4a0404;">${designation}</td>
          </tr>
          <tr>
            <td style="padding:5px 8px;font-weight:600;color:#4a0404;">सहयोग राशि:</td>
            <td style="padding:5px 8px;font-weight:700;color:#c0392b;">${fee}</td>
          </tr>
          <tr style="background:#fffef5;">
            <td style="padding:5px 8px;font-weight:600;color:#4a0404;">Volunteer / Member ID:</td>
            <td style="padding:5px 8px;font-weight:700;">${volunteerId}</td>
          </tr>
        </table>
      </div>

      <!-- नियुक्ति पत्र का मुख्य पाठ -->
      <div style="font-size:13px;line-height:1.8;color:#222;margin-bottom:20px;text-align:justify;">
        <p>महोदय/महोदया,</p>
        <br>
        <p>उन्नति स्वयं सहायता समिति आपकी सामाजिक सेवा, गौ-संरक्षण एवं राष्ट्र निर्माण के प्रति समर्पण एवं निष्ठा का स्वागत करती है। आपके आवेदन एवं भुगतान के पश्चात, आपको संस्था के अंतर्गत <strong style="color:#4a0404;">${designation}</strong> पद पर तत्काल प्रभाव से नियुक्त किया जाता है।</p>
        <br>
        <p>आप अपने क्षेत्र में गौ सेवा, घायल गोवंश सहायता, पर्यावरण संरक्षण, रक्तदान, जनजागरूकता एवं समाज सेवा के कार्यों में सक्रिय भूमिका निभाएंगे। गौ माता को राष्ट्रमाता एवं राज्यमाता का सम्मान दिलाने के संस्था के उद्देश्य में आपका सहयोग अपेक्षित है।</p>
        <br>
        <p><strong>महत्वपूर्ण:</strong> प्रशासनिक सहयोग राशि <strong>${fee}</strong> Non-Refundable है तथा ID Card, नियुक्ति पत्र एवं प्रशासनिक सेवाओं हेतु है। इस नियुक्ति पत्र का उपयोग केवल संस्था के सेवा कार्यों हेतु किया जाए। किसी से धन की मांग करना या संस्था के नाम पर अवैध कार्य करना दंडनीय अपराध होगा।</p>
      </div>

      <!-- हस्ताक्षर -->
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px;">
        <div style="font-size:11px;color:#555;">
          <p>नियुक्त व्यक्ति के हस्ताक्षर</p>
          <div style="margin-top:30px;border-top:1px solid #999;width:160px;"></div>
          <p style="margin-top:4px;">${data.name || ""}</p>
        </div>
        <div style="text-align:center;">
          <img src="${SIGN_URL}" alt="Authorised Signature" style="height:60px;max-width:180px;object-fit:contain;" crossorigin="anonymous">
          <div style="border-top:1px solid #999;margin-top:4px;"></div>
          <p style="font-size:11px;font-weight:700;color:#4a0404;margin-top:4px;">अधिकृत हस्ताक्षर</p>
          <p style="font-size:10px;color:#555;">राष्ट्रीय सचिव</p>
          <p style="font-size:10px;color:#555;">उन्नति स्वयं सहायता समिति</p>
        </div>
      </div>

      <!-- नीचे Footer -->
      <div style="margin-top:30px;text-align:center;border-top:1.5px solid #d4af37;padding-top:10px;">
        <p style="font-size:10px;color:#777;">यह नियुक्ति पत्र संस्था के आधिकारिक पोर्टल द्वारा जारी किया गया है।</p>
        <p style="font-size:10px;color:#777;">Reg: UK0660892021006667 | Validity: 30-01-2031 | NGO Darpan: UA/2016/0108273</p>
        <p style="font-size:10px;color:#4a0404;font-weight:600;">unnatiselfhelpgroup-creator.github.io | 📧 unnatiselfhelpgroup@gmail.com</p>
      </div>
    </div>
    `;

    const opt = {
        margin: 5,
        filename: (data.name || "Appointment") + "-NiyuktiPatra.pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
};

