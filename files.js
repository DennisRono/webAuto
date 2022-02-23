var LogWriter = require('log-writer');
const Format = require('json-format');
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
let logs =  {
    "id": "123",
    "Status": 'nothing to commit, working tree clean',
    "TimePushed": "hpoask"
};
var writer = new LogWriter(__dirname+'/Logs/'+filename+'-%s.log');
writer.write(Format(logs, config));
// writer.writeln('writeln');
writer.end();