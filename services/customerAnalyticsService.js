const supabase = require("../config/supabase");

async function updateCustomerAnalytics(customerId, orderTotal) {

    const { data: customer, error } = await supabase
        .from("customer_master")
        .select("total_orders,total_spent")
        .eq("id", customerId)
        .single();

    if (error) {
        console.error(error);
        return false;
    }

    const totalOrders = (customer.total_orders || 0) + 1;
    const totalSpent = Number(customer.total_spent || 0) + Number(orderTotal);

    const { error: updateError } = await supabase
        .from("customer_master")
        .update({
            total_orders: totalOrders,
            total_spent: totalSpent,
            last_order_date: new Date().toISOString(),
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