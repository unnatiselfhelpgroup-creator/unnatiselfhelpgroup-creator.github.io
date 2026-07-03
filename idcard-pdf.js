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
function buildIDCardMarkup(data) {
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

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
      background:linear-gradient(135deg,#fffdf8,#fff6e0);overflow:hidden;border-radius:14px;}
    .idc-border{position:absolute;inset:4px;border:2.5px solid #C8960C;border-radius:11px;}
    .idc-border-inner{position:absolute;inset:8px;border:0.75px solid #C8960C;border-radius:9px;}
    .idc-side{position:absolute;top:0;bottom:0;width:8px;}
    .idc-side-l{left:0;background:#FF6B00;} .idc-side-r{right:0;background:#138808;}
    .idc-watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.07;}
    .idc-watermark img{width:65%;}
    .idc-head{position:relative;background:linear-gradient(135deg,#071b34,#0d2545);
      height:${Math.round(H * 0.25)}px;display:flex;align-items:center;gap:10px;padding:0 16px;}
    .idc-head img.logo{height:${Math.round(H * 0.16)}px;width:${Math.round(H * 0.16)}px;border-radius:50%;
      border:2px solid #F2CE63;object-fit:cover;flex-shrink:0;}
    .idc-head .org{font-family:'Tiro Devanagari Hindi',serif;color:#F2CE63;font-weight:700;font-size:15px;line-height:1.25;}
    .idc-head .sub{color:#FF9500;font-size:8px;letter-spacing:.3px;margin-top:2px;}
    .idc-tri{height:4px;display:flex;}
    .idc-tri span{flex:1;}
    .idc-tri span:nth-child(1){background:#FF6B00;} .idc-tri span:nth-child(2){background:#fff;} .idc-tri span:nth-child(3){background:#138808;}
    .idc-title{background:#FF6B00;text-align:center;padding:3px 6px;}
    .idc-title span{color:#fff;font-family:'Tiro Devanagari Hindi',serif;font-size:11px;font-weight:700;letter-spacing:.3px;}
    .idc-body{display:flex;gap:12px;padding:9px 16px 0;}
    .idc-photo{width:${Math.round(H * 0.34)}px;height:${Math.round(H * 0.44)}px;border-radius:6px;
      border:2px solid #C8960C;overflow:hidden;background:#f0e8e0;display:flex;align-items:center;
      justify-content:center;font-size:26px;flex-shrink:0;}
    .idc-photo img{width:100%;height:100%;object-fit:cover;}
    .idc-info{flex:1;min-width:0;}
    .idc-name{font-family:'Tiro Devanagari Hindi',serif;font-weight:700;color:#071b34;font-size:15px;
      line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .idc-desig{display:inline-block;background:linear-gradient(135deg,#4a0404,#8B0000);color:#fff;
      font-size:9px;font-weight:700;padding:2px 9px;border-radius:10px;margin:4px 0 6px;}
    .idc-row{font-size:9.5px;color:#333;margin-bottom:2px;display:flex;gap:4px;}
    .idc-row b{color:#4a0404;font-weight:700;min-width:52px;flex-shrink:0;}
    .idc-foot{position:absolute;bottom:0;left:0;right:0;padding:6px 16px 8px;display:flex;
      justify-content:space-between;align-items:flex-end;background:linear-gradient(90deg,#fff8e7,#fff3d0);
      border-top:1px solid #f0dfb0;}
    .idc-volid .lbl{font-size:7px;color:#888;text-transform:uppercase;letter-spacing:.5px;}
    .idc-volid .val{font-family:'Courier New',monospace;font-weight:700;color:#4a0404;font-size:11.5px;letter-spacing:.8px;}
    .idc-sign{text-align:center;}
    .idc-sign img{height:22px;}
    .idc-sign .lbl{font-size:6.5px;color:#4a0404;border-top:1px solid #C8960C;padding-top:2px;margin-top:1px;font-weight:700;}

    /* BACK SIDE */
    .idc-back-head{background:linear-gradient(135deg,#071b34,#0d2545);height:${Math.round(H * 0.20)}px;
      display:flex;flex-direction:column;align-items:center;justify-content:center;}
    .idc-back-head .o1{font-family:'Tiro Devanagari Hindi',serif;color:#fff;font-size:13px;font-weight:700;}
    .idc-back-head .o2{color:#F2CE63;font-size:7.5px;margin-top:2px;letter-spacing:.5px;}
    .idc-idbox{margin:10px 16px 0;background:#fff8e7;border:1.5px solid #C8960C;border-radius:8px;padding:7px 10px;text-align:center;}
    .idc-idbox .lbl{font-family:'Tiro Devanagari Hindi',serif;font-size:9px;color:#4a0404;font-weight:700;}
    .idc-idbox .val{font-family:'Courier New',monospace;font-size:15px;font-weight:800;color:#8B0000;letter-spacing:1.5px;margin-top:2px;}
    .idc-rules{padding:8px 16px 0;font-size:8px;color:#222;line-height:1.55;}
    .idc-qr{position:absolute;right:14px;bottom:26px;width:${Math.round(H * 0.22)}px;height:${Math.round(H * 0.22)}px;
      background:#fff;border:1.5px solid #C8960C;border-radius:5px;padding:2px;}
    .idc-qr img{width:100%;height:100%;}
    .idc-back-foot{position:absolute;bottom:0;left:0;right:0;padding:5px 12px;
      background:linear-gradient(90deg,#fff8e7,#fff3d0);border-top:1px solid #f0dfb0;text-align:center;}
    .idc-back-foot span{font-size:7.5px;font-weight:700;color:#4a0404;}
  </style>

  <div id="idc-front" class="idc-card">
    <div class="idc-watermark"><img src="${LOGO_URL}" crossorigin="anonymous"></div>
    <div class="idc-head">
      <img class="logo" src="${LOGO_URL}" crossorigin="anonymous">
      <div>
        <div class="org">उन्नति स्वयं सहायता समिति</div>
        <div class="sub">गौ माता • राष्ट्रमाता सेवा में समर्पित</div>
      </div>
    </div>
    <div class="idc-tri"><span></span><span></span><span></span></div>
    <div class="idc-title"><span>🪪 आधिकारिक सदस्यता पहचान पत्र</span></div>
    <div class="idc-body">
      <div class="idc-photo">${photoURL ? `<img src="${photoURL}" crossorigin="anonymous">` : "👤"}</div>
      <div class="idc-info">
        <div class="idc-name">${name}</div>
        <span class="idc-desig">${designation}</span>
        <div class="idc-row"><b>पिता/पति:</b><span>${fatherName}</span></div>
        <div class="idc-row"><b>मोबाइल:</b><span>${mobile}</span></div>
        <div class="idc-row"><b>क्षेत्र:</b><span>${address}</span></div>
      </div>
    </div>
    <div class="idc-foot">
      <div class="idc-volid"><div class="lbl">Volunteer ID</div><div class="val">${volunteerId}</div></div>
      <div class="idc-sign"><img src="${SIGN_URL}" crossorigin="anonymous"><div class="lbl">हस्ताक्षर</div></div>
    </div>
    <div class="idc-border"></div><div class="idc-border-inner"></div>
    <div class="idc-side idc-side-l"></div><div class="idc-side idc-side-r"></div>
  </div>

  <div id="idc-back" class="idc-card">
    <div class="idc-watermark"><img src="${LOGO_URL}" crossorigin="anonymous"></div>
    <div class="idc-back-head">
      <div class="o1">उन्नति स्वयं सहायता समिति</div>
      <div class="o2">OFFICIAL MEMBER ID CARD</div>
    </div>
    <div class="idc-idbox">
      <div class="lbl">Volunteer ID</div>
      <div class="val">${volunteerId}</div>
    </div>
    <div class="idc-rules">
      • यह कार्ड हस्तांतरणीय नहीं है।<br>
      • इस कार्ड का दुरुपयोग दंडनीय है।<br>
      • खोने पर तुरंत संस्था को सूचित करें।<br>
      • सभी गतिविधियाँ संविधान के दायरे में होंगी।
    </div>
    <div class="idc-qr"><img src="${qrURL}" crossorigin="anonymous"></div>
    <div class="idc-back-foot"><span>📞 9410332400 &nbsp;|&nbsp; ✉️ unnatiselfhelpgroup@gmail.com</span></div>
    <div class="idc-border"></div><div class="idc-border-inner"></div>
    <div class="idc-side idc-side-l"></div><div class="idc-side idc-side-r"></div>
  </div>
  `;
  return html;
}

window.generateIDCardPDF = async function (data) {
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
  wrap.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;";
  document.body.appendChild(wrap);
  wrap.innerHTML = buildIDCardMarkup(data);

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
  const markup = buildIDCardMarkup(data);

  const win = window.open("", "_blank");
  if (!win) { alert("⚠️ Popup ब्लॉक हो गया — कृपया popup की अनुमति दें।"); return; }

  win.document.open();
  win.document.write(`
  <!DOCTYPE html>
  <html lang="hi">
  <head>
    <meta charset="UTF-8">
    <title>ID Card Preview — ${esc(data.name || "")}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
      body{background:#e9e9e9;margin:0;padding:0;font-family:'Poppins',sans-serif;}
      .toolbar{position:sticky;top:0;z-index:10;background:#4a0404;padding:12px 16px;display:flex;gap:10px;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);}
      .toolbar button{padding:10px 20px;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.9rem;}
      .btn-print{background:#138808;color:#fff;}
      .btn-close{background:#8B0000;color:#fff;}
      .cards-wrap{max-width:900px;margin:24px auto 60px;padding:0 10px;display:flex;flex-wrap:wrap;gap:24px;justify-content:center;}
      @media print{ .toolbar{display:none;} body{background:#fff;} .cards-wrap{margin:0;max-width:100%;} }
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
