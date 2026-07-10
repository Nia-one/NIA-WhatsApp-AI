const supabase = require("../config/supabase");
const guestService = require("./guestService");
const { syncTable } = require("./googleSheets/syncEngine");

const importGuests = async (rows) => {

    let imported = 0;
    let updated = 0;
    let failed = 0;
    const errors = [];

    for (const row of rows) {

        try {

            const mobile =
                row["Mobile Number"] ||
                row.mobile_number ||
                row.Mobile;

            if (!mobile) {
                failed++;
                errors.push({
                    row,
                    reason: "Mobile Number is missing"
                });
                continue;
            }

            const { data: existingGuest, error } = await supabase
                .from("guest_master")
                .select("id")
                .eq("mobile_number", mobile)
                .maybeSingle();

            if (error) throw error;

            const payload = {

                guest_name:
                    row["Guest Name"] ||
                    row.guest_name,

                mobile_number: mobile,

                aadhaar_number:
                    row["Aadhaar Number"] ||
                    row.aadhaar_number ||
                    null,

                theatre_name:
                    row["Theatre Name"] ||
                    row.theatre_name,

                studio_code:
                    row["Studio Code"] ||
                    row.studio_code,

                studio_name:
                    row["Studio Name"] ||
                    row.studio_name,

                room_number:
                    row["Room Number"] ||
                    row.room_number,

                guest_status:
                    row["Guest Status"] ||
                    "Active",

                is_active: true

            };

            if (existingGuest) {

                const { error: updateError } = await supabase
                    .from("guest_master")
                    .update(payload)
                    .eq("id", existingGuest.id);

                if (updateError) throw updateError;

                updated++;

            } else {

                await guestService.createGuest(payload);

                imported++;

            }

        } catch (err) {

            failed++;

            errors.push({
                row,
                reason: err.message
            });

        }

    }

    // Sync Guest_Master to Google Sheet
await syncTable(
    "guest_master",
    "Guest_Master"
);

return {

    imported,

    updated,

    failed,

    errors

};

};

module.exports = {

    importGuests

};