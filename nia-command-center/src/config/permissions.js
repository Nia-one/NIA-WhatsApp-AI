export const rolePermissions = {
  // =====================================
  // ADMIN (Full System Access)
  // =====================================
  admin: ["*"],

  // =====================================
  // OPERATIONS
  // =====================================
  operations: [
    "/",
    "/orders",
    "/inventory",
    "/customers",
    "/guests",
    "/studios",

    "/reports",
    "/reports/sales",
    "/reports/orders",
    "/reports/customers",
    "/reports/products",
    "/reports/inventory",
    "/reports/studios",
  ],

  // =====================================
  // FOUNDER (Read Only)
  // =====================================
  founder: [
    "/",
    "/orders",
    "/inventory",
    "/customers",
    "/guests",
    "/studios",

    "/reports",
    "/reports/sales",
    "/reports/orders",
    "/reports/customers",
    "/reports/products",
    "/reports/inventory",
    "/reports/studios",
  ],

  // =====================================
  // ANALYTICS
  // =====================================
  analytics: [
    "/",

    "/reports",
    "/reports/sales",
    "/reports/orders",
    "/reports/customers",
    "/reports/products",
    "/reports/inventory",
    "/reports/studios",
  ],
};