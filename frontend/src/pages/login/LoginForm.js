import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import GoogleSignin from './GoogleSignin';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/user.service';

const LoginForm = () => {

    const initialValues = {
        email: '',
        password: '',
        rememberMe: '',
        useToken: ''
    }

    // let [error, setError] = useState(false);

    let auth = useAuth();
    let { getToken, setToken, tokenDecoder, login } = auth;

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().required("email field is required").email("invalid email format"),
        password: Yup.string().required("password field is required")
    })


    // REQUEST TO AUTHENTICATE WITH THE SERVER
    const onSubmit = async (values, onSubmitProps) => {
        console.log(values)
        loginUser("/api/login/payload", values, { withCredentials: true }).then((res) => {
            if (res && res?.data.status === "login successful") {
                onSubmitProps.resetForm();
                
                setToken("access_token", res.data.accToken);
                setToken("refresh_token", res.data.renewToken);
                
                const user = tokenDecoder(getToken("access_token"));
                const { role } = user;

                login(user);

                if (role === "admin") {
                    return navigate('/admin/system', { replace: true })
                }
                else if (role === "client") {
                    return navigate('/auth/user', { replace: true })
                }
                else {
                    return navigate('/', { replace: true });
                }
            }
            else if(res && res.data.status === "otp sent to user"){
                return navigate(`/otp/2fa/${res.data.userId}`);
            }
    
        }).catch((err) => {
            if (err && err.response) {
                const { error } = err.response.data;
                if (error === "email and password fields are required") {
                    // onSubmitProps.resetForm();
                    toast.info(error);
                }
                if (error === "email is associated to a closed account") {
                    // onSubmitProps.resetForm();
                    toast.info(error);
                }
                if (error === "email is associated to a blocked account") {
                    // onSubmitProps.resetForm();
                    toast.info("your account has been blocked, call customer support for help.", { autoClose: 6000 });
                }
                if (error === "invalid email or password") {
                    // onSubmitProps.resetForm();
                    toast.info(error);
                }

            }
        });
    }


    return (
        <div className='container-fluid pt-5 bg-primary mx-auto vh-100 login-section'>
            <div className='row'>
                <div className='col-lg-4'></div>
                <div className='col-lg-4 border p-4 bg-white shadow-lg mt-2'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {
                            (formik) => {
                                const handleRememberMe = (event) => {
                                    const { target } = event;
                                    const { checked, value } = target;
                                    if(checked){
                                        formik.values.rememberMe = value
                                        return;
                                    }
                                }
                            
                                const handleUseToken = (event) => {
                                    const { target } = event;
                                    const { checked, value } = target;
                                    if(checked){
                                        formik.values.useToken = value
                                        return;
                                    }
                                }

                                return (
                                    <Form>
                                        <div className='form-group sect mb-3'>
                                            <label className='me-5' htmlFor='email'>Email</label>
                                            <Field name='email'>
                                                {
                                                    (props) => {
                                                        const { field, meta } = props
                                                        return (
                                                            <>
                                                                <input className='form-control rounded-0' id='email' {...field} type='email' noValidate />
                                                                {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                            </>
                                                        )
                                                    }
                                                }
                                            </Field>
                                        </div>
                                        <div className='form-group sect mb-3'>
                                            <label htmlFor='password'>Password</label>
                                            <Field name='password'>
                                                {
                                                    (props) => {
                                                        const { field, meta } = props

                                                        return (
                                                            <>
                                                                <input className='form-control rounded-0' id='password' {...field} type='password' />
                                                                {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                            </>
                                                        )
                                                    }
                                                }
                                            </Field>
                                        </div>
                                        <span className='me-5'>
                                            <Field>
                                                {(props) => {
                                                    return (
                                                        <input className='form-check-input m-1' type='checkbox' value='remember me' onChange={(e) => handleRememberMe(e)} id='remember me'/>
                                                    )
                                                }}
                                                
                                            </Field>
                                            <label htmlFor='remember me'>Remember me</label>
                                        </span>
                                        <span className='ms-5'>
                                            <Field>
                                                {(props) => {
                                                    return (
                                                        <input className='form-check-input m-1' id='use token' type='checkbox' value='use token' onChange={(e) => handleUseToken(e)} />
                                                    )
                                                }}
                                            </Field>
                                            <label htmlFor='use token'>Use token</label>
                                        </span>
                                        <div className='ms-1 mt-2'>
                                            <a href='/forgot/password'>forgot password?</a>
                                        </div>

                                        <div className='text-center mt-3'>
                                            <button className='btn btn-primary rounded-0 shadow px-5 fw-bold' type='submit'>Login</button>
                                        </div>
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                    <div className='mt-3'>
                        <GoogleSignin />
                    </div>
                    <div className='mt-2'>
                        <span className='fw-bold'> Don't have an account? </span><Link className='fw-bold' to='/register'> Register here</Link>
                    </div>

                </div>
                <div className='col-lg-4'></div>
            </div>
        </div>
    );
};

export default LoginForm;