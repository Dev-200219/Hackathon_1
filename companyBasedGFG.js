const fs = require('fs');
const { page } = require('pdfkit');
const puppeteer = require('puppeteer');
let questions = {}

const readline = require("readline");
let rl = readline.createInterface(
    process.stdin,
    process.stdout
)

rl.question("Which Company are you preparing for?\n", async function (ans) {
    await companyGFG(ans);
    rl.close();
})

async function companyGFG(companyName) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 100
    });

    let pagesArr = await browser.pages();
    const pageGFG = pagesArr[0];
    await pageGFG.goto('https://practice.geeksforgeeks.org/explore/?page=1');
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
            await browser.close();
        }
    })
    
    await pageGFG.click("#selectCompanyModal", { delay: 500 })
    await pageGFG.waitForSelector(".panel.problem-block div>span")
    await pageGFG.click("div[href='#collapse1'] h4", { delay: 2000 });
    
    await Promise.all([
        pageGFG.waitForNavigation(),
        pageGFG.click("[value='0']", { delay: 2000 })
    ])
    await pageGFG.waitForSelector(".panel.problem-block div>span")
    questions["Easy Questions: "] = await getGFGQuestions(pageGFG, 10);  ;

    await pageGFG.click("[value='0']", { delay: 2000 })
    await Promise.all([
        pageGFG.waitForNavigation(),
        pageGFG.click("[value='1']", { delay: 2000 })
    ])
    await pageGFG.waitForSelector(".panel.problem-block div>span")
    questions["Medium Questions: "] =  await getGFGQuestions(pageGFG, 10)

    await pageGFG.click("[value='1']", { delay: 2000 })
    await Promise.all([
        pageGFG.waitForNavigation(),
        pageGFG.click("[value='2']", { delay: 2000 })
    ])
    await pageGFG.waitForSelector(".panel.problem-block div>span")
    questions["Hard Questions: "] =  await getGFGQuestions(pageGFG, 10)

    let fileName = companyName + "Questions.json";
    fs.writeFile(fileName, JSON.stringify(questions), function (err) {
        if (err)
            console.log(err);

        browser.close();
    })


}
    

async function getGFGQuestions(pageGFG, numQues) {
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