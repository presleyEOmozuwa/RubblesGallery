import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addItemToCart } from '../../services/product.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const AddToCart = ({ productId, typeOfItem }) => {

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    const handleAddtoCart = async (event) => {
        event.preventDefault();
        if (!getToken("access_token")) {
            addItemToCart("/api/addtocart/guestUser", { productId: productId }, { withCredentials: true }).then((res) => {
                if (res && res.data.status === "product successfully added to cart") {
                    navigate("/cart/guest");
                }
            }).catch(async (err) => {
                console.log(err);
                const { error } = err.response.data;
                if (err.response) {
                    console.log(error);
                }
            });
        }
        else {
            if (typeOfItem === "regular") {
                addItemToCart("/api/addtocart/loggedInUser", { productId: productId }, { headers: httptoken(getToken("access_token")) }).then((res) => {
                    if (res && res.data.status === "product successfully added to cart") {
                        navigate("/auth/shoppingcart");
                    }
                }).catch(async (err) => {
                    console.log(err);
                    const { error } = err.response.data;
                    if (err.response) {
                        if (error === "access token expired") {
                            await tokenRenewalHandler(navigate, getToken, setToken, toast);
                        }
                    }
                });
            }
            else {
                addItemToCart("/api/sub/addtocart", { productId: productId }, { headers: httptoken(getToken("access_token")) }).then((res) => {
                    if (res && res.data.status === "product successfully added to subcart") {
                        navigate("/auth/sub/shoppingcart");
                    }
                }).catch(async (err) => {
                    console.log(err);
                    const { error } = err.response.data;
                    if (err.response) {
                        if (error === "access token expired") {
                            await tokenRenewalHandler(navigate, getToken, setToken, toast);
                        }
                    }
                });
            }

        }
    }


    return (
        <>
            <span className='mt-1'>
                <button className='border px-4 py-1 ms-2 bg-primary text-white shadow' onClick={(e) => handleAddtoCart(e)}>Add to Cart</button>
            </span>
        </>
    );
};

export default AddToCart;