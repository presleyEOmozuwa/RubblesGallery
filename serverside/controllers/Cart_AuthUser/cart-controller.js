const express = require('express');
const router = express.Router();
const { getAppUser } = require('../AppUser/appuser-service');
const { retrieveCart, retrieveCartPlus } = require('./cart-service');
const { addProductToCart, removeProductFromCart } = require('../Utils/cart-util');
const { getProduct } = require('../Product/product-service');
const { verifyAccessToken } = require('../Utils/token.utils');


router.post('/addtocart/loggedInUser', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id
        
        const user = await getAppUser(userId);

        const cart = await retrieveCart(user._id);

        const product = await getProduct(req.body.productId);

        const shoppingcart = await addProductToCart(cart._id, product);

        res.send({ "status": "product successfully added to cart", "shoppingcart": shoppingcart });

    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

router.get('/cart', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);
        
        const userId = decodedToken.user.id
        
        const user = await getAppUser(userId)
        
        const cart = await retrieveCartPlus(user._id);

        res.send({ "cart": cart });
    }
    catch (err) {
        res.status(500).send({ "error": err.message });
    }
})

// REQUEST FROM LOGGED IN USER TO DELETE CART PRODUCT
router.delete('/removefromcart/:productId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const userId = decodedToken.user.id;

        const user = await getAppUser(userId);

        const cart = await retrieveCart(user._id);

        const product = await getProduct(req.params.productId);

        await removeProductFromCart(cart._id, product);

        res.send({ "isProductRemoveFromCart": true, "status": "product removed from cart successfully", "product": product });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


module.exports = router;
