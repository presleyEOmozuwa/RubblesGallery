import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: []
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userReducer: (state, action) => {
            state.users = action.payload;
        }
    }
})

export const { userReducer } = userSlice.actions;