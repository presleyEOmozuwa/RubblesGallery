import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { checkoutFailureMultipleHandler } from '../../services/stripe.service'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const CheckoutFailureRegular = () => {

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const { sessionId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        checkoutFailureMultipleHandler(`/api/checkout/failure/regular/${sessionId}`, { headers: httptoken(getToken("access_token")) }).then((res) => {
            if (res && res.data) {
                console.log(res.data.status);
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
        
    }, [navigate, httptoken, getToken, sessionId])
    

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-4'></div>
                <div className='col-lg-4'>
                    <h2> Stripe Failure Page For Regular Items </h2>
                </div>
                <div className='col-lg-4'></div>
            </div>
        </div>
    );
};

export default CheckoutFailureRegular;