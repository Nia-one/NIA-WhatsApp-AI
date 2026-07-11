const supabase = require("../config/supabase");

async function updateCustomerAnalytics(customerId) {
    const { data: orders, error } = await supabase
    .from("orders")
    .select("grand_total, created_at")
    .eq("customer_id", customerId);

if (error) {
    console.error(error);
    return false;
}

    const totalOrders = orders.length;

const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.grand_total || 0),
    0
);

const lastOrderDate =
    totalOrders > 0
        ? orders
              .sort(
                  (a, b) =>
                      new Date(b.created_at) -
                      new Date(a.created_at)
              )[0].created_at
        : null;

    const { error: updateError } = await supabase
        .from("customer_master")
        .update({
    total_orders: totalOrders,
    total_spent: totalSpent,
    last_order_date: lastOrderDate,
    updated_at: new Date().toISOString()
})
        .eq("id", customerId);

    if (updateError) {
        console.error(updateError);
        return false;
    }

    return true;
}

module.exports = {
    updateCustomerAnalytics
};