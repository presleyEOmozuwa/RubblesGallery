import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarPublic from '../navbars/NavbarPublic';
import NavbarAdmin from '../navbars/NavbarAdmin';
import NavbarAuthUser from '../navbars/NavbarAuthUser';


export const LayoutPublic = () => {
    return (
        <>
            <NavbarPublic />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}

export const LayoutAdmin = () => {
    return (
        <>
            <NavbarAdmin />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}

export const LayoutAuthUser = () => {
    return (
        <>
            <NavbarAuthUser />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}