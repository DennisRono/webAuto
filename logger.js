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

//formatter config
let config = {
    type: 'space',
    size: 2
}