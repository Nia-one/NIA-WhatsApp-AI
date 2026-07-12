const supabase = require("../config/supabase");

// ======================================
// Dashboard Report
// ======================================
const getDashboardReport = async () => {

  // Orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      order_date,
      grand_total
    `);

  if (error) throw error;

  // Customer Count
  const { count: totalCustomers, error: customerError } = await supabase
    .from("customer_master")
    .select("*", { count: "exact", head: true });

  if (customerError) throw customerError;

      // Total Products in Catalog
const { count: totalProducts, error: productCountError } =
  await supabase
    .from("product_master")
    .select("*", {
      count: "exact",
      head: true,
    });

if (productCountError) throw productCountError;

  // Total Cost
  const { data: costData, error: costError } = await supabase
    .from("order_items")
    .select("cost");

  if (costError) throw costError;

  // Products Sold
  const { data: productData, error: productError } = await supabase
    .from("order_items")
    .select("quantity");

  if (productError) throw productError;

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

  const totalCost = costData.reduce((sum, item) => {
  return sum + Number(item.cost || 0);
}, 0);

const grossProfit = totalRevenue - totalCost;

const grossMargin =
  totalRevenue > 0
    ? Number(((grossProfit / totalRevenue) * 100).toFixed(2))
    : 0;

const totalProductsSold = productData.reduce((sum, item) => {
  return sum + Number(item.quantity || 0);
}, 0);

  return {

    today_sales: todaySales,

    week_sales: weekSales,

    month_sales: monthSales,

    total_revenue: totalRevenue,

    total_orders: orders.length,

    total_customers: totalCustomers,

    total_products: totalProducts,

    total_cost: totalCost,

    gross_profit: grossProfit,

    gross_margin: grossMargin,

    total_products_sold: totalProductsSold,

    average_order_value:
      orders.length > 0
        ? Number((totalRevenue / orders.length).toFixed(2))
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
      revenue,
      cost,
      gross_profit
`);

  if (error) throw error;

  const products = {};

  data.forEach(item => {

    if (!products[item.product_code]) {

      products[item.product_code] = {
    product_code: item.product_code,
    product_name: item.product_name,
    total_quantity: 0,
    total_revenue: 0,
    total_cost: 0,
    gross_profit: 0
};

    }

    products[item.product_code].total_quantity += Number(item.quantity);

    products[item.product_code].total_revenue += Number(item.revenue || 0);

    products[item.product_code].total_cost += Number(item.cost || 0);

    products[item.product_code].gross_profit += Number(item.gross_profit || 0);

  });

  return Object.values(products)
    .map(product => ({

        ...product,

        gross_margin:
            product.total_revenue > 0
                ? Number(((product.gross_profit / product.total_revenue) * 100).toFixed(2))
                : 0

    }))
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

    const normalizedStatus = order.order_status
      ?.toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());


    if (!statusSummary[normalizedStatus]) {

      statusSummary[normalizedStatus] = {
        status: normalizedStatus,
        orders: 0
      };

    }


    statusSummary[normalizedStatus].orders++;

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

// ======================================
// Studio Analytics
// ======================================
// ======================================
// Studio Analytics
// ======================================

