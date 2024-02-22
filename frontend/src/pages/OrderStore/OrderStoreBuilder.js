import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getOrders } from '../../services/order.service'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';
import OrderHistory from './OrderHistory.js';


const OrderStoreBuilder = () => {
    const [orderStore, setOrder] = useState({ orders: [] });

    const { orders } = orderStore;

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken("access_token");
        getOrders("/api/order/history", { headers: httptoken(token) }).then((res) => {
            if (res && res?.data.orderArchive) {
                setOrder((state) => {
                    console.log(res.data.orderArchive.orders);
                    return {
                        ...state,
                        orders: res.data.orderArchive.orders
                    }
                })
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

    }, [JSON.stringify(orders), navigate, httptoken, getToken, setToken]);

    if (orders.length === 0) {
        return (
            <div className='container-fluid mt-3 p-3 vh-100 shared'>
                <div className='row'>
                    <div className='col-lg-3'></div>
                    <div className='col-lg-6'>
                        <h1 className='fw-light text-center pt-2 align-self-center'> Orders & Payments </h1>
                        <div className='text-center mt-4'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum aspernatur facere! Similique dolores sequi repellendus assumenda, nobis enim, quod aspernatur numquam error eum iste?</p>
                        </div>
                    </div>
                    <div className='col-lg-3'></div>
                </div>
                <div className='row mt-4 show-cart'>
                    <div className='col-sm-3'></div>
                    <div className='col-sm-6 p-5 shadow empty'>
                        <p className='display-5 mb-2'> No Order History Yet! </p>
                        <Link className='me-1 border py-1 px-3 bg-danger text-white fw-bolder shadow text-decoration-none' to='/auth/show'> Shop Now </Link>
                    </div>
                    <div className='col-sm-3'></div>
                </div>

            </div>
        )
    }

    return (
        <React.Fragment>
            {orders.map((order, i) => {
                return (
                    <OrderHistory key={i} order={order} />
                )
            })}
        </React.Fragment>
    )

};

export default OrderStoreBuilder;