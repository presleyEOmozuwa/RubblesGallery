import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import { useAuth } from '../../context/AuthContext';
import { getCartItems } from '../../services/product.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';


const ShoppingCartBuilder = () => {
    const [cartObj, setCartObj] = useState({ products: [] });
    const { products } = cartObj;
    
    const [deletedProduct, setDeletedProduct] = useState({ });

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();




    useEffect(() => {
        const token = getToken("access_token");
        getCartItems("/api/cart", { headers: httptoken(token) }).then((res) => {
            console.log(res.data.cart.products);
            if (res && res.data.cart) {
                const cartProducts = res.data.cart.products;
                setCartObj((state) => {
                    return {
                        ...state,
                        products: cartProducts
                    }
                });
            }
        }).catch( async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
                if(error === "product already exist on cart"){
                    toast.info(error);
                }
            }
        });

    }, [JSON.stringify(products), deletedProduct._id, navigate, httptoken, getToken, setToken]);

    return (
        <ShoppingCart products={products} initAmount={0} httptoken={httptoken} getToken={getToken} setDeletedProduct={setDeletedProduct}/>
    );
};

export default ShoppingCartBuilder;