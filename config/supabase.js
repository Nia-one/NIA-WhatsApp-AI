require("dotenv").config();

console.log("✅ Supabase URL loaded");
console.log("✅ Service Role Key loaded");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;