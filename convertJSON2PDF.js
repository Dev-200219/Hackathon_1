const fs = require("fs");
const PDFdocument = require("pdfkit")

function createPDF(jsonObj, name, site){

let obj = JSON.parse(jsonObj);
var doc = new PDFdocument({ size: 'A4' });
doc.pipe(fs.createWriteStream(`${name} ${site} Questions.pdf`))

doc.fontSize(25).font('Times-Bold').text(`${name} ${site} Questions`,{
    underline:true,
    align:'center'
}).moveDown(1.0)

doc.lineGap(2)

for (let key in obj) {

doc.fontSize(15)
doc.font('Times-Bold').text(`${key}`)

let nobj = obj[key];

for (let k in nobj) 
{
doc.font('Times-Roman').fontSize(10)
.text(`${k}`, {
    link: nobj[k],
    width: 500
    })
}

doc.moveDown(1.0);

}
doc.end()
}

module.exports=createPDF;