import { configureStore } from '@reduxjs/toolkit';
import  { productSlice } from '../redux_slices/productSlice';
import { userSlice } from '../redux_slices/userSlice';
import { categorySlice } from '../redux_slices/categorySlice';

const store = configureStore({
    reducer: {
        product: productSlice.reducer,
        user: userSlice.reducer,
        category: categorySlice.reducer,
    }
})

export default store;