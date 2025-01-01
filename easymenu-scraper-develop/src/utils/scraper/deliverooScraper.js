import { getRealBrowserDeliveroo } from "./getRealBrowserDeliveroo";

const deliverooScraper = async (url) => {
  try {
    const scrapedResult = await getRealBrowserDeliveroo(url);
    const sanitizedResult = scrapedResult.props.initialState.menuPage.menu.meta;
    const sanitizedPhone =
      scrapedResult.props.initialState.menuPage.menu.layoutGroups[1].layouts[1]
        .blocks[0].actions[0].target.params;
    return { sanitizedResult, sanitizedPhone };
  } catch (error) {
    console.error("Error scraping data:", error);
    return { error: "Data scraping failed", details: error.message };
  }
};

export default deliverooScraper;
