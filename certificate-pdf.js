// ============================================================
// certificate-pdf.js — उन्नति स्वयं सहायता समिति
// Premium "Sacred India" थीम — सेवा प्रमाण पत्र (A4 Landscape)
// HTML/CSS + html2canvas से render होता है ताकि हिंदी सही दिखे।
//
// ज़रूरी: इस पेज पर html2pdf.bundle.min.js लोड होना चाहिए, जिसमें
// html2canvas + jsPDF दोनों शामिल हैं:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
// ============================================================
window.generateCertificatePDF = async function (data) {
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  if (!document.getElementById("cert-font-link")) {
    const link = document.createElement("link");
    link.id = "cert-font-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Cinzel:wght@700;900&family=Poppins:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.load('700 20px "Tiro Devanagari Hindi"');
      await document.fonts.load('900 20px "Cinzel"');
      await document.fonts.ready;
    } catch (e) {}
  }

  const LOGO_URL = "https://unnatiselfhelpgroup-creator.github.io/ngologo.png";
  const SIGN_URL = "https://unnatiselfhelpgroup-creator.github.io/signature.png";

  const certNo = data.certificate_no || ("CERT-" + Date.now());
  const date = new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" });

  const qrData = encodeURIComponent(
    `https://unnatiselfhelpgroup-creator.github.io/certificate-verification.html?cert=${certNo}`
  );
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${qrData}`;

  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;";
  document.body.appendChild(wrap);

  wrap.innerHTML = `
  <style>
    .cert{width:1123px;height:794px;position:relative;background:linear-gradient(135deg,#FFFDF8,#FFF8ED);
      font-family:'Poppins',sans-serif;overflow:hidden;}
    .cert-outer{position:absolute;inset:14px;border:3px solid #C8960C;}
    .cert-inner{position:absolute;inset:22px;border:1px solid #C8960C;}
    .cert-corner{position:absolute;width:46px;height:46px;border:3px solid #8B0000;}
    .cc-tl{top:26px;left:26px;border-right:none;border-bottom:none;}
    .cc-tr{top:26px;right:26px;border-left:none;border-bottom:none;}
    .cc-bl{bottom:26px;left:26px;border-right:none;border-top:none;}
    .cc-br{bottom:26px;right:26px;border-left:none;border-top:none;}
    .cert-wm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.055;}
    .cert-wm img{width:420px;}
    .cert-tri{position:absolute;top:14px;left:14px;right:14px;height:5px;display:flex;}
    .cert-tri span{flex:1;} .cert-tri span:nth-child(1){background:#FF6B00;}
    .cert-tri span:nth-child(2){background:#fff;} .cert-tri span:nth-child(3){background:#138808;}
    .cert-content{position:relative;text-align:center;padding:44px 90px 0;}
    .cert-content img.logo{height:74px;width:74px;border-radius:50%;border:3px solid #C8960C;object-fit:cover;}
    .cert-org{font-family:'Tiro Devanagari Hindi',serif;font-size:27px;font-weight:700;color:#4a0404;margin-top:8px;}
    .cert-org-en{font-size:11.5px;letter-spacing:3px;color:#8B6B00;margin-top:2px;text-transform:uppercase;}
    .cert-reg{font-size:9.5px;color:#888;margin-top:4px;}
    .cert-divider{width:180px;height:2px;background:linear-gradient(90deg,transparent,#C8960C,transparent);margin:14px auto;}
    .cert-title{font-family:'Cinzel',serif;font-size:25px;font-weight:900;color:#8B0000;letter-spacing:2px;margin-top:4px;}
    .cert-title-hi{font-family:'Tiro Devanagari Hindi',serif;font-size:14.5px;color:#666;margin-top:3px;}
    .cert-meta{display:flex;justify-content:space-between;max-width:760px;margin:18px auto 0;font-size:11px;color:#555;}
    .cert-body{max-width:800px;margin:20px auto 0;font-family:'Tiro Devanagari Hindi',serif;font-size:15.5px;line-height:1.95;color:#222;}
    .cert-name{font-size:22px;font-weight:700;color:#4a0404;display:inline-block;border-bottom:2px solid #C8960C;padding:0 8px 2px;margin:0 3px;}
    .cert-details{max-width:800px;margin:14px auto 0;text-align:left;font-size:12px;color:#333;
      display:grid;grid-template-columns:1fr 1fr;gap:5px 30px;font-family:'Poppins',sans-serif;}
    .cert-details b{color:#4a0404;}
    .cert-sign-row{display:flex;justify-content:space-between;align-items:flex-end;max-width:800px;margin:28px auto 0;}
    .cert-seal{width:84px;height:84px;border-radius:50%;border:3px double #8B0000;display:flex;
      align-items:center;justify-content:center;flex-direction:column;color:#8B0000;transform:rotate(-8deg);flex-shrink:0;}
    .cert-seal span{font-size:8.5px;font-weight:700;line-height:1.3;font-family:'Tiro Devanagari Hindi',serif;}
    .cert-sign-block{text-align:center;}
    .cert-sign-block img{height:38px;}
    .cert-sign-block .line{border-top:1px solid #999;width:170px;margin:2px auto 0;}
    .cert-sign-block .role{font-size:11px;font-weight:700;color:#4a0404;margin-top:3px;}
    .cert-qr{width:66px;height:66px;border:1.5px solid #C8960C;border-radius:5px;padding:2px;background:#fff;flex-shrink:0;}
    .cert-qr img{width:100%;height:100%;}
    .cert-footer{position:absolute;bottom:34px;left:90px;right:90px;text-align:center;
      font-size:9.5px;color:#888;border-top:1px solid #eadfc0;padding-top:8px;}
  </style>

  <div id="cert-render" class="cert">
    <div class="cert-wm"><img src="${LOGO_URL}" crossorigin="anonymous"></div>
    <div class="cert-outer"></div><div class="cert-inner"></div>
    <div class="cert-corner cc-tl"></div><div class="cert-corner cc-tr"></div>
    <div class="cert-corner cc-bl"></div><div class="cert-corner cc-br"></div>
    <div class="cert-tri"><span></span><span></span><span></span></div>

    <div class="cert-content">
      <img class="logo" src="${LOGO_URL}" crossorigin="anonymous">
      <div class="cert-org">उन्नति स्वयं सहायता समिति</div>
      <div class="cert-org-en">Unnati Swayam Sahayata Samiti</div>
      <div class="cert-reg">NGO Darpan: UA/2016/0108273 &nbsp;|&nbsp; PAN: AAATU7133Q &nbsp;|&nbsp; Reg: UK0660892021006667</div>
      <div class="cert-divider"></div>
      <div class="cert-title">CERTIFICATE OF APPRECIATION</div>
      <div class="cert-title-hi">सामाजिक सेवा एवं अनुभव प्रमाण पत्र</div>

      <div class="cert-meta">
        <span><b>प्रमाण पत्र संख्या:</b> ${esc(certNo)}</span>
        <span><b>दिनांक:</b> ${date}</span>
      </div>

      <div class="cert-body">
        यह प्रमाणित किया जाता है कि <span class="cert-name">${esc(data.name || "")}</span>
        सुपुत्र/सुपुत्री श्री <b>${esc(data.father_name || "")}</b> ने
        <b>${esc(data.designation || "स्वयंसेवक")}</b> के पद पर रहते हुए
        <b>${esc(data.duration || "")}</b> की अवधि तक उन्नति स्वयं सहायता समिति के साथ
        <b>${esc(data.activity_type || "सामाजिक सेवा")}</b> में सक्रिय एवं सराहनीय योगदान दिया है।
        ${data.work_details ? `<br><span style="font-size:12.5px;font-family:'Poppins',sans-serif;color:#555;">${esc(data.work_details)}</span>` : ""}
      </div>

      <div class="cert-details">
        <div><b>Volunteer ID:</b> ${esc(data.volunteer_id || "-")}</div>
        <div><b>कार्यक्षेत्र:</b> ${esc(data.work_area || data.district || "-")}</div>
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

  await new Promise(r => setTimeout(r, 350));

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
