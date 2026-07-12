const supabase = require("../config/supabase");

const {
    syncStudioMaster,
} = require("./googleSheets/googleSheetsService");
const getStudios = async () => {

    const { data, error } = await supabase
        .from("studio_master")
        .select("*")
        .order("theatre_name", { ascending: true })
        .order("studio_name", { ascending: true });

    if (error) {
        throw error;
    }

    // Debug: Print the first studio record
    console.log("========== FIRST STUDIO ==========");
    console.log(data[0]);
    console.log("==================================");

    return data;

};

// ==========================================
// Create Studio
// ==========================================

const createStudio = async (studioData) => {

    // ===========================
    // Duplicate Studio Code
    // ===========================

    const { data: existingCode } = await supabase
        .from("studio_master")
        .select("id")
        .eq("studio_code", studioData.studio_code)
        .maybeSingle();

    if (existingCode) {

        throw new Error("Studio Code already exists.");

    }

    // ===========================
    // Duplicate Studio Name
    // ===========================

    const { data: existingName } = await supabase
        .from("studio_master")
        .select("id")
        .eq("studio_name", studioData.studio_name)
        .maybeSingle();

    if (existingName) {

        throw new Error("Studio Name already exists.");

    }

    // ===========================
    // Insert Studio
    // ===========================

    const payload = {

        studio_code: studioData.studio_code,

        studio_name: studioData.studio_name,

        theatre_code: studioData.theatre_code,

        theatre_name: studioData.theatre_name,

        city: studioData.city,

        state: studioData.state,

        address: studioData.address || null,

        contact_person: studioData.contact_person || null,

        contact_number: studioData.contact_number || null,

        is_active: true

    };

    const { data, error } = await supabase
        .from("studio_master")
        .insert(payload)
        .select()
        .single();

    if (error) {

        throw error;

    }

    // ===========================
    // Sync Google Sheet
    // ===========================

    await syncStudioMaster();

    console.log("✅ Studio Master synced.");

    return data;

};

// ==========================================
// Update Studio
// ==========================================

const updateStudio = async (id, studioData) => {

    // ===========================
    // Duplicate Studio Name
    // ===========================

    const { data: existingName } = await supabase
        .from("studio_master")
        .select("id")
        .eq("studio_name", studioData.studio_name)
        .neq("id", id)
        .maybeSingle();

    if (existingName) {

        throw new Error("Studio Name already exists.");

    }

    // ===========================
    // Update Studio
    // ===========================

    const payload = {

        studio_name: studioData.studio_name,

        theatre_name: studioData.theatre_name,

        city: studioData.city,

        state: studioData.state,

        address: studioData.address || null,

        contact_person: studioData.contact_person || null,

        contact_number: studioData.contact_number || null,

    };

    const { data, error } = await supabase
        .from("studio_master")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {

        throw error;

    }

    // ===========================
    // Sync Google Sheet
    // ===========================

    await syncStudioMaster();

    console.log("✅ Studio Master synced.");

    return data;

};

// ==========================================
// Update Studio Status
// ==========================================

const updateStudioStatus = async (id, isActive) => {

    const { data, error } = await supabase
        .from("studio_master")
        .update({

            is_active: isActive,

        })
        .eq("id", id)
        .select()
        .single();

    if (error) {

        throw error;

    }

    // ===========================
    // Sync Google Sheet
    // ===========================

    await syncStudioMaster();

    console.log("✅ Studio Master synced.");

    return data;

};

module.exports = {

    getStudios,

    createStudio,

    updateStudio,

    updateStudioStatus,

};