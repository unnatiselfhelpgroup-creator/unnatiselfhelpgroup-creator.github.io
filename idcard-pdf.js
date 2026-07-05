// ============================================================
// idcard-pdf.js — उन्नति स्वयं सहायता समिति (Complete File)
// ============================================================

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
    if (attempt > 0) {
      try {
        if (m.includes("html2pdf")) await _loadScriptOnce("https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js");
        if (m.includes("canvas")) await _loadScriptOnce("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
        if (m.includes("jspdf")) await _loadScriptOnce("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      } catch (e) {}
    }
    await new Promise(r => setTimeout(r, 800));
  }
  return missing().length === 0;
}

function buildIDCardMarkup(data, forCapture) {
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const CO = forCapture ? 'crossorigin="anonymous"' : '';
  const LOGO_URL = "https://unnatiselfhelpgroup-creator.github.io/ngologo.png";
  const SIGN_URL = "https://unnatiselfhelpgroup-creator.github.io/signature.png";

  const volunteerId = esc(data.volunteer_id || data.volunteerId || "USS-2026-XXXX");
  const name = esc(data.name || "—");
  const fatherName = esc(data.fatherName || data.father_name || "—");
  const designation = esc(data.designation || "Volunteer");
  const mobile = esc(data.mobile || data["mobile number"] || "—");
  const address = esc(String(data.address || "—")).substring(0, 30);
  const photoURL = data.photoBase64 || data.photoURL || "";

  const qrData = encodeURIComponent(`https://unnatiselfhelpgroup-creator.github.io/idverification.html?id=${data.volunteer_id || data.volunteerId || ""}`);
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrData}`;

  return `
  <style>
    .idc-card { width: 330px; height: 210px; background: #fff8e1; border: 2px solid #C8960C; border-radius: 15px; padding: 12px; position: relative; font-family: sans-serif; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .idc-header { text-align: center; border-bottom: 2px solid #4a0404; padding-bottom: 5px; margin-bottom: 8px; }
    .idc-org { font-size: 15px; font-weight: 800; color: #4a0404; font-family: 'Tiro Devanagari Hindi', serif; }
    .idc-body { display: flex; align-items: flex-start; }
    .idc-photo { width: 80px; height: 95px; border: 2px solid #C8960C; border-radius: 5px; overflow: hidden; background: #eee; }
    .idc-details { margin-left: 10px; font-size: 11px; line-height: 1.5; color: #333; }
    .idc-footer { position: absolute; bottom: 10px; left: 15px; right: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
    .idc-sign { text-align: center; font-size: 10px; font-weight: bold; color: #4a0404; border-top: 1px solid #4a0404; padding-top: 4px; }
  </style>
  <div class="idc-card">
    <div class="idc-header"><div class="idc-org">उन्नति स्वयं सहायता समिति</div></div>
    <div class="idc-body">
      <div class="idc-photo">${photoURL ? `<img src="${photoURL}" width="80" height="95" ${CO}>` : "👤"}</div>
      <div class="idc-details">
        <div><b>नाम:</b> ${name}</div>
        <div><b>पिता का नाम:</b> ${fatherName}</div>
        <div><b>पद:</b> ${designation}</div>
        <div><b>मोबाइल:</b> ${mobile}</div>
        <div><b>ID:</b> ${volunteerId}</div>
      </div>
    </div>
    <div class="idc-footer">
      <div><small>ID Card</small></div>
      <div class="idc-sign">राष्ट्रीय सचिव<br>(अधिकृत हस्ताक्षर)</div>
    </div>
  </div>`;
}

window.generateIDCardPDF = async function (data) {
  await ensurePdfLibsReady({ canvas: true, jspdf: true });
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;";
  document.body.appendChild(wrap);
  wrap.innerHTML = buildIDCardMarkup(data, true);
  await new Promise(r => setTimeout(r, 500));
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [54, 86] });
  const canvas = await html2canvas(wrap, { scale: 3, useCORS: true });
  const img = canvas.toDataURL("image/jpeg", 0.96);
  pdf.addImage(img, "JPEG", 0, 0, 86, 54);
  pdf.save((data.name || "Member") + "-ID-Card.pdf");
  document.body.removeChild(wrap);
};

window.previewIDCard = function (data) {
  const markup = buildIDCardMarkup(data, false);
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>Preview</title></head><body>${markup}<button onclick="window.print()">Print</button></body></html>`);
  win.document.close();
};
