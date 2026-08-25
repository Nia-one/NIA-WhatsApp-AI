const supabase = require("../config/supabase");

function normalizeMobile(value) {
    return String(value || "").replace(/\D/g, "").slice(-10);
}

async function findRetailerByMobile(mobile) {
    const last10 = normalizeMobile(mobile);
    if (last10.length !== 10) return null;

    const { data, error } = await supabase
        .from("retailer_master")
        .select("*")
        .or(`mobile_number.eq.${last10},mobile_number.eq.91${last10}`)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Retailer lookup error:", error);
        return null;
    }
    return data;
}

module.exports = { findRetailerByMobile, normalizeMobile };
