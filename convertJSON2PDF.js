const fs=require("fs");
const { default: jsPDF } = require("jspdf");
let data=fs.readFileSync("RecursionGFGQuestions.json");
let obj=JSON.parse(data);
console.log(obj);
var doc= new jsPDF({
    orientation: "landscape",
    unit: "mm",
  });

let i=10;

for(let key in obj)
{

    var j=i+10;
    var l=i+20;

    doc.text(key,10,i)
    let nobj=obj[key];
   
    for(let k in nobj)
    {
        doc.text(k+" : "+nobj[k],10,j);
        // doc.text(nobj[k],10,l);
        j=j+10;
        l=l+50;
    }
    i+=j-10;
}

    // doc.text("Medium Questions: ",0,i)


    
doc.save("questions.pdf")


// Default export is a4 paper, portrait, using millimeters for units
// const doc = new jsPDF();

// doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");