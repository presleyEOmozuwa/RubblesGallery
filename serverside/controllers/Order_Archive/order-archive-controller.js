const express = require('express');
const router = express.Router();
const { getAppUser } = require('../AppUser/appuser-service')
const { retrieveOrderArchive } = require('./order-archive-service');
const { verifyAccessToken } = require('../Utils/token.utils');

router.get('/order/history', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const orderArchive = await retrieveOrderArchive(user._id);

        res.send({ "orderArchive": orderArchive });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }
})

router.get('/order-details/:sessionId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const orderArchive = await retrieveOrderArchive(user._id);

        const order = orderArchive.orders.find((orderItem) => orderItem.checkoutSessionId === req.params.sessionId);

        if (!order) {
            throw new Error("order not found in archive");
        }

        res.send({ "order": order });
    
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

module.exports = router;