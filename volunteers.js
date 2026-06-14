import { initializeApp }
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
getFirestore,
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyCNEZ03VUTOD-eJjPsMP4b0Ykh4eiigqPQ",
authDomain: "ngo-certificate-system.firebaseapp.com",
projectId: "ngo-certificate-system",
storageBucket: "ngo-certificate-system.firebasestorage.app",
messagingSenderId: "664351169113",
appId: "1:664351169113:web:3c476e199d369615c6ef48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const body =
document.getElementById("volunteerBody");

async function loadVolunteers(){

body.innerHTML = `
<tr>
<td colspan="3">
डेटा लोड हो रहा है...
</td>
</tr>
`;

try{

const snap =
await getDocs(
collection(db,"Volunteers")
);

body.innerHTML = "";

if(snap.empty){

body.innerHTML = `
<tr>
<td colspan="3">
कोई स्वयंसेवक उपलब्ध नहीं है।
</td>
</tr>
`;

return;

}

let sr = 1;

snap.forEach((docItem)=>{

const d =
docItem.data();

let status =
d.status || "Pending";

let color =
"#ffb300";

if(
status.toLowerCase()==="verified" ||
status.toLowerCase()==="approved" ||
status.toLowerCase()==="active"
){
color = "#00ff66";
}

if(
status.toLowerCase()==="rejected"
){
color = "#ff3b30";
}

body.innerHTML += `
<tr>

<td>
${d.name || "-"}
</td>

<td>
${d.volunteer_id || "-"}
</td>

<td style="
color:${color};
font-weight:bold;
">

${status}

</td>

</tr>
`;

sr++;

});

}
catch(error){

console.log(error);

body.innerHTML = `
<tr>
<td colspan="3">
डेटा लोड नहीं हो सका।
</td>
</tr>
`;

}

}

loadVolunteers();
