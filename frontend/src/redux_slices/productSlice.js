import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: []
}

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        productReducer: (state, action) => {
            state.products = action.payload;
        }
    }
})

export const { productReducer } = productSlice.actions;
