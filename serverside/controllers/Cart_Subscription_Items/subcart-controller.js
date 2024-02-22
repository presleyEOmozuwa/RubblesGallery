const express = require('express');
const router = express.Router();
const { getAppUser } = require('../AppUser/appuser-service');
const {retrieveSubCart, retrieveSubCartPlus } = require('./subcart-service');
const { addProductToSubCart, removeProductFromSubCart } = require('../Utils/cart-subitems-utils');
const { getProduct } = require('../Product/product-service');
const { verifyAccessToken } = require('../Utils/token.utils');

router.post('/sub/addtocart', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id
        
        const user = await getAppUser(userId);

        const subcart = await retrieveSubCart(user._id);

        const product = await getProduct(req.body.productId);

        await addProductToSubCart(subcart._id, product);

        res.send({ "status": "product successfully added to subcart"});

    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

router.get('/sub/cart', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);
        
        const userId = decodedToken.user.id
        
        const user = await getAppUser(userId)
        
        const subcart = await retrieveSubCartPlus(user._id);

        res.send({ "subcart": subcart });
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

// REQUEST FROM LOGGED IN USER TO DELETE CART PRODUCT
router.delete('/sub/removefromcart/:productId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const subcart = await retrieveSubCart(user._id);

        const product = await getProduct(req.params.productId);

        await removeProductFromSubCart(subcart._id, product);

        res.send({  "status": "product removed from cart successfully", "product": product });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;