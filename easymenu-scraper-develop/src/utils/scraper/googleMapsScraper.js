import { fileUrlToBase64 } from "./_scraperHelpers.js";
import { getBrowser } from "./getBrowser.js";

const debugBool = true;
const debug = {
  log: (...strings) => debugBool && console.log(strings.join(" ")),
};

async function waitForCoverImageLoad(page) {
  await page.waitForFunction(() => {
    const roleMain = document.querySelector('[role="main"]');
    return (
      roleMain &&
      roleMain.children[0]?.children[0]?.children[0]?.children[0]?.src
    );
  });
  const src = await page.evaluate(async () => {
    const parent = document.querySelector('[role="main"]');
    if (!parent) return null;

    const nestedElement =
      parent.children[0]?.children[0]?.children[0]?.children[0];
    if (!nestedElement) return null;

    return new Promise((resolve) => {
      if (nestedElement.complete && nestedElement.src) {
        resolve(nestedElement.src);
      } else {
        nestedElement.onload = () => resolve(nestedElement.src);
        nestedElement.onerror = () => resolve(null);
      }
    });
  });

  if (src) {
    console.log("Image source loaded:", src);
  } else {
    console.log("Image failed to load or was not found");
  }
}

async function clickOnCookieBanner(page) {
  const spans = await page.$$eval("span", (spanElements) => {
    return spanElements.map((span) => span.textContent.trim());
  });

  for (let i = 0; i < spans.length; i++) {
    if (spans[i] === "Rifiuta tutto" || spans[i] === "Alle ablehnen") {
      const span = await page.$$("span");
      await span[i].click();
      console.log("Clicked on:", spans[i]);
      await page.waitForSelector('[role="main"]');
      break;
    }
  }
}

async function getPageData(url, page) {
  await clickOnCookieBanner(page);
  await page.waitForSelector('[role="main"]');
  await page.waitForFunction(() => {
    const roleMain = document.querySelector('[role="main"]');
    return roleMain && roleMain.ariaLabel;
  });

  let returnObj = {};

  try {
    returnObj["name"] =
      (await page.$eval('[role="main"]', (element) =>
        element.getAttribute("aria-label")
      )) || "No shop name provided";

    returnObj["address"] =
      (await page.$eval('button[data-item-id="address"]', (element) =>
        element.innerText.replace(/^\s*./, "").replace(/\n/g, "")
      )) || "Delivery service (No address)";

    returnObj["website"] =
      (await page.$eval('[data-item-id="authority"]', (element) =>
        element.innerText.replace(/^\s*./, "").replace(/\n/g, "")
      )) || "No website provided";

    await waitForCoverImageLoad(page);
    const coverPhotoUrl =
      (await page.evaluate(() => {
        return document.querySelector('[role="main"]').children[0].children[0]
          .children[0]?.children[0]?.src;
      })) || "No coverPhoto provided";

    returnObj["coverPhoto"] = {
      coverPhotoUrl: coverPhotoUrl,
      coverPhotoBase64: await fileUrlToBase64(
        coverPhotoUrl,
        (error, base64) => {
          if (error) {
            console.error("Error:", error);
          } else {
            return base64;
          }
        }
      ),
    };

    const orderTooltipSelector = 'a[data-item-id="action:4"]';
    const orderLink = await page.$eval(orderTooltipSelector, (element) => {
      return {
        text: element.textContent.trim() || "No text available",
        url: element.href || "No URL available",
      };
    });
    returnObj["orderTooltip"] = orderLink;
  } catch (e) {
    console.log("Error while scraping data:", e);
  }

  console.log("====== THE DATA ======");
  console.log(returnObj);
  console.log("==== THE DATA END ====");
  return returnObj;
}

const googleMapsScraper = async (link) => {
  console.log(
    "ENV is:",
    JSON.stringify(process.env.NODE_ENV),
    process.platform
  );
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.goto(link);
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  const scrapedData = await getPageData(link, page);

  debug.log("Scrape complete!");
  await browser.close();

  return scrapedData;
};

export { googleMapsScraper };
