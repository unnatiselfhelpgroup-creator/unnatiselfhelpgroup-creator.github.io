// ============================================================
// idcard-pdf.js — उन्नति स्वयं सहायता समिति
// Premium "Sacred India" थीम — Front + Back ID Card PDF
// HTML/CSS + html2canvas से render होता है ताकि हिंदी (Devanagari)
// सही दिखे — jsPDF के default फॉन्ट्स में हिंदी सपोर्ट नहीं होता।
//
// ज़रूरी: इस पेज पर html2pdf.bundle.min.js (जिसमें html2canvas + jsPDF
// दोनों शामिल हैं) पहले से लोड होना चाहिए। उदाहरण:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
// ============================================================
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

function buildIDCardMarkup(data, forCapture) {
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const CO = forCapture ? 'crossorigin="anonymous"' : ''; // capture (PDF) के लिए ज़रूरी, preview में हटाया ताकि image ज़रूर दिखे

  const LOGO_URL = "https://unnatiselfhelpgroup-creator.github.io/ngologo.png";
  const SIGN_URL = "https://unnatiselfhelpgroup-creator.github.io/signature.png";

  const volunteerId = esc(data.volunteer_id || data.volunteerId || data["volunteer-id"] || "USS-XXXX-XXXX");
  const name = esc(data.name || "—");
  const fatherName = esc(data.fatherName || data.father_name || "—");
  const designation = esc(data.designation || "Volunteer");
  const mobile = esc(data.mobile || data["mobile number"] || data["mobile_number"] || "—");
  const address = esc(String(data.address || "—")).substring(0, 30);
  const photoURL = data.photoBase64 || data.photoURL || data.photo || "";

  const qrData = encodeURIComponent(
    `https://unnatiselfhelpgroup-creator.github.io/idverification.html?id=${data.volunteer_id || data.volunteerId || ""}`
  );
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=0&data=${qrData}`;

  const CARD_W_MM = 86, CARD_H_MM = 54;
  const PX_PER_MM = 12; // sharpness के लिए render scale
  const W = CARD_W_MM * PX_PER_MM;
  const H = CARD_H_MM * PX_PER_MM;

  const html = `
  <style>
    .idc-card{width:${W}px;height:${H}px;position:relative;font-family:'Poppins',sans-serif;
      background:linear-gradient(160deg,#fffdf7,#fdf2d8 55%,#fbe9c4);overflow:hidden;border-radius:14px;
      box-shadow:inset 0 0 0 1px rgba(200,150,12,0.15);display:flex;flex-direction:column;}
    .idc-border{position:absolute;inset:4px;border:2.5px solid #C8960C;border-radius:11px;pointer-events:none;}
    .idc-border-inner{position:absolute;inset:8px;border:0.75px solid #C8960C;border-radius:9px;pointer-events:none;}
    .idc-side{position:absolute;top:0;bottom:0;width:8px;}
    .idc-side-l{left:0;background:linear-gradient(#FF6B00,#FF9500);} .idc-side-r{right:0;background:linear-gradient(#138808,#1DA212);}
    .idc-corner{position:absolute;width:16px;height:16px;border-color:#C8960C;z-index:3;}
    .idc-corner-tl{top:6px;left:12px;border-top:2px solid;border-left:2px solid;border-radius:4px 0 0 0;}
    .idc-corner-tr{top:6px;right:12px;border-top:2px solid;border-right:2px solid;border-radius:0 4px 0 0;}
    .idc-corner-bl{bottom:6px;left:12px;border-bottom:2px solid;border-left:2px solid;border-radius:0 0 0 4px;}
    .idc-corner-br{bottom:6px;right:12px;border-bottom:2px solid;border-right:2px solid;border-radius:0 0 4px 0;}
    .idc-watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.06;
      transform:rotate(-8deg);pointer-events:none;}
    .idc-watermark img{width:58%;}
    .idc-cow-wm{position:absolute;right:-6px;bottom:2px;font-size:${Math.round(H*0.9)}px;opacity:0.05;
      line-height:1;pointer-events:none;transform:rotate(-6deg);}
    .idc-head{position:relative;flex-shrink:0;background:linear-gradient(120deg,#3a0303 0%,#5c0808 45%,#7a1a08 75%,#a8420c 100%);
      height:${Math.round(H * 0.24)}px;display:flex;align-items:center;gap:10px;padding:0 16px;overflow:hidden;}
    .idc-head::after{content:"";position:absolute;inset:0;
      background:radial-gradient(circle at 85% 20%,rgba(242,206,99,0.25),transparent 55%);}
    .idc-head .logo-ring{position:relative;flex-shrink:0;height:${Math.round(H * 0.18)}px;width:${Math.round(H * 0.18)}px;
      border-radius:50%;background:conic-gradient(from 0deg,#F2CE63,#C8960C,#F2CE63,#C8960C,#F2CE63);
      padding:2px;display:flex;align-items:center;justify-content:center;}
    .idc-head img.logo{height:${Math.round(H * 0.15)}px;width:${Math.round(H * 0.15)}px;border-radius:50%;
      border:1.5px solid #3a0303;object-fit:cover;display:block;}
    .idc-head .org{font-family:'Tiro Devanagari Hindi',serif;color:#F9DE8E;font-weight:700;font-size:15px;
      line-height:1.25;text-shadow:0 1px 2px rgba(0,0,0,0.4);position:relative;}
    .idc-head .sub{color:#FFB347;font-size:7.8px;letter-spacing:.3px;margin-top:2px;position:relative;
      display:flex;align-items:center;gap:3px;}
    .idc-tri{height:4px;display:flex;flex-shrink:0;}
    .idc-tri span{flex:1;}
    .idc-tri span:nth-child(1){background:#FF6B00;} .idc-tri span:nth-child(2){background:#fff;} .idc-tri span:nth-child(3){background:#138808;}
    .idc-title{flex-shrink:0;background:linear-gradient(90deg,#a8420c,#FF6B00 50%,#a8420c);text-align:center;padding:4px 6px;
      box-shadow:0 1px 3px rgba(0,0,0,0.15) inset;}
    .idc-title span{color:#fff;font-family:'Tiro Devanagari Hindi',serif;font-size:10.5px;font-weight:700;
      letter-spacing:.3px;text-shadow:0 1px 1px rgba(0,0,0,0.3);}
    .idc-body{flex:1;display:flex;gap:14px;padding:14px 16px;position:relative;min-height:0;}
    .idc-photo{width:${Math.round(H * 0.38)}px;flex-shrink:0;border-radius:6px;
      border:2px solid #C8960C;box-shadow:0 0 0 1px #fff, 0 2px 5px rgba(0,0,0,0.15);
      overflow:hidden;background:#f0e8e0;display:flex;align-items:center;
      justify-content:center;font-size:30px;}
    .idc-photo img{width:100%;height:100%;object-fit:cover;}
    .idc-info{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;}
    .idc-name{font-family:'Tiro Devanagari Hindi',serif;font-weight:700;color:#3a0303;font-size:16px;
      line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .idc-desig{display:inline-flex;align-items:center;gap:3px;background:linear-gradient(120deg,#5c0808,#a8420c);
      color:#F9DE8E;font-size:9px;font-weight:700;padding:3px 10px;border-radius:10px;margin:6px 0 10px;
      box-shadow:0 1px 2px rgba(0,0,0,0.2);width:fit-content;}
    .idc-row{font-size:9.5px;color:#333;margin-bottom:5px;display:flex;gap:4px;}
    .idc-row b{color:#7a1a08;font-weight:700;min-width:52px;flex-shrink:0;}
    .idc-foot{flex-shrink:0;padding:8px 16px;display:flex;
      justify-content:space-between;align-items:center;background:linear-gradient(90deg,#fdf0d0,#fbe4b0);
      border-top:1px solid #e8c878;}
    .idc-volid .lbl{font-size:6.8px;color:#8a6a20;text-transform:uppercase;letter-spacing:.6px;font-weight:600;}
    .idc-volid .val{font-family:'Courier New',monospace;font-weight:800;color:#5c0808;font-size:12px;letter-spacing:.8px;}
    .idc-sign{text-align:center;}
    .idc-sign img{height:26px;display:block;margin:0 auto;}
    .idc-sign .lbl{font-size:6.5px;color:#5c0808;border-top:1px solid #C8960C;padding-top:2px;margin-top:2px;font-weight:700;}

    /* BACK SIDE */
    .idc-back-head{position:relative;flex-shrink:0;background:linear-gradient(120deg,#3a0303 0%,#5c0808 45%,#7a1a08 75%,#a8420c 100%);
      height:${Math.round(H * 0.20)}px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}
    .idc-back-head::after{content:"";position:absolute;inset:0;
      background:radial-gradient(circle at 15% 25%,rgba(242,206,99,0.22),transparent 55%);}
    .idc-back-head .o1{font-family:'Tiro Devanagari Hindi',serif;color:#F9DE8E;font-size:13px;font-weight:700;
      position:relative;text-shadow:0 1px 2px rgba(0,0,0,0.4);}
    .idc-back-head .o2{color:#FFB347;font-size:7.2px;margin-top:2px;letter-spacing:.5px;position:relative;}
    .idc-idbox{flex-shrink:0;margin:10px 16px 0;background:linear-gradient(135deg,#fdf0d0,#fbe4b0);border:1.5px solid #C8960C;
      border-radius:8px;padding:7px 10px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.06) inset;}
    .idc-idbox .lbl{font-family:'Tiro Devanagari Hindi',serif;font-size:8.5px;color:#5c0808;font-weight:700;}
    .idc-idbox .val{font-family:'Courier New',monospace;font-size:14px;font-weight:800;color:#8B0000;letter-spacing:1.5px;margin-top:2px;}
    .idc-mid{flex:1;display:flex;gap:14px;padding:10px 16px;min-height:0;align-items:center;}
    .idc-rules{flex:1;font-size:8px;color:#2a2a2a;line-height:1.7;}
    .idc-rules .rh{font-family:'Tiro Devanagari Hindi',serif;font-size:9px;color:#5c0808;font-weight:700;margin-bottom:4px;}
    .idc-qrbox{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:5px;}
    .idc-qr{width:${Math.round(H * 0.24)}px;height:${Math.round(H * 0.24)}px;
      background:#fff;border:1.5px solid #C8960C;border-radius:5px;padding:2px;box-shadow:0 1px 3px rgba(0,0,0,0.1);}
    .idc-qr img{width:100%;height:100%;}
    .idc-motto{font-family:'Tiro Devanagari Hindi',serif;font-size:7.5px;color:#7a1a08;font-weight:700;font-style:italic;text-align:center;}
    .idc-back-foot{flex-shrink:0;padding:6px 12px;
      background:linear-gradient(90deg,#fdf0d0,#fbe4b0);border-top:1px solid #e8c878;text-align:center;}
    .idc-back-foot span{font-size:7px;font-weight:700;color:#5c0808;}
  </style>

  <div id="idc-front" class="idc-card">
    <div class="idc-cow-wm">🐄</div>
    <div class="idc-watermark"><img src="${LOGO_URL}" ${CO}></div>
    <div class="idc-head">
      <div class="logo-ring"><img class="logo" src="${LOGO_URL}" ${CO}></div>
      <div>
        <div class="org">उन्नति स्वयं सहायता समिति</div>
        <div class="sub">🐄 गौ माता • राष्ट्रमाता सेवा में समर्पित</div>
      </div>
    </div>
    <div class="idc-tri"><span></span><span></span><span></span></div>
    <div class="idc-title"><span>🪪 आधिकारिक सदस्यता पहचान पत्र</span></div>
    <div class="idc-body">
      <div class="idc-photo">${photoURL ? `<img src="${photoURL}" ${CO}>` : "👤"}</div>
      <div class="idc-info">
        <div class="idc-name">${name}</div>
        <span class="idc-desig">🐄 ${designation}</span>
        <div class="idc-row"><b>पिता/पति:</b><span>${fatherName}</span></div>
        <div class="idc-row"><b>मोबाइल:</b><span>${mobile}</span></div>
        <div class="idc-row"><b>क्षेत्र:</b><span>${address}</span></div>
      </div>
    </div>
    <div class="idc-foot">
      <div class="idc-volid"><div class="lbl">Volunteer ID</div><div class="val">${volunteerId}</div></div>
      <div class="idc-sign"><img src="${SIGN_URL}" ${CO}><div class="lbl">हस्ताक्षर</div></div>
    </div>
    <div class="idc-border"></div><div class="idc-border-inner"></div>
    <div class="idc-side idc-side-l"></div><div class="idc-side idc-side-r"></div>
    <div class="idc-corner idc-corner-tl"></div><div class="idc-corner idc-corner-tr"></div>
    <div class="idc-corner idc-corner-bl"></div><div class="idc-corner idc-corner-br"></div>
  </div>

  <div id="idc-back" class="idc-card">
    <div class="idc-cow-wm">🐄</div>
    <div class="idc-watermark"><img src="${LOGO_URL}" ${CO}></div>
    <div class="idc-back-head">
      <div class="o1">उन्नति स्वयं सहायता समिति</div>
      <div class="o2">🐄 OFFICIAL MEMBER ID CARD · गौ सेवा अभियान</div>
    </div>
    <div class="idc-idbox">
      <div class="lbl">Volunteer ID</div>
      <div class="val">${volunteerId}</div>
    </div>
    <div class="idc-mid">
      <div class="idc-rules">
        <div class="rh">नियम एवं शर्तें</div>
        • यह कार्ड हस्तांतरणीय नहीं है।<br>
        • इस कार्ड का दुरुपयोग दंडनीय है।<br>
        • खोने पर तुरंत संस्था को सूचित करें।<br>
        • सभी गतिविधियाँ संविधान के दायरे में होंगी।
      </div>
      <div class="idc-qrbox">
        <div class="idc-qr"><img src="${qrURL}" ${CO}></div>
        <div class="idc-motto">"गौ सेवा परमो धर्मः"</div>
      </div>
    </div>
    <div class="idc-back-foot"><span>📞 9410332400 &nbsp;|&nbsp; ✉️ unnatiselfhelpgroup@gmail.com</span></div>
    <div class="idc-border"></div><div class="idc-border-inner"></div>
    <div class="idc-side idc-side-l"></div><div class="idc-side idc-side-r"></div>
    <div class="idc-corner idc-corner-tl"></div><div class="idc-corner idc-corner-tr"></div>
    <div class="idc-corner idc-corner-bl"></div><div class="idc-corner idc-corner-br"></div>
  </div>
  `;
  return html;
}

window.generateIDCardPDF = async function (data) {
  await ensurePdfLibsReady({ canvas: true, jspdf: true });
  // Google Fonts (Tiro Devanagari Hindi + Poppins) load करें — पूरा wait करें ताकि
  // html2canvas खाली/invisible टेक्स्ट का स्नैपशॉट न ले (FOIT bug)
  await ensureFontsLoaded();
  async function ensureFontsLoaded() {
    if (!document.getElementById("idc-font-link")) {
      await new Promise((resolve) => {
        const link = document.createElement("link");
        link.id = "idc-font-link";
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Poppins:wght@400;600;700;800&display=swap";
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
          document.fonts.load('400 16px "Poppins"'),
          document.fonts.load('700 16px "Poppins"'),
          document.fonts.load('800 16px "Poppins"')
        ]);
        await document.fonts.ready;
      } catch (e) {}
    }
    await new Promise(r => setTimeout(r, 500));
  }

  const CARD_W_MM = 86, CARD_H_MM = 54;

  const wrap = document.createElement("div");
  // color:#222 explicitly सेट करें ताकि admin-dashboard.html के body{color:#fff} से
  // सफ़ेद रंग inherit होकर कार्ड के आगे/पीछे के नाम आदि अदृश्य न हो जाएँ।
  wrap.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;color:#222222;";
  document.body.appendChild(wrap);
  wrap.innerHTML = buildIDCardMarkup(data, true);

  // इमेज (लोगो/फोटो/QR/हस्ताक्षर) लोड होने के लिए wait
  await new Promise(r => setTimeout(r, 400));

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [CARD_H_MM, CARD_W_MM] });

  async function captureToPDF(elId, isFirst) {
    const el = document.getElementById(elId);
    const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/jpeg", 0.96);
    if (!isFirst) pdf.addPage([CARD_H_MM, CARD_W_MM], "landscape");
    pdf.addImage(img, "JPEG", 0, 0, CARD_W_MM, CARD_H_MM);
  }

  try {
    await captureToPDF("idc-front", true);
    await captureToPDF("idc-back", false);
  } finally {
    document.body.removeChild(wrap);
  }

  pdf.save((data.name || "Member") + "-ID-Card.pdf");
};

// ── नए टैब में Preview खोलें (Print/Close बटन के साथ, front + back दोनों) ──
window.previewIDCard = function (data) {
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const markup = buildIDCardMarkup(data, false);

  const win = window.open("", "_blank");
  if (!win) { alert("⚠️ Popup ब्लॉक हो गया — कृपया popup की अनुमति दें।"); return; }

  win.document.open();
  win.document.write(`
  <!DOCTYPE html>
  <html lang="hi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ID Card Preview — ${esc(data.name || "")}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
      body{background:#e9e9e9;margin:0;padding:0;font-family:'Poppins',sans-serif;}
      *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}
      .toolbar{position:sticky;top:0;z-index:10;background:#4a0404;padding:12px 16px;display:flex;gap:10px;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);}
      .toolbar button{padding:10px 20px;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.9rem;}
      .btn-print{background:#138808;color:#fff;}
      .btn-close{background:#8B0000;color:#fff;}
      .cards-wrap{max-width:900px;margin:24px auto 60px;padding:0 10px;display:flex;flex-wrap:wrap;gap:24px;justify-content:center;}
      @page{margin:8mm;}
      @media print{ .toolbar{display:none;} body{background:#fff;} .cards-wrap{margin:0;max-width:100%;gap:10mm;} }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <button class="btn-print">🖨️ प्रिंट करें</button>
      <button class="btn-close">✕ बंद करें</button>
    </div>
    <div class="cards-wrap">${markup}</div>
  </body>
  </html>
  `);
  win.document.close();
  win.document.querySelector(".btn-print").onclick = () => win.print();
  win.document.querySelector(".btn-close").onclick = () => win.close();
};
