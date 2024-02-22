import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import './Admin'
import { useAuth } from '../../context/AuthContext';
import { getUserByAdmin, updateUserByAdmin, clearHandler } from '../../services/admin.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';


const UserEditAdminForm = () => {
    const [appuser, setUser] = useState({
        username: '',
        email: ''
    });
    const { username, email } = appuser;

    const params = useParams();
    const { userId } = params;

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    const initialValues = {
        username: username,
        email: email,
    }

    // REQUEST TO UPDATE A USER (BUTTON CLICK SUBMISSION)
    const onSubmit = async (values) => {
        const payload = {
            userId: userId,
            username: values.username,
            email: values.email
        }

        console.log(payload);

        const token = getToken("access_token");
        updateUserByAdmin("/api/admin/user-update", { payload: payload }, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.status === "user updated successfully") {
                navigate('/admin/userlist')
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

    const handleClearOrders = (event) => {
        event.preventDefault();
        clearHandler(`/api/admin/clear-orders/${userId}`, { headers: httptoken(getToken("access_token")) }).then((res) => {
            console.log(res.data);
            if (res && res.data.status === "orders cleared from archive") {
                toast.info(res.data.status);
                navigate('/admin/userlist')
            }
        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
                if (error === "orders already cleared out") {
                    toast.info(error);
                }
            }

        })

    }


    // REQUEST TO GET A USER
    useEffect(() => {
        const token = getToken("access_token");
        getUserByAdmin(`/api/admin/get-user/${userId}`, { headers: httptoken(token) }).then((res) => {
            setUser((state) => {
                let user = res.data.user;
                const clone = {
                    ...state,
                    username: user.username,
                    email: user.email
                }
                return clone;
            });
        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate,getToken, setToken, toast);
                }
            }
        });

    }, [httptoken, setToken, getToken, userId, navigate]);


    return (
        <div className='container mt-5'>
            <div className='row mb-3'>
                <div className='col-lg-4'></div>
                <div className='col-lg-5'>

                </div>
                <div className='col-lg-3'>
                    <button className='btn btn-success rounded-0 shadow p-0 px-2' type='submit' onClick={(e) => handleClearOrders(e)}> Clear archived orders </button>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-4'></div>
                <div className='col-sm-4 border p-4 shadow-lg mt-2'>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        onSubmit={onSubmit}
                    >
                        {
                            (formik) => {

                                return (
                                    <Form>
                                        <div className='form-group sect mb-3'>
                                            <label htmlFor='username'>User Name</label>
                                            <Field name='username'>
                                                {
                                                    (props) => {
                                                        const { field } = props

                                                        return (
                                                            <div>
                                                                <input className='form-control rounded-0' id='username' {...field} type='text' />
                                                            </div>
                                                        )
                                                    }
                                                }
                                            </Field>
                                        </div>
                                        <div className='form-group sect mb-3'>
                                            <label htmlFor='email'>Email</label>
                                            <Field name='email'>
                                                {
                                                    (props) => {
                                                        const { field } = props

                                                        return (
                                                            <div>
                                                                <input className='form-control rounded-0' id='email' {...field} type='text' />
                                                            </div>
                                                        )
                                                    }
                                                }
                                            </Field>
                                        </div>
                                        <div className='text-center'>
                                            <button className='btn btn-primary rounded-0 shadow px-3 fw-bold' type='submit'>Update</button>
                                        </div>
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                </div>
                <div className='col-sm-4'></div>
            </div>
        </div>
    );
};

export default UserEditAdminForm;