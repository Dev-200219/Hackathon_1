const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

console.log(fs.readFileSync("helpFile.txt")+"\n");


rl.question("Input your choice: \n", function (choice) {

    if (choice == 1) {
        require("./532PatternGFG_LC");
    }
    else if (choice == 2) {
        require("./nQuesFromGFG_LC");
    }
    else if(choice==3) {
        require("./companyBasedGFG")
    }
    else
    console.log("Invalid Choice!!!!");
})
