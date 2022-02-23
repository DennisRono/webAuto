let fs = require('fs');

//checks if the file exists if it doesn't create it
function checkForFile(fileName, callback){
    fs.exists(fileName, function (exists) {
        if(exists){
            callback();
        }else{
            //fs.writeFileSync(fileName,  callback());
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) {
                return callback();
            })
        }
    });
}

checkForFile('Logs/logs.dat', ()=>{
    console.log("succ");
    return "hello";
})

module.exports = checkForFile