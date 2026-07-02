// =============================================
// appointment-pdf.js — नियुक्ति पत्र PDF Generator
// Premium "Sacred India" थीम — Logo, Signature, Seal, QR Verification के साथ
// =============================================
window.generateAppointmentPDF = async function (data) {
    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
        return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    }

    async function ensureFontsLoaded() {
        if (!document.getElementById("appt-font-link")) {
            await new Promise((resolve) => {
                const link = document.createElement("link");
                link.id = "appt-font-link";
                link.rel = "stylesheet";
                link.href = "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Cinzel:wght@700;900&family=Poppins:wght@400;600;700&display=swap";
                link.onload = () => resolve();
                link.onerror = () => resolve();
                document.head.appendChild(link);
                setTimeout(resolve, 2500); // safety net अगर font CDN धीमा हो
            });
        }
        if (document.fonts) {
            try {
                await Promise.all([
                    document.fonts.load('400 16px "Tiro Devanagari Hindi"'),
                    document.fonts.load('700 16px "Tiro Devanagari Hindi"'),
                    document.fonts.load('700 16px "Cinzel"'),
                    document.fonts.load('900 16px "Cinzel"')
                ]);
                await document.fonts.ready;
            } catch (e) {}
        }
        // अतिरिक्त सुरक्षा — धीमे मोबाइल नेटवर्क पर font paint होने का समय दें
        await new Promise(r => setTimeout(r, 500));
    }
    await ensureFontsLoaded();

    const volunteerId = escapeHtml(data.volunteer_id || data.volunteerId || "-");
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

    const qrData = encodeURIComponent(
        `https://unnatiselfhelpgroup-creator.github.io/idverification.html?id=${data.volunteer_id || data.volunteerId || ""}`
    );
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=0&data=${qrData}`;

    const element = document.createElement('div');
    element.style.cssText = "width:794px;padding:0;background:#FFFDF8;font-family:'Poppins',sans-serif;position:relative;";

    element.innerHTML = `
    <style>
      .apl-outer{border:4px solid #C8960C;padding:3px;position:relative;}
      .apl-inner{border:1px solid #C8960C;padding:30px 34px 34px;position:relative;min-height:1080px;overflow:hidden;}
      .apl-tri{height:5px;display:flex;margin:-30px -34px 22px;}
      .apl-tri span{flex:1;} .apl-tri span:nth-child(1){background:#FF6B00;}
      .apl-tri span:nth-child(2){background:#fff;} .apl-tri span:nth-child(3){background:#138808;}
      .apl-wm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.05;width:420px;pointer-events:none;}
      .apl-corner{position:absolute;width:34px;height:34px;border:2.5px solid #8B0000;}
      .apl-cc-tl{top:8px;left:8px;border-right:none;border-bottom:none;}
      .apl-cc-tr{top:8px;right:8px;border-left:none;border-bottom:none;}
      .apl-cc-bl{bottom:8px;left:8px;border-right:none;border-top:none;}
      .apl-cc-br{bottom:8px;right:8px;border-left:none;border-top:none;}
    </style>

    <div class="apl-outer">
      <div class="apl-inner">
        <div class="apl-corner apl-cc-tl"></div><div class="apl-corner apl-cc-tr"></div>
        <div class="apl-corner apl-cc-bl"></div><div class="apl-corner apl-cc-br"></div>
        <img class="apl-wm" src="${LOGO_URL}" crossorigin="anonymous">
        <div class="apl-tri"><span></span><span></span><span></span></div>

        <!-- शीर्षक -->
        <div style="text-align:center;margin-bottom:16px;position:relative;">
          <img src="${LOGO_URL}" alt="NGO Logo" style="width:76px;height:76px;border-radius:50%;border:3px solid #C8960C;margin-bottom:8px;object-fit:cover;" crossorigin="anonymous">
          <h1 style="font-family:'Tiro Devanagari Hindi',serif;color:#4a0404;font-size:22px;margin:0;">उन्नति स्वयं सहायता समिति</h1>
          <p style="color:#8B6B00;font-size:10.5px;letter-spacing:1.5px;margin:5px 0 2px;text-transform:uppercase;">Unnati Swayam Sahayata Samiti</p>
          <p style="color:#777;font-size:10.5px;margin:2px 0;">गौ सेवा • मानव सेवा • पर्यावरण संरक्षण • राष्ट्र सेवा</p>
          <p style="color:#999;font-size:9.5px;margin:2px 0;">NGO Darpan: UA/2016/0108273 | PAN: AAATU7133Q | Reg: UK0660892021006667</p>
          <p style="color:#999;font-size:9.5px;margin:2px 0;">Lalkuan, Nainital, Uttarakhand — 263139 | 📱 9410332400</p>
          <div style="width:160px;height:2px;background:linear-gradient(90deg,transparent,#C8960C,transparent);margin:12px auto;"></div>
          <h2 style="font-family:'Cinzel',serif;color:#8B0000;font-size:19px;letter-spacing:3px;margin:0;font-weight:900;">APPOINTMENT LETTER</h2>
          <p style="font-family:'Tiro Devanagari Hindi',serif;color:#666;font-size:13px;margin-top:4px;">नियुक्ति पत्र</p>
        </div>

        <!-- पत्र संख्या और दिनांक -->
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#333;margin-bottom:18px;padding:0 2px;">
          <div><strong style="color:#4a0404;">पत्र संख्या:</strong> ${letterNo}</div>
          <div><strong style="color:#4a0404;">दिनांक:</strong> ${dateStr}</div>
        </div>

        <!-- आवेदक की जानकारी -->
        <div style="background:#fff8e7;border:1.5px solid #C8960C;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
          <h3 style="font-family:'Tiro Devanagari Hindi',serif;color:#4a0404;font-size:13.5px;margin-bottom:10px;border-bottom:1px solid #e0c060;padding-bottom:7px;">📋 नियुक्त व्यक्ति का विवरण</h3>
          <table style="width:100%;font-size:12px;border-collapse:collapse;">
            <tr>
              <td style="padding:5px 8px;font-weight:600;width:38%;color:#4a0404;">नाम:</td>
              <td style="padding:5px 8px;">${escapeHtml(data.name || "-")}</td>
            </tr>
            <tr style="background:#fffef5;">
              <td style="padding:5px 8px;font-weight:600;color:#4a0404;">पिता/पति का नाम:</td>
              <td style="padding:5px 8px;">${escapeHtml(data.fatherName || data.father_name || "-")}</td>
            </tr>
            <tr>
              <td style="padding:5px 8px;font-weight:600;color:#4a0404;">मोबाइल:</td>
              <td style="padding:5px 8px;">${escapeHtml(data.mobile || "-")}</td>
            </tr>
            <tr style="background:#fffef5;">
              <td style="padding:5px 8px;font-weight:600;color:#4a0404;">ईमेल:</td>
              <td style="padding:5px 8px;">${escapeHtml(data.email || "-")}</td>
            </tr>
            <tr>
              <td style="padding:5px 8px;font-weight:600;color:#4a0404;">पता:</td>
              <td style="padding:5px 8px;">${escapeHtml(data.address || "-")}</td>
            </tr>
            <tr style="background:#fffef5;">
              <td style="padding:5px 8px;font-weight:600;color:#4a0404;">पद (Designation):</td>
              <td style="padding:5px 8px;font-weight:700;color:#4a0404;">${escapeHtml(designation)}</td>
            </tr>
            <tr>
              <td style="padding:5px 8px;font-weight:600;color:#4a0404;">सहयोग राशि:</td>
              <td style="padding:5px 8px;font-weight:700;color:#8B0000;">${escapeHtml(fee)}</td>
            </tr>
            <tr style="background:#fffef5;">
              <td style="padding:5px 8px;font-weight:600;color:#4a0404;">Volunteer / Member ID:</td>
              <td style="padding:5px 8px;font-weight:700;">${volunteerId}</td>
            </tr>
          </table>
        </div>

        <!-- नियुक्ति पत्र का मुख्य पाठ -->
        <div style="font-family:'Tiro Devanagari Hindi',serif;font-size:13px;line-height:1.9;color:#222;margin-bottom:20px;text-align:justify;">
          <p>महोदय/महोदया,</p>
          <br>
          <p>उन्नति स्वयं सहायता समिति आपकी सामाजिक सेवा, गौ-संरक्षण एवं राष्ट्र निर्माण के प्रति समर्पण एवं निष्ठा का स्वागत करती है। आपके आवेदन एवं भुगतान के पश्चात, आपको संस्था के अंतर्गत <strong style="color:#4a0404;">${escapeHtml(designation)}</strong> पद पर तत्काल प्रभाव से नियुक्त किया जाता है।</p>
          <br>
          <p>आप अपने क्षेत्र में गौ सेवा, घायल गोवंश सहायता, पर्यावरण संरक्षण, रक्तदान, जनजागरूकता एवं समाज सेवा के कार्यों में सक्रिय भूमिका निभाएंगे। गौ माता को राष्ट्रमाता एवं राज्यमाता का सम्मान दिलाने के संस्था के उद्देश्य में आपका सहयोग अपेक्षित है।</p>
          <br>
          <p><strong>महत्वपूर्ण:</strong> प्रशासनिक सहयोग राशि <strong>${escapeHtml(fee)}</strong> Non-Refundable है तथा ID Card, नियुक्ति पत्र एवं प्रशासनिक सेवाओं हेतु है। इस नियुक्ति पत्र का उपयोग केवल संस्था के सेवा कार्यों हेतु किया जाए। किसी से धन की मांग करना या संस्था के नाम पर अवैध कार्य करना दंडनीय अपराध होगा।</p>
        </div>

        <!-- सील + हस्ताक्षर + QR -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:36px;">
          <div style="width:74px;height:74px;border-radius:50%;border:3px double #8B0000;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#8B0000;transform:rotate(-8deg);">
            <span style="font-family:'Tiro Devanagari Hindi',serif;font-size:7.5px;font-weight:700;line-height:1.25;text-align:center;">उन्नति<br>स्वयं सहायता<br>समिति</span>
          </div>
          <div style="text-align:center;">
            <img src="${SIGN_URL}" alt="Authorised Signature" style="height:52px;max-width:170px;object-fit:contain;" crossorigin="anonymous">
            <div style="border-top:1px solid #999;margin-top:4px;width:170px;"></div>
            <p style="font-size:11px;font-weight:700;color:#4a0404;margin-top:4px;">अधिकृत हस्ताक्षर</p>
            <p style="font-size:10px;color:#555;">राष्ट्रीय सचिव</p>
          </div>
          <div style="text-align:center;">
            <img src="${qrURL}" style="width:60px;height:60px;border:1.5px solid #C8960C;border-radius:5px;padding:2px;background:#fff;" crossorigin="anonymous">
            <p style="font-size:8.5px;color:#777;margin-top:4px;">स्कैन कर सत्यापित करें</p>
          </div>
        </div>

        <!-- नीचे Footer -->
        <div style="margin-top:28px;text-align:center;border-top:1.5px solid #C8960C;padding-top:10px;">
          <p style="font-size:9.5px;color:#777;">यह नियुक्ति पत्र संस्था के आधिकारिक पोर्टल द्वारा जारी किया गया है।</p>
          <p style="font-size:9.5px;color:#777;">Reg: UK0660892021006667 | Validity: 30-01-2031 | NGO Darpan: UA/2016/0108273</p>
          <p style="font-size:9.5px;color:#4a0404;font-weight:600;">unnatiselfhelpgroup-creator.github.io | 📧 unnatiselfhelpgroup@gmail.com</p>
        </div>
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

    await html2pdf().set(opt).from(element).save();
};
