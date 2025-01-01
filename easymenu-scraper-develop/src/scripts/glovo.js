import { glovoScraper } from "../src/utils/scraper/glovoScraper";

const link = "https://glovoapp.com/it/en/torino/girarrosti-santa-rita-tor";
await glovoScraper(link);

// const puppeteer = require("puppeteer");

// (async () => {
//   const url = "https://glovoapp.com/it/en/torino/girarrosti-santa-rita-tor/";
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   try {
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Wait for the content to load
//     await page.waitForSelector('[data-test-id="store-content"]');

//     // Scrape data
//     const data = await page.evaluate(() => {
//       const categories = [];

//       // Select all categories
//       document
//         .querySelectorAll('[data-test-id="list-title"]')
//         .forEach((categoryElement) => {
//           const categoryName = categoryElement.innerText.trim();

//           // Find products within the same category
//           const categoryContainer = categoryElement.closest(
//             '[data-test-id="store-content"]',
//           );
//           const products = [];

//           categoryContainer
//             .querySelectorAll('[data-test-id="product-row-content"]')
//             .forEach((productElement) => {
//               const name = productElement
//                 .querySelector('[data-test-id="product-row-name__highlighter"]')
//                 ?.innerText.trim();
//               const description = productElement
//                 .querySelector(
//                   '[data-test-id="product-row-description__highlighter"]',
//                 )
//                 ?.innerText.trim();
//               const price = productElement
//                 .querySelector('[data-test-id="product-price-effective"]')
//                 ?.innerText.trim();
//               const imageUrl =
//                 productElement.querySelector(
//                   '[data-test-id="product-image-formats"] img',
//                 )?.src || null;

//               if (name && price) {
//                 products.push({ name, description, price, imageUrl });
//               }
//             });

//           if (categoryName && products.length > 0) {
//             categories.push({ category: categoryName, products });
//           }
//         });

//       return categories;
//     });

//     console.log(JSON.stringify(data, null, 2));
//   } catch (error) {
//     console.error("Error scraping data:", error);
//   } finally {
//     await browser.close();
//   }
// })();
