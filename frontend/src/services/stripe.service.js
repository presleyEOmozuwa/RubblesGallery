import axios from "axios";

export const manageBillingHandler = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const checkoutSuccessMultiple = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const checkoutFailureMultipleHandler = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const checkoutFailureSingleHandler = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const regularSingleHistory = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const regularMultipleHistory = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const singleSubHistory = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const multipleSubHistory = async (url, option) => {
    let response;
    if (typeof option === "object") {
        response = await axios.get(url, option)
    }
    return response;
}

export const singleRegularHandler = async (url, payload, option) => {
    let response;
    if (typeof payload === "object" || typeof option === "object") {
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const singleSubHandler  = async (url, payload, option) => {
    let response;
    if (typeof payload === "object" || typeof option === "object") {
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const multipleRegularHandler  = async (url, payload, option) => {
    let response;
    if (typeof payload === "object" || typeof option === "object") {
        response = await axios.post(url, payload, option)
    }
    return response;
}

export const multipleSubHandler  = async (url, payload, option) => {
    let response;
    if (typeof payload === "object" || typeof option === "object") {
        response = await axios.post(url, payload, option)
    }
    return response;
}






