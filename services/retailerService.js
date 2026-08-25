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

async function createRetailer({ name, mobile }) {
    const retailerName = String(name || "").trim();
    const mobileNumber = normalizeMobile(mobile);
    if (retailerName.length < 2 || mobileNumber.length !== 10) return null;

    const existing = await findRetailerByMobile(mobileNumber);
    if (existing) return existing;

    const { data: codes, error: codeError } = await supabase
        .from("retailer_master")
        .select("retailer_code");
    if (codeError) throw codeError;

    const nextNumber = (codes || []).reduce((maximum, row) => {
        const match = String(row.retailer_code || "").match(/\d+/);
        return Math.max(maximum, match ? Number(match[0]) : 0);
    }, 0) + 1;

    const { data, error } = await supabase
        .from("retailer_master")
        .insert({
            retailer_code: `RTL${String(nextNumber).padStart(6, "0")}`,
            retailer_name: retailerName,
            mobile_number: mobileNumber,
            is_active: true
        })
        .select("*")
        .single();

    if (error) throw error;
    return data;
}

module.exports = { findRetailerByMobile, createRetailer, normalizeMobile };
