const {Builder, By, Key, until} = require('selenium-webdriver');
require('dotenv').config();

const firefox = require('selenium-webdriver/firefox');
let options = new firefox.Options().setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');

(async function example() {
  let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
  try {
    await driver.get('https://twitter.com/login');
    //await driver.findElement(By.xpath(`//*[@id="rcc-confirm-button"]`)).click();
    await driver.findElement(By.className('r-30o5oe')).sendKeys(process.env.USERNAME);
    await driver.findElement(By.className('css-901oao')).click();
    //await driver.findElement(By.css('input[type="email"]')).sendKeys('selenium@selenium.com');
    //await driver.findElement(By.name('message')).sendKeys('holla trying out selenium automation');
    //await driver.findElement(By.css('input[type="submit"]')).click();
    //await driver.wait(until.titleIs('webdriver - Google Search'), 5000);
  } catch(err){
    console.log(err);
  }
})();