import { setTimeout } from "node:timers/promises";
import { getBrowser } from "./getBrowser";

const glovoScraperCmd = async (url) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    console.log("Navigating to URL:", url);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await setTimeout(3000);

    const result = await page.evaluate(() => {
      return window.__NUXT__;
    });

    return result;
  } catch (error) {
    console.error("Error scraping data:", error);
    return { error: "Data scraping failed", details: error.message };
  } finally {
    await browser.close();
  }
};

export default glovoScraperCmd;

// Example of how to call the scraper with a URL
// const url = "https://glovoapp.com/it/en/torino/girarrosti-santa-rita-tor/";
// glovoScraper(url)
//   .then((data) => {
//     console.log("Scraped Data:", data);
//   })
//   .catch((error) => {
//     console.error("Error during scraping:", error);
//   });

// Export the scraper function
export { glovoScraperCmd };
