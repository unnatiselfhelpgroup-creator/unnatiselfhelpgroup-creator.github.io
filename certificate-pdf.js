// ── PDF लाइब्रेरी लोडर — html2canvas / jsPDF कभी-कभी मोबाइल नेटवर्क
// (जैसे Jio का data-compression) की वजह से लोड होते वक़्त टूट जाती हैं।
// यह फ़ंक्शन जाँचता है कि दोनों लाइब्रेरी उपलब्ध हैं या नहीं, और अगर
// नहीं हैं तो बिना SRI hash के एक वैकल्पिक CDN से दोबारा लोड करने की
// कोशिश करता है, ताकि "html2canvas is not defined" जैसी गलती की वजह
// से PDF जनरेशन पूरी तरह फेल न हो।
function _loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("script load failed: " + src));
    document.head.appendChild(s);
  });
}
async function ensurePdfLibsReady(need) {
  // need: { canvas: true/false, jspdf: true/false, html2pdf: true/false }
  need = need || { canvas: true, jspdf: true, html2pdf: false };
  function missing() {
    const m = [];
    if (need.canvas && typeof window.html2canvas === "undefined") m.push("canvas");
    if (need.jspdf && (typeof window.jspdf === "undefined" || typeof window.jspdf.jsPDF === "undefined")) m.push("jspdf");
    if (need.html2pdf && typeof window.html2pdf === "undefined") m.push("html2pdf");
    return m;
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    let m = missing();
    if (m.length === 0) return true;
    if (attempt === 0) {
      await new Promise(r => setTimeout(r, 800));
      continue;
    }
    m = missing();
    try {
      if (m.includes("html2pdf")) {
        await _loadScriptOnce("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js");
      }
      if (m.includes("canvas")) {
        await _loadScriptOnce("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
      }
      if (m.includes("jspdf")) {
        await _loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      }
    } catch (e) { /* अगले attempt में फिर कोशिश होगी */ }
    await new Promise(r => setTimeout(r, 500));
  }
  if (missing().length > 0) {
    throw new Error("PDF लाइब्रेरी लोड नहीं हो पाई। कृपया अपना इंटरनेट/नेटवर्क जाँचें (Wi-Fi या दूसरा नेटवर्क आज़माएँ) और फिर से कोशिश करें, या ऊपर 'Preview' खोलकर वहाँ से 'प्रिंट करें → Save as PDF' इस्तेमाल करें।");
  }
  return true;
}

// ============================================================
// certificate-pdf.js — उन्नति स्वयं सहायता समिति
// Premium "Sacred India" थीम — सेवा प्रमाण पत्र (A4 Landscape)
// HTML/CSS + html2canvas से render होता है ताकि हिंदी सही दिखे।
//
// ज़रूरी: इस पेज पर html2pdf.bundle.min.js लोड होना चाहिए, जिसमें
// html2canvas + jsPDF दोनों शामिल हैं:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
// ============================================================

function certEsc(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function ensureCertFontsLoaded() {
  if (!document.getElementById("cert-font-link")) {
    await new Promise((resolve) => {
      const link = document.createElement("link");
      link.id = "cert-font-link";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Cinzel:wght@700;900&family=Poppins:wght@400;600;700&display=swap";
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
      setTimeout(resolve, 2500);
    });
  }
  if (document.fonts) {
    try {
      await Promise.all([
        document.fonts.load('400 16px "Tiro Devanagari Hindi"'),
        document.fonts.load('700 16px "Tiro Devanagari Hindi"'),
        document.fonts.load('700 16px "Cinzel"'),
        document.fonts.load('900 16px "Cinzel"'),
        document.fonts.load('400 16px "Poppins"'),
        document.fonts.load('700 16px "Poppins"')
      ]);
      await document.fonts.ready;
    } catch (e) {}
  }
  await new Promise(r => setTimeout(r, 500));
}

// सर्टिफिकेट का पूरा markup (style सहित) — PDF और Preview दोनों इसे इस्तेमाल करते हैं
function buildCertificateMarkup(data, certNo, date) {
  const LOGO_URL = "https://unnatiselfhelpgroup-creator.github.io/ngologo.png";
  const SIGN_URL = "https://unnatiselfhelpgroup-creator.github.io/signature.png";

  const qrData = encodeURIComponent(
    `https://unnatiselfhelpgroup-creator.github.io/certificate-verification.html?cert=${certNo}`
  );
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${qrData}`;

  return `
  <style>
    .cert{width:1123px;height:794px;position:relative;background:linear-gradient(135deg,#FFFDF8,#FFF8ED);
      font-family:'Poppins',sans-serif;overflow:hidden;margin:0 auto;}
    .cert-outer{position:absolute;inset:14px;border:3px solid #C8960C;}
    .cert-inner{position:absolute;inset:22px;border:1px solid #C8960C;}
    .cert-corner{position:absolute;width:46px;height:46px;border:3px solid #8B0000;}
    .cc-tl{top:26px;left:26px;border-right:none;border-bottom:none;}
    .cc-tr{top:26px;right:26px;border-left:none;border-bottom:none;}
    .cc-bl{bottom:26px;left:26px;border-right:none;border-top:none;}
    .cc-br{bottom:26px;right:26px;border-left:none;border-top:none;}
    .cert-wm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.055;}
    .cert-wm img{width:420px;}
    .cert-cow-wm{position:absolute;left:-30px;bottom:-40px;font-size:280px;opacity:0.05;transform:rotate(-8deg);pointer-events:none;}
    .cert-cow-wm2{position:absolute;right:-20px;top:-30px;font-size:220px;opacity:0.045;transform:rotate(12deg);pointer-events:none;}
    .cert-mission-band{display:inline-block;background:linear-gradient(120deg,#5c0808,#a8420c);color:#F9DE8E;
      font-family:'Tiro Devanagari Hindi',serif;font-size:11px;font-weight:700;padding:4px 22px;border-radius:14px;
      margin-top:8px;box-shadow:0 2px 5px rgba(0,0,0,0.15);}
    .cert-tri{position:absolute;top:14px;left:14px;right:14px;height:5px;display:flex;}
    .cert-tri span{flex:1;} .cert-tri span:nth-child(1){background:#FF6B00;}
    .cert-tri span:nth-child(2){background:#fff;} .cert-tri span:nth-child(3){background:#138808;}
    .cert-content{position:relative;text-align:center;padding:36px 90px 0;}
    .cert-content img.logo{height:74px;width:74px;border-radius:50%;border:3px solid #C8960C;object-fit:cover;}
    .cert-org{font-family:'Tiro Devanagari Hindi',serif;font-size:27px;font-weight:700;color:#4a0404;margin-top:8px;}
    .cert-org-en{font-size:11.5px;letter-spacing:3px;color:#8B6B00;margin-top:2px;text-transform:uppercase;}
    .cert-reg{font-size:9.5px;color:#888;margin-top:4px;}
    .cert-divider{width:180px;height:2px;background:linear-gradient(90deg,transparent,#C8960C,transparent);margin:10px auto;}
    .cert-title{font-family:'Cinzel',serif;font-size:25px;font-weight:900;color:#8B0000;letter-spacing:2px;margin-top:4px;}
    .cert-title-hi{font-family:'Tiro Devanagari Hindi',serif;font-size:14.5px;color:#666;margin-top:3px;}
    .cert-meta{display:flex;justify-content:space-between;max-width:760px;margin:18px auto 0;font-size:11px;color:#555;}
    .cert-body{max-width:800px;margin:20px auto 0;font-family:'Tiro Devanagari Hindi',serif;font-size:15.5px;line-height:1.95;color:#222;}
    .cert-name{font-size:22px;font-weight:700;color:#4a0404;display:inline-block;border-bottom:2px solid #C8960C;padding:0 8px 2px;margin:0 3px;}
    .cert-details{max-width:800px;margin:14px auto 0;text-align:left;font-size:12px;color:#333;
      display:grid;grid-template-columns:1fr 1fr;gap:5px 30px;font-family:'Poppins',sans-serif;}
    .cert-details b{color:#4a0404;}
    .cert-terms{max-width:800px;margin:12px auto 0;text-align:left;background:#fff3e0;border:1px solid #e0c060;
      border-left:4px solid #8B0000;border-radius:6px;padding:8px 12px;}
    .cert-terms p{font-family:'Tiro Devanagari Hindi',serif;font-size:10px;color:#4a0404;font-weight:700;margin-bottom:3px;}
    .cert-terms span{font-size:9px;color:#555;line-height:1.5;}
    .cert-sign-row{display:flex;justify-content:space-between;align-items:flex-end;max-width:800px;margin:20px auto 0;}
    .cert-seal{width:84px;height:84px;border-radius:50%;border:3px double #8B0000;display:flex;
      align-items:center;justify-content:center;flex-direction:column;color:#F9DE8E;transform:rotate(-8deg);flex-shrink:0;
      background:linear-gradient(135deg,#5c0808,#a8420c);box-shadow:0 2px 6px rgba(0,0,0,0.2);}
    .cert-seal span{font-size:8.5px;font-weight:700;line-height:1.3;font-family:'Tiro Devanagari Hindi',serif;}
    .cert-sign-block{text-align:center;}
    .cert-sign-block img{height:38px;}
    .cert-sign-block .line{border-top:1px solid #999;width:170px;margin:2px auto 0;}
    .cert-sign-block .role{font-size:11px;font-weight:700;color:#4a0404;margin-top:3px;}
    .cert-qr{width:66px;height:66px;border:1.5px solid #C8960C;border-radius:5px;padding:2px;background:#fff;flex-shrink:0;}
    .cert-qr img{width:100%;height:100%;}
    .cert-footer{position:absolute;bottom:20px;left:90px;right:90px;text-align:center;
      font-size:9.5px;color:#888;border-top:1px solid #eadfc0;padding-top:8px;}
  </style>

  <div id="cert-render" class="cert">
    <div class="cert-wm"><img src="${LOGO_URL}" crossorigin="anonymous"></div>
    <div class="cert-cow-wm">🐄</div>
    <div class="cert-cow-wm2">🐄</div>
    <div class="cert-outer"></div><div class="cert-inner"></div>
    <div class="cert-corner cc-tl"></div><div class="cert-corner cc-tr"></div>
    <div class="cert-corner cc-bl"></div><div class="cert-corner cc-br"></div>
    <div class="cert-tri"><span></span><span></span><span></span></div>

    <div class="cert-content">
      <img class="logo" src="${LOGO_URL}" crossorigin="anonymous">
      <div class="cert-org">उन्नति स्वयं सहायता समिति</div>
      <div class="cert-org-en">Unnati Swayam Sahayata Samiti</div>
      <div class="cert-reg">NGO Darpan: UA/2016/0108273 &nbsp;|&nbsp; PAN: AAATU7133Q &nbsp;|&nbsp; Reg: UK0660892021006667</div>
      <div class="cert-mission-band">🐄 गौ माता को राष्ट्रमाता का सम्मान — सेवा ही धर्म है</div>
      <div class="cert-divider"></div>
      <div class="cert-title">CERTIFICATE OF APPRECIATION</div>
      <div class="cert-title-hi">सामाजिक सेवा एवं अनुभव प्रमाण पत्र</div>

      <div class="cert-meta">
        <span><b>प्रमाण पत्र संख्या:</b> ${certEsc(certNo)}</span>
        <span><b>दिनांक:</b> ${date}</span>
      </div>

      <div class="cert-body">
        यह प्रमाणित किया जाता है कि <span class="cert-name">${certEsc(data.name || "")}</span>
        सुपुत्र/सुपुत्री श्री <b>${certEsc(data.father_name || "")}</b> ने
        <b>${certEsc(data.designation || "स्वयंसेवक")}</b> के पद पर रहते हुए
        <b>${certEsc(data.duration || "")}</b> की अवधि तक उन्नति स्वयं सहायता समिति के साथ
        <b>${certEsc(data.activity_type || "सामाजिक सेवा")}</b> में सक्रिय एवं सराहनीय योगदान दिया है।
        ${data.work_details ? `<br><span style="font-size:12.5px;font-family:'Poppins',sans-serif;color:#555;">${certEsc(data.work_details)}</span>` : ""}
      </div>

      <div class="cert-details">
        <div><b>Volunteer ID:</b> ${certEsc(data.volunteer_id || "-")}</div>
        <div><b>कार्यक्षेत्र:</b> ${certEsc(data.work_area || data.district || "-")}</div>
      </div>

      <div class="cert-terms">
        <p>📜 नियम एवं शर्तें</p>
        <span>यह प्रमाण पत्र उन्नति स्वयं सहायता समिति द्वारा सत्यापन के आधार पर जारी किया गया है तथा केवल सेवा-अनुभव प्रमाण हेतु मान्य है। आवेदक ने संस्था की नियम व शर्तों से सहमति दी है।</span>
      </div>

      <div class="cert-sign-row">
        <div class="cert-seal"><span>उन्नति<br>स्वयं सहायता<br>समिति</span></div>
        <div class="cert-sign-block">
          <img src="${SIGN_URL}" crossorigin="anonymous">
          <div class="line"></div>
          <div class="role">राष्ट्रीय सचिव</div>
        </div>
        <div class="cert-qr"><img src="${qrURL}" crossorigin="anonymous"></div>
      </div>
    </div>

    <div class="cert-footer">
      यह प्रमाण पत्र उन्नति स्वयं सहायता समिति के आधिकारिक पोर्टल द्वारा जारी किया गया है — unnatiselfhelpgroup-creator.github.io &nbsp;|&nbsp; 📧 unnatiselfhelpgroup@gmail.com &nbsp;|&nbsp; 📞 9410332400
    </div>
  </div>
  `;
}

// ── PDF जनरेट करें, डाउनलोड करें और Firestore में सेव करें ──
window.generateCertificatePDF = async function (data) {
  await ensurePdfLibsReady({ canvas: true, jspdf: true });
  await ensureCertFontsLoaded();

  const certNo = data.certificate_no || ("CERT-" + Date.now());
  const date = new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" });

  const wrap = document.createElement("div");
  // color:#222 explicitly सेट करें ताकि होस्ट पेज के body{color:#fff} से सफ़ेद रंग
  // inherit होकर सर्टिफिकेट के नाम/विवरण अदृश्य न हो जाएँ।
  wrap.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;color:#222222;";
  document.body.appendChild(wrap);
  wrap.innerHTML = buildCertificateMarkup(data, certNo, date);

  await new Promise(r => setTimeout(r, 400));

  let pdf;
  try {
    const el = document.getElementById("cert-render");
    const canvas = await html2canvas(el, { scale: 2.2, useCORS: true, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/jpeg", 0.96);

    const { jsPDF } = window.jspdf;
    pdf = new jsPDF("landscape", "mm", "a4");
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    pdf.addImage(img, "JPEG", 0, 0, pw, ph);
  } finally {
    document.body.removeChild(wrap);
  }

  pdf.save(`${data.name || "Volunteer"}-Certificate.pdf`);

  // डेटाबेस में रिकॉर्ड करें (पुराना लॉजिक बरकरार)
  try {
    const { db } = await import("./firebase-config.js");
    const { doc: fireDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");
    await setDoc(fireDoc(db, "Certificates", certNo), {
      name: data.name,
      father_name: data.father_name,
      volunteer_id: data.volunteer_id,
      duration: data.duration,
      issueDate: date,
      status: "Verified"
    });
    console.log("Certificate saved to database!");
  } catch (err) {
    console.error("Database save error:", err);
  }
};

// ── नए टैब में Preview खोलें (Print/Download बटन के साथ) ──
window.previewCertificate = function (data) {
  const certNo = data.certificate_no || ("CERT-" + Date.now());
  const date = new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" });
  const markup = buildCertificateMarkup(data, certNo, date);

  const win = window.open("", "_blank");
  if (!win) { alert("⚠️ Popup ब्लॉक हो गया — कृपया popup की अनुमति दें।"); return; }

  win.document.open();
  win.document.write(`
  <!DOCTYPE html>
  <html lang="hi">
  <head>
    <meta charset="UTF-8">
    <title>सर्टिफिकेट Preview — ${certEsc(data.name || "")}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Cinzel:wght@700;900&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      body{background:#e9e9e9;margin:0;padding:0;font-family:'Poppins',sans-serif;}
      *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}
      .toolbar{position:sticky;top:0;z-index:10;background:#4a0404;padding:12px 16px;display:flex;gap:10px;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);}
      .toolbar button{padding:10px 20px;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.9rem;}
      .btn-print{background:#138808;color:#fff;}
      .btn-close{background:#8B0000;color:#fff;}
      .sheet-wrap{max-width:1160px;margin:24px auto 60px;padding:0 10px;overflow-x:auto;}
      @media print{ .toolbar{display:none;} body{background:#fff;} .sheet-wrap{margin:0;max-width:100%;} }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <button class="btn-print" onclick="window.print()">🖨️ प्रिंट करें</button>
      <button class="btn-close" onclick="window.close()">✕ बंद करें</button>
    </div>
    <div class="sheet-wrap">${markup}</div>
  </body>
  </html>
  `);
  win.document.close();
};
