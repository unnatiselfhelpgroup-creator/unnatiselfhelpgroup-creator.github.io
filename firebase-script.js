import { db } from "./firebase-config.js";

import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const container =
document.getElementById(
"appointments-container"
);

async function loadAppointments() {

try {

container.innerHTML =
"Loading...";

const querySnapshot =
await getDocs(
collection(
db,
"Appointments"
)
);

container.innerHTML = "";

if (querySnapshot.empty) {

container.innerHTML =
"<h3>No Applications Found</h3>";

return;

}

querySnapshot.forEach(
(docSnap) => {

const data =
docSnap.data();

const id =
docSnap.id;

const div =
document.createElement(
"div"
);

div.className =
"card";

div.innerHTML = `

<p><b>Name :</b>
${data.name || ""}</p><p><b>Father :</b>
${data.father_name || ""}</p><p><b>Mobile :</b>
${data.mobile || ""}</p><p><b>Email :</b>
${data.email || ""}</p><p><b>Address :</b>
${data.address || ""}</p><p><b>District :</b>
${data.district || ""}</p><p><b>State :</b>
${data.state || ""}</p><p><b>Status :</b>
${data.status || "Pending"}</p><button class="approve">
Approve
</button><button class="reject">
Reject
</button><button class="delete">
Delete
</button><button class="pdf">
PDF
</button><button class="print">
Print
</button>`;

container.appendChild(
div
);

div.querySelector(
".approve"
).onclick = () =>
updateStatus(
id,
"verified"
);

div.querySelector(
".reject"
).onclick = () =>
updateStatus(
id,
"rejected"
);

div.querySelector(
".delete"
).onclick = () =>
deleteAppointment(
id
);

div.querySelector(
".pdf"
).onclick = () => {

if (
window.generateAppointmentPDF
) {
window.generateAppointmentPDF(
data
);
}

};

div.querySelector(
".print"
).onclick = () => {

const printWindow =
window.open(
"",
"_blank"
);

printWindow.document.write(`

<html><head><title>
Appointment Letter
</title><style>

body{
font-family:Arial;
padding:30px;
line-height:1.8;
}

h2{
text-align:center;
}

</style></head><body><h2>
Appointment Letter
</h2><p>
<b>Name :</b>
${data.name || ""}
</p><p>
<b>Father :</b>
${data.father_name || ""}
</p><p>
<b>Mobile :</b>
${data.mobile || ""}
</p><p>
<b>Email :</b>
${data.email || ""}
</p><p>
<b>Address :</b>
${data.address || ""}
</p><p>
<b>District :</b>
${data.district || ""}
</p><p>
<b>State :</b>
${data.state || ""}
</p><br><p>Dear
${data.name || "Member"},

You are hereby appointed as

${data.designation || "Volunteer"}

in Unnati Sawaye Sahayata Samiti under the Gau Mata Rashtramata Samman Abhiyan.

Your contribution towards social service, cow protection, awareness campaigns and organisational activities is highly appreciated.

</p></body></html>`);

printWindow.document.close();

printWindow.print();

};

}
);

}
catch (error) {

console.error(
error
);

container.innerHTML =
"<h3>Error Loading Data</h3>";

alert(
error.message
);

}

}

async function updateStatus(
id,
status
) {

try {

await updateDoc(
doc(
db,
"Appointments",
id
),
{
status: status
}
);

alert(
"Status Updated"
);

loadAppointments();

}
catch (error) {

alert(
error.message
);

}

}

async function deleteAppointment(
id
) {

if (
!confirm(
"Delete this application?"
)
)
return;

try {

await deleteDoc(
doc(
db,
"Appointments",
id
)
);

alert(
"Deleted Successfully"
);

loadAppointments();

}
catch (error) {

alert(
error.message
);

}

}

loadAppointments();
