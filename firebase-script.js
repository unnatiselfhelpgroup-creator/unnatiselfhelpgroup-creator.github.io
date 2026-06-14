async function sendMail(
name,
email,
subject,
message
){

try{

await emailjs.send(
  "service_63pefgf",
  "template_6cetpmr",
  {
    name:name,
    email:email,
    subject:subject,
    message:message
  }
);

}
catch(error){

console.log(error);
alert(error.message);

}

}

// =========================
// VERIFY APPLICATION
// =========================

window.verifyApplication =
async function(
collectionName,
docId,
name,
email,
data
){

try{

await updateDoc(
doc(db,collectionName,docId),
{
status:"verified"
}
);

// PDF Generate
if(
window.generateAppointmentPDF &&
data
){
window.generateAppointmentPDF(data);
}

await sendMail(
name,
email,
"आवेदन सत्यापित",
"आपका आवेदन सफलतापूर्वक Verified कर दिया गया है।"
);

alert("✅ Application Verified");

location.reload();

}
catch(error){

console.log(error);
alert(error.message);

}

};

// =========================
// REJECT APPLICATION
// =========================

window.rejectApplication =
async function(
collectionName,
docId,
name,
email
){

try{

await updateDoc(
  doc(db,collectionName,docId),
  {
    status:"rejected"
  }
);

await sendMail(
  name,
  email,
  "आवेदन अस्वीकृत",
  "आपका आवेदन Rejected कर दिया गया है।"
);

alert("❌ Application Rejected");

location.reload();

}
catch(error){

console.log(error);
alert(error.message);

}

};

// =========================
// DELETE APPLICATION
// =========================

window.deleteApplication =
async function(
collectionName,
docId
){

if(
confirm("क्या आप आवेदन हटाना चाहते हैं?")
){

try{

  await deleteDoc(
    doc(db,collectionName,docId)
  );

  alert("🗑️ Application Deleted");

  location.reload();

}
catch(error){

  console.log(error);
  alert(error.message);

}

}

};
