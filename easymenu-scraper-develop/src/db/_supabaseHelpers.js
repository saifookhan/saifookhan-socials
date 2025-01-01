import supabase from "./supabase";

async function insertDataInSupabaseTable(table, data) {
  const { error } = await supabase.from(table).insert(data);

  if (error) {
    console.error("Error inserting data:", error);
    return false;
  }

  return true;
}

export { insertDataInSupabaseTable };
