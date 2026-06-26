import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const body = document.getElementById("volunteerBody");

async function loadVolunteers() {
    if (!body) return;

    // Loading state
    body.innerHTML = "";
    const loadTr = document.createElement("tr");
    const loadTd = document.createElement("td");
    loadTd.colSpan = 3;
    loadTd.textContent = "⏳ डेटा लोड हो रहा है...";
    loadTr.appendChild(loadTd);
    body.appendChild(loadTr);

    try {
        const snap = await getDocs(collection(db, "Volunteers"));
        body.innerHTML = "";

        if (snap.empty) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 3;
            td.textContent = "कोई स्वयंसेवक उपलब्ध नहीं है।";
            tr.appendChild(td);
            body.appendChild(tr);
            return;
        }

        snap.forEach((docItem) => {
            const d = docItem.data();

            // ✅ XSS Safe — textContent इस्तेमाल
            const tr = document.createElement("tr");

            const tdName = document.createElement("td");
            tdName.textContent = d.name || "-";

            const tdId = document.createElement("td");
            tdId.textContent = d.volunteerId || d.volunteer_id || "-";

            const tdStatus = document.createElement("td");
            const status = d.status || "Pending";
            tdStatus.textContent = status;
            const s = status.toLowerCase();
            if (s === "verified" || s === "approved" || s === "active") {
                tdStatus.style.color = "#00ff66";
            } else if (s === "rejected") {
                tdStatus.style.color = "#ff3b30";
            } else {
                tdStatus.style.color = "#ffb300";
            }
            tdStatus.style.fontWeight = "bold";

            tr.appendChild(tdName);
            tr.appendChild(tdId);
            tr.appendChild(tdStatus);
            body.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading volunteers:", error);
        body.innerHTML = "";
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.textContent = "डेटा लोड में त्रुटि हुई।";
        td.style.color = "#ff4d4d";
        tr.appendChild(td);
        body.appendChild(tr);
    }
}

loadVolunteers();
