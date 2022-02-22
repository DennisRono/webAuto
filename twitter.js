const {Builder, By, Key, until} = require('selenium-webdriver');
require('dotenv').config();

const firefox = require('selenium-webdriver/firefox');
let options = new firefox.Options().setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');

(async function Twitter() {
  let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  try {
    await driver.get('https://twitter.com/login');
    await driver.findElement(By.className('r-30o5oe')).sendKeys(process.env.USERNAME);
    await driver.findElement(By.className('css-901oao')).click();
  } catch(err){
    console.log(err);
  }
})();