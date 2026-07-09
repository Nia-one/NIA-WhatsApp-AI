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

async function restoreInventory(productId, quantity) {

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

    const available = inventory.available_stock + quantity;
    const total = inventory.total_stock + quantity;

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

async function getInventory(filters = {}) {
        const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

        let query = supabase
    .from("inventory_master")
    .select(
        `
        *,
        product_master!inner (
            sku,
            category,
            brand,
            purchase_rate,
            mrp,
            nia_price,
            nia_savings,
            unit,
            is_active
        )
        `,
        { count: "exact" }
    )
    .eq("product_master.is_active", true)
    .order("product_name", {
        ascending: true
    });
            if (filters.status) {
        query = query.eq("inventory_status", filters.status);
    }

    if (filters.search) {
    query = query.ilike("product_name", `%${filters.search}%`);
}

            const {
    data,
    error,
    count
} = await query.range(from, to);

      if (error) {
        throw error;
    }
        return {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
    data
};
}

async function updateInventory(productId, stock, reason = "Manual Adjustment") {

    console.log("================================");
    console.log("UPDATE INVENTORY");
    console.log("Product ID:", productId);
    console.log("Stock Received:", stock);
    console.log("Reason:", reason);

    // Fetch current inventory before update
    const { data: currentInventory, error: fetchError } = await supabase
        .from("inventory_master")
        .select("*")
        .eq("id", productId)
         .maybeSingle();

         console.log("Product ID received:", productId);
console.log("Inventory found:", currentInventory);
console.log("Fetch Error:", fetchError);

    console.log("Current Inventory:");
    console.log(currentInventory);

    console.log("Fetch Error:");
    console.log(fetchError);

    if (fetchError) {
        throw fetchError;
    }


        // Add stock to existing inventory

const updatedTotalStock =
    currentInventory.total_stock + stock;

const updatedAvailableStock =
    currentInventory.available_stock + stock;

let status = "In Stock";

if (updatedAvailableStock <= 0) {
    status = "Out of Stock";
} else if (updatedAvailableStock <= currentInventory.reorder_level) {
    status = "Low Stock";
}

        const { data, error } = await supabase
        .from("inventory_master")
        .update({
        total_stock: updatedTotalStock,
        available_stock: updatedAvailableStock,
        inventory_status: status,
        last_stock_update: new Date()
    })
    .eq("id", productId)
    .select()
    .single();

    console.log("================================");
console.log("UPDATE RESPONSE");
console.log(data);
console.log("================================");

if (error) {
    throw error;
}

// Create inventory adjustment history

const { error: historyError } = await supabase
    .from("inventory_adjustment_history")
    .insert({
        inventory_id: currentInventory.id,
        product_id: currentInventory.product_id,
        product_name: currentInventory.product_name,
        old_stock: currentInventory.total_stock,
        new_stock: updatedAvailableStock,

adjustment: stock,
        reason,
        updated_by: "Admin"
    });

if (historyError) {
    console.error("Inventory history insert failed:", historyError);
}


return data;
}

async function getInventoryHistory() {

    const { data, error } = await supabase
        .from("inventory_adjustment_history")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
    console.error("Inventory Update Error:");
    console.error(error);
    throw error;
}

console.log("================================");
console.log("Inventory Updated Successfully");
console.log(data);
console.log("================================");

    return data;
}

async function getInventorySummary() {

    const { data, error } = await supabase
        .from("inventory_master")
        .select(`
            *,
            product_master!inner(
                is_active
            )
        `)
        .eq("product_master.is_active", true);

    if (error) {
        throw error;
    }

    return {
        totalProducts: data.length,
        inStock: data.filter(item => item.available_stock > item.reorder_level).length,
        lowStock: data.filter(item =>
            item.available_stock > 0 &&
            item.available_stock <= item.reorder_level
        ).length,
        outOfStock: data.filter(item => item.available_stock <= 0).length
    };

}

async function getLowStockProducts() {

    const { data, error } = await supabase
        .from("inventory_master")
        .select("*")
        .gt("available_stock", 0)
        .lte("available_stock", 20)
        .order("available_stock", { ascending: true });

    if (error) {
        throw error;
    }

    return data;

}

async function getOutOfStockProducts() {

    const { data, error } = await supabase
        .from("inventory_master")
        .select("*")
        .lte("available_stock", 0)
        .order("product_name");

    if (error) {
        throw error;
    }

    return data;

}

module.exports = {
    reduceInventory,
    restoreInventory,
    getInventory,
    updateInventory,
    getInventoryHistory,
    getInventorySummary,
    getLowStockProducts,
    getOutOfStockProducts
};