require("dotenv").config();

const path = require("path");
const XLSX = require("xlsx");
const supabase = require("../config/supabase");
const { syncTable } = require("../services/googleSheets/syncEngine");

const BATCH_SIZE = 200;

function digits(value) {
    return String(value ?? "").replace(/\D/g, "");
}

function mobile(value) {
    const valueDigits = digits(value);
    return valueDigits.length >= 10 ? valueDigits.slice(-10) : "";
}

function text(value) {
    const cleaned = String(value ?? "").trim();
    return cleaned && cleaned !== "-" ? cleaned : null;
}

async function fetchAll(table, columns) {
    const allRows = [];
    for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase
            .from(table)
            .select(columns)
            .range(from, from + 999);
        if (error) throw error;
        allRows.push(...data);
        if (data.length < 1000) return allRows;
    }
}

async function importSheet6(workbookPath, { dryRun = false } = {}) {
    const workbook = XLSX.readFile(workbookPath, { raw: false });
    const worksheet = workbook.Sheets.Sheet6;
    if (!worksheet) throw new Error("Workbook does not contain Sheet6");

    const sourceRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    const uniqueByMobile = new Map();

    for (const row of sourceRows) {
        const mobileNumber = mobile(row["MOBILE. NO"]);
        if (!mobileNumber || uniqueByMobile.has(mobileNumber)) continue;
        uniqueByMobile.set(mobileNumber, row);
    }

    const [existingGuests, studios] = await Promise.all([
        fetchAll("guest_master", "id,guest_code,mobile_number"),
        fetchAll("studio_master", "id,studio_code,theatre_code,theatre_name,is_active")
    ]);

    const guestsByMobile = new Map(
        existingGuests.map(guest => [mobile(guest.mobile_number), guest])
    );
    const studiosByCode = new Map(
        studios.map(studio => [String(studio.studio_code || "").trim(), studio])
    );
    let nextGuestNumber = existingGuests.reduce((maximum, guest) => {
        const match = String(guest.guest_code || "").match(/\d+/);
        return Math.max(maximum, match ? Number(match[0]) : 0);
    }, 0) + 1;

    const inserts = [];
    const updates = [];
    const timestamp = new Date().toISOString();

    for (const [mobileNumber, row] of uniqueByMobile) {
        const studioCode = text(row["Studio Code"]);
        const studio = studiosByCode.get(studioCode) || null;
        const payload = {
            theatre_name: text(row.Theatre) || studio?.theatre_name || null,
            studio_status: studio ? (studio.is_active ? "Active" : "Inactive") : "Active",
            studio_code: studioCode,
            studio_name: text(row["Studio Name"]),
            guest_name: text(row["Name of Tenant"]),
            mobile_number: mobileNumber,
            aadhaar_number: digits(row["AADHAR. NO"]) || null,
            guest_status: "Active",
            whatsapp_enabled: true,
            is_active: true,
            studio_id: studio?.id || null,
            theatre_code: studio?.theatre_code || null,
            updated_at: timestamp
        };

        const existing = guestsByMobile.get(mobileNumber);
        if (existing) {
            updates.push({ id: existing.id, payload });
        } else {
            inserts.push({
                ...payload,
                guest_code: `GST${String(nextGuestNumber++).padStart(6, "0")}`,
                created_at: timestamp
            });
        }
    }

    const summary = {
        sourceRows: sourceRows.length,
        uniqueMobiles: uniqueByMobile.size,
        duplicateRowsSkipped: sourceRows.length - uniqueByMobile.size,
        inserted: inserts.length,
        updated: updates.length
    };

    if (dryRun) return summary;

    for (let index = 0; index < inserts.length; index += BATCH_SIZE) {
        const { error } = await supabase
            .from("guest_master")
            .insert(inserts.slice(index, index + BATCH_SIZE));
        if (error) throw error;
    }

    for (let index = 0; index < updates.length; index += BATCH_SIZE) {
        const batch = updates.slice(index, index + BATCH_SIZE);
        await Promise.all(batch.map(async ({ id, payload }) => {
            const { error } = await supabase
                .from("guest_master")
                .update(payload)
                .eq("id", id);
            if (error) throw error;
        }));
    }

    await syncTable("guest_master", "Guest_Master");
    return summary;
}

if (require.main === module) {
    const workbookPath = process.argv[2];
    const dryRun = process.argv.includes("--dry-run");
    if (!workbookPath) {
        console.error("Usage: node scripts/importSheet6Guests.js <workbook.xlsx> [--dry-run]");
        process.exit(1);
    }

    importSheet6(path.resolve(workbookPath), { dryRun })
        .then(summary => console.log(JSON.stringify(summary, null, 2)))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { importSheet6 };
