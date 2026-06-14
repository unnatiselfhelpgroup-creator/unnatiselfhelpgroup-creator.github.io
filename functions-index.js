const functions=
require("firebase-functions");

const admin=
require("firebase-admin");

const nodemailer=
require("nodemailer");

admin.initializeApp();

exports.sendAppointmentLetter=
functions.https.onRequest(
async(req,res)=>{

const {
email,
name
}=req.body;

const transporter=
nodemailer.createTransport({
service:"gmail",
auth:{
user:"YOUR_GMAIL",
pass:"YOUR_APP_PASSWORD"
}
});

await transporter.sendMail({

from:"YOUR_GMAIL",

to:email,

subject:
"Appointment Verified",

text:
`${name},
आपका आवेदन Verified हो गया है।`

});

res.send("Mail Sent");

});
