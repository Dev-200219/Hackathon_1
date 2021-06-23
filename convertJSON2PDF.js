const fs = require("fs");
const { default: jsPDF } = require("jspdf");
const { options } = require("pdfkit");
let data = fs.readFileSync("AdobeQuestions.json");
let obj = JSON.parse(data);

var doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a3"
});

let i = 10;

for (let key in obj) {

    var j = 20;
    // var l=i+20;

    doc.setFontSize(20)
    doc.text(key, 10, i,{
        
    })

    let nobj = obj[key];

    for (let k in nobj) {
        doc.setFontSize(10)
        doc.text(k + " : " + nobj[k], 10, j,{
        
        });
        j = j + 10;
        // l=l+50;
    }

    doc.addPage()
}


doc.save(`Adobe Questions.pdf`)
