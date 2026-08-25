const crypto = require("crypto");
const { readSheet } = require("../googleSheetsService");
const supabase = require("../../../config/supabase");

function clean(value) {
    const result = String(value ?? "").trim();
    return result || null;
}

function digits(value) {
    return String(value ?? "").replace(/\D/g, "");
}

function bool(value, fallback = true) {
    if (value === undefined || value === null || value === "") return fallback;
    return String(value).trim().toUpperCase() === "TRUE";
}

async function fetchAll(table, columns = "*") {
    const rows = [];
    for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase.from(table).select(columns).range(from, from + 999);
        if (error) throw error;
        rows.push(...data);
        if (data.length < 1000) return rows;
    }
}

async function syncGuests() {
    const rows = await readSheet("Guest_Master");
    if (rows.length < 2) return;

    const headers = rows[0].map(header => String(header || "").trim());
    const [existingGuests, studios] = await Promise.all([
        fetchAll("guest_master", "id,guest_code,mobile_number"),
        fetchAll("studio_master", "id,studio_code,theatre_code,theatre_name,is_active")
    ]);
    const byId = new Map(existingGuests.map(row => [row.id, row]));
    const byMobile = new Map(existingGuests.map(row => [digits(row.mobile_number).slice(-10), row]));
    const studioByCode = new Map(studios.map(row => [row.studio_code, row]));
    const usedCodes = new Set(existingGuests.map(row => row.guest_code).filter(Boolean));
    let nextCode = existingGuests.reduce((maximum, row) => {
        const match = String(row.guest_code || "").match(/\d+/);
        return Math.max(maximum, match ? Number(match[0]) : 0);
    }, 0) + 1;
    const now = new Date().toISOString();
    const upserts = [];

    for (const row of rows.slice(1)) {
        const guest = Object.fromEntries(headers.map((header, index) => [header, row[index]]));
        const mobileNumber = digits(guest.mobile_number).slice(-10);
        const existing = byId.get(clean(guest.id)) || byMobile.get(mobileNumber);
        if (!existing && mobileNumber.length !== 10) continue;

        let guestCode = clean(guest.guest_code) || existing?.guest_code;
        while (!guestCode) {
            const candidate = `GST${String(nextCode++).padStart(6, "0")}`;
            if (!usedCodes.has(candidate)) guestCode = candidate;
        }
        usedCodes.add(guestCode);

        const studioCode = clean(guest.studio_code);
        const studio = studioByCode.get(studioCode);
        upserts.push({
            id: clean(guest.id) || existing?.id || crypto.randomUUID(),
            guest_code: guestCode,
            theatre_name: clean(guest.theatre_name) || studio?.theatre_name || null,
            studio_status: clean(guest.studio_status) || (studio ? (studio.is_active ? "Active" : "Inactive") : "Active"),
            studio_code: studioCode,
            studio_name: clean(guest.studio_name),
            room_number: clean(guest.room_number),
            guest_name: clean(guest.guest_name) || `Guest ${mobileNumber.slice(-4)}`,
            mobile_number: mobileNumber || clean(guest.mobile_number),
            aadhaar_number: digits(guest.aadhaar_number) || null,
            guest_status: clean(guest.guest_status) || "Active",
            whatsapp_enabled: bool(guest.whatsapp_enabled),
            is_active: bool(guest.is_active),
            created_at: clean(guest.created_at) || now,
            updated_at: clean(guest.updated_at) || now,
            studio_id: clean(guest.studio_id) || studio?.id || null,
            theatre_code: clean(guest.theatre_code) || studio?.theatre_code || null
        });
    }

    for (let index = 0; index < upserts.length; index += 200) {
        const { error } = await supabase
            .from("guest_master")
            .upsert(upserts.slice(index, index + 200), { onConflict: "id" });
        if (error) throw error;
    }

    console.log(`Guest inbound sync completed: ${upserts.length} rows checked`);
}

module.exports = { syncGuests };
