const fs = require('fs');
const puppeteer = require('puppeteer');
let questions = {}


async function pattern532(dsaTopic) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
        slowMo: 75
    });
    const page = await browser.newPage();
    await page.goto('https://practice.geeksforgeeks.org/explore/?page=1');
    await page.waitForSelector("div[href='#collapse4'] h4")
    // await page.click(".clearFilters")

    await page.evaluate(function () {
        document.querySelector("div[href='#collapse4'] h4").click();
        document.querySelector("#moreCategories").click();
    })

    // await page.click("#moreCategories");
    await page.waitForSelector("#searchCategories");
    await page.type("#searchCategories", dsaTopic)

    await page.click('[style="font-size: 12px; padding: 10px; display: block;"]',{delay:2000})
    await page.click("#selectCategoryModal",{delay:500})

    // await page.click(".modal-body button.close", { delay: 2000 })
    // await page.click("label[style='display: block;']", { delay: 1000 })
    // await page.click("label[style='display: block;']")
    // await page.click("label[style='display: block;']")  


    await page.click("div[href='#collapse1'] h4", { delay: 2000 });
    await Promise.all([
        page.waitForNavigation(),
        page.click("[value='0']", { delay: 2000 })
    ])



    let easyQ = await page.evaluate(function () {
        let easyQ = {};
        let problemName = document.querySelectorAll(".panel.problem-block div>span");
        let problemLink = document.querySelectorAll(".panel.problem-block a");

        for (let i = 0; i < 5; i++) {

            easyQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
        }

        return easyQ;
    })

    questions["Easy Questions: "] = easyQ;

    await page.click("[value='0']", { delay: 2000 })

    await Promise.all([
        page.waitForNavigation(),
        page.click("[value='1']", { delay: 2000 })
    ])

    await page.waitForSelector(".panel.problem-block div>span")

    let mediumQ = await page.evaluate(function () {
        let mediumQ = {};
        let problemName = document.querySelectorAll(".panel.problem-block div>span");
        let problemLink = document.querySelectorAll(".panel.problem-block a");

        for (let i = 0; i < 3; i++) {

            mediumQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
        }

        return mediumQ;
    })

    questions["Medium Questions: "] = mediumQ

    await page.click("[value='1']", { delay: 2000 })
    await Promise.all([
        page.waitForNavigation(),
        page.click("[value='2']", { delay: 2000 })
    ])

    await page.waitForSelector(".panel.problem-block div>span")

    let hardQ = await page.evaluate(function () {
        let hardQ = {};
        let problemName = document.querySelectorAll(".panel.problem-block div>span");
        let problemLink = document.querySelectorAll(".panel.problem-block a");

        for (let i = 0; i < 2; i++) {

            hardQ[problemName[i].innerText] = problemLink[i].getAttribute("href");
        }

        return hardQ;
    })

    questions["Hard Questions: "] = hardQ;

    let fileName= dsaTopic+" Questions.json";

    fs.writeFile(fileName, JSON.stringify(questions), function (err) {
        if (err)
        {
            console.log(err);
        }
        browser.close();
    })

}

pattern532("Graph");