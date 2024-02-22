const express = require('express');
const router = express.Router();
const { getProduct } = require('../Product/product-service');
const { objCheckerOne } = require('../Utils/obj-checker-utils');

// router.post('/api/addtocart/guestUser', async (req, res) => {
//     try {
//         // SETTING AN ARRAY IN SESSION TO HOLD GUEST PRODUCTS
//         req.session.products ??= [];

//         const product = await getProduct(req.body.productId);

//         // IF ARRAY IS EMPTY, ADD PRODUCT
//         if (!req.session.products ) {
//             req.session.products.push(product);
//             res.send({ "status": "product successfully added to cart" });
//         }

//         // IF NOT EMPTY, CHECK IF PRODUCT ALREADY EXIST
//         const isProductInCart = req.session.products.some((item) => item._id === product._id);

//         if (isProductInCart) {
//             throw new Error("product already exist on cart")
//         }

//         req.session.products.push(product);
//         res.send({ "status": "product successfully added to cart", "isProductAdded": true })

//     }
//     catch (err) {
//         res.status(400).send({ error: err.message });
//     }

// })

// router.post('/api/addtocart/guestUser', async (req, res) => {
//     try {
//         // SETTING AN ARRAY IN SESSION TO HOLD GUEST PRODUCTS
//         req.session.products = [];
//         const product = await getProduct(req.body.productId);
//         console.log(req.sessionID);
//         console.log(req.session.id);
//         console.log(req.session.products);

//         // IF ARRAY IS EMPTY, ADD PRODUCT
//         if (!req.session.products.includes(product) ) {
//             req.session.products.push(product);
//             res.send({ "status": "product successfully added to cart" });
//         }
//         else{
//             throw new Error("product already exist on cart")
//         }

//     }
//     catch (err) {
//         res.status(400).send({ error: err.message });
//     }

// })

// router.post('/addtocart/guestUser', async (req, res) => {
//     try {
//         // SETTING AN ARRAY IN SESSION TO HOLD GUEST PRODUCTS
//         req.session.products ??= [];
//         const product = await getProduct(req.body.productId);
//         const found = req.session.products.find((item) => item._id === product._id); 
        
//         if(!found || objCheckerOne(found) === 0){
//             req.session.products.push(product);
//             console.log(req.sessionStore);
//             res.send({ "status": "product successfully added to cart" });
//         }
//         else{
//             throw new Error("product already exist");
//         }
//     }
//     catch (err) {
//         const { message } = err;
//         if(message == "product already exist"){
//             res.status(400).send({ error: message });
//         }
//         res.status(500).send({ error: message });
//     }

// })

router.post('/addtocart/guestUser', async (req, res) => {
    try {
        // SETTING AN ARRAY IN SESSION TO HOLD GUEST PRODUCTS
        const itemlist = req.session.products = [];
        const product = await getProduct(req.body.productId);
        
        if(itemlist.indexOf(product) === -1) {
            itemlist.push(product);
            res.send({ "status": "product successfully added to cart"});
        }
        else{
            throw new Error("product already exist");
        }
    }
    catch (err) {
        const { message } = err;
        if(message == "product already exist"){
            res.status(400).send({ error: message });
        }
        res.status(500).send({ error: message });
    }

})


// REQUEST FROM UNREGISTERED USER TO GET SESSION CART ITEMS 
router.get('/shopping-cart/guestUser', (req, res) => {
    try {

        if (!req.session.products) {
            throw new Error("cart is empty");
        }

        res.send({ "cart": { products: req.session.products } })

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


// REQUEST FROM UNREGISTERED USER TO DELETE A PRODUCT FROM SESSION CART
router.post('/delete-item/guestUser', (req, res) => {
    try {

        const product = req.session.products?.find((p) => p._id === req.body.productId);

        if (!product) {
            throw new Error("product not found, nothing to delete");
        }

        let index = req.session.products?.indexOf(product);
        req.session.products?.splice(index, 1);

        res.send({ "status": "product removed from cart successfully", "deletedItem": product });

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});



module.exports = router;

