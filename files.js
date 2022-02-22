let fs = require('fs');

function checkForFile(fileName,callback){
    fs.exists(fileName, function (exists) {
        if(exists){
            callback();
        }else{
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) { 
                callback();
            })
        }
    });
}