import React, { useState, createContext, useContext } from 'react';
import jwt_decode from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ });
    // const [accessTokenKey, setAccessTokenKey] = useState('');
    // const [refreshTokenKey, setRefreshTokenKey] = useState('');

    const login = (user) => {
        setUser(user);
    }

    // const login = (user, accessTokenKey, refreshTokenKey) => {
    //     setUser(user);
    //     setAccessTokenKey(accessTokenKey);
    //     setRefreshTokenKey(refreshTokenKey);
    // }

    const logout = () => {
        setUser(null);
    }

    const httptoken = (token) => {
        return {
            "Authorization": `Bearer ${token}`
        }
    }
    
    const getToken = (tokename) => {
            return localStorage.getItem(tokename);
    }
    
    const setToken = (tokename, val) => {
        return localStorage.setItem(tokename, val);
    }
    
    const removeToken = (tokename) => {
            localStorage.removeItem(tokename);
    }

    const tokenDecoder = (token) => {
        const decodedToken = jwt_decode(token);
        return {
            id: decodedToken.user.id,
            username: decodedToken.user.username,
            role: decodedToken.user.role,
            accessTokenId: user.accessTokenId,
            refreshTokenId: user.refreshTokenId
        }
    }

    const signout = (acctokename, reftokename) => {
            localStorage.removeItem(acctokename);
            localStorage.removeItem(reftokename);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, httptoken, getToken, setToken, removeToken, tokenDecoder, signout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
