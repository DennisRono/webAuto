const Format = require('json-format');
let fs = require('fs');

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

//filename
let filename = (todayDate()+"-"+genId()).replace("log", "")+".json";

//formatter config
let config = {
    type: 'space',
    size: 2
}

//logger
function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fs.accessSync(filepath, fs.constants.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
}
//read the json file
const getLogs = () => {
    let lastFileName = (fs.readFileSync('logs.dat')).toString().split(/\r?\n/)
    if(lastFileName[lastFileName.length-2] === undefined){
        return {data: "", state: "Empty"}
    }else {
        var webProjects = JSON.parse(fs.readFileSync(lastFileName[lastFileName.length-2]));
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
      let lastFileName = (fs.readFileSync('logs.dat')).toString().split(/\r?\n/)
      if(lastFileName[lastFileName.length-2] === undefined){
          return {data: "", state: "Empty"}
      }else {
          fs.writeFileSync(lastFileName[lastFileName.length-2], Format(logs, config));
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
          let lastFileName = (fs.readFileSync('logs.dat')).toString().split(/\r?\n/)
          if(lastFileName[lastFileName.length-2] === undefined){
              return {data: "", state: "Empty"}
          }else {
              fs.writeFileSync(lastFileName[lastFileName.length-2], Format(logs, config));
          }
      }else{
          let cutlogs = JSON.stringify(getLogs().data).slice(0, JSON.stringify(getLogs().data).length-1);
          logs = cutlogs+',"'+todayDate()+'" :['+JSON.stringify(newlogs)+']}';
          logs = JSON.parse(logs);
          let lastFileName = (fs.readFileSync('logs.dat')).toString().split(/\r?\n/)
          if(lastFileName[lastFileName.length-2] === undefined){
              return {data: "", state: "Empty"}
          }else {
              fs.writeFileSync(lastFileName[lastFileName.length-2], Format(logs, config));
          }
      }
  }
}
//write to data file
const writeDat = () => {
    //get data in it
    var dat = fs.readFileSync('logs.dat');
    if(dat.length === 0){
        //...
        fs.appendFile('logs.dat', filename+"\n", function (err) {
            if (err) throw err;
        });
    } else{
        //...
        fs.appendFile('logs.dat', filename+"\n", function (err) {
            if (err) throw err;
        });
    }
}
//create data file to save log files created
const logPolice = () => {
    //check if log file exists
  if(!checkFileExistsSync('logs.dat')){
    fs.open('logs.dat', 'w', function (err) {
        if (err){
            throw err;
        } else {
            console.log('Created file: logs.dat');
            fs.writeFileSync('logs.dat', '');
            //add logfile to gitignore
            fs.appendFile('.gitignore', '\n# Cron logs \nlogs.dat\n', function (err) {
            if (err) throw err;
            });
            writeDat();
        }
    });
  }else{
    writeDat();
  }
}
//get last file
const getLastFile = () => {
        //check if log file exists
  if(!checkFileExistsSync('logs.dat')){
    fs.open('logs.dat', 'w', function (err) {
        if (err){
            throw err;
        } else {
            console.log('Created file: logs.dat');
            fs.writeFileSync('logs.dat', '');
            //add logfile to gitignore
            fs.appendFile('.gitignore', '\n# Cron logs \nlogs.dat\n', function (err) {
            if (err) throw err;
            });
            return "nolastfile";
        }
    });
  }else{
    let lastFileDate = (fs.readFileSync('logs.dat')).toString().split(/\r?\n/);
    if(lastFileDate[lastFileDate.length-2] === undefined){
        return "nolastfile";
    }else {
        return lastFileDate[lastFileDate.length-2].toString().substring(0,9);
    }
  }
}
const logger = (newlogs) => {
  //check if log file exists
  if(!checkFileExistsSync(filename)){
    fs.open(filename, 'w', function (err) {
        if (err){
            throw err;
        } else {
            logPolice();
            console.log(getLastFile() === "nolastfile" || getLastFile() !== todayDate().replace("log", ""));
            if(getLastFile() === "nolastfile" || getLastFile() !== todayDate().replace("log", "")){
                console.log('Created file: '+filename);
                fs.writeFileSync(filename, Format({}, config));
                //add logfile to gitignore
                fs.appendFile('.gitignore', '\n# Cron logs \n'+filename+'\n', function (err) {
                if (err) throw err;
                });
                writingLogs(newlogs);
            }
        }
    });
  }else{
    writingLogs(newlogs);
  }
}

let newlogs =  {
    id: genId(),
    Status: 'nothing to commit, working tree clean',
    TimePushed: getTime()
}
logger(newlogs);
//module.exports = logger