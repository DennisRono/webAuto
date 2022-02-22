let fs = require('fs');

let lastFile = (fs.readFileSync('logs.dat')).toString().split(/\r?\n/);
lastFile = lastFile[lastFile.length-2].substring(0,9);
if(lastFile === ""){
    console.log("empty");
}else{
    console.log(lastFile);
}