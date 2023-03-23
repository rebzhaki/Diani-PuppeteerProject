import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);
  // await page.goto("https://www.booking.com/index.en-gb.html");
  // const searchData = await page.$(".ce45093752");
  // await searchData.type("Malindi Beach, Kenya");

  // await page.screenshot({ path: "search.png", fullPage: true });
  // await searchData.press("Enter");

  // await page.screenshot({ path: "clicked.png", fullPage: true });
  // await page.waitForNavigation({ delay: 100000 });

  // await page.waitForSelector(".efdb2b543b", {
  //   waitUntil: "load",
  //   timeout: 0,
  // });

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

  let otherData = [];

  let mainReview = [];

  /////////////////////////////////////////////////

  //access links of all hotels

  // const links = await page.evaluate(() => {
  //   const linkElements = document.querySelectorAll(".e13098a59f");
  //   const linkArray = Array.from(linkElements);
  //   return linkArray.map((link) => link.href);
  // });

  // Open each link in a new tab and click on reviews

  // for (const link of links) {
  //   const newPage = await browser.newPage();
  //   await newPage.setDefaultNavigationTimeout(0);
  //   await newPage.goto(link);
  //   await newPage.click(".d8eab2cf7f.c90c0a70d3.db63693c62");

  //access all links of the review navigation tab
  // await newPage.waitForSelector(".bui-pagination__link");
  // const totalReviewPages = await newPage.$$eval(
  //   ".bui-pagination__link",
  //   (links) => links.map((link) => link.href)
  // );

  // console.log("=====> links", totalReviewPages);

  //first two indexes are null for all links so start on 2nd index
  // const startIdx = 2;
  // let allReviews = [];
  // for (const totalReviewPage of totalReviewPages.slice(startIdx)) {
  //   await newPage.goto(totalReviewPage);
  //   let docs = await newPage.$$eval(
  //     ".bui-grid__column-9.c-review-block__right",
  //     (elements) =>
  //       elements.map((e) => ({
  //         review: e.querySelector("h3").innerText,
  //         rating: e.querySelector(
  //           "div.bui-grid__column-1.bui-u-text-right > div > div"
  //         ).innerText,
  //       }))
  //   );

  // allReviews.push(docs);
  // return allReviews;
  //console.log("aaa", docs);
  // }
  // console.log("aaa", allReviews);

  //   await newPage.screenshot({ path: "link.png", fullPage: true });
  //   await newPage.close();
  // }

  ////////////////////////////////////////////////

  const pages = await page.$$("div.eef2c3ca89 > ol > li ");
  console.log("pagesss", pages.length);

  for (let j = 0; j < pages.length; j++) {
    const liElement = pages[j + 1];
    const button = await liElement?.$("button");
    await new Promise((resolve) => setTimeout(resolve, 50000));

    if (j < pages.length - 1) {
      await Promise.all([button.click(), page.waitForNavigation()]);
    }
    console.log(`Clicked button inside ${j} li element`);

    await page.waitForSelector(
      "div.eef2c3ca89 > ol > li:nth-child(" + (j + 1) + ")",
      { timeout: 10000 }
    );

    // let moreData = await page.$$eval(
    //   ".a826ba81c4.fe821aea6c.fa2f36ad22.afd256fc79.d08f526e0d.ed11e24d01.ef9845d4b3.da89aeb942",
    //   (elements) =>
    //     elements
    //       .map((e) => ({
    //         title: e.querySelector(".fcab3ed991.a23c043802").innerText,
    //         distanceFromCenter: e.querySelector(
    //           "div.a1fbd102d9 > span > span > span"
    //         ).innerText,
    //         distancefrombeach: e.querySelector(".a196e30dac").innerText,
    //         description: e.querySelector(".d8eab2cf7f").innerText,
    //       }))
    //       .map((review) => review.reviews)
    // );
    // otherData.push(moreData);

    let docs = await page.$$eval(
      ".a826ba81c4.fe821aea6c.fa2f36ad22.afd256fc79.d08f526e0d.ed11e24d01.ef9845d4b3.da89aeb942",
      (elements) =>
        elements
          .map((e) => ({
            reviews: (reviews = e.querySelector(".e13098a59f").href),
          }))
          .map((review) => review.reviews)
    );

    for (const doc of docs) {
      console.log("arrray", doc);
      let allReviews = [];
      const newPage = await browser.newPage();
      await newPage.setDefaultNavigationTimeout(0);
      await newPage.goto(doc);
      // await newPage.click(".d8eab2cf7f.c90c0a70d3.db63693c62");

      const elementExists = await newPage.$(
        ".d8eab2cf7f.c90c0a70d3.db63693c62"
      );
      if (elementExists) {
        await elementExists.click();
      } else {
        console.log("Element not found, continuing with the rest of the code.");
        // await newPage.close();
        await newPage.setDefaultNavigationTimeout(0);
        await newPage.goto(doc);
      }

      await newPage.waitForSelector(".bui-pagination__link")?.catch(() => {});
      const totalReviewPages = await newPage.$$eval(
        ".bui-pagination__link",
        (links) => links.map((link) => link.href)
      );

      // console.log("=====> links", totalReviewPages);
      const startIdx = 2;
      for (const totalReviewPage of totalReviewPages.slice(startIdx)) {
        await newPage.goto(totalReviewPage);
        let docsss = await newPage.$$eval(
          ".bui-grid__column-9.c-review-block__right",
          (elements) =>
            elements.map((e) => ({
              review: e.querySelector("h3")?.innerText || null,
              rating:
                e.querySelector(
                  "div.bui-grid__column-1.bui-u-text-right > div > div"
                )?.innerText || null,
            }))
        );

        // console.log("aaa", docsss);
        allReviews.push(...docsss);

        fs.writeFile("firstReview.json", JSON.stringify(allReviews), (err) => {
          if (err) throw err;
          console.log("File Saved");
        });
      }

      mainReview.push(doc, allReviews);

      fs.writeFile("HotelReviews.json", JSON.stringify(mainReview), (err) => {
        if (err) throw err;
        console.log("File Saved");
      });

      await newPage.screenshot({ path: "link.png", fullPage: true });
      await newPage.close();
    }
  }

  fs.writeFile("bookings.json", JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log("File Saved");
  });

  // console.log("aaa", data);

  await page.screenshot({ path: "pagessss.png", fullPage: true });

  await page.screenshot({ path: "results.png", fullPage: true });

  await browser.close();
})();
