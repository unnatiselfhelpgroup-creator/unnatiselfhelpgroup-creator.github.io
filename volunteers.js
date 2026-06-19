import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const body = document.getElementById("volunteerBody");

async function loadVolunteers() {
    if (!body) return;

    body.innerHTML = `<tr><td colspan="3">डेटा लोड हो रहा है...</td></tr>`;

    try {
        const snap = await getDocs(collection(db, "VolunteerRegistrations"));
        body.innerHTML = "";

        if (snap.empty) {
            body.innerHTML = `<tr><td colspan="3">कोई स्वयंसेवक उपलब्ध नहीं है।</td></tr>`;
            return;
        }

        snap.forEach((docItem) => {
            const d = docItem.data();
            const name = d.name || "-";
            const volunteerId = d.volunteerId || "-";
            const status = d.status || "Pending";

            let color = "#ffb300"; // Default (Pending)
            const s = status.toLowerCase();

            if (s === "verified" || s === "approved" || s === "active") {
                color = "#00ff66";
            } else if (s === "rejected") {
                color = "#ff3b30";
            }

            body.innerHTML += `
            <tr>
                <td>${name}</td>
                <td>${volunteerId}</td>
                <td style="color:${color}; font-weight:bold;">${status}</td>
            </tr>`;
        });
    } catch (error) {
        console.error("Error loading volunteers:", error);
        body.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
    }
}

loadVolunteers();
