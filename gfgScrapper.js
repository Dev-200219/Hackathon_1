const fs = require('fs');
const puppeteer = require('puppeteer');
let questions = {}
let mainBrowser;
let mainPage;

const readline = require("readline");

let rl = readline.createInterface(
    process.stdin,
    process.stdout

)

rl.question("What DSA you want to practice ? ", async function (ans) {
    await pattern532LC(ans);
    rl.close();
})


async function pattern532GFG(dsaTopic) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 75
    });

    let pagesArr = await browser.pages();

    const pageGFG = pagesArr[0];
    await pageGFG.goto('https://practice.geeksforgeeks.org/explore/?page=1');
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
    await Promise.all([
        pageGFG.waitForNavigation(),
        pageGFG.click("[value='0']", { delay: 2000 })
    ])


    let easyQ = await pageGFG.evaluate(function () {
        let easyQ = {};
        let problemName = document.querySelectorAll(".panel.problem-block div>span");
        let problemLink = document.querySelectorAll(".panel.problem-block a");

        if (problemName.length > 5) {

            for (let i = 0; i < 5; i++) {

                easyQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
            }
        }
        else {
            for (let i = 0; i < problemName.length; i++) {

                easyQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
            }
        }


        return easyQ;
    })

    questions["Easy Questions: "] = easyQ;

    await pageGFG.click("[value='0']", { delay: 2000 })

    await Promise.all([
        pageGFG.waitForNavigation(),
        pageGFG.click("[value='1']", { delay: 2000 })
    ])

    await pageGFG.waitForSelector(".panel.problem-block div>span")

    let mediumQ = await pageGFG.evaluate(function () {
        let mediumQ = {};
        let problemName = document.querySelectorAll(".panel.problem-block div>span");
        let problemLink = document.querySelectorAll(".panel.problem-block a");

        if (problemName.length > 3) {

            for (let i = 0; i < 3; i++) {

                mediumQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
            }
        }
        else {

            for (let i = 0; i < problemName.length; i++) {

                mediumQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
            }
        }


        return mediumQ;
    })

    questions["Medium Questions: "] = mediumQ

    await pageGFG.click("[value='1']", { delay: 2000 })
    await Promise.all([
        pageGFG.waitForNavigation(),
        pageGFG.click("[value='2']", { delay: 2000 })
    ])

    await pageGFG.waitForSelector(".panel.problem-block div>span")

    let hardQ = await pageGFG.evaluate(function () {
        let hardQ = {};
        let problemName = document.querySelectorAll(".panel.problem-block div>span");
        let problemLink = document.querySelectorAll(".panel.problem-block a");

        if (problemName.length > 2) {

            for (let i = 0; i < 2; i++) {

                hardQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
            }
        }
        else {

            for (let i = 0; i < problemName.length; i++) {

                hardQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
            }
        }


        return hardQ;
    })

    questions["Hard Questions: "] = hardQ;

    let fileName = dsaTopic + "GFGQuestions.json";

    fs.writeFile(fileName, JSON.stringify(questions), function (err) {
        if (err) {
            console.log(err);
        }
        browser.close();
    })

}

async function pattern532LC(dsaTopic) {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 75
    });

    let pagesArr = await browser.pages();

    const pageLC = pagesArr[0];
    await pageLC.goto('https://leetcode.com/problemset/all/');
    await pageLC.click("#headlessui-popover-button-17", { delay: 1000 })
    await pageLC.click("[placeholder='Filter topics']", { delay: 1000 })
    await pageLC.type("[placeholder='Filter topics']", dsaTopic)
    await pageLC.click(".flex.flex-wrap.py-4.-m-1 span");

    await pageLC.evaluate(function () {
        document.querySelectorAll(".relative div>button[type='button'][aria-haspopup='true']")[1].click();
    })

    await pageLC.waitForSelector(".flex.items-center.h-5", { visible: true });

    await pageLC.evaluate(function () {
            document.querySelectorAll(".flex.items-center.h-5")[0].click();
    })

    let p= new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve();
        },5000)
    })

    await p;
    
   let easyQ= await pageLC.evaluate(function () {
        let easyQ = {};
        let allTrs = document.querySelectorAll("tbody tr");

        if (allTrs.length > 5) {
            for (let i = 2; i < 7; i++) {
                let allATags = allTrs[i].querySelectorAll("td a");
                let problemName = allATags[0].innerText;
                let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");;
                easyQ[problemName] = problemLink;
            }
        }
        else {
            for (let i = 2; i < allTrs.length; i++) {
                let allATags = allTrs.querySelectorAll("td a");
                let problemName = allATags[0].innerText;
                let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");
                easyQ[problemName] = problemLink;
            }
        }

        return easyQ;
    })

    questions["Easy Questions: "]=easyQ;

    await pageLC.evaluate(function () {
        document.querySelectorAll(".relative div>button[type='button'][aria-haspopup='true']")[1].click();
    })

    await pageLC.waitForSelector(".flex.items-center.h-5", { visible: true });

    await pageLC.evaluate(function () {
            document.querySelectorAll(".flex.items-center.h-5")[1].click();
    })

    p= new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve();
        },5000)
    })

    await p;
    
   let mediumQ= await pageLC.evaluate(function () {
        let mediumQ = {};
        let allTrs = document.querySelectorAll("tbody tr");

        if (allTrs.length > 5) {
            for (let i = 2; i < 5; i++) {
                let allATags = allTrs[i].querySelectorAll("td a");
                let problemName = allATags[0].innerText;
                let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");;
                mediumQ[problemName] = problemLink;
            }
        }
        else {
            for (let i = 2; i < allTrs.length; i++) {
                let allATags = allTrs.querySelectorAll("td a");
                let problemName = allATags[0].innerText;
                let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");
                mediumQ[problemName] = problemLink;
            }
        }

        return mediumQ;
    })

    questions["Medium Questions: "]=mediumQ;

    await pageLC.evaluate(function () {
        document.querySelectorAll(".relative div>button[type='button'][aria-haspopup='true']")[1].click();
    })

    await pageLC.waitForSelector(".flex.items-center.h-5", { visible: true });

    await pageLC.evaluate(function () {
            document.querySelectorAll(".flex.items-center.h-5")[2].click();
    })

    p= new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve();
        },5000)
    })

    await p;
    
   let hardQ= await pageLC.evaluate(function () {
        let hardQ = {};
        let allTrs = document.querySelectorAll("tbody tr");

        if (allTrs.length > 5) {
            for (let i = 2; i < 4; i++) {
                let allATags = allTrs[i].querySelectorAll("td a");
                let problemName = allATags[0].innerText;
                let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");;
                hardQ[problemName] = problemLink;
            }
        }
        else {
            for (let i = 2; i < allTrs.length; i++) {
                let allATags = allTrs.querySelectorAll("td a");
                let problemName = allATags[0].innerText;
                let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");
                hardQ[problemName] = problemLink;
            }
        }

        return hardQ;
    })

    questions["Hard Questions: "]=hardQ;
    console.log(questions);
}