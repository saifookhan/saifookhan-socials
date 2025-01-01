import { setTimeout } from "node:timers/promises";
import { getBrowser } from "./getBrowser";

const glovoScraper = async (url) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    console.log("Navigating to URL:", url);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await setTimeout(3000);

    await page.waitForSelector('[data-test-id="store-content"]');

    const storeInfo = await page.evaluate(() => {
      const logoElement = document.querySelector(".store-info__logo");
      const storeNameElement = document.querySelector(".store-info__title");
      const timestamp = new Date().toISOString();

      const storeLogoUrl = logoElement ? logoElement.src : "No logo available";
      const storeName = storeNameElement
        ? storeNameElement.innerText.trim()
        : "not found";

      return { storeLogoUrl, storeName, timestamp };
    });

    console.log("Store Info:", storeInfo);
    const data = await page.evaluate(() => {
      const categories = [];

      document
        .querySelectorAll('[data-test-id="list-title"]')
        .forEach((categoryElement) => {
          const categoryName = categoryElement?.innerText?.trim() || null;

          if (!categoryName) return;

          const categoryContainer = categoryElement.closest(
            '[data-test-id="store-content"]'
          );
          const products = [];

          if (categoryContainer) {
            categoryContainer
              .querySelectorAll('[data-test-id="product-row-content"]')
              .forEach((productElement) => {
                const name =
                  productElement
                    .querySelector(
                      '[data-test-id="product-row-name__highlighter"]'
                    )
                    ?.innerText?.trim() || null;
                const description =
                  productElement
                    .querySelector(
                      '[data-test-id="product-row-description__highlighter"]'
                    )
                    ?.innerText?.trim() || null;
                const price =
                  productElement
                    .querySelector('[data-test-id="product-price-effective"]')
                    ?.innerText?.trim() || null;
                const imageUrl =
                  productElement
                    .querySelector(
                      '[data-test-id="product-image-formats"] source'
                    )
                    ?.srcset?.split(",")[0]
                    ?.trim() || null;

                if (name && price) {
                  products.push({ name, description, price, imageUrl });
                }
              });
          }

          if (products.length > 0) {
            categories.push({ category: categoryName, products });
          }
        });

      return categories;
    });

    const result = {
      storeLogoUrl: storeInfo.storeLogoUrl,
      storeName: storeInfo.storeName,
      timeStamps: storeInfo.timestamp,
      categories: data.length > 0 ? data : "No categories found",
    };

    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error scraping data:", error);
    return { error: "Data scraping failed", details: error.message };
  } finally {
    await browser.close();
  }
};

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
export { glovoScraper };