const getStudioAnalytics = async () => {

const {
    data: orderItems,
    error: orderItemsError,
} = await supabase
    .from("order_items")
    .select(`
        studio_id,
        quantity
    `);

if (orderItemsError) throw orderItemsError;

  const { data, error } = await supabase
    .from("orders")
    .select(`
    studio_id,
    customer_id,
    studio_name,
    theatre_name,
    grand_total,
    discount_amount,
    delivery_charge,
    order_date,
    studio_master (
        studio_name,
        theatre_name,
        city,
        state,
        is_active
    )
`);

  if (error) throw error;


  const studioSummary = {};

  const studioCustomers = {};

  const productsSold = {};

  orderItems.forEach((item) => {

    const studioId = item.studio_id || "Unknown";

    if (!productsSold[studioId]) {

        productsSold[studioId] = 0;

    }

    productsSold[studioId] += Number(item.quantity || 0);

});

  data.forEach(order => {

    const studioId = order.studio_id || "Unknown";

    if (!studioCustomers[studioId]) {

    studioCustomers[studioId] = new Set();

}

if (order.customer_id) {

    studioCustomers[studioId].add(order.customer_id);

}


    const studioName =
  order.studio_master?.studio_name ||
  order.studio_name ||
  "Unknown";


    if (!studioSummary[studioId]) {

    studioSummary[studioId] = {

        studio_id: studioId,

        studio_name: studioName,

        theatre_name:
            order.studio_master?.theatre_name ||
            order.theatre_name ||
            "Unknown",

        city:
            order.studio_master?.city || "",

        state:
            order.studio_master?.state || "",

        is_active:
            order.studio_master?.is_active ?? true,

        total_customers: 0,

        total_orders: 0,

        products_sold: 0,

        total_revenue: 0,

        total_discount: 0,

        total_delivery_charge: 0,

        total_cost: 0,

        gross_profit: 0,

        first_order_date: order.order_date,

        last_order_date: order.order_date

    };

}


    studioSummary[studioId].total_orders += 1;

studioSummary[studioId].total_customers =
    studioCustomers[studioId].size;

    studioSummary[studioId].products_sold =
    productsSold[studioId] || 0;

studioSummary[studioId].total_revenue +=
    Number(order.grand_total || 0);

studioSummary[studioId].total_discount +=
    Number(order.discount_amount || 0);

studioSummary[studioId].total_delivery_charge +=
    Number(order.delivery_charge || 0);

// studioSummary[studioId].total_cost +=
//     Number(order.total_cost || 0);

// studioSummary[studioId].gross_profit +=
//     Number(order.gross_profit || 0);

studioSummary[studioId].total_cost +=
    Number(order.total_cost || 0);

studioSummary[studioId].gross_profit +=
    Number(order.gross_profit || 0);

// First Order Date
if (
    order.order_date &&
    order.order_date < studioSummary[studioId].first_order_date
) {
    studioSummary[studioId].first_order_date =
        order.order_date;
}

// Last Order Date
if (
    order.order_date &&
    order.order_date > studioSummary[studioId].last_order_date
) {
    studioSummary[studioId].last_order_date =
        order.order_date;
}

  });


  return Object.values(studioSummary)
    .map((studio) => ({

        ...studio,

        average_order_value:
            studio.total_orders > 0
                ? Number(
                    (
                        studio.total_revenue /
                        studio.total_orders
                    ).toFixed(2)
                )
                : 0,

        gross_margin:
            studio.total_revenue > 0
                ? Number(
                    (
                        (studio.gross_profit /
                            studio.total_revenue) *
                        100
                    ).toFixed(2)
                )
                : 0

    }))
    .sort(
        (a, b) =>
            b.total_revenue - a.total_revenue
    );

};

// ======================================
// Orders Report
// ======================================

const getOrdersReport = async () => {

  const { data, error } = await supabase
    .from("orders")
   .select(`
      order_number,
      order_date,
      customer_name,
      customer_mobile,
      studio_name,
      theatre_name,
      subtotal,
      delivery_charge,
      discount_amount,
      grand_total,
      payment_mode,
      payment_status,
      order_status,
      remarks
`)
    .order("order_date", {
      ascending: false
    });


  if (error) throw error;


  return data.map(order => ({

    order_number: order.order_number,

    order_date: order.order_date,

    customer_name: order.customer_name,

    customer_mobile: order.customer_mobile,

    studio_name: order.studio_name,
    theatre_name: order.theatre_name,

    subtotal: Number(order.subtotal || 0),

    delivery_charge: Number(order.delivery_charge || 0),

    discount_amount: Number(order.discount_amount || 0),

    grand_total: Number(order.grand_total || 0),

    payment_mode: order.payment_mode,

    payment_status: order.payment_status,

    order_status: order.order_status,

    remarks: order.remarks || ""

  }));

};

// ======================================
// Inventory Report
// ======================================

const getInventoryReport = async () => {

  const { data, error } = await supabase
    .from("inventory_master")
    .select(`
      product_name,
      total_stock,
      available_stock,
      inventory_status,
      last_stock_update,
      product_master (
        sku,
        category,
        brand,
        purchase_rate,
        mrp,
        nia_price,
        nia_savings,
        unit
      )
    `)
    .order("product_name", {
      ascending: true
    });


  if (error) throw error;


  return data.map(item => ({

    product_name: item.product_name,

    sku: item.product_master?.sku || "",

    category: item.product_master?.category || "",

    brand: item.product_master?.brand || "",

    total_stock: Number(item.total_stock || 0),

    available_stock: Number(item.available_stock || 0),

    inventory_status: item.inventory_status,

    purchase_rate: Number(
      item.product_master?.purchase_rate || 0
    ),

    mrp: Number(
      item.product_master?.mrp || 0
    ),

    nia_price: Number(
      item.product_master?.nia_price || 0
    ),

    nia_savings: Number(
      item.product_master?.nia_savings || 0
    ),

    unit: item.product_master?.unit || "",

    last_stock_update: item.last_stock_update

  }));

};


// ======================================
// Customer Report
// ======================================

