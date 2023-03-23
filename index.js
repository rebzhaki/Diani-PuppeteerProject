import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://developer.chrome.com/");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  //   await page.screenshot({ path: "image.png", fullPage: true });

  //   await page.pdf({ path: "example.pdf", format: "A4" });

  //   const html = await page.content();

  //   const title = await page.evaluate(() => document.title);
  //   const text = await page.evaluate(() => document.body.innerText);

  //   const links = await page.evaluate(() =>
  //     Array.from(document.querySelectorAll("a"), (e) => e.href)
  //   );

  //   const docs = await page.evaluate(() =>
  //     Array.from(document.querySelectorAll(".project-card"), (e) => ({
  //       title: e.querySelector("h3").innerText,
  //     }))
  //   );

  const docs = await page.$$eval(".project-card", (elements) =>
    elements.map((e) => ({
      title: e.querySelector("h3").innerText,
    }))
  );
  console.log(docs);
  fs.writeFile("docs.json", JSON.stringify(docs), (err) => {
    if (err) throw err;
    console.log("File Saved");
  });

  // Type into search box
  await page.type(".search-box__input", "automate beyond recorder");

  // Wait and click on first result
  const searchResultSelector = ".search-box__link";
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    "text/Customize and automate"
  );
  const fullTitle = await textSelector.evaluate((el) => el.textContent);

  // Print the full title
  //   console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})();
