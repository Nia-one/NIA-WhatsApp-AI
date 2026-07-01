const supabase = require("../config/supabase");

async function reduceInventory(productId, quantity) {

    // Fetch inventory
    const { data: inventory, error } = await supabase
        .from("inventory_master")
        .select("*")
        .eq("product_id", productId)
        .single();

    if (error || !inventory) {
        console.error("Inventory not found");
        return false;
    }

    // Check stock
    if (inventory.available_stock < quantity) {
        console.error("Insufficient stock");
        return false;
    }

    const available = inventory.available_stock - quantity;
    const total = inventory.total_stock - quantity;

    let status = "In Stock";

    if (available <= 0) {
        status = "Out of Stock";
    } else if (available <= inventory.reorder_level) {
        status = "Low Stock";
    }

    const { error: updateError } = await supabase
        .from("inventory_master")
        .update({
            total_stock: total,
            available_stock: available,
            inventory_status: status,
            last_stock_update: new Date()
        })
        .eq("product_id", productId);

    if (updateError) {
        console.error(updateError);
        return false;
    }

    return true;
}

module.exports = {
    reduceInventory
};