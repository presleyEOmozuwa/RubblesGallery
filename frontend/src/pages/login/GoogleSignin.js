import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const GoogleSignin = () => {
    let auth = useAuth();
    let { getToken, setToken, tokenDecoder, login } = auth;
    const navigate = useNavigate();

    const sender = async (res) => {
        try {
            const payload = {
                clientId: res.clientId,
                token: res.credential
            }

            console.log(payload)
            const val = await axios.post("/api/google-signin", { payload: payload });
            console.log("User successfully logged in");

            if (val && val?.data.status === "login successful") {
                setToken("access_token", val.data.accToken);
                setToken("refresh_token", val.data.renewToken);

                let appuser = tokenDecoder(getToken("access_token"));

                login(appuser);

                const { role } = appuser;

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

        } 
        catch (err) {
            if (err && err.response) {
                const { error } = err.response.data;
                if (error === "authentication failed, contact google") {
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
                
            }
        }
    }

    
    
    return (
        <>
            <GoogleLogin
                onSuccess={(response) => {
                    console.log(response);
                    sender(response);
                }}
                type="outline"
                shape="circle"
                onError={() => console.log('Login Failed')}
            />
        </>
    );
};

export default GoogleSignin;