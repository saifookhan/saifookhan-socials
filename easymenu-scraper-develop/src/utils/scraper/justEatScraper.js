import { getBrowser } from "../../../src/utils/scraper/getBrowser";

const justEatScraper = async (url) => {
  const browser = await getBrowser();

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    // Handle the first popup (e.g., cookie consent)
    const cookiePopupSelector = 'button[aria-label="Accetta tutti i cookie"]';
    if (await page.$(cookiePopupSelector)) {
      await page.click(cookiePopupSelector);
      console.log("Closed cookie consent popup.");
    }

    // Handle the second popup (e.g., location or additional modal)
    const secondPopupSelector = 'button[aria-label="Chiudi"]';
    if (await page.$(secondPopupSelector)) {
      await page.click(secondPopupSelector);
      console.log("Closed second popup.");
    }

    // Wait for the menu categories to load
    await page.waitForSelector('[data-qa="item-category"]', { timeout: 60000 });

    // Extract categories and their items
    const menuData = await page.evaluate(async () => {
      // let scrollPosition = 0;
      const totalScrollHeight = document.body.scrollHeight;
      const scrollStep = totalScrollHeight / 50; // Divide into 50 steps
      const scrollInterval = 5000 / 50; // Total 5 seconds / 50 steps = 100ms per step

      for (
        let currentScroll = 0;
        currentScroll < totalScrollHeight;
        currentScroll += scrollStep
      ) {
        window.scrollBy(0, scrollStep);
        await new Promise((resolve) => setTimeout(resolve, scrollInterval));
      }

      const categories = [];
      document
        .querySelectorAll('[data-qa="item-category"]')
        .forEach((categoryEl) => {
          const categoryName =
            categoryEl.querySelector("h2")?.innerText || "Unknown Category";
          const products = [];

          categoryEl
            .querySelectorAll('[data-qa="item-element"]')
            .forEach((productEl) => {
              const productName =
                productEl.querySelector('[data-qa="heading"]')?.innerText ||
                "Unknown Product";
              const productDescription =
                productEl.querySelector(
                  '[class*="item-description"] div[data-qa="text"]'
                )?.innerText || "description not found";
              const productPrice =
                productEl.querySelector('[data-qa="text"] span')?.innerText ||
                "Price not available";

              products.push({
                name: productName,
                description: productDescription,
                price: productPrice,
              });
            });

          categories.push({ name: categoryName, products });
        });

      return categories;
    });

    console.log(JSON.stringify(menuData, null, 2));
    return menuData; // Return the scraped data
  } catch (error) {
    console.error("Error:", error);
    await page.screenshot({ path: "error-screenshot.png" }); // Capture the page state if an error occurs
  } finally {
    await browser.close();
  }
};

// Example of how to call the scraper with a URL
// const url = "https://www.justeat.it/restaurants-burrito-bar---bologna-bologna/menu";
// scraper(url)
//   .then((data) => {
//     console.log("Scraped Data:", data);
//   })
//   .catch((error) => {
//     console.error("Error during scraping:", error);
//   });

// Export the scraper function
export { justEatScraper };
