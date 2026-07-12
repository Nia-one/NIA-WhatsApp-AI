const {
    generateExcel,
    generateCSV
} = require("../../services/exportService");

const {
    getDashboardReport,
    getOrdersReport,
    getInventoryReport,
    getCustomerReport,
    getProductReport,
    getSalesReport
    
} = require("../../services/reportService");


// ======================================
// Test Export Controller
// ======================================

exports.exportTestReport = async (req, res) => {

    try {

        const type = req.query.type || "xlsx";


        const columns = [
            {
                header: "ID",
                key: "id"
            },
            {
                header: "Name",
                key: "name"
            }
        ];


        const data = [
            {
                id: 1,
                name: "NIA Export Test"
            }
        ];


        if (type === "csv") {

            const csv = generateCSV({
                columns,
                data
            });


            res.header(
                "Content-Type",
                "text/csv"
            );

            res.attachment(
                "nia_export_test.csv"
            );

            return res.send(csv);

        }


        const buffer = await generateExcel({
            sheetName: "Test",
            columns,
            data
        });


        res.header(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.attachment(
            "nia_export_test.xlsx"
        );


        return res.send(buffer);


    } catch (error) {

        console.error(
            "Export Error:",
            error
        );


        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ======================================
// Dashboard Export
// ======================================

exports.exportDashboardReport = async (req, res) => {

    try {

        const report = await getDashboardReport();


        const columns = [
            {
                header: "Metric",
                key: "metric"
            },
            {
                header: "Value",
                key: "value"
            }
        ];


        const data = Object.keys(report).map(key => ({
            metric: key,
            value: report[key]
        }));


        // CSV Export

        if (req.query.type === "csv") {

            const csv = generateCSV({
                columns,
                data
            });


            res.header(
                "Content-Type",
                "text/csv"
            );


            res.attachment(
                "nia_dashboard_report.csv"
            );


            return res.send(csv);

        }


        // Excel Export

        const buffer = await generateExcel({

            sheetName: "Dashboard",

            columns,

            data

        });


        res.header(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.attachment(
            "nia_dashboard_report.xlsx"
        );


        return res.send(buffer);


    } catch (error) {


        console.error(
            "Dashboard Export Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Orders Export
// ======================================

exports.exportOrdersReport = async (req, res) => {

    try {

        const orders = await getOrdersReport();


        const columns = [
            {
                header: "Order Number",
                key: "order_number"
            },
            {
                header: "Order Date",
                key: "order_date"
            },
            {
                header: "Customer Name",
                key: "customer_name"
            },
            {
                header: "Mobile",
                key: "customer_mobile"
            },
            {
                header: "Studio",
                key: "studio_name"
            },

            {
    header: "Theatre",
    key: "theatre_name"
},

            {
                header: "Subtotal",
                key: "subtotal"
            },
            {
                header: "Delivery Charge",
                key: "delivery_charge"
            },
            {
                header: "Discount",
                key: "discount_amount"
            },
            {
                header: "Grand Total",
                key: "grand_total"
            },
            {
                header: "Payment Mode",
                key: "payment_mode"
            },
            {
                header: "Payment Status",
                key: "payment_status"
            },
            {
                header: "Order Status",
                key: "order_status"
            }
        ];


        if (req.query.type === "csv") {

            const csv = generateCSV({
                columns,
                data: orders
            });


            res.header(
                "Content-Type",
                "text/csv"
            );


            res.attachment(
                "nia_orders_report.csv"
            );


            return res.send(csv);

        }


        const buffer = await generateExcel({

            sheetName: "Orders",

            columns,

            data: orders

        });


        res.header(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.attachment(
            "nia_orders_report.xlsx"
        );


        return res.send(buffer);


    } catch (error) {

        console.error(
            "Orders Export Error:",
            error
        );


        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

// ======================================
// Inventory Export
// ======================================

exports.exportInventoryReport = async (req, res) => {

    try {

        const inventory = await getInventoryReport();


        const columns = [

            {
                header: "Product Name",
                key: "product_name"
            },

            {
                header: "SKU",
                key: "sku"
            },

            {
                header: "Category",
                key: "category"
            },

            {
                header: "Brand",
                key: "brand"
            },

            {
                header: "Total Stock",
                key: "total_stock"
            },

            {
                header: "Available Stock",
                key: "available_stock"
            },

            {
                header: "Status",
                key: "inventory_status"
            },

            {
                header: "Purchase Rate",
                key: "purchase_rate"
            },

            {
                header: "MRP",
                key: "mrp"
            },

            {
                header: "NIA Price",
                key: "nia_price"
            },

            {
                header: "Savings",
                key: "nia_savings"
            },

            {
                header: "Unit",
                key: "unit"
            },

            {
                header: "Last Stock Update",
                key: "last_stock_update"
            }

        ];


        if (req.query.type === "csv") {

            const csv = generateCSV({
                columns,
                data: inventory
            });


            res.header(
                "Content-Type",
                "text/csv"
            );


            res.attachment(
                "nia_inventory_report.csv"
            );


            return res.send(csv);

        }


        const buffer = await generateExcel({

            sheetName: "Inventory",

            columns,

            data: inventory

        });


        res.header(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.attachment(
            "nia_inventory_report.xlsx"
        );


        return res.send(buffer);


    } catch(error) {


        console.error(
            "Inventory Export Error:",
            error
        );


        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

// ======================================
// Customer Export
// ======================================

exports.exportCustomerReport = async (req, res) => {

    try {

        const customers = await getCustomerReport();


        const columns = [

            {
                header: "Customer Name",
                key: "customer_name"
            },

            {
                header: "Mobile Number",
                key: "mobile_number"
            },

            {
                header: "Studio",
                key: "studio_name"
            },

            {
    header: "Theatre",
    key: "theatre_name"
},

            {
                header: "Total Orders",
                key: "total_orders"
            },

            {
                header: "Total Spent",
                key: "total_spent"
            },

            {
                header: "Average Order Value",
                key: "average_order_value"
            },

            {
                header: "Last Order Date",
                key: "last_order_date"
            },

            {
                header: "Preferred Language",
                key: "preferred_language"
            },

            {
                header: "Status",
                key: "is_active"
            },

            {
                header: "Created At",
                key: "created_at"
            }

        ];


        if (req.query.type === "csv") {

            const csv = generateCSV({
                columns,
                data: customers
            });


            res.header(
                "Content-Type",
                "text/csv"
            );


            res.attachment(
                "nia_customer_report.csv"
            );


            return res.send(csv);

        }


        const buffer = await generateExcel({

            sheetName: "Customers",

            columns,

            data: customers

        });


        res.header(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.attachment(
            "nia_customer_report.xlsx"
        );


        return res.send(buffer);


    } catch(error) {


        console.error(
            "Customer Export Error:",
            error
        );


        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

// ======================================
// Product Export
// ======================================

exports.exportProductReport = async (req, res) => {

    try {

        const products = await getProductReport();


        const columns = [

            {
                header: "Product Name",
                key: "product_name"
            },

            {
                header: "SKU",
                key: "sku"
            },

            {
                header: "Category",
                key: "category"
            },

            {
                header: "Brand",
                key: "brand"
            },

            {
                header: "Purchase Rate",
                key: "purchase_rate"
            },

            {
                header: "MRP",
                key: "mrp"
            },

            {
                header: "NIA Price",
                key: "nia_price"
            },

            {
                header: "Savings",
                key: "nia_savings"
            },

            {
                header: "Unit",
                key: "unit"
            },

            {
                header: "Status",
                key: "status"
            },

            {
                header: "Created At",
                key: "created_at"
            }

        ];


        if (req.query.type === "csv") {

            const csv = generateCSV({
                columns,
                data: products
            });


            res.header(
                "Content-Type",
                "text/csv"
            );


            res.attachment(
                "nia_product_report.csv"
            );


            return res.send(csv);

        }


        const buffer = await generateExcel({

            sheetName: "Products",

            columns,

            data: products

        });


        res.header(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.attachment(
            "nia_product_report.xlsx"
        );


        return res.send(buffer);


    } catch(error) {


        console.error(
            "Product Export Error:",
            error
        );


        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

// ======================================
// Sales Export
// ======================================

exports.exportSalesReport = async (req, res) => {

    try {

        const sales = await getSalesReport();


        const columns = [

            {
                header: "Order Number",
                key: "order_number"
            },

            {
                header: "Order Date",
                key: "order_date"
            },

            {
                header: "Customer Name",
                key: "customer_name"
            },

            {
                header: "Customer Mobile",
                key: "customer_mobile"
            },

            {
                header: "Studio Name",
                key: "studio_name"
            },

            {
    header: "Theatre Name",
    key: "theatre_name"
},

            {
                header: "Product Code",
                key: "product_code"
            },

            {
                header: "Product Name",
                key: "product_name"
            },

            {
                header: "Quantity",
                key: "quantity"
            },

            {
                header: "Selling Price",
                key: "selling_price"
            },

            {
                header: "Product MRP",
                key: "product_mrp"
            },

            {
                header: "NIA Savings",
                key: "nia_savings"
            },

            {
                header: "Revenue",
                key: "revenue"
            },

            {
                header: "Cost",
                key: "cost"
            },

            {
                header: "Gross Profit",
                key: "gross_profit"
            },

            {
                header: "Gross Margin %",
                key: "gross_margin"
            },

            {
                header: "Payment Mode",
                key: "payment_mode"
            },

            {
                header: "Payment Status",
                key: "payment_status"
            },

            {
                header: "Order Status",
                key: "order_status"
            }

        ];


        if (req.query.type === "csv") {


            const csv = generateCSV({
                columns,
                data: sales
            });


            res.header(
                "Content-Type",
                "text/csv"
            );


            res.attachment(
                "nia_sales_report.csv"
            );


            return res.send(csv);

        }


        const buffer = await generateExcel({

            sheetName: "Sales",

            columns,

            data: sales

        });


        res.header(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.attachment(
            "nia_sales_report.xlsx"
        );


        return res.send(buffer);


    } catch(error) {


        console.error(
            "Sales Export Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

