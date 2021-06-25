let createPDF=require("./convertJSON2PDF");
let getQuestions= require("./getQuestionsFromGFG").getQues;
const puppeteer = require('puppeteer');

const readline = require("readline");
let rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
    terminal:false
})

rl.question("Which Company are you preparing for?\n", async function (companyName) {
    rl.question("Enter number of questions:",async function(numQues){
        
        await getCompanyQues(companyName,numQues);
        rl.close(); 
    })
})

async function getCompanyQues(companyName, numQues) {
    
    let questions = {}
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 75
    });
    
    let allPages = await browser.pages();
    const pageGFG = allPages[0];
    await pageGFG.setDefaultTimeout(60000)
    await pageGFG.goto('https://practice.geeksforgeeks.org/explore/?page=1');
    await pageGFG.reload();
    await pageGFG.click("#moreCompanies", { delay: 2000 });
    await pageGFG.waitForSelector("#searchCompanies");
    await pageGFG.type("#searchCompanies", companyName)
    
    /*Checking if the company's questions are even available or not, if not then print the corresponding statement and exit from process*/ 
    await pageGFG.$('[style="font-size: 12px; padding: 10px; display: block;"]')
    .then(async function(questionsAvailable){
        
        if(questionsAvailable!=null)
        await pageGFG.click('[style="font-size: 12px; padding: 10px; display: block;"]', { delay: 2000 })
        else
        {
            console.log(`${companyName} questions not availabe`);
            process.exit();
        }
    })
    
    await pageGFG.click("#selectCompanyModal", { delay: 500 })
    await pageGFG.waitForSelector(".panel.problem-block div>span")
    await pageGFG.click("div[href='#collapse1'] h4", { delay: 1000 });
    
    /*Getting questions of each type of difficulty from getQuestionsFromGFG module*/ 
    questions["Easy Questions: "] = await getQuestions(pageGFG, numQues, 0, true); 
    questions["Medium Questions: "] =  await getQuestions(pageGFG, numQues, 1, true) 
    questions["Hard Questions: "] =  await getQuestions(pageGFG, numQues, 2, true)  
    
    /*Creating PDF of all the questions*/
    createPDF(JSON.stringify(questions),companyName,"");
    browser.close();
}

module.exports;

