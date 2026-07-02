function normalize(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();

}

function needsUpdate(googleProduct, dbProduct) {

    if (!dbProduct) {
        return true;
    }

    const fields = [
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

    for (const field of fields) {

        if (normalize(googleProduct[field]) !== normalize(dbProduct[field])) {

            console.log(`🔄 Changed Field: ${field}`);

            return true;

        }

    }

    return false;

}

module.exports = {
    needsUpdate
};