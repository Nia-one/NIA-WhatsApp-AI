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
// Find Customer by Mobile Number
// ======================================

async function findCustomerByMobile(mobileNumber) {

    const { data, error } = await supabase
        .from("customer_master")
        .select("*")
        .eq("mobile_number", mobileNumber)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Find Customer Error:", error);
        return null;
    }

    return data;
}

// ======================================
// Create Customer
// ======================================

async function createCustomer(guest) {

    const { data, error } = await supabase
        .from("customer_master")
        .insert({
            mobile_number: guest.mobile_number,
            customer_name: guest.guest_name,
            guest_id: guest.id,
            studio_id: guest.studio_id
        })
        .select()
        .single();

    if (error) {
        console.error("Create Customer Error:", error);
        return null;
    }

    return data;
}

// ======================================
// Get or Create Customer
// ======================================

async function getOrCreateCustomer(guest) {

    let customer = await findCustomerByMobile(
        guest.mobile_number
    );

    if (customer) {
        return customer;
    }

    customer = await createCustomer(
        guest
    );

    return customer;
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
    getOrCreateGuest,
    findCustomerByMobile,
    createCustomer,
    getOrCreateCustomer
};