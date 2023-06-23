import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);

  await page.goto("https://worldfranchisecentre.com");

  await page.setViewport({ width: 1080, height: 1024 });

  await page.setJavaScriptEnabled(true);

  await page.screenshot({ path: "results1.png", fullPage: true });
  let mainReview = [];

  //   await page.waitForSelector("div.grid-category__card");

  let main = await page.$$eval(".grid-category__image", (elements) => {
    const maxLinks2 = 7;
    const hrefs = [];

    for (let i = 0; i < elements.length; i++) {
      const href = elements[i].href;
      hrefs.push(href);

      if (hrefs.length >= maxLinks2) {
        break;
      }
    }

    return hrefs;
  });
  console.log("main", main);

  console.log("items", main[0]);
  const newPage2 = await browser.newPage();
  await newPage2.setDefaultNavigationTimeout(0);
  await newPage2.goto(main[0]);

  let selections = await newPage2.$$eval(
    ".grid-category__card a:nth-child(1)",
    (elements) =>
      elements
        .map((e) => ({
          reviews: e.href,
        }))
        .map((review) => review.reviews)
  );

  let allReviews = [];
  let reviewPages = [];
  var num = 0;
  for (const selection of selections) {
    console.log("arrray", selection);

    const newPage = await browser.newPage();
    await newPage.setDefaultNavigationTimeout(0);
    await newPage.goto(selection);

    let selectiveLinks = await newPage.$$eval(
      "div.grid-product__wrap-inner",
      (elements) => {
        const hrefs = [];

        for (let i = 0; i < elements.length; i++) {
          const href = elements[i].querySelector(".grid-product__image").href;
          hrefs.push(href);
        }

        return hrefs;
      }
    );

    reviewPages.push(...selectiveLinks);
    console.log("===>", reviewPages);

    num++;
    console.log("index", num);
    // if (num === 2) {
    //   break;
    // }

    // console.log("==>", allReviews);
    for (const totalReviewPage of reviewPages) {
      await newPage.goto(totalReviewPage);

      let franchiseeName = await newPage.$$eval(
        "div.product-details__sidebar > h1",
        (elements) => elements.map((e) => e.textContent)
      );

      let sectors = await newPage.$$eval(
        "div.product-details__product-sku.ec-text-muted",
        (elements) => elements.map((e) => e.textContent)
      );

      const fontSize = "18px";
      let description = await newPage.$$eval(
        `div.product-details__product-description > div > p > span[style="font-size: ${fontSize};"]`,
        (elements) => elements.map((e) => e.textContent)
      );

      let docsss = await newPage.$$eval(
        "div.details-gallery__thumb-img-wrapper > div:nth-child(1)",
        (elements) =>
          elements.map(
            (e) =>
              (reviews = getComputedStyle(
                e.querySelector("a.details-gallery__thumb-img")
              ).backgroundImage.match(/url\("(.+?)"\)/)[1])
          )
      );

      //   console.log("aaa", { about: description[1] });
      allReviews.push({
        name: franchiseeName[0],
        tagLine: "",
        sector: sectors[0],
        profilePhoto: docsss[0],
        is_active: "true",
        slug: franchiseeName[0].replace(/\s+/g, "-").toLowerCase(),
        about: description[1],
        website: "",
        location: "",
        franchiseFee: "",
        royaltyFee: "",
        investmentAmount: "",
        capexSchedule: "",
        pnl: "",
        tradeMark: "Demo TradeM",
        terms: "Test terms",
      });

      fs.writeFile(
        "Food-Hospitality.json",
        JSON.stringify(allReviews),
        (err) => {
          if (err) throw err;
          console.log("File Saved");
        }
      );
    }

    await newPage.screenshot({ path: "link.png", fullPage: true });
    await newPage.close();
  }
  await newPage2.close();
  await browser.close();
})();
