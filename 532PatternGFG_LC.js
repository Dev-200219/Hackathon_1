const puppeteer = require('puppeteer');
let getQuestionsGFG = require("./getQuestionsFromGFG").getQues;
let getQuestionsLC = require("./getQuestionsFromLC").getQues;
let createPDF=require("./convertJSON2PDF")
let questions = {}
let mainPage;
let mainBrowser;

const readline = require("readline");

let rl = readline.createInterface(
    process.stdin,
    process.stdout
)

rl.question("Which DSA do you want to practice?\n", async function (topic) {
    await pattern532GFG(topic);
    await pattern532LC(topic);
    rl.close();
})

async function pattern532GFG(dsaTopic) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 50
    });

    let pagesArr = await browser.pages();
    const pageGFG = pagesArr[0];
    mainBrowser=browser;
    mainPage=pageGFG;
    
    await pageGFG.goto('https://practice.geeksforgeeks.org/explore/?page=1');
    await pageGFG.reload()
    await pageGFG.waitForSelector("div[href='#collapse4'] h4");

    await pageGFG.evaluate(function () {
        document.querySelector("div[href='#collapse4'] h4").click();
        document.querySelector("#moreCategories").click();
    })
    await pageGFG.waitForSelector("#searchCategories");
    await pageGFG.type("#searchCategories", dsaTopic)
    await pageGFG.$('[style="font-size: 12px; padding: 10px; display: block;"]')
    .then(async function(topicAvailable){
        
        if(topicAvailable!=null)
        await pageGFG.click('[style="font-size: 12px; padding: 10px; display: block;"]', { delay: 2000 })
        else
        {
            console.log(`${dsaTopic} questions are not availabe on GFG`);
            await questionsLC(dsaTopic,numQues,difficulty);
            process.exit(0);
        }
    })
    await pageGFG.click("#selectCategoryModal", { delay: 500 })
    await pageGFG.click("div[href='#collapse1'] h4", { delay: 2000 });
    
    questions["Easy Questions: "] = await getQuestionsGFG(pageGFG, 5, 0, true); 
    questions["Medium Questions: "] =  await getQuestionsGFG(pageGFG, 3, 1, true)
    questions["Hard Questions: "] =  await getQuestionsGFG(pageGFG, 2, 2, true)

    createPDF(JSON.stringify(questions),dsaTopic,"GFG");

}

async function pattern532LC(dsaTopic) {

    const pageLC = mainPage;
    await pageLC.goto('https://leetcode.com/problemset/all/');
    await pageLC.click("#headlessui-popover-button-17", { delay: 1000 })
    await pageLC.click("[placeholder='Filter topics']", { delay: 1000 })
    await pageLC.type("[placeholder='Filter topics']", dsaTopic)
    await pageLC.click(".flex.flex-wrap.py-4.-m-1 span");


    questions["Easy Questions: "] = await getQuestionsLC(pageLC, 0, 5);
    questions["Medium Questions: "] = await getQuestionsLC(pageLC, 1, 3);
    questions["Hard Questions: "] = await getQuestionsLC(pageLC, 2, 2);

    createPDF(JSON.stringify(questions),dsaTopic,"LeetCode");
    mainBrowser.close();
}

module.exports={
GFG:pattern532GFG,
LC:pattern532LC
}


