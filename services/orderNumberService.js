const supabase = require("../config/supabase");

async function generateOrderNumber() {

    const today = new Date();

    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const prefix = `NIA${yy}${mm}${dd}`;

    const { count } = await supabase
        .from("orders")
        .select("*", {
            count: "exact",
            head: true
        })
        .like("order_number", `${prefix}%`);

    const next = String((count || 0) + 1).padStart(4, "0");

    return `${prefix}${next}`;
}

module.exports = {
    generateOrderNumber
};