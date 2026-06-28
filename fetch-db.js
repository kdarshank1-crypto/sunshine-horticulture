const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchDb() {
  const { data, error } = await supabase.from("products").select("name");
  if (error) {
    console.error("Error fetching products:", error);
  } else {
    console.log(`Found ${data.length} products:`);
    console.log(data.map(p => p.name).join("\n"));
  }
}

fetchDb();
