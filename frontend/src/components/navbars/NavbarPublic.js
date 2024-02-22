import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavbarPublic = () => {
    const auth = useAuth();
    const { getToken } = auth;
    
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
                            {!getToken("access_token") ? <li className="nav-item">
                                <a className='nav-link text-white' href='/'>Home</a>
                            </li> : <li className="nav-item">
                                <a className='nav-link text-white' href='/auth/show'>Products</a>
                            </li>}
                            
                            {!getToken("access_token") ? <li className="nav-item">
                                <Link data-testid="registerLink" className="nav-link text-white" to="/register">Register</Link>
                            </li> : <li className="nav-item">
                                <a className="nav-link text-white" href='/auth/user'>Account</a>
                            </li>}

                            {!getToken("access_token") ? <li className="nav-item">
                                <a className='nav-link text-white' href='/login'>Login</a>
                            </li> : <li className="nav-item">
                                <a className='nav-link text-white' href='/auth/sub/products'>Subscriptions</a>
                            </li>}

                            {!getToken("access_token") ? <li className="nav-item">
                                <a className='nav-link text-white' href='/cart/guest'>Guest</a>
                            </li> : <li className="nav-item">
                                <a className='nav-link text-white' href='/auth/order/history'>Orders</a>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavbarPublic;