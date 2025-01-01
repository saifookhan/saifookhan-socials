import supabase from "../../../src/db/supabase";
import { transformData } from "./_resturantHelpers";

// Named export for the GET method
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Restaurant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Pass `data` to the transformData function
    const newData = transformData(data);

    return new Response(JSON.stringify(newData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Function to extract image URLs from url("...") formatted strings
// function extractImageUrls(urlString) {
//   if (!urlString) return [];
//   return urlString
//     .match(/url\("([^"]+)"\)/g) // Match each `url("...")` part
//     ?.map((url) => url.replace(/url\("([^"]+)"\)/, '$1')) || []; // Extract the actual URL
// }
