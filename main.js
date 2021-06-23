#!/usr/bin/env node
const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

// console.log(fs.readFileSync("helpFile.txt")+"\n");


rl.question("Input your choice: \n", function (ans) {

    if (ans == 1) {
        require("./532PatternGFG_LC");
    }
    else if (ans == 2) {
        require("./nQuesFromGFG_LC");
    }
    else {
        require("./companyBasedGFG")
    }
})