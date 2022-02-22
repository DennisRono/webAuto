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
  var webProjects = JSON.parse(fs.readFileSync(filename));
  if(Object.entries(webProjects).length === 0){
      return {data: webProjects, state: "Empty"}
  } else{
      return {data: webProjects, state: "Not Empty"}
  }
}
//write logs to file
const writingLogs = (newlogs) => {
  //check logs state
  let logs;
  if(getLogs().state === "Empty"){
      //add id to new logs
      const idlogs = Object.entries(newlogs);
      idlogs.push(["_id", genId()]);
      idlogs.push(['Time', getTime()]);
      console.log(idlogs);
      newlogs = Object.fromEntries(idlogs);
      let tod = todayDate();
      newlogs = '{"'+tod+'"'+' :['+JSON.stringify(newlogs)+']}';
      logs = JSON.parse(newlogs);
      fs.writeFileSync(filename, Format(logs, config));
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
          fs.writeFileSync(filename, Format(logs, config));
      }else{
          let cutlogs = JSON.stringify(getLogs().data).slice(0, JSON.stringify(getLogs().data).length-1);
          logs = cutlogs+',"'+todayDate()+'" :['+JSON.stringify(newlogs)+']}';
          logs = JSON.parse(logs);
          fs.writeFileSync(filename, Format(logs, config));
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
            console.log('Created file: '+filename);
            fs.writeFileSync(filename, Format({}, config));
            //add logfile to gitignore
            fs.appendFile('.gitignore', '\n# Cron logs \n'+filename+'\n', function (err) {
              if (err) throw err;
            });
            writingLogs(newlogs);
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