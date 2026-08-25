const crypto = require("crypto");
const { readSheet } = require("../googleSheetsService");
const supabase = require("../../../config/supabase");

const clean = value => String(value ?? "").trim() || null;
const mobile = value => String(value ?? "").replace(/\D/g, "").slice(-10);
const active = value => value === undefined || value === null || value === ""
    ? true
    : String(value).trim().toUpperCase() === "TRUE";

async function syncRetailers() {
    const rows = await readSheet("Retailer_Master");
    if (rows.length < 2) return;

    const headers = rows[0].map(value => String(value || "").trim());
    const { data: existing, error } = await supabase.from("retailer_master").select("*");
    if (error) throw error;

    const byId = new Map(existing.map(row => [row.id, row]));
    const byMobile = new Map(existing.map(row => [mobile(row.mobile_number), row]));
    const usedCodes = new Set(existing.map(row => row.retailer_code));
    let nextCode = existing.reduce((max, row) => {
        const match = String(row.retailer_code || "").match(/\d+/);
        return Math.max(max, match ? Number(match[0]) : 0);
    }, 0) + 1;
    const now = new Date().toISOString();
    const upserts = [];

    for (const values of rows.slice(1)) {
        const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
        const normalizedMobile = mobile(row.mobile_number);
        if (normalizedMobile.length !== 10 || !clean(row.retailer_name)) continue;
        const match = byId.get(clean(row.id)) || byMobile.get(normalizedMobile);
        let code = clean(row.retailer_code) || match?.retailer_code;
        while (!code) {
            const candidate = `RTL${String(nextCode++).padStart(6, "0")}`;
            if (!usedCodes.has(candidate)) code = candidate;
        }
        usedCodes.add(code);
        const payload = {
            id: clean(row.id) || match?.id || crypto.randomUUID(),
            retailer_code: code,
            retailer_name: clean(row.retailer_name),
            business_name: clean(row.business_name),
            mobile_number: normalizedMobile,
            address: clean(row.address),
            city: clean(row.city),
            state: clean(row.state),
            is_active: active(row.is_active),
            created_at: clean(row.created_at) || match?.created_at || now
        };
        const changed = !match || [
            "retailer_name", "business_name", "mobile_number", "address",
            "city", "state", "is_active"
        ].some(field => (match[field] ?? null) !== (payload[field] ?? null));
        payload.updated_at = changed ? now : (match.updated_at || now);
        upserts.push(payload);
    }

    for (let index = 0; index < upserts.length; index += 200) {
        const { error: upsertError } = await supabase
            .from("retailer_master")
            .upsert(upserts.slice(index, index + 200), { onConflict: "id" });
        if (upsertError) throw upsertError;
    }
    console.log(`Retailer inbound sync completed: ${upserts.length} rows checked`);
}

module.exports = { syncRetailers };
