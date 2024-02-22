const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../Utils/token.utils');
const { createOrder } = require('./order-service');
const { getAppUser } = require('../AppUser/appuser-service')
const { multipleRegularItemsHandler } = require('../Utils/multiple-regular-item-utils');
const { singleRegularItemHandler } = require('../Utils/single-regular-items-utils');
const { addCartItemToOrder } = require('../Utils/order-utils');

router.post('/regular/multiple/create-checkout-session', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const session = await multipleRegularItemsHandler(user, req.body.cartItems);

        const order = await createOrder(user, session);

        req.body.cartItems.forEach(async (item) => {
            await addCartItemToOrder(order._id, item);
        })

        res.send({ "url": session.url });
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }


})

router.post('/single/regular/create-checkout-session', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const session = await singleRegularItemHandler(user, req.body.cartItems);

        const order = await createOrder(user, session);

        req.body.cartItems.forEach(async (item) => {
            await addCartItemToOrder(order._id, item);
        })

        res.send({ "url": session.url });
    }
    catch (err) {
        res.status(400).send({ "error": err.message });
    }


})

module.exports = router;