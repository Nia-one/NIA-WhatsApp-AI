require("dotenv").config();

const {
    readProductMaster
} = require("./services/googleSheets/inbound/productSync");

(async () => {

    const products = await readProductMaster();

    console.log(products);

})();