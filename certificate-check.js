import { initializeApp }
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

import {
getFirestore,
doc,
getDoc
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

window.checkCert =
async function(){

const certNo =
document.getElementById("certInput")
.value.trim();

const result =
document.getElementById("resultBox");

if(certNo===""){
alert("सर्टिफिकेट नंबर दर्ज करें");
return;
}

const ref =
doc(db,
"Certificates",
certNo);

const snap =
await getDoc(ref);

result.style.display =
"block";

if(snap.exists()){

const d =
snap.data();

result.innerHTML =
`
✅ <b>प्रमाणपत्र मान्य है</b>

<br><br>

<b>नाम :</b>
${d.name}

<br>

<b>वॉलंटियर ID :</b>
${d.volunteer_id}

<br>

<b>अवधि :</b>
${d.days}

<br>

<b>जारी तिथि :</b>
${d.issueDate}
`;

}
else{

result.innerHTML =
`
❌ यह प्रमाणपत्र संख्या उपलब्ध नहीं है।
`;

}

}
