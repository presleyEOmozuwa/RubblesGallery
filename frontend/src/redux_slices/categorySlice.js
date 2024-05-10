import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: []
}

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        categoryReducer: (state, action) => {
            state.categories = action.payload;
        }
    }
})

export const { categoryReducer } = categorySlice.actions;