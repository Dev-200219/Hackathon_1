const readline= require("readline");
const rl= readline.createInterface({
   input: process.stdin,
    output: process.stdout,
    terminal:false
})


rl.question("Input your choice: \n",function(ans){
    
    if(ans==1)
    {   
        require("./companyBasedGFG")
    }
    else if(ans==2)
    {
        require("./532PatternGFG_LC");
    }
    else
    {
        require("./nQuesFromGFG_LC");
    }
})