const getCustomerReport = async () => {

  const { data, error } = await supabase
    .from("customer_master")
    .select(`
      customer_name,
      mobile_number,
      total_orders,
      total_spent,
      last_order_date,
      preferred_language,
      is_active,
      created_at,
      studio_name,
      theatre_name
`)
    .order("created_at", {
      ascending: false
    });


  if (error) throw error;


  return data.map(customer => ({

    customer_name: customer.customer_name || "",

    mobile_number: customer.mobile_number || "",

    studio_name: customer.studio_name || "",

    theatre_name: customer.theatre_name || "",

    total_orders: Number(
      customer.total_orders || 0
    ),

    total_spent: Number(
      customer.total_spent || 0
    ),

    average_order_value:
      Number(customer.total_orders || 0) > 0
        ?
        Number(
          (
            Number(customer.total_spent || 0) /
            Number(customer.total_orders || 0)
          ).toFixed(2)
        )
        :
        0,

    last_order_date: customer.last_order_date,

    preferred_language:
      customer.preferred_language || "",

    is_active:
      customer.is_active ? "Active" : "Inactive",

    created_at: customer.created_at

  }));

};


// ======================================
// Product Report
// ======================================

const getProductReport = async () => {

  const { data, error } = await supabase
    .from("product_master")
    .select(`
      product_name,
      sku,
      category,
      brand,
      purchase_rate,
      mrp,
      nia_price,
      nia_savings,
      unit,
      is_active,
      created_at
    `)
    .order("product_name", {
      ascending: true
    });


  if (error) throw error;


  return data.map(product => ({

    product_name: product.product_name || "",

    sku: product.sku || "",

    category: product.category || "",

    brand: product.brand || "",

    purchase_rate: Number(
      product.purchase_rate || 0
    ),

    mrp: Number(
      product.mrp || 0
    ),

    nia_price: Number(
      product.nia_price || 0
    ),

    nia_savings: Number(
      product.nia_savings || 0
    ),

    unit: product.unit || "",

    status:
      product.is_active
        ? "Active"
        : "Inactive",

    created_at: product.created_at

  }));

};


// ======================================
// Sales Report Export
// ======================================

// ======================================
// Sales Report Export
// ======================================

const getSalesReport = async () => {


  const { data, error } = await supabase
    .from("orders")
    .select(`
      
      order_number,
      order_date,
      studio_name,
      theatre_name,
      payment_mode,
      payment_status,
      order_status,

      order_items (
        product_code,
        product_name,
        quantity,
        selling_price,
        product_mrp,
        nia_savings,
        revenue,
        cost,
        gross_profit,
        customer_name,
        customer_mobile

      )

    `)
    .order("order_date", {
      ascending: false
    });


  if (error) {
    throw error;
  }


  const salesReport = [];


  data.forEach(order => {


    order.order_items.forEach(item => {


      const revenue =
        Number(item.revenue || 0);


      const grossProfit =
        Number(item.gross_profit || 0);


      salesReport.push({

        order_number:
          order.order_number,


        order_date:
          order.order_date,


        customer_name:
          item.customer_name || "",


        customer_mobile:
          item.customer_mobile || "",


        studio_name:
          order.studio_name || "",

          theatre_name:
  order.theatre_name || "",


        product_code:
          item.product_code || "",


        product_name:
          item.product_name || "",


        quantity:
          Number(item.quantity || 0),


        selling_price:
          Number(item.selling_price || 0),


        product_mrp:
          Number(item.product_mrp || 0),


        nia_savings:
          Number(item.nia_savings || 0),


        revenue,


        cost:
          Number(item.cost || 0),


        gross_profit:
          grossProfit,


        gross_margin:
          revenue > 0
            ?
            Number(
              (
                (grossProfit / revenue) * 100
              ).toFixed(2)
            )
            :
            0,


        payment_mode:
          order.payment_mode,


        payment_status:
          order.payment_status,


        order_status:
          order.order_status


      });


    });


  });


  return salesReport;


};

const getStudioReport = async () => {

    const { data, error } = await supabase
        .from("studio_master")
        .select(`
            studio_code,
            studio_name,
            theatre_code,
            theatre_name,
            city,
            state,
            address,
            contact_person,
            contact_number,
            is_active,
            created_at
        `)
        .order("theatre_name", { ascending: true })
        .order("studio_name", { ascending: true });

    if (error) throw error;

    return data;

};


module.exports = {
    getDashboardReport,
    getSalesTrend,
    getTopProducts,
    getOrderStatusAnalytics,
    getCustomerAnalytics,
    getInventoryAnalytics,
    getStudioAnalytics,
    getOrdersReport,
    getInventoryReport,
      getCustomerReport,
      getProductReport,
       getSalesReport,
       getStudioReport,
};