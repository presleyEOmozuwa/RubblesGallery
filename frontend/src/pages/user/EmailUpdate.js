import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { emailHandler, getUser } from '../../services/user.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { emailChecker } from './user-helper';
import { toast } from 'react-toastify';

const EmailUpdate = () => {
    const [appuser, setUser] = useState({
        userId: '',
        email: ''
    });

    const { userId, email } = appuser;

    const auth = useAuth();

    const navigate = useNavigate();

    const { httptoken, getToken, setToken } = auth;

    const initialValues =
    {
        email: email,
        isDone: true
    }

    // REQUEST TO SUBMIT USER DATA TO THE SERVER
    const onSubmit = async (values) => {
        const payload = {
            email: values.email,
            isDone: true
        }
        console.log(payload)
        
        const token = getToken("access_token");
        emailHandler("/api/email/update", { payload: payload }, { headers: httptoken(token) }).then((res) => {
            console.log(res.data.status)
            if (res && res.data.status === "email updated successfully") {
                navigate("/auth/user/shared/update");
            }
        }
        ).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
                
                if(error === "you cannot use an old email, provide a new one"){
                    toast.info(error);
                }
            }
        });

    }


    const validationSchema = Yup.object({
        email: Yup.string().required("email field is required").email("invalid email format"),
    })

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
                
                else if(error === "provide a new email address"){
                    toast.info(error);
                }

                else if(error === "you cannot use an old email, provide a new one"){
                    toast.info(error);
                }
                
            }
        });

    }, [httptoken, navigate, getToken, setToken]);


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-4'></div>
                <div className='col-lg-5'>
                    <p className='display-6'>Change your Email</p>
                    <div>
                        <p className='m-0 fw-semibold'> Current email address: </p>
                        <span className='text-success'>{email}</span>
                        <p className='mt-3'>
                            Enter the new email address you would like to associate with your account below.
                        </p>
                        <Formik initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                        >
                            {(formik) => {
                                return (
                                    <Form>
                                        <div className='form-group'>
                                            <label htmlFor='email'> Enter new email </label>
                                            <Field name='email'>
                                                {
                                                    (props) => {
                                                        const { field, meta } = props

                                                        return (
                                                            <>
                                                                <input className='form-control rounded-0' id='username' type='email' value={email} {...field} />
                                                                {emailChecker(formik.values.email, email, meta)? <p className='text-danger'>
                                                                    you cannot use the email address you've entered, because it is the same as your current email address.
                                                                </p> : null}
                                                                {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                            </>
                                                        )
                                                    }
                                                }
                                            </Field>
                                        </div>
                                        <div className="d-grid gap-2 col-6 mt-4">
                                            <button className="btn btn-primary" type="submit"> Update </button>
                                        </div>
                                    </Form>
                                )
                            }}

                        </Formik>
                    </div>
                </div>
                <div className='col-lg-3'></div>
            </div>
        </div>
    );
};

export default EmailUpdate;