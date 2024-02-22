import axios from "axios";

export const getAllProducts = async (url) => {
    const response = await axios.get(url)
    return response;
}

export const getFilteredProducts = async (url) => {
    const response = await axios.get(url)
    return response;
}

export const getProduct = async (url) => {
    const response = await axios.get(url)
    return response;
}

export const getSubProducts = async (url) => {
    const response = await axios.get(url)
    return response;
}

export const getProductWithCategories = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}


export const addItemToCart = async (url, payload, option) => {
    let response;
    if (typeof payload === "object" || typeof option === "object") {
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const getCartItems = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const createProduct = async (url, payload, option) => {
    let response;
    if (typeof payload === "object" || typeof option === "object") {
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const updateProduct = async (url, payload, option) => {
    let response;
    if (typeof payload === "object" || typeof option === "object") {
        response = await axios.put(url, payload, option)
    }
    return response;
}

export const deleteProduct = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.delete(url, option)
    }
    return response;
}

export const deleteCartItem = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.delete(url, option)
    }
    return response;
}
