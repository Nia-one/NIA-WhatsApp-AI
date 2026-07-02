const supabase = require("../config/supabase");

async function rollbackOrder(orderId) {

    console.log("================================");
    console.log("ROLLBACK STARTED");
    console.log("================================");

    console.log("Order ID:", orderId);

    // Delete Order Items

    const { error: itemError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

    if (itemError) {

        console.error("Failed to delete Order Items");

        console.error(itemError);

    }

    // Delete Order Timeline

    const { error: timelineError } = await supabase
        .from("order_status_history")
        .delete()
        .eq("order_id", orderId);

    if (timelineError) {

        console.error("Failed to delete Timeline");

        console.error(timelineError);

    }

    // Delete Order

    const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

    if (orderError) {

        console.error("Failed to delete Order");

        console.error(orderError);

        return false;

    }
console.log("================================");
console.log("ROLLBACK COMPLETED");
console.log("================================");

console.log("Order Deleted");
console.log("Order Items Deleted");
console.log("Timeline Deleted");

return true;
}

module.exports = {
    rollbackOrder
};