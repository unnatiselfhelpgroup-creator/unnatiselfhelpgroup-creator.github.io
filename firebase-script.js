import { db } from "./firebase-config.js";

import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc
}
from
"https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

emailjs.init("AvD_f76bB4qjYnGb0");

async function loadAppointments() {

const container =
document.getElementById(
"appointments-container"
);

container.innerHTML = "";

const snap =
await getDocs(
collection(
db,
"Appointments"
)
);

snap.forEach(
(docSnap)=>{

const data =
docSnap.data();

const id =
docSnap.id;

const div =
document.createElement(
"div"
);

div.style.background =
"#fff";

div.style.padding =
"20px";

div.style.margin =
"20px";

div.style.borderRadius =
"15px";

div.innerHTML = `

<h3>${data.name||""}</h3>

<p>Father :
${data.father_name||""}</p>

<p>Mobile :
${data.mobile||""}</p>

<p>Email :
${data.email||""}</p>

<p>Status :
${data.status||"Pending"}</p>

<button id="approve-${id}">
Approve
</button>

<button id="reject-${id}">
Reject
</button>

<button id="delete-${id}">
Delete
</button>

<button id="pdf-${id}">
PDF
</button>

`;

container.appendChild(
div
);

document.getElementById(
`approve-${id}`
).onclick =
()=>verifyApplication(
id,
data
);

document.getElementById(
`reject-${id}`
).onclick =
()=>rejectApplication(
id,
data
);

document.getElementById(
`delete-${id}`
).onclick =
()=>deleteApplication(
id
);

document.getElementById(
`pdf-${id}`
).onclick =
()=>{

if(
window.generateAppointmentPDF
){
window.generateAppointmentPDF(
data
);
}

};

}
);

}

async function verifyApplication(
id,
data
){

await updateDoc(
doc(
db,
"Appointments",
id
),
{
status:
"verified"
}
);

if(
window.generateAppointmentPDF
){
window.generateAppointmentPDF(
data
);
}

if(data.email){

await emailjs.send(
"service_63pefgf",
"template_6cetpmr",
{
name:
data.name,
email:
data.email,
subject:
"Application Verified",
message:
"आपका आवेदन Verified कर दिया गया है।"
}
);

}

alert(
"Verified"
);

loadAppointments();

}

async function rejectApplication(
id,
data
){

await updateDoc(
doc(
db,
"Appointments",
id
),
{
status:
"rejected"
}
);

if(data.email){

await emailjs.send(
"service_63pefgf",
"template_6cetpmr",
{
name:
data.name,
email:
data.email,
subject:
"Application Rejected",
message:
"आपका आवेदन Rejected कर दिया गया है।"
}
);

}

alert(
"Rejected"
);

loadAppointments();

}

async function deleteApplication(
id
){

if(
!confirm(
"Delete ?"
)
){
return;
}

await deleteDoc(
doc(
db,
"Appointments",
id
)
);

alert(
"Deleted"
);

loadAppointments();

}

loadAppointments();
