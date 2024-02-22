import axios from "axios";

export const getAllUsers = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.get(url, option)
    }
    return response;
}

export const getUser = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.get(url, option)
    }
    return response;
}


export const registerAdminUser = async (url, payload) => {
    let response;
    if(typeof payload === "object"){
        response = await axios.post(url, payload)
    }
    return response;
}

export const registerUser = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const loginUser = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const logoutFromServer = async (url, option) => {
    let response;
    if(typeof payload === "object"){
        response = await axios.put(url, option)
    }
    return response;
}

export const logoutFromClient = (logout, signout, navigate) => {
    logout();
    signout("access_token", "refresh_token");
    navigate('/');
}

export const forgotPasswordHandler = async (url, payload) => {
    let response;
    if(typeof payload === "object"){
        response = await axios.post(url, payload)
    }
    return response;
}

export const OTPHandler = async (url, payload) => {
    let response;
    if(typeof payload === "object"){
        response = await axios.post(url, payload)
    }
    return response;
}

export const resetPasswordHandler = async (url, payload) => {
    let response;
    if(typeof payload === "object"){
        response = await axios.post(url, payload)
    }
    return response;
}

export const updateUser = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.put(url, payload, option)
    }
    return response;
}

export const deleteUser = async (url, option) => {
    let response;
    if(typeof payload === "object"){
        response = await axios.delete(url, option)
    }
    return response;
}

export const userNameHandler = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.put(url, payload, option)
    }
    return response;
}

export const emailHandler = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.put(url, payload, option)
    }
    return response;
}

export const passwordChangeHandler = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.put(url, payload, option)
    }
    return response;
}



