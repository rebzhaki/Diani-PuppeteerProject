import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await page.goto(
    "https://data.census.gov/table?t=Populations+and+People&g=050XX00US27139"
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });
  await page.setJavaScriptEnabled(true);
  await page.screenshot({ path: "food.png", fullPage: true });

  const content = await page.content();

  //   let docsss = await page.$$eval("div.aqua-screenreader-only", (elements) =>
  //     elements.map((e) => ({
  //       mealName: e.querySelector("span")?.innerText || null,
  //     }))
  //   );
  //   console.log("===>", docsss);

  //   let others = await page.$$eval(
  //     "div.aqua-flex > div > div > div > div > div:nth-child(3)",
  //     (elements) =>
  //       elements.map((e) => ({
  //         mealName: e.querySelector("div")?.innerText || null,
  //       }))
  //   );
  //   console.log("===>", others);

  //   let others2 = await page.$$eval(
  //     "div.aqua-flex > div > section > ul > li > div",
  //     (elements) =>
  //       elements.map((e) => ({
  //         mealName: e.querySelector("div.branchLabel")?.innerText || null,
  //       }))
  //   );
  //   console.log("===>", others2);

  let others3 = await page.$$eval(
    "div.DynamicLoader > div > div > div:nth-child(2) > div:nth-child(1) > div.ag-center-cols-clipper",
    (elements) =>
      elements.map((e) => ({
        // mealName: e.querySelector("div.branchLabel")?.innerText || null,
      }))
  );
  console.log("===>", others3);

  await browser.close();
})();
