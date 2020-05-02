const puppeteer = require('puppeteer');

const clsSpring2020 = "https://taylorcfse.qualtrics.com/jfe/form/SV_7ZBZX9cP1JT1Y1L";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(clsSpring2020);
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();
