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

body.innerHTML = "";

try {

const snap =
await getDocs(collection(db,"Volunteers"));

if(snap.empty){

body.innerHTML =
`
<tr>
<td colspan="3">
कोई स्वयंसेवक उपलब्ध नहीं है।
</td>
</tr>
`;

}

snap.forEach((doc)=>{

const d = doc.data();

body.innerHTML +=
`
<tr>
<td>${d.name || "-"}</td>
<td>${d.volunteer_id || "-"}</td>
<td>${d.status || "Pending"}</td>
</tr>
`;

});

}

catch(error){

body.innerHTML =
`
<tr>
<td colspan="3">
डेटा लोड नहीं हो सका।
</td>
</tr>
`;

console.log(error);

}
