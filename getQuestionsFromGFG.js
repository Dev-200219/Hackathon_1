async function getGFGQuestions(pageGFG, numQues, difficulty, check) {

    let p;
    
    if(difficulty==0)
    {
        await Promise.all([
            pageGFG.waitForNavigation(),
            pageGFG.click("[value='0']", { delay: 1000 })
        ])
        p= new Promise(function(resolve,reject){
            pageGFG.waitForSelector(".panel.problem-block div>span",{setTimeout:1000})
            .then(function(){
                resolve();
            })
            .catch(function(){
                return {"No Easy Questions Available":'\0'}
            })
        })

    }
    else if(difficulty==1)
    {
        if(check==true)
        await pageGFG.click("[value='0']", { delay: 1000 })
        
        await Promise.all([
            pageGFG.waitForNavigation(),
            pageGFG.click("[value='1']", { delay: 1000 })
        ])
        p= new Promise(function(resolve,reject){
            pageGFG.waitForSelector(".panel.problem-block div>span",{setTimeout:1000})
            .then(function(){
                resolve();
            })
            .catch(function(){
                return {"No Medium Questions Available":'\0'}
            })
        })
    }
    else if(difficulty==2)
    {   
        if(check==true)
        await pageGFG.click("[value='1']", { delay: 1000 })
        
        await Promise.all([
            pageGFG.waitForNavigation(),
            pageGFG.click("[value='2']", { delay: 1000 })
        ]) 
        p= new Promise(function(resolve,reject){
            pageGFG.waitForSelector(".panel.problem-block div>span",{setTimeout:1000})
            .then(function(){
                resolve();  
            })
            .catch(function(){
                resolve();
                return {"No Hard Questions Available":'\0'}
            })
        })

    }

    await p;
    
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

module.exports={
    "getQues":getGFGQuestions
}