export const maxDuration = 60;
export const dynamic = "force-dynamic";
// /api/scraper/justeat?url=https%3A%2F%2Fwww.justeat.it%2Frestaurants-burrito-bar---bologna-bologna%2Fmenu

import { justEatScraper } from "../../../../src/utils/scraper/justEatScraper";

export async function GET(request) {
  // Get the URL object from the request
  if (!request || !request.url) {
    throw new Error("Request object or URL is undefined");
  }
  const { searchParams } = new URL(request?.url);

  // Extract the `justeat` parameter
  const justeat = searchParams.get("url");

  const val = await justEatScraper(justeat);

  // Return a JSON response
  return new Response(
    JSON.stringify({
      message: val,
      scrapedUrl: justeat || "No link provided", // Fallback if no parameter is given
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
