import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../services/user.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const SharedEditView = () => {
    const [appuser, setUser] = useState({
        userId: '',
        username: '',
        email: ''
    });

    const { userId, username, email } = appuser;

    const auth = useAuth();

    const navigate = useNavigate();

    const { httptoken, getToken, setToken } = auth;


    const handleUserName = async (event) => {
        event.preventDefault();
        navigate("/auth/user/username/update");
    }

    const handleEmail = async (event) => {
        event.preventDefault();
        navigate("/auth/user/email/update");
    }

    const handlePassword = async (event) => {
        event.preventDefault();
        navigate("/auth/user/passwordchange/update");
    }

    // REQUEST TO RETRIEVE A USER
    useEffect(() => {
        getUser("/api/user", { headers: httptoken(getToken("access_token")) }).then((res) => {
            console.log(res.data);
            if (res && res.data.user) {
                setUser((state) => {
                    let user = res.data.user;
                    const clone = {
                        ...state,
                        userId: user._id,
                        username: user.username,
                        email: user.email
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
        <div className='container px-5'>
            <div className='row mb-3'>
                <div className='col-lg-3'>
                </div>
                <div className='col-lg-6 ms-0'>
                    <p className='display-6'>Login & Security</p>
                </div>
                <div className='col-lg-3'></div>
            </div>
            <div className='row mb-4 justify-content-center'>
                <div className='col-lg-6'>
                    <p className='m-0'>UserName :</p>
                    <span> {username} </span>
                </div>
                <div className='col-lg-6 p-2'>
                    <button className="btn btn-white p-0 px-5 py-1 border me-1 fw-semibold" onClick={(e) => handleUserName(e)}> Edit </button>
                </div>
            </div>
            <div className='row mb-4 justify-content-center'>
                <div className='col-lg-6'>
                    <p className='m-0'>Email :</p>
                    <span> {email} </span>
                </div>
                <div className='col-lg-6 p-2'>
                    <button className="btn btn-white p-0 px-5 py-1 border me-1 fw-semibold" onClick={(e) => handleEmail(e)}> Edit </button>
                </div>
            </div>
            <div className='row mb-4 justify-content-center'>
                <div className='col-lg-6'>
                    <p className='m-0'>Password :</p>
                    <span> change password </span>
                </div>
                <div className='col-lg-6 p-2'>
                    <button className="btn btn-white p-0 px-5 py-1 border me-1 fw-semibold" onClick={(e) => handlePassword(e)}> Edit </button>
                </div>
            </div>
        </div>
    );

}
export default SharedEditView;