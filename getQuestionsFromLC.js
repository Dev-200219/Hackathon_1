async function getLCQuestions(pageLC, difficulty, numQues) {

await pageLC.evaluate(function () {
document.querySelectorAll(".relative div>button[type='button'][aria-haspopup='true']")[1].click();
})
await pageLC.waitForSelector(".flex.items-center.h-5", { visible: true });
await pageLC.evaluate(function (difficulty) {
    document.querySelectorAll(".flex.items-center.h-5")[difficulty].click();
}, difficulty)

let p = new Promise(function (resolve, reject) {
setTimeout(function () {
    resolve();
}, 5000)
})

await p;
return await pageLC.evaluate(function (numQues) {
let ques = {};
let allTrs = document.querySelectorAll("tbody tr");

if (allTrs.length >= numQues) 
{  
    for (let i = 2; i < numQues+2; i++) {
    let allATags = allTrs[i].querySelectorAll("td a");
    let problemName = allATags[0].innerText;
    let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");
    ques[problemName] = problemLink;
    }
}
else {
    for (let i = 2; i < allTrs.length; i++) {
    let allATags = allTrs[i].querySelectorAll("td a");
    let problemName = allATags[0].innerText;
    let problemLink = "https://leetcode.com" + allATags[0].getAttribute("href");
    ques[problemName] = problemLink;
    }
}
return ques;
}, numQues)
}

module.exports={"getQues":getLCQuestions}