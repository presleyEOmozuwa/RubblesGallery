import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { blockHandler, unblockHandler  } from '../../services/admin.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import { toast } from 'react-toastify';

const UserBlockAdmin = () => {

    // ID OF THE USER ADMIN WANTS TO BLOCK
    let { userId } = useParams();
    
    let auth = useAuth();
    let { httptoken, getToken, setToken } = auth;

    let navigate = useNavigate();

    const handleBlock = () => {
        const token = getToken("access_token");
        blockHandler(`/api/admin/user-block/${userId}`, { headers: httptoken(token) }).then((res) => {
            if (res && res.data.blocked === "user successfully blocked") {
                toast.info(res.data.blocked, { autoClose: 3000 });
                setTimeout(() => {
                    navigate('/admin/userlist');
                }, 3000)
            }

        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
                if(error === "user already blocked"){
                    toast.info(error, { autoClose: 3000 });
                    setTimeout(() => {
                        navigate('/admin/userlist');
                    }, 3000)
                }
            }
        });
    }

    const handleUnblock = () => {
        const token = getToken("access_token");
        unblockHandler(`/api/admin/user-unblock/${userId}`, { headers: httptoken(token) }).then((res) => {
            if (res && res.data.unblocked === "user successfully unblocked") {
                toast.info(res.data.unblocked, { autoClose: 3000 });
                setTimeout(() => {
                    navigate('/admin/userlist');
                }, 3000)
            }

        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
                if(error === "user already unblocked"){
                    toast.info(error, { autoClose: 3000 });
                    setTimeout(() => {
                        navigate('/admin/userlist');
                    }, 3000)
                }
            }
        });
    }


    return (
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-lg-2'></div>
                <div className='col-lg-8 border text-center shadow p-3'>
                    <p className='display-6 m-0'> Block user </p>
                    <p className='p-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eumLorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eumLorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fuga laudantium repellendus consequatur ratione eum</p>
                    <div>
                        <div className='text-center'>
                            <button className='btn btn-danger rounded-0 shadow p-0 px-4 py-1  m-2' type='submit' onClick={(e) => handleBlock(e)}>Block</button>
                            <button className='btn btn-primary rounded-0 shadow p-0 px-4 py-1' type='submit' onClick={(e) => handleUnblock(e)}>Unblock</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-2'></div>
            </div>
        </div>
    );
};

export default UserBlockAdmin;