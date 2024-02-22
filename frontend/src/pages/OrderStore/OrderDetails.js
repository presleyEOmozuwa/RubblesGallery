import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrder } from '../../services/order.service'
import { totalBeforeTax, totalAfterTax } from './helper'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import './OrderStore.css'
import { toast } from 'react-toastify';

const OrderDetails = () => {
    const [order, setOrder] = useState({});

    const params = useParams();
    const { sessionId } = params;

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    const handleViewInvoice = async (event) => {
        event.preventDefault();
        navigate(`/auth/order/details/invoice/${sessionId}`)
    }

    useEffect(() => {
        const token = getToken("access_token");
        getOrder(`/api/order-details/${sessionId}`, { headers: httptoken(token) }).then((res) => {
            if (res && res?.data.order) {
                console.log(res?.data.order)
                setOrder(res.data.order);
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

    }, [navigate, httptoken, getToken, setToken]);

    return (
        <div className='container justify-content-center p-3'>
            <div className='row justify-content-center'>
                <div className='col-lg-4'>
                    <p className='display-6'>Order Details</p>
                </div>
                <div className='col-lg-4'></div>
                <div className='col-lg-4'></div>
            </div>
            <div className='row justify-content-center mb-3'>
                <div className='col-lg-5'>
                    <p className='m-0'> <span className='fw-semibold'> Ordered on</span> {order.orderplaced}</p>
                </div>
                <div className='col-lg-3'>
                    <p className='m-0'> <span className='fw-semibold'> Order</span> {order.orderNumber}</p>
                </div>
                <div className='col-lg-4'>
                    <button className="btn btn-white p-0 px-3 border me-1 " onClick={(e) => handleViewInvoice(e)}><small> View or Print invoice </small></button>
                </div>
            </div>
            <div className='row justify-content-center mb-3'>
                <div className='col-lg-4'>
                    <span className='fw-semibold'>Shipping Address</span>
                    <p className='m-0'>{order.customerAddress?.name}</p>
                    <p className='m-0'>{order.customerAddress?.postalcode}</p>
                </div>
                <div className='col-lg-4'>
                    <span className='fw-semibold'>Payment Method</span>
                    <p><small className='border text-primary fw-bold'>VISA</small> ending in {order.last4}</p>
                </div>
                <div className='col-lg-4'>
                    <span className='fw-semibold'> Order Summary </span>
                    <div>
                        <span className='me-5'>Items(s) Subtotal:</span>
                        <span> ${order.orderTotal} </span>
                    </div>
                    <div>
                        <span className='me-5'>Shipping & Handling:</span>
                        <span> ${order.shipping} </span>
                    </div>
                    <div>
                        <span className='me-5'>Total before tax:</span>
                        <span> ${totalBeforeTax(order.orderTotal, order.shipping)} </span>
                    </div>
                    <div>
                        <span className='me-5'>Estimated tax:</span>
                        <span> ${order.tax}</span>
                    </div>
                    <div>
                        <span className='me-5 fw-semibold'>Grand total:</span>
                        <span> ${totalAfterTax(order.orderTotal, order.shipping, order.tax)} </span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default OrderDetails;