import axios from "axios";

export const getUserByAdmin = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.get(url, option)
    }
    return response;
}

export const registerUserByAdmin = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const updateUserByAdmin = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.put(url, payload, option)
    }
    return response;
}

export const blockHandler = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.get(url, option)
    }
    return response;
}

export const unblockHandler = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.get(url, option)
    }
    return response;
}

export const clearHandler = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.delete(url, option)
    }
    return response;
}

export const clearOrderArchive = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.delete(url, option)
    }
    return response;
}

export const locationHandler = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.delete(url, option)
    }
    return response;
}


export const deleteUserByAdmin = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.delete(url, option)
    }
    return response;
}

