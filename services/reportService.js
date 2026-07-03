const supabase = require("../config/supabase");

// ======================================
// Dashboard Report
// ======================================
const getDashboardReport = async () => {

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      order_date,
      grand_total
    `);

  if (error) throw error;

  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6);

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  let todaySales = 0;
  let weekSales = 0;
  let monthSales = 0;
  let totalRevenue = 0;

  orders.forEach(order => {

    const amount = Number(order.grand_total);

    const orderDate = new Date(order.order_date);

    totalRevenue += amount;

    if (orderDate >= startOfToday) {
      todaySales += amount;
    }

    if (orderDate >= startOfWeek) {
      weekSales += amount;
    }

    if (orderDate >= startOfMonth) {
      monthSales += amount;
    }

  });

  return {

    today_sales: todaySales,

    week_sales: weekSales,

    month_sales: monthSales,

    total_revenue: totalRevenue,

    total_orders: orders.length,

    average_order_value:
      orders.length > 0
        ? Number(
            (totalRevenue / orders.length).toFixed(2)
          )
        : 0

  };

};

// ======================================
// Sales Trend
// ======================================
const getSalesTrend = async () => {

  const { data, error } = await supabase
    .from("orders")
    .select(`
      order_date,
      grand_total
    `)
    .order("order_date", { ascending: true });

  if (error) throw error;

  const trend = {};

  data.forEach(order => {

    const date = order.order_date.substring(0, 10);

    if (!trend[date]) {
      trend[date] = {
        date,
        orders: 0,
        sales: 0
      };
    }

    trend[date].orders += 1;
    trend[date].sales += Number(order.grand_total);

  });

  return Object.values(trend);

};

// ======================================
// Top Products
// ======================================
const getTopProducts = async () => {

  const { data, error } = await supabase
    .from("order_items")
    .select(`
      product_code,
      product_name,
      quantity,
      total_price
    `);

  if (error) throw error;

  const products = {};

  data.forEach(item => {

    if (!products[item.product_code]) {

      products[item.product_code] = {
        product_code: item.product_code,
        product_name: item.product_name,
        total_quantity: 0,
        total_revenue: 0
      };

    }

    products[item.product_code].total_quantity += Number(item.quantity);

    products[item.product_code].total_revenue += Number(item.total_price);

  });

  return Object.values(products)
    .sort((a, b) => b.total_quantity - a.total_quantity);

};

// ======================================
// Order Status Analytics
// ======================================
const getOrderStatusAnalytics = async () => {

  const { data, error } = await supabase
    .from("orders")
    .select(`
      order_status
    `);

  if (error) throw error;

  const statusSummary = {};

  data.forEach(order => {

    if (!statusSummary[order.order_status]) {
      statusSummary[order.order_status] = {
        status: order.order_status,
        orders: 0
      };
    }

    statusSummary[order.order_status].orders++;

  });

  return Object.values(statusSummary)
    .sort((a, b) => b.orders - a.orders);

};

// ======================================
// Customer Analytics
// ======================================
const getCustomerAnalytics = async () => {

  const { data, error } = await supabase
    .from("customer_master")
    .select(`
      total_orders,
      total_spent,
      is_active
    `);

  if (error) throw error;

  const totalCustomers = data.length;

  const activeCustomers = data.filter(
    customer => customer.is_active
  ).length;

  const totalOrders = data.reduce(
    (sum, customer) => sum + Number(customer.total_orders || 0),
    0
  );

  const totalSpent = data.reduce(
    (sum, customer) => sum + Number(customer.total_spent || 0),
    0
  );

  return {

    total_customers: totalCustomers,

    active_customers: activeCustomers,

    total_orders: totalOrders,

    total_spent: totalSpent,

    average_spent:
      totalCustomers > 0
        ? Number((totalSpent / totalCustomers).toFixed(2))
        : 0,

    average_orders:
      totalCustomers > 0
        ? Number((totalOrders / totalCustomers).toFixed(2))
        : 0

  };

};

// ======================================
// Inventory Analytics
// ======================================
const getInventoryAnalytics = async () => {

  const { data, error } = await supabase
    .from("inventory_master")
    .select(`
      available_stock,
      inventory_status
    `);

  if (error) throw error;

  const totalProducts = data.length;

  const totalAvailableStock = data.reduce(
    (sum, item) => sum + Number(item.available_stock || 0),
    0
  );

  const outOfStock = data.filter(
    item => Number(item.available_stock) === 0
  ).length;

  const lowStock = data.filter(
    item =>
      Number(item.available_stock) > 0 &&
      Number(item.available_stock) < 10
  ).length;

  const inStock = totalProducts - outOfStock;

  return {
    total_products: totalProducts,
    in_stock: inStock,
    low_stock: lowStock,
    out_of_stock: outOfStock,
    total_available_stock: totalAvailableStock
  };

};

module.exports = {
    getDashboardReport,
    getSalesTrend,
    getTopProducts,
    getOrderStatusAnalytics,
    getCustomerAnalytics,
    getInventoryAnalytics
};