const PDFDocument =
require("pdfkit");

module.exports=
function createPDF(data){

const doc=
new PDFDocument();

doc.fontSize(20)
.text(
"उन्नति स्वयं सहायता समिति",
{
align:"center"
}
);

doc.moveDown();

doc.fontSize(14)
.text(
`नाम :
${data.name}`
);

doc.text(
`पिता :
${data.father_name}`
);

doc.text(
`पता :
${data.address}`
);

doc.text(
`मोबाइल :
${data.mobile}`
);

doc.text(
`Volunteer ID :
${data.volunteer_id}`
);

doc.moveDown();

doc.text(
"आपको संस्था में नियुक्त किया जाता है।"
);

doc.end();

return doc;

};
