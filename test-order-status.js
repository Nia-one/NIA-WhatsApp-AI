require("dotenv").config();

const {
    updateOrderStatus
} = require("./services/orderStatusService");

async function test() {

    const success = await updateOrderStatus(

        "531ca1e6-f8c8-4369-80bb-714270d3ff9f",

        "Confirmed",

        "Order accepted by warehouse",

        "Admin"

    );

    console.log("Result :", success);

}

test();