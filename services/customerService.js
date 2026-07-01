const supabase = require("../config/supabase");

// ======================================
// Create Guest
// ======================================

async function createGuest(mobileNumber) {

    const { data, error } = await supabase
        .from("guest_master")
        .insert({
            mobile_number: mobileNumber
        })
        .select()
        .single();

    if (error) {
        console.error("Create Guest Error:", error);
        return null;
    }

    return data;
}

// ======================================
// Get or Create Guest
// ======================================

async function getOrCreateGuest(mobileNumber) {

    let guest = await findGuestByMobile(mobileNumber);

    if (guest) {
        return guest;
    }

    guest = await createGuest(mobileNumber);

    return guest;
}

// ======================================
// Find Guest by Mobile Number
// ======================================

async function findGuestByMobile(mobileNumber) {

    const { data, error } = await supabase
        .from("guest_master")
        .select("*")
        .eq("mobile_number", mobileNumber)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Find Guest Error:", error);
        return null;
    }

    return data;
}



module.exports = {
    findGuestByMobile,
    createGuest,
    getOrCreateGuest
};