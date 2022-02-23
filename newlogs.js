/*
  * author: Dennis Kibet
  * contact: https://denniskibet.com/contact
  * Email: dennis@denniskibet.com
  * Github: @DennisRono
  * Twitter: FinnNeron
  
*/
/*
 * ==WORKFLOW==
 * create a logs directory if it does'nt exist
 * Create dat file if it does'nt exist
 * create a log file if it does't exist (name starting with today's date)
 * write to the logfile
 * ==CONSTRAINTS==
 * one log file will be created on a week (containing that week's logs)
*/

'use strict';
const Format = require('json-format');
const fs = require('fs');

//root directory
const rootdir = __dirname

//get today's time
const getTime = () => {
    return new Date(Date.now()).toLocaleString("en-US", { timeZone: "Africa/Nairobi" });
}

//today's date
const todayDate = () => {
    const today = new Date();
    let todaydate = "log"+today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
    return todaydate
}

//generate unique id
const genId = () => {
    return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
}

//logs location
const logsLocation = rootdir+'/Logs/';
//filename
let filename = (todayDate()+"-"+genId()).replace("log", "")+".json";
//log data file
const datfile = rootdir+'/Logs/'+'logs.dat';

//formatter config
let config = {
    type: 'space',
    size: 2
}

//checks if a folder exists if it doesn't create it
const checkLogDir = (dirName, callback) => {
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName, function (err, data) {
            callback();
        });
    }  else {
        callback();
    }
}

//checks if the file exists if it doesn't create it
function checkForFile(fileName, callback){
    fileName = fileName.toString().replace(rootdir, "");
    //console.log(callback());
    fs.exists(fileName, function (exists) {
        if(exists){
            callback();
        }else{
            fs.writeFile("Logs/logs.dat", {flag: 'wx'}, '');
            callback();
        }
    });
}

//get last file
const getLastFile = () => {
    //check if log file exists
    checkForFile(datfile, () =>{
        let lastFileDate = (fs.readFileSync(datfile)).toString().split(/\r?\n/);
        if(lastFileDate[lastFileDate.length-2] === undefined){
            return "nolastfile";
        }else {
            return lastFileDate[lastFileDate.length-2].toString().substring(0,9);
        }
    });
}

//today checker
const DateFileChecker = () => {
    if(getLastFile() === "nolastfile" || getLastFile() !== todayDate().replace("log", "")){
        return true
    } else {
        return false
    }
}

//read the json file
const getLogs = () => {
    let lastFileName = (fs.readFileSync(datfile)).toString().split(/\r?\n/)
    if(lastFileName[lastFileName.length-2] === undefined){
        return {data: "", state: "Empty"}
    }else {
        var webProjects = JSON.parse(fs.readFileSync(logsLocation+lastFileName[lastFileName.length-2]));
        if(Object.entries(webProjects).length === 0){
            return {data: webProjects, state: "Empty"}
        } else{
            return {data: webProjects, state: "Not Empty"}
        }
    }
}

//write logs to file
const writingLogs = (newlogs) => {
  //check logs state
  let logs;
  if(getLogs().state === "Empty"){
      //add id to new logs
      const idlogs = Object.entries(newlogs);
      idlogs.unshift(["_id", genId()], ['Time', getTime()]);
      newlogs = Object.fromEntries(idlogs);
      let tod = todayDate();
      newlogs = '{"'+tod+'"'+' :['+JSON.stringify(newlogs)+']}';
      logs = JSON.parse(newlogs);
      let lastFileName = (fs.readFileSync(datfile)).toString().split(/\r?\n/)
      if(lastFileName[lastFileName.length-2] === undefined){
          return {data: "", state: "Empty"}
      }else {
          fs.writeFileSync(logsLocation+lastFileName[lastFileName.length-2], Format(logs, config));
      }
  }else{
      //get last key input from the json data
      var lastKey;
      for(var key in getLogs().data){
          if(getLogs().data.hasOwnProperty(key)){
              lastKey = key;
          }
      }
      if(lastKey === todayDate()){
          let cutlogs = JSON.stringify(getLogs().data).slice(0, JSON.stringify(getLogs().data).length-2);
          logs = cutlogs+','+JSON.stringify(newlogs)+']}';
          logs = JSON.parse(logs);
          let lastFileName = (fs.readFileSync(datfile)).toString().split(/\r?\n/)
          if(lastFileName[lastFileName.length-2] === undefined){
              return {data: "", state: "Empty"}
          }else {
              fs.writeFileSync(logsLocation+lastFileName[lastFileName.length-2], Format(logs, config));
          }
      }else{
          let cutlogs = JSON.stringify(getLogs().data).slice(0, JSON.stringify(getLogs().data).length-1);
          logs = cutlogs+',"'+todayDate()+'" :['+JSON.stringify(newlogs)+']}';
          logs = JSON.parse(logs);
          let lastFileName = (fs.readFileSync(datfile)).toString().split(/\r?\n/)
          if(lastFileName[lastFileName.length-2] === undefined){
              return {data: "", state: "Empty"}
          }else {
              fs.writeFileSync(logsLocation+lastFileName[lastFileName.length-2], Format(logs, config));
          }
      }
  }
}

//write to data file
const writeDat = (logfile, file) => {
    //get data in it
    var dat = fs.readFileSync(logfile);
    if(dat.length === 0){
        fs.appendFile(datfile, file+"\n", function (err) {
            if (err) throw err;
        });
    } else{
        fs.appendFile(datfile, file+"\n", function (err) {
            if (err) throw err;
        });
    }
}

//the logger start point
const logger = (newlogs) => {
    //check if logs dir exists and create it if it doesn't exist
    checkLogDir(rootdir+"/"+'Logs', ()=>{
        //check if log file exists and create it if it doesn't exist
        checkForFile(datfile, () =>{
            //create the logfile
            if(DateFileChecker()){
                checkForFile(rootdir+"/"+'Logs'+filename, () =>{
                    //write to the datfile and thelog file
                    writeDat(datfile, filename);
                    writingLogs(newlogs);
                });
            } else {
                writingLogs(newlogs);
            }
        });
    });
}

//calling the logger function
let newlogs =  {
    id: genId(),
    Status: 'nothing to commit, working tree clean',
    TimePushed: getTime()
}
logger(newlogs);
//module.exports = logger