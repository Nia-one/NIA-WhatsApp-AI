require("dotenv").config();

console.log("URL:", process.env.SUPABASE_URL);
console.log("SERVICE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;