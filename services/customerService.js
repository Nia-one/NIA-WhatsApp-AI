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

// ======================================
// Get All Customers
// ======================================

async function getCustomers() {

    const { data, error } = await supabase
        .from("customer_master")
        .select(`
    id,
    customer_name,
    mobile_number,
    total_orders,
    total_spent,
    last_order_date,
    preferred_language,
    is_active,
    created_at
`)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;

}

// ======================================
// Get Customer By ID
// ======================================

async function getCustomerById(customerId) {

    const { data, error } = await supabase
    .from("customer_master")
    .select("*")
    .eq("id", customerId)
    .single();
    if (error) {
        throw error;
    }

    return data;

}

// ======================================
// Get Customer Orders
// ======================================
const getCustomerOrders = async (customerId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      order_number,
      order_date,
      order_status,
      grand_total
    `)
    .eq("customer_id", customerId)
    .order("order_date", { ascending: false });

  if (error) throw error;

  return data.map(order => ({
    order_number: order.order_number,
    order_date: order.order_date,
    status: order.order_status,
    total_amount: order.grand_total
  }));
};

// ======================================
// Get Customer Statistics
// ======================================
const getCustomerStats = async (customerId) => {
  const customer = await getCustomerById(customerId);

  return {
    total_orders: customer.total_orders,
    total_spent: customer.total_spent,
    last_order_date: customer.last_order_date,
    average_order_value:
      customer.total_orders > 0
        ? Number(customer.total_spent) / Number(customer.total_orders)
        : 0,
  };
};

// ======================================
// Update Guest Name
// ======================================

async function updateGuestName(mobileNumber, guestName) {

    const { data, error } = await supabase
        .from("guest_master")
        .update({
            guest_name: guestName,
            updated_at: new Date()
        })
        .eq("mobile_number", mobileNumber)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;

}

module.exports = {
    findGuestByMobile,
    createGuest,
    getOrCreateGuest,
    findCustomerByMobile,
    createCustomer,
    getOrCreateCustomer,
    getCustomers,
    getCustomerById,
    getCustomerOrders,
    updateGuestName,
    getCustomerStats
};