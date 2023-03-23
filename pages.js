import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.booking.com/searchresults.html?ss=diani");

  await page.setViewport({ width: 1080, height: 1024 });

  await page.setJavaScriptEnabled(true);

  await page.screenshot({ path: "results1.png", fullPage: true });

  // Get the total number of pages
  const numPages = await page.evaluate(() => {
    const pages = document.querySelectorAll("div.eef2c3ca89 > ol > li");
    return pages.length;
  });

  console.log(`Scraping ${numPages} pages...`);

  const data = [];
  const mainData = [];
  const final = [];

  const pages = await page.$$("div.eef2c3ca89 > ol > li ");
  console.log("pagesss", pages.length);

  for (let j = 0; j < pages.length; j++) {
    const liElement = pages[j + 1];
    const button = await liElement?.$("button");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    if (j < pages.length - 1) {
      await Promise.all([button.click(), page.waitForNavigation()]);
    }
    console.log(`Clicked button inside ${j} li element`);

    await page.waitForSelector(
      "div.eef2c3ca89 > ol > li:nth-child(" + (j + 1) + ")",
      { timeout: 10000 }
    );

    let moreData = await page.$$eval(
      ".a826ba81c4.fe821aea6c.fa2f36ad22.afd256fc79.d08f526e0d.ed11e24d01.ef9845d4b3.da89aeb942",
      (elements) =>
        elements.map((e) => ({
          title: e.querySelector(".fcab3ed991.a23c043802")?.innerText,
          distanceFromCenter: e.querySelector(
            "div.a1fbd102d9 > span > span > span"
          )?.innerText,
          distancefrombeach: e.querySelector(".a196e30dac")?.innerText,
          description: e.querySelector(".d8eab2cf7f")?.innerText,
        }))
    );
    mainData.push(...moreData);

    fs.writeFile("HotelNames.json", JSON.stringify(mainData), (err) => {
      if (err) throw err;
      console.log("File Saved");
    });
  }

  await browser.close();
})();
