import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutFromServer, logoutFromClient } from '../../services/user.service'


const NavbarAdmin = () => {
    let auth = useAuth();
    let { logout, signout, getToken } = auth;
    let navigate = useNavigate();

    const handleLogout = async (event) => {
        event.preventDefault();

        logoutFromClient(logout, signout, navigate);

        logoutFromServer("/api/logout/payload", { renewtoken: getToken("refresh_token") }).then((res) => {
            console.log(res.data.status === "logout successful")

        }).catch((err) => {
            if (err.response) {
                const { error } = err.response.data;
                console.log(error);
            }
        });

    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark m-1">
                <div className="container-fluid">
                    <a className="navbar-brand text-white" href="#">Navbar</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/admin/system'>Admin</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/admin/userlist'>Users</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className='nav-link dropdown-toggle text-white' role="button" data-bs-toggle="dropdown" aria-expanded="false">Forms</a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a className='dropdown-item' href='/admin/productform'>Product</a>
                                    </li>
                                    <li>
                                        <a className='dropdown-item' href='/admin/categoryform'>Category</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/admin/productlist'>Products</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/admin/sub/products'>Subscriptions</a>
                            </li>
                            <li className="nav-item">
                                <a className='nav-link text-white' href='/admin/categorylist'>Categories</a>
                            </li>
                        </ul>
                        <button className="p-1 ms-1 border-0 bg-dark text-white" type='submit' onClick={(e) => handleLogout(e)}>Sign-out</button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavbarAdmin;