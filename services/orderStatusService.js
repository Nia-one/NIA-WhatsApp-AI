const supabase = require("../config/supabase");
const {
    addOrderTimeline
} = require("./orderTimelineService");

const {
    logSection,
    logInfo,
    logSuccess,
    logError
} = require("../utils/logger");

async function updateOrderStatus(
    orderId,
    status,
    remarks,
    updatedBy
) {

    logSection("UPDATE ORDER STATUS");

    logInfo("Order ID", orderId);
    logInfo("Status", status);

    const { error } = await supabase
        .from("orders")
        .update({

            order_status: status,
            remarks: remarks,
            updated_at: new Date()

        })
        .eq("id", orderId);

    if (error) {

        logError("Order status update failed");

        console.error(error);

        return false;

    }

    logSuccess("Order status updated");

const timelineCreated = await addOrderTimeline(

    orderId,

    status,

    remarks,

    updatedBy

);

if (timelineCreated) {

    logSuccess("Order timeline updated");

} else {

    logError("Order timeline update failed");

}

return true;
}



module.exports = {
    updateOrderStatus
};