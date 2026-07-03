const orderService = require("../../services/orderService");

exports.getOrders = async (req, res) => {
    try {

        const result = await orderService.getOrders(req.query);

        res.status(200).json({
    success: true,
    ...result
});

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.getOrderById = async (req, res) => {
    try {

        const order = await orderService.getOrderById(req.params.id);

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.updateOrderStatus = async (req, res) => {
    try {

        const result = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};