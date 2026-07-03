const inventoryService = require("../../services/inventoryService");

exports.getInventory = async (req, res) => {

    try {

        const result = await inventoryService.getInventory(req.query);

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

exports.updateInventory = async (req, res) => {

    try {

        const result = await inventoryService.updateInventory(
            req.params.productId,
            req.body.stock
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

exports.getInventoryHistory = async (req, res) => {

    try {

        const result = await inventoryService.getInventoryHistory();

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

exports.getInventorySummary = async (req, res) => {

    try {

        const result = await inventoryService.getInventorySummary();

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

exports.getLowStockProducts = async (req, res) => {

    try {

        const result = await inventoryService.getLowStockProducts();

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

exports.getOutOfStockProducts = async (req, res) => {

    try {

        const result = await inventoryService.getOutOfStockProducts();

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