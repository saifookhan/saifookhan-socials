import { fetchFromExternalUrlAndStoreInDb } from "../../utils/scraper/_scraperHelpers";


async function fetchBulkDataAndProcess(url) {
  console.log("inside url", url);
  const array = url.split(",");

  const results = await Promise.all(
    array.map(async (item) => {
      try {
        const result = await fetchFromExternalUrlAndStoreInDb(item.trim());
        return {
          url: item.trim(),
          status: !!result, 
        };
      } catch (error) {
        console.error("Error fetching or processing external data:", error);
        return {
          url: item.trim(),
          status: false,
        };
      }
    })
  );

  console.log(results);
  return results;
}



export { fetchBulkDataAndProcess };
