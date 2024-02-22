import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import './User.css'
import { useAuth } from '../../context/AuthContext';
import { getUser, updateUser } from '../../services/user.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';


const UserEditForm = () => {
    let [appuser, setUser] = useState({
        username: '',
        email: ''
    });
    let { username, email } = appuser;

    let auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let navigate = useNavigate();

    const initialValues = {
        username: username,
        email: email,
    }

    // REQUEST TO UPDATE A USER (BUTTON CLICK SUBMISSION)
    const onSubmit = async (payload) => {
        console.log(payload)
        const token = getToken("access_token");
        updateUser("/api/update/user", { payload: payload }, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.status === "user updated successfully") {
                navigate('/auth/user')
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


    // REQUEST TO GET A USER
    useEffect(() => {
        const token = getToken("access_token");
        getUser("/api/user", { headers: httptoken(token) }).then((res) => {
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
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
            }
        });

    }, [httptoken, setToken, getToken, navigate]);


    return (
        <div className='container mt-5'>
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

export default UserEditForm;