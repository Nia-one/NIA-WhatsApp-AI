const supabase = require("../config/supabase");

// ======================================
// Create Guest
// ======================================

async function createGuest(mobileNumber, guestName) {

    const { data, error } = await supabase
        .from("guest_master")
        .insert({
    mobile_number: mobileNumber,
    guest_name: guestName || "Guest Customer"
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

        console.log("================================");
        console.log("EXISTING GUEST FOUND");
        console.log("Guest ID :", guest.id);
        console.log("Mobile   :", guest.mobile_number);
        console.log("Guest    :", guest.guest_name);
        console.log("================================");

        return guest;
    }

    console.log("================================");
    console.log("CREATING NEW GUEST");
    console.log("Mobile :", mobileNumber);
    console.log("================================");

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

async function getStudioByCode(studioCode) {

    if (!studioCode) {
        return null;
    }

    const { data, error } = await supabase
        .from("studio_master")
        .select(`
    id,
    studio_name,
    theatre_name,
    studio_code
`)
        .eq("studio_code", studioCode)
        .single();

    if (error) {
        console.error("Studio Lookup Error:", error);
        return null;
    }

    return data;
}


// ======================================
// Create Customer
// ======================================

async function createCustomer(guest) {

 const studio = await getStudioByCode(
    guest.studio_code
);

const { data, error } = await supabase
    .from("customer_master")
    .insert({
        mobile_number: guest.mobile_number,
        customer_name: guest.guest_name,
        guest_id: guest.id,

        studio_id: studio?.id || null,
        studio_name: studio?.studio_name || null,
        theatre_name: studio?.theatre_name || null,
        studio_code: guest.studio_code

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

if (
    !customer.customer_name ||
    !customer.studio_id ||
    !customer.studio_name ||
    !customer.theatre_name
) {
            const studio = await getStudioByCode(
                guest.studio_code
            );

            const { data: updatedCustomer, error } = await supabase
                .from("customer_master")
              .update({
    customer_name: guest.guest_name,
    studio_code: guest.studio_code,
    studio_id: studio?.id || null,
    studio_name: studio?.studio_name || null,
    theatre_name: studio?.theatre_name || null
})
                .eq("id", customer.id)
                .select()
                .single();

            if (error) {
                console.error("Customer Update Error:");
                console.error(error);
            } else {
                return updatedCustomer;
            }
        }

        // Always return the latest customer from database
        return await findCustomerByMobile(
            guest.mobile_number
        );
    }

    customer = await createCustomer(guest);

    return customer;
}

// ======================================
// Find Guest by Mobile Number
// ======================================

async function findGuestByMobile(mobileNumber) {

    // Normalize Mobile Number
    const digits = String(mobileNumber).replace(/\D/g, "");

    const last10 =
        digits.length > 10
            ? digits.slice(-10)
            : digits;

    const with91 = "91" + last10;

    console.log("================================");
    console.log("GUEST LOOKUP");
    console.log("Incoming :", mobileNumber);
    console.log("Last10   :", last10);
    console.log("With91   :", with91);
    console.log("================================");

    const { data, error } = await supabase
        .from("guest_master")
        .select("*")
        .or(
            `mobile_number.eq.${last10},mobile_number.eq.${with91}`
        )
        .limit(1)
        .maybeSingle();

    if (error) {
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
    studio_code,
    studio_name,
    theatre_name,
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
      id,
      order_number,
      order_date,
      order_status,
      grand_total
  `)
    .eq("customer_id", customerId)
    .order("order_date", { ascending: false });

  if (error) throw error;

  return data.map(order => ({
  id: order.id,
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