import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './User.css';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../services/user.service';
import { manageBillingHandler } from '../../services/stripe.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const UserDetails = () => {
    const [appuser, setUser] = useState({
        id: '',
        username: '',
        email: '',
        role: ''
    });

    const { id, username, email, role } = appuser;

    const auth = useAuth();

    const navigate = useNavigate();

    const { httptoken, getToken, setToken } = auth;

    const handleSubPortal = async (event) => {
        event.preventDefault();
        manageBillingHandler("/api/stripe/customer/portal", { headers: httptoken(getToken("access_token")) }).then((res) => {
            console.log(res.data);
            if (res && res.data) {
                window.location.href = res.data.url;
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


    // REQUEST TO RETRIEVE A USER
    useEffect(() => {
        const token = getToken("access_token");
        getUser("/api/user", { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.user) {
                setUser((state) => {
                    let user = res.data.user;
                    const clone = {
                        ...state,
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                    return clone;
                });
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

    }, [httptoken, navigate, getToken, setToken]);


    return (
        <div className='container-fluid'>
            <div className='row mb-5'>
                <div className='col-lg-5'></div>
                <div className='col-lg-5'></div>
                <div className='col-lg-2 text-end'>
                    <span className='fw-semibold'> Hi, {username} </span>
                </div>
            </div>
            <div className='row mb-4 justify-content-center m-3'>
                <div className='col-lg-2'></div>
                <div className='col-lg-4 text-center'>
                    <h5> Profile Info</h5>
                    <div className='p-3 shadow'>
                        <p className='m-0'>Manage, add or remove user profile for personalized experiences.</p>
                        <Link className='text-decoration-none fw-semibold text-success' to='/auth/user/update'>Profile</Link>
                    </div>
                </div>
                <div className='col-lg-4 text-center'>
                    <h5> Login & Security</h5>
                    <div className='p-3 shadow'>
                        <p className='m-0'>Edit login, username and email and password.</p>
                        <Link className='text-decoration-none fw-semibold text-success' to='/auth/user/shared/update'>Login & Security</Link>
                    </div>
                </div>
                <div className='col-lg-2'></div>
            </div>
            <div className='row mb-4 justify-content-center m-3'>
                <div className='col-lg-2'></div>
                <div className='col-lg-4 text-center'>
                    <h5 className=''> Orders & Payments</h5>
                    <div className='p-3 shadow'>
                        <p className='m-0 mb-3'>Track, cancel an order, download invoice or buy again</p>
                        <Link className='text-decoration-none fw-semibold text-success' to='/auth/order/history'>Orders & Payments</Link>
                    </div>
                </div>
                <div className='col-lg-4 text-center'>
                    <h5> Subscriptions</h5>
                    <div className='p-3 shadow'>
                        <p className='m-0 mb-2'>Manage subscriptions, view benefits and payment settings.</p>
                        <button className="btn btn-white p-0 px-5 py-1 border me-1 text-success fw-semibold" onClick={(e) => handleSubPortal(e)}> Portal</button>
                    </div>
                </div>
                <div className='col-lg-2'></div>
            </div>
        </div>
    );
};

export default UserDetails;