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

    await page.click("div[href='#collapse4'] h4", { delay: 2000 })
    
    await page.click("#moreCategories", { delay: 2000 })
    
    await page.waitForSelector("#searchCategories");
    
    await page.type("#searchCategories", dsaTopic)
    
    await page.click('[style="font-size: 12px; padding: 10px; display: block;"]', { delay: 2000 })
}

pattern532("Recursion");