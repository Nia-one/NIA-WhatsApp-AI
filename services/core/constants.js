const SHEETS = {

    PRODUCT_MASTER: "Product_Master",
    INVENTORY_MASTER: "Inventory_Master",
    STUDIO_MASTER: "Studio_Master",
    CUSTOMER_MASTER: "Customer_Master",
    GUEST_MASTER: "Guest_Master",
    ORDERS: "Orders",
    ORDER_ITEMS: "Order_Items",
    DELIVERY_ADDRESSES: "Delivery_Addresses",
    ORDER_STATUS_HISTORY: "Order_Status_History",
    DASHBOARD: "Dashboard",
    SYNC_LOG: "Sync_Log"

};

const TABLES = {

    PRODUCT_MASTER: "product_master",
    INVENTORY_MASTER: "inventory_master",
    STUDIO_MASTER: "studio_master",
    CUSTOMER_MASTER: "customer_master",
    GUEST_MASTER: "guest_master",
    ORDERS: "orders",
    ORDER_ITEMS: "order_items",
    DELIVERY_ADDRESSES: "delivery_addresses",
    ORDER_STATUS_HISTORY: "order_status_history"

};

const SYNC = {

    INTERVAL_MINUTES: 2

};

const PRODUCT_COMPARE_FIELDS = [

    "product_code",
    "sku",
    "product_name",
    "category",
    "brand",
    "description",
    "mrp",
    "nia_price",
    "nia_savings",
    "unit",
    "hsn_code",
    "image_url",
    "is_active"

];

const INVENTORY_COMPARE_FIELDS = [

    "total_stock",
    "reserved_stock",
    "available_stock",
    "reorder_level",
    "inventory_status",
    "warehouse_location"

];

module.exports = {

    SHEETS,
    TABLES,
    SYNC,
    PRODUCT_COMPARE_FIELDS,
    INVENTORY_COMPARE_FIELDS

};