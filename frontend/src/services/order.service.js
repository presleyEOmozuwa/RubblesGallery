import axios from "axios";

export const getOrders = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.get(url, option)
    }
    return response;
}

export const getOrder = async (url, option) => {
    let response;
    if(typeof option === "object"){
        response = await axios.get(url, option)
    }
    return response;
}
