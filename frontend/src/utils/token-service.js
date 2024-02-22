import axios from "axios";
import jwt_decode from "jwt-decode";


export const httpRequestoken = (token) => {
    return {
        "Authorization": `Bearer ${token}`
    }
}


export const sendRefreshToken = async (url, refreshToken) => {
    let con = { isVerified: false, entryToken: '', renewToken: '', bug: '' };
    try {
        const res = await axios.post(url, { backupToken: refreshToken });
        console.log(res.data);

        if (res && res.data) {
            const { entryToken, renewToken } = res.data;
            con.entryToken = entryToken;
            con.renewToken = renewToken;
            con.isVerified = true;
        }

    } catch (err) {
        const { error } = err.response.data;
        con.bug = error;
    }

    return con;
}


export const tokenDecoder = (token) => {
    const decodedToken = jwt_decode(token);
    const payload = {
        id: decodedToken.user.id,
        firstname: decodedToken.user.firstname,
        role: decodedToken.user.role,
    }
    return payload;
}

export const getToken = (tokename) => {
    return localStorage.getItem(tokename);
}

export const setToken = (tokename, val) => {
    return localStorage.setItem(tokename, val);
}

export const removeToken = (tokename) => {
    localStorage.removeItem(tokename);
}

export const signout = (acctokename, reftokename) => {
    let refreshToken = localStorage.getItem(reftokename);
    localStorage.removeItem(acctokename);
    localStorage.removeItem(reftokename);
    return refreshToken;
}
