export const maxDuration = 60;
export const dynamic = "force-dynamic";
// /api/scraper/googleMaps?url=https://maps.app.goo.gl/fYQaKTbqZvCG2QMv9

import { googleMapsScraper } from "../../../../src/utils/scraper/googleMapsScraper";

export async function GET(request) {
  // Get the URL object from the request
  const { searchParams } = new URL(request.url);

  // Extract the `googleMapsLink` parameter
  const googleMapsLink = searchParams.get("url");

  const val = await googleMapsScraper(googleMapsLink);
  console.log(val);

  // Return a JSON response
  return new Response(
    JSON.stringify({
      message: val,
      googleMapsLink: googleMapsLink || "No link provided", // Fallback if no parameter is given
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
