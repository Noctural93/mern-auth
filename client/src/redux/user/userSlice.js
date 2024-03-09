import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
    errorMsg: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.errorMsg = action.payload;
            state.loading = false;
            state.error = true;
        }
    }
});

export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;
