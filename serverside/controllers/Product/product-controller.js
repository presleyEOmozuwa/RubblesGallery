const express = require('express');
const { getCategoryList, getCategoryByName } = require('../Category/category-service');
const router = express.Router();
const { getAppUser } = require('../AppUser/appuser-service');
const { getProductlist, getSubProducts, getProduct, getProductWithCategories, createProduct, upDateProduct, deleteProduct } = require('./product-service');
const { addCategoryToProduct, addCategoryToUpdatedProduct, removeCategoryFromProduct } = require('../Utils/product.utils');
const { verifyAccessToken } = require('../Utils/token.utils');



// REQUEST TO CREATE PRODUCT
router.post('/product-form/payload', async (req, res) => {
    try {

        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const { product } = await createProduct(req.body.payload);

            const { categories } = req.body.payload;

            categories.forEach(async (catObj) => {
                if(catObj.ischecked){
                    const category = await getCategoryByName(catObj.catName)
                    await addCategoryToProduct(product._id, category)
                }
            })

            res.send({ "status": "product successfully created", "product": product });
        }

    }
    catch (err) {
        const { message } = err;
        if(message == "please provide required fields"){
            res.status(400).send({ error: message });
        }
        res.status(500).send({ error: message });
    }
});

router.get('/product-list', async (req, res) => {
    try {
            const { count, page } = req.query
            const products = await getProductlist(count, page);
            res.send({ "products": products });
        }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
});


// REQUEST TO GET A SINGLE PRODUCT
router.get('/product-details/:productId', async (req, res) => {
    try {
            const product = await getProduct(req.params.productId);
            res.send({ "product": product });
    }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
});

// REQUEST TO GET ALL SUBCRIPTION PRODUCTS
router.get('/sub/product-list', async (req, res) => {
    try {
            const products = await getSubProducts();
            res.send({ "products": products });
    }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
});


// REQUEST TO GET A SINGLE PRODUCT
router.get('/product/with/categories/:productId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const categorylist = await getCategoryList();

            const productWithCat = await getProductWithCategories(req.params.productId);

            const categories = categorylist.map((cat) => {
                productWithCat.categories.forEach((pc) => {
                    if (cat.catName === pc.catName) {
                        cat.ischecked = true;
                    }
                })
                return cat;
            });

            res.send({ "categories": categories });
        }

    }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
});


// REQUEST TO UPDATE PRODUCT
router.put('/update/product', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const { upDatedProduct } = await upDateProduct(req.body.payload);

            const { categories } = req.body.payload;

            categories.forEach(async (catObj) => {
                if(catObj.ischecked){
                    const category = await getCategoryByName(catObj.catName)
                    await addCategoryToUpdatedProduct(upDatedProduct._id, category)
                }
                if(!catObj.ischecked){
                    const category = await getCategoryByName(catObj.catName)
                    await removeCategoryFromProduct(upDatedProduct._id, category)
                }
            })

            res.send({ "status": "product updated successfully", typeOfItem: upDatedProduct.typeOfItem });

        }

    }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
})


// REQUEST TO DELELE PRODUCT
router.delete('/product-delete/:productId', async (req, res) => {
    try {
        const decodedToken = await verifyAccessToken(req.headers["authorization"]);

        const adminId = decodedToken.user.id;

        const admin = await getAppUser(adminId);

        if (admin.role === "admin") {
            const { deletedItem, isDeleted } = await deleteProduct(req.params.productId);

            if (!isDeleted) {
                throw new Error("product deletion failed");
            }

            res.send({ "status": "product deleted successfully", "deletedItem": deletedItem });
        }

    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
});


module.exports = router;