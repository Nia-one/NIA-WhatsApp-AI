const { readSheet } = require("../googleSheetsService");
const supabase = require("../../../config/supabase");
const { SHEETS, TABLES } = require("../../core/constants");

function clean(value) {
    const text = String(value ?? "").trim();
    return text || null;
}

function asBoolean(value, defaultValue = true) {
    if (value === undefined || value === null || value === "") return defaultValue;
    return String(value).trim().toUpperCase() === "TRUE";
}

async function syncStudios() {
    const rows = await readSheet(SHEETS.STUDIO_MASTER);
    if (rows.length < 2) return;

    const headers = rows[0].map(header => String(header || "").trim());
    const studios = rows.slice(1).map(row => Object.fromEntries(
        headers.map((header, index) => [header, row[index]])
    ));

    for (const studio of studios) {
        const studioCode = clean(studio.studio_code);
        if (!studioCode) continue;

        const payload = {
            studio_code: studioCode,
            studio_name: clean(studio.studio_name),
            theatre_code: clean(studio.theatre_code),
            theatre_name: clean(studio.theatre_name),
            city: clean(studio.city),
            state: clean(studio.state),
            address: clean(studio.address),
            contact_person: clean(studio.contact_person),
            contact_number: clean(studio.contact_number),
            is_active: asBoolean(studio.is_active)
        };

        const { data: existing, error: lookupError } = await supabase
            .from(TABLES.STUDIO_MASTER)
            .select("id")
            .eq("studio_code", studioCode)
            .maybeSingle();
        if (lookupError) throw lookupError;

        const query = existing
            ? supabase.from(TABLES.STUDIO_MASTER).update(payload).eq("id", existing.id)
            : supabase.from(TABLES.STUDIO_MASTER).insert(payload);

        const { error } = await query;
        if (error) throw error;
    }

    console.log(`Studio sync completed: ${studios.length} sheet rows checked`);
}

module.exports = { syncStudios };
