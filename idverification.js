import { db } from "./firebase-config.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.verifyID = async function() {
    const idInput = document.getElementById("idInput");
    const statusMsg = document.getElementById("status-msg");
    const resultBox = document.getElementById("result-box");

    if (!idInput) return;
    const volunteerID = idInput.value.trim().toUpperCase();
    if (!volunteerID) { alert("कृपया वॉलंटियर ID दर्ज करें।"); return; }

    statusMsg.innerHTML = '<div class="msg-loading"><span class="spinner"></span>सत्यापन किया जा रहा है...</div>';
    resultBox.style.display = "none";

    try {
        const q = query(collection(db, "IDcard"), where("volunteer_id", "==", volunteerID));
        const snap = await getDocs(q);

        if (!snap.empty) {
            const data = snap.docs[0].data();
            statusMsg.innerHTML = "";
            showIDCard(data, resultBox);
        } else {
            statusMsg.innerHTML = '<div class="msg-error">❌ यह ID नहीं मिली। कृपया ID पुनः जाँचें।</div>';
        }
    } catch (err) {
        console.error("Verification Error:", err);
        statusMsg.innerHTML = '<div class="msg-error">⚠️ सर्वर से कनेक्ट नहीं हो सका।<br><small>' + (err.message||"") + '</small></div>';
    }
};

function showIDCard(data, resultBox) {
    const photo = data.photoBase64 || data.photoURL || "";
    const photoHTML = photo
        ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;">`
        : "👤";
    const status = data.status || "Verified";
    const statusColor = status === "Approved" || status === "Verified" ? "#27ae60" : "#f39c12";

    resultBox.innerHTML = `
      <div class="id-card">
        <div class="id-card-top">
          <img src="https://unnatiselfhelpgroup-creator.github.io/ngologo.png" onerror="this.style.display='none'">
          <div>
            <div class="org-name">उन्नति स्वयं सहायता समिति</div>
            <div class="org-sub">NGO Darpan: UA/2016/0108273 | Lalkuan, Uttarakhand</div>
          </div>
        </div>
        <div class="id-card-tricolor"><span></span><span></span><span></span></div>
        <div class="id-card-header"><h4>🪪 स्वयंसेवी पहचान पत्र — VOLUNTEER ID CARD</h4></div>
        <div class="id-card-body">
          <div class="member-photo">${photoHTML}</div>
          <div class="member-details">
            <div class="member-name">${esc(data.name)}</div>
            <div class="member-designation">${esc(data.designation || data.post || "Volunteer")}</div>
            <div class="detail-row"><span class="dl">पिता/पतिः</span><span class="dv">${esc(data.father_name || data.father || "—")}</span></div>
            <div class="detail-row"><span class="dl">मोबाइलः</span><span class="dv">${esc(data.mobile)}</span></div>
            <div class="detail-row"><span class="dl">जिलाः</span><span class="dv">${esc(data.district || data.address || "—")}</span></div>
          </div>
        </div>
        <div class="id-card-idbar">
          <div>
            <div class="id-label">VOLUNTEER ID</div>
            <div class="id-value">${esc(data.volunteer_id || "—")}</div>
          </div>
          <div style="text-align:right">
            <span style="background:${statusColor};color:#fff;padding:4px 14px;border-radius:20px;font-size:0.75rem;font-weight:700;">
              ${status === "Approved" || status === "Verified" ? "✅ VERIFIED" : "⏳ " + status}
            </span>
          </div>
        </div>
        <div class="id-card-footer">
          <div style="flex:1"></div>
          <div class="signature-box">
            <img src="https://unnatiselfhelpgroup-creator.github.io/signature.png" style="height:40px;max-width:120px;object-fit:contain;" onerror="this.style.display='none'">
            <div style="border-top:1px solid #999;padding-top:3px;font-size:0.7rem;color:#666;text-align:center;">अधिकृत हस्ताक्षर</div>
          </div>
        </div>
      </div>
      <div class="extra-info-card">
        <h3>✅ ID सत्यापन सफल — अतिरिक्त जानकारी</h3>
        <div class="info-item"><div class="info-label">नियुक्ति दिनांक</div><div class="info-val">${esc(data.createdAt?.toDate?.().toLocaleDateString("hi-IN") || "—")}</div></div>
        <div class="info-item"><div class="info-label">स्थिति</div><div class="info-val">${status === "Approved" || status === "Verified" ? "✅ सत्यापित" : "⏳ प्रक्रियाधीन"}</div></div>
        <div class="info-item"><div class="info-label">ईमेल</div><div class="info-val">${esc(data.email || "—")}</div></div>
        <div class="info-item"><div class="info-label">पूरा पता</div><div class="info-val">${esc(data.address || "—")}</div></div>
        <div class="verified-badge">🏛️ यह ID <strong>उन्नति स्वयं सहायता समिति</strong> द्वारा अधिकृत है।<br>सत्यापन दिनांक: ${new Date().toLocaleDateString("hi-IN")} | संपर्क: 9410332400</div>
      </div>
    `;
    resultBox.style.display = "block";
}

function esc(s) {
    if (!s) return "—";
    return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
