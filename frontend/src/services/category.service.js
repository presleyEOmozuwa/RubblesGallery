import axios from "axios";

export const getAllCategories = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const getCategory = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}


export const createCategory = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const updateCategory = async (url, payload, option) => {
    let response;
    if(typeof payload === "object" || typeof option === "object"){
        response = await axios.put(url, payload, option)
    }
    return response;
}


export const deleteCategory = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.delete(url, option)
    }
    return response;
}


