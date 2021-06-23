const fs = require("fs");
const PDFdocument = require("pdfkit")
let data = fs.readFileSync("StringGFGQuestions.json");
let obj = JSON.parse(data);

var doc = new PDFdocument({ size: 'A4' });
doc.pipe(fs.createWriteStream("./StringGFG.pdf"))

doc.fontSize(25).font('Times-Bold').text(`String GFG Questions`,{
    underline:true,
    align:'center'
}).moveDown(1.0)
doc.lineGap(2)

let i = 10;

for (let key in obj) {

    doc.fontSize(15)
    doc.font('Times-Bold').text(`${key}`)

    let nobj = obj[key];

    for (let k in nobj) {
        doc.font('Times-Roman').fontSize(10)
        .text(`${k}`, {
                link: nobj[k],
                width: 500
            })
        j = j + 10;
    }
    doc.moveDown(1.0);
}
doc.end()
