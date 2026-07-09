const supabase = require("../config/supabase");


// Get all guests
const getGuests = async () => {

    const { data, error } = await supabase
        .from("guest_master")
        .select("*")
        .order("guest_code", { ascending: true });


    if (error) {
        throw error;
    }


    return data;
};



// Generate Guest Code
const generateGuestCode = async () => {

    const { data, error } = await supabase
        .from("guest_master")
        .select("guest_code")
        .not("guest_code", "is", null)
        .order("guest_code", { ascending: false })
        .limit(1);


    if (error) {
        throw error;
    }


    let nextNumber = 1;


    if (data && data.length > 0 && data[0].guest_code) {

        const lastCode = data[0].guest_code;


        const match = lastCode.match(/\d+/);


        if (match) {

            nextNumber = Number(match[0]) + 1;

        }

    }


    const newCode = `GST${String(nextNumber).padStart(6, "0")}`;


    console.log("Generated Guest Code:", newCode);


    return newCode;

};




// Create Guest
const createGuest = async (guestData) => {

    // ==========================================
    // Check Duplicate Mobile Number
    // ==========================================

    const { data: existingGuest, error: checkError } = await supabase
        .from("guest_master")
        .select("id, guest_name")
        .eq("mobile_number", guestData.mobile_number)
        .maybeSingle();

    if (checkError) {
        throw checkError;
    }

    if (existingGuest) {
        throw new Error(
            `Mobile number already exists for guest "${existingGuest.guest_name}".`
        );
    }


    // ==========================================
    // Generate Guest Code
    // ==========================================

    const guestCode = await generateGuestCode();

    console.log("Generated Guest Code:", guestCode);


    // ==========================================
    // Prepare Payload
    // ==========================================

    const payload = {

        guest_code: guestCode,

        guest_name: guestData.guest_name,

        mobile_number: guestData.mobile_number,

        aadhaar_number: guestData.aadhaar_number || null,

        theatre_name: guestData.theatre_name,

        studio_code: guestData.studio_code,

        studio_name: guestData.studio_name,

        room_number: guestData.room_number,

        guest_status: guestData.guest_status || "Active",

        is_active: true

    };


    // ==========================================
    // Insert Guest
    // ==========================================

    const { data, error } = await supabase
        .from("guest_master")
        .insert(payload)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;

};



module.exports = {

    getGuests,

    createGuest,

};