function buildOrderAttribution(actorMobile, context = {}) {
    const isRetailerOrder = context.userType === "RETAILER";
    const beneficiaryMobile = isRetailerOrder
        ? context.beneficiaryMobile
        : (context.beneficiaryMobile || actorMobile);

    if (!beneficiaryMobile || (isRetailerOrder && !context.retailerId)) {
        return null;
    }

    return {
        isRetailerOrder,
        beneficiaryMobile,
        orderSource: isRetailerOrder ? "RETAILER" : "DIRECT_CUSTOMER",
        retailerId: isRetailerOrder ? context.retailerId : null,
        placedByName: isRetailerOrder ? (context.retailerName || "Retailer") : null,
        placedByMobile: actorMobile
    };
}

module.exports = { buildOrderAttribution };
