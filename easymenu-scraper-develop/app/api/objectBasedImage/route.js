import { imageQueue } from "./helpers/queue";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter 'q' is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
      const jsonQuery = JSON.parse(query);
      jsonQuery.map(
        (category)=>{
          category.items.map(
            async(item)=>{
              console.log("malaki",item.name);
             await imageQueue.add("generateImage",{
                name:item.name,
                description:item.description
              })
            }
          )
        }
      )
      console.log(jsonQuery)

    return new Response(
      JSON.stringify({ message: "Job added to the queue successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error adding job to the queue:", err);
    return new Response(
      JSON.stringify({ error: "Failed to add job to the queue", details: err }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
