const fs = require('fs');
let createPDF=require("./convertJSON2PDF")
const puppeteer = require('puppeteer');
let questions = {}

const readline = require("readline");
let rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout,
    terminal:false
})

rl.question("Which Company are you preparing for?\n", async function (companyName) {
        rl.question("Enter number of questions:",async function(numQues){

        await companyGFG(companyName,numQues);
        rl.close();

        })
        
    })

async function companyGFG(companyName, numQues) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 75
    });

    let pagesArr = await browser.pages();
    const pageGFG = pagesArr[0];
    await pageGFG.setDefaultTimeout(60000)
    await pageGFG.goto('https://practice.geeksforgeeks.org/explore/?page=1');
    await pageGFG.reload();
    await pageGFG.click("#moreCompanies", { delay: 2000 });
    await pageGFG.waitForSelector("#searchCompanies");
    await pageGFG.type("#searchCompanies", companyName)
    
    await pageGFG.$('[style="font-size: 12px; padding: 10px; display: block;"]')
    .then(async function(data){
        if(data!=null)
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

    questions["Easy Questions: "] = await getGFGQuestions(pageGFG, numQues, 0); 
    questions["Medium Questions: "] =  await getGFGQuestions(pageGFG, numQues, 1)
    questions["Hard Questions: "] =  await getGFGQuestions(pageGFG, numQues, 2)  

    

    createPDF(JSON.stringify(questions),companyName,"");
    browser.close();



}
    
async function getGFGQuestions(pageGFG, numQues, difficulty) {

    let p;
    
    if(difficulty==0)
    {
        await Promise.all([
            pageGFG.waitForNavigation(),
            pageGFG.click("[value='0']", { delay: 1000 })
        ])
        p= new Promise(function(resolve,reject){
            pageGFG.waitForSelector(".panel.problem-block div>span")
            .then(function(){
                resolve();
            })
            .catch(function(){
                return {"No Easy Questions Available":'\0'}
            })
        })

    }
    else if(difficulty==1)
    {
        await pageGFG.click("[value='0']", { delay: 1000 }) 
        await Promise.all([
            pageGFG.waitForNavigation(),
            pageGFG.click("[value='1']", { delay: 1000 })
        ])
        p= new Promise(function(resolve,reject){
            pageGFG.waitForSelector(".panel.problem-block div>span")
            .then(function(){
                resolve();
            })
            .catch(function(){
                return {"No Medium Questions Available":'\0'}
            })
        })
    }
    else if(difficulty==2)
    {   
        await pageGFG.click("[value='1']", { delay: 1000 })
        await Promise.all([
            pageGFG.waitForNavigation(),
            pageGFG.click("[value='2']", { delay: 1000 })
        ]) 
        p= new Promise(function(resolve,reject){
            pageGFG.waitForSelector(".panel.problem-block div>span")
            .then(function(){
                resolve();  
            })
            .catch(function(){
                resolve();
                return {"No Hard Questions Available":'\0'}
            })
        })

    }

    await p;
    
    return await pageGFG.evaluate(function (numQues) {
        let ques = {};
        let problemName = document.querySelectorAll(".panel.problem-block div>span");
        let problemLink = document.querySelectorAll('[style="position: absolute;top: 0;left: 0;height: 100%;width: 100%;z-index:1;pointer:cursor;"]');

            if (problemName.length > numQues) {
    
                for (let i = 0; i < numQues; i++) {
                    ques[problemName[i].innerText] = problemLink[i].getAttribute("href");
            }
            }
            else {
                for (let i = 0; i < problemName.length; i++) {
                ques[problemName[i].innerText] = problemLink[i].getAttribute("href");
                }
            }
            return ques;
            }, numQues)
}

module.exports;