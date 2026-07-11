export function normalizeOrder(order) {
  if (!order) return null;

  const items = (order.order_items || []).map((item) => {
    const quantity = Number(item.quantity || 0);

    const total = Number(item.total_price || 0);

    const price =
      Number(item.offer_price) ||
      Number(item.unit_price) ||
      (quantity > 0 ? total / quantity : 0);

    return {
      id: item.id,
      productName: item.product_name || "-",
      productCode: item.product_code || item.sku || "-",
      quantity,
      price,
      total,
      imageUrl: item.image_url || "",
    };
  });

  return {
    id: order.id,

    orderNumber: order.order_number || "-",

    status: (order.order_status || "pending").toLowerCase(),

    createdAt: order.created_at,

    customerName: order.customer_name || "-",

    mobile: order.customer_mobile || "-",

    studio: order.studio_name || "",
theatre: order.theatre_name || "",

    grandTotal: Number(order.grand_total || 0),

    subtotal: Number(
      order.subtotal ??
      order.total_amount ??
      order.grand_total ??
      0
    ),

    discount: Number(order.discount || 0),

    deliveryCharge: Number(
      order.delivery_charge ??
      order.shipping_charge ??
      0
    ),

    paymentMethod:
      order.payment_method || "Cash on Delivery",

    items,

    address:
      order.delivery_address ||
      order.shipping_address ||
      order.address ||
      "",

    city: order.city || "",

    state: order.state || "",

    pincode: order.pincode || "",
  };
}