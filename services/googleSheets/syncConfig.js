module.exports = [

    {
        table: "product_master",
        sheet: "Product_Master",
        direction: "GOOGLE_TO_SUPABASE",
        role: "MASTER"
    },

    {
        table: "inventory_master",
        sheet: "Inventory_Master",
        direction: "GOOGLE_TO_SUPABASE",
        role: "MASTER"
    },

    {
        table: "studio_master",
        sheet: "Studio_Master",
        direction: "GOOGLE_TO_SUPABASE",
        role: "MASTER"
    },

    {
        table: "customer_master",
        sheet: "Customer_Master",
        direction: "SUPABASE_TO_GOOGLE",
        role: "TRANSACTION"
    },

    {
        table: "guest_master",
        sheet: "Guest_Master",
        direction: "SUPABASE_TO_GOOGLE",
        role: "TRANSACTION"
    },

    {
        table: "orders",
        sheet: "Orders",
        direction: "SUPABASE_TO_GOOGLE",
        role: "TRANSACTION"
    },

    {
        table: "order_items",
        sheet: "Order_Items",
        direction: "SUPABASE_TO_GOOGLE",
        role: "TRANSACTION"
    },

    {
        table: "delivery_addresses",
        sheet: "Delivery_Addresses",
        direction: "SUPABASE_TO_GOOGLE",
        role: "TRANSACTION"
    },

    {
        table: "order_status_history",
        sheet: "Order_Status_History",
        direction: "SUPABASE_TO_GOOGLE",
        role: "TRANSACTION"
    }

];