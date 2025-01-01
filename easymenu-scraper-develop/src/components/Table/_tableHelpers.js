import supabase from "../../db/supabase";

function getMenuStats(menu) {
  if (!menu) {
    return {
      totalCategories: 0,
      totalItems: 0,
    };
  }
  const totalCategories = menu.length;
  const totalItems = menu.reduce(
    (acc, category) => acc + category.items.length,
    0
  );

  return {
    totalCategories,
    totalItems,
  };
}

async function generateProductImagesByResturantId(id) {

  const { data, error } = await supabase.from("restaurants").select("*").eq("id",id);

  if(error){
    return {
      stats:500,
      message:"failed to fetch data from database"
    }
  }

  if(data){
    const arrayData = data[0].external_menuJson;
    console.log("before iteration")
    if (arrayData) {
      data = await fetch(
        `http://localhost:3000/api/objectBasedImage?q=${JSON.stringify(
          arrayData
        )}`
      );
    }
  }

  // TODO:: Aashir - Redis task
  // Read: https://chatgpt.com/share/676e4a3b-025c-8008-b89a-d8cd559d8b2f
  // chatgpt prompt: I have to generate 100 images using chatgpt api but chatgpt has an api request limit. What about some queue system since my application is hosted on vercel. use bullmq
  // It will give a solution with bullmq ioredis
  // You will need redis url REDIS_URL="redis://default:rVsBrZ8esL9Dh6i4RsXm8WG5qCucE61t@redis-15657.c72.eu-west-1-2.ec2.redns.redis-cloud.com:15657"

  // What you have to do it keep adding "jobs" to the redis database.
  // Redis is a like a temporary database.

  // Use the redis insight software or use Redis Commander to view the database.

  // Good luck!

}

export { getMenuStats, generateProductImagesByResturantId };
