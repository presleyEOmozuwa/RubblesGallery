import React from 'react';
import './Admin.css';

const Admin = () => {
    return (
        <div className='container-fluid mt-1 mx-auto vh-100 admin-section'>
            <div className='row'>
                <div className='col-lg-4'></div>
                <div className='col-lg-4 admin'>
                    <p className='display-2 text-white '> Administrator </p>
                </div>
                <div className='col-lg-4 takeTwo'></div>
            </div>
        </div>
    );
};

export default Admin;