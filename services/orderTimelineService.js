const supabase = require("../config/supabase");

async function addOrderTimeline(
    orderId,
    status,
    remarks = null,
    updatedBy = "System"
) {

    const { error } = await supabase
        .from("order_status_history")
        .insert({
            order_id: orderId,
            status,
            remarks,
            updated_by: updatedBy
        });

    if (error) {

        console.error(error);

        return false;

    }

    return true;

}

module.exports = {
    addOrderTimeline
};