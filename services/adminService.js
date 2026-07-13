const supabase = require("../config/supabase");


// ======================================
// Dashboard Summary
// ======================================
const getDashboardSummary = async () => {

  const today = new Date();

  const todayStart = new Date(today);
  todayStart.setHours(0,0,0,0);

  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(today.getDate() - 1);
  yesterdayStart.setHours(0,0,0,0);


  const [
    todayOrders,
    yesterdayOrders,
    customers,
    products,
    lowStock
  ] = await Promise.all([


    // Today's Orders
    supabase
      .from("orders")
      .select("grand_total, order_status", { count:"exact" })
      .gte("order_date", todayStart.toISOString()),


    // Yesterday Orders
    supabase
      .from("orders")
      .select("grand_total", { count:"exact" })
      .gte("order_date", yesterdayStart.toISOString())
      .lt("order_date", todayStart.toISOString()),


    // Customers
    supabase
      .from("customer_master")
      .select("*", { count:"exact" }),


    // Active Products
    supabase
      .from("product_master")
      .select("id", {
        count:"exact",
        head:true
      })
      .eq("is_active", true),


    // Low Stock
    supabase
      .from("inventory_master")
      .select("*", { count:"exact" })
      .lt("available_stock",10)

  ]);


  if(todayOrders.error) throw todayOrders.error;
  if(yesterdayOrders.error) throw yesterdayOrders.error;
  if(customers.error) throw customers.error;
  if(products.error) throw products.error;
  if(lowStock.error) throw lowStock.error;


  const todayRevenue = todayOrders.data.reduce(
    (sum,order)=>sum + Number(order.grand_total),
    0
  );


  const yesterdayRevenue = yesterdayOrders.data.reduce(
    (sum,order)=>sum + Number(order.grand_total),
    0
  );


  const calculateGrowth = (today,yesterday)=>{

    if(yesterday === 0){
      return today > 0 ? 100 : 0;
    }

    return Number(
      (((today-yesterday)/yesterday)*100).toFixed(1)
    );
  };


  return {

    total_orders: todayOrders.count,

    total_customers: customers.count,

    total_products: products.count,

    total_revenue: todayRevenue,


    orders_growth: calculateGrowth(
      todayOrders.count,
      yesterdayOrders.count
    ),


    revenue_growth: calculateGrowth(
      todayRevenue,
      yesterdayRevenue
    ),


    pending_orders:
      todayOrders.data.filter(
        order=>order.order_status==="Pending"
      ).length,


    low_stock_products: lowStock.count

  };

};

// ======================================
// Recent Orders
// ======================================
const getRecentOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      order_number,
      order_date,
      order_status,
      grand_total,
      customer_master (
        customer_name,
        mobile_number
      )
    `)
    .order("order_date", { ascending: false })
    .limit(10);

  if (error) throw error;

  return data.map(order => ({
    order_number: order.order_number,
    customer_name: order.customer_master?.customer_name || null,
    mobile_number: order.customer_master?.mobile_number || null,
    order_date: order.order_date,
    status: order.order_status,
    total_amount: order.grand_total
  }));
};

// ======================================
// Low Stock Products
// ======================================
const getLowStockProducts = async () => {
  const { data, error } = await supabase
    .from("inventory_master")
    .select(`
      product_code,
      product_name,
      available_stock,
      reorder_level,
      inventory_status
    `)
    .lt("available_stock", 10)
    .order("available_stock", { ascending: true });

  if (error) throw error;

  return data;
};

// ======================================
// Order Details
// ======================================
const getOrderDetails = async (orderId) => {

  const [
    order,
    items,
    timeline
  ] = await Promise.all([

    supabase
      .from("orders")
      .select(`
        id,
        order_number,
        order_date,
        order_status,
        payment_mode,
        payment_status,
        subtotal,
        delivery_charge,
        discount_amount,
        grand_total,
        remarks,
        customer_master (
          customer_name,
          mobile_number
        )
      `)
      .eq("id", orderId)
      .single(),

    supabase
      .from("order_items")
      .select(`
        product_code,
        product_name,
        quantity,
        unit_price,
        total_price
      `)
      .eq("order_id", orderId),

    supabase
      .from("order_status_history")
      .select(`
        status,
        remarks,
        updated_by,
        created_at
      `)
      .eq("order_id", orderId)
      .order("created_at", { ascending: true })

  ]);

  if (order.error) throw order.error;
  if (items.error) throw items.error;
  if (timeline.error) throw timeline.error;
  if (!order.data) {
  throw new Error("Order not found");
}

  return {
    order: order.data,
    items: items.data,
    timeline: timeline.data
  };
};

// ======================================
// Update Order Status
// ======================================
const updateOrderStatus = async (
  orderId,
  status,
  remarks,
  updatedBy
) => {

  // Update Order
  const { error: orderError } = await supabase
    .from("orders")
    .update({
      order_status: status,
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId);

  if (orderError) throw orderError;

  // Insert Timeline
  const { error: historyError } = await supabase
    .from("order_status_history")
    .insert({
      order_id: orderId,
      status,
      remarks,
      updated_by: updatedBy
    });

  if (historyError) throw historyError;

  return {
    message: "Order status updated successfully"
  };
};

module.exports = {
    getDashboardSummary,
    getRecentOrders,
    getLowStockProducts,
    getOrderDetails,
    updateOrderStatus
};