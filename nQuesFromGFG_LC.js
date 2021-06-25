const puppeteer = require('puppeteer');
let createPDF=require("./convertJSON2PDF")
let getQuestionsGFG= require("./getQuestionsFromGFG").getQues;
let getQuestionsLC = require("./getQuestionsFromLC").getQues;
let questions = {}
const readline = require("readline");
let mainPage;
let mainBrowser;

let rl = readline.createInterface(
    process.stdin,
    process.stdout
)

rl.question("Which DSA do you want to practice ? \n", async function (ans1) {
    rl.question("Number of Questions you want to practice\n",async function(ans2){
        rl.question("Enter your difficulty level:(Easy,Medium,Hard,All)\n",async function(ans3){
           
            if(ans3.toLowerCase()=="easy")
            { 
                await questionsGFG(ans1,ans2,0);
                await questionsLC(ans1,ans2,0);
            }
            else if(ans3.toLowerCase()=="medium")
            {     
                await questionsGFG(ans1,ans2,1);
                await questionsLC(ans1,ans2,1);
            }
            else if(ans3.toLowerCase()=="hard")
            {      
                await questionsGFG(ans1,ans2,2);
                await questionsLC(ans1,ans2,2);
            }
            else
            {
                await questionsGFG(ans1,ans2);
                await questionsLC(ans1,ans2);
            }

            rl.close();
        })

    })
})

async function questionsGFG(dsaTopic, numQues, difficulty) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 50
    });

    let allPages = await browser.pages();
    const pageGFG = allPages[0];
    await pageGFG.setDefaultTimeout(60000)
    mainBrowser=browser;
    mainPage=pageGFG;
    
    await pageGFG.goto('https://practice.geeksforgeeks.org/explore/?page=1');
    await pageGFG.reload();
    await pageGFG.waitForSelector(".panel.problem-block div>span",{visible:true})
    await pageGFG.waitForSelector("div[href='#collapse4'] h4");

    await pageGFG.evaluate(function () {
        document.querySelector("div[href='#collapse4'] h4").click();
        document.querySelector("#moreCategories").click();
    })
    await pageGFG.waitForSelector("#searchCategories");
    await pageGFG.type("#searchCategories", dsaTopic)
    await pageGFG.click('[style="font-size: 12px; padding: 10px; display: block;"]', { delay: 2000 })
    await pageGFG.click("#selectCategoryModal", { delay: 500 })
    await pageGFG.click("div[href='#collapse1'] h4", { delay: 2000 });

    if(difficulty==0)
    {
        questions["Easy Questions: "] = await getQuestionsGFG(pageGFG, numQues,0, false);  
    }
    else if(difficulty==1)
    {
        questions["Medium Questions: "] =  await getQuestionsGFG(pageGFG, numQues,1, false)
    }
    else if(difficulty==2)
    {
        questions["Hard Questions: "] =  await getQuestionsGFG(pageGFG, numQues,2, false)

    }
    else
    {
        questions["Easy Questions: "] = await getQuestionsGFG(pageGFG, numQues, 0, true); 
        questions["Medium Questions: "] =  await getQuestionsGFG(pageGFG, numQues, 1, true)
        questions["Hard Questions: "] =  await getQuestionsGFG(pageGFG, numQues, 2, true)  

    }
    
    createPDF(JSON.stringify(questions),dsaTopic,"GFG");

}

async function questionsLC(dsaTopic,numQues, difficulty) {

    const pageLC = mainPage;
    await pageLC.goto('https://leetcode.com/problemset/all/');
    await pageLC.click("#headlessui-popover-button-17", { delay: 1000 })
    await pageLC.click("[placeholder='Filter topics']", { delay: 1000 })
    await pageLC.type("[placeholder='Filter topics']", dsaTopic)
    await pageLC.click(".flex.flex-wrap.py-4.-m-1 span");

    if(difficulty==0)
    questions["Easy Questions: "] = await getQuestionsLC(pageLC, difficulty, numQues);
    else if(difficulty==1)
    questions["Medium Questions: "] = await getQuestionsLC(pageLC, difficulty, numQues);
    else if(difficulty==2)
    questions["Hard Questions: "] = await getQuestionsLC(pageLC, difficulty, numQues);
    else
    {
        questions["Easy Questions: "] = await getQuestionsLC(pageLC, 0, numQues);
        questions["Medium Questions: "] = await getQuestionsLC(pageLC, 1, numQues);
        questions["Hard Questions: "] = await getQuestionsLC(pageLC, 2, numQues);
    }

        createPDF(JSON.stringify(questions),dsaTopic,"LeetCode");
        mainBrowser.close();

}

module.exports;