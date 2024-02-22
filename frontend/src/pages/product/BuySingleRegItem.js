import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { singleRegularHandler } from '../../services/stripe.service'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const SingleRegularItem = ({ cartItems }) => {
    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();


    const handleBuyNow = async (event) => {
        event.preventDefault();
        if (!getToken("access_token")) {
            toast.info("Login to continue");
        }
        else {
            // SINGLE REGULAR ITEM 
            const token = getToken("access_token");
            singleRegularHandler("/api/single/regular/create-checkout-session", { cartItems: cartItems }, { headers: httptoken(token)}).then((res) => {
                if (res && res.data.url) {
                    window.location.href = res.data.url;
                }
            }).catch( async (err) => {
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

    return (
        <>
            <button className='border px-4 py-1 ms-2 bg-danger text-white shadow' onClick={(e) => handleBuyNow(e)}>BuyNow</button>
        </>
    );
};

export default SingleRegularItem;