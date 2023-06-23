import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await page.goto("https://www.bluemarlinbeachhotel.com/menus");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });
  await page.screenshot({ path: "food.png", fullPage: true });

  const content = await page.content();
  //   console.log(content);

  //   const docs = await page.$$eval("div.OQ8Tzd.TPASection_kb0nu9er > ul > li", (elements) =>
  //     elements.map((e) => ({
  //       title: e.querySelector("h3").innerText,
  //     }))
  //   );

  //   fs.writeFile("kokkosCafeBistro.json", JSON.stringify(docs), (err) => {
  //     if (err) throw err;
  //     console.log("File Saved");
  //   });

  const numPages = await page.evaluate(() => {
    const pages = document.querySelectorAll(
      "section.rich_smgM > div > ul > li"
    );
    return pages.length;
  });

  console.log("===>", numPages);

  // let docsss = await page.$$eval(".rich_smgM > div > ul > li", (elements) =>
  //   elements.map((e) => ({
  //     h3: e.querySelector("h3")?.innerText || null,
  //   }))
  // );
  // console.log("===>", docsss);
  //   for (const totalReviewPage of totalReviewPages) {
  //     await page.goto(totalReviewPage);
  //     let docsss = await page.$$eval("div", (elements) =>
  //       elements.map((e) => ({
  //         mealName: e.querySelector("h1")?.innerText || null,
  //         name: e.querySelector("h4")?.innerText || null,
  //         price: e.querySelector(".funky-menu-item-price")?.innerText || null,
  //         description:
  //           e.querySelector(".funky-menu-item-description")?.innerText || null,
  //       }))
  //     );

  //     allMeals.push(...docsss);

  //     fs.writeFile("havanaRestaurant.json", JSON.stringify(allMeals), (err) => {
  //       if (err) throw err;
  //       console.log("File Saved");
  //     });
  //   }

  await browser.close();
})();
