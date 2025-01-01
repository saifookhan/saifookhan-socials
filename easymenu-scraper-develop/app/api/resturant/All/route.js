import supabase from "../../../../src/db/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .select("id, name");

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
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
