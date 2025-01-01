export const maxDuration = 60;
export const dynamic = "force-dynamic";

// /api/scraper/glovo?url=https://glovoapp.com/it/en/torino/girarrosti-santa-rita-tor/
import { glovoScraperCmd } from "../../../../src/utils/scraper/glovoScraperCmd";

export async function GET(request) {
  // Get the URL object from the request
  const { searchParams } = new URL(request.url);

  // Extract the `glovo` parameter
  const glovoUrlUsed = searchParams.get("url");

  const val = await glovoScraperCmd(glovoUrlUsed);

  // Return a JSON response
  return new Response(
    JSON.stringify({
      message: val,
      scrapedUrl: glovoUrlUsed || "No link provided", // Fallback if no parameter is given
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
