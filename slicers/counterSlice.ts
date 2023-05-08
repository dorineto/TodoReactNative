import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './store';

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: state => {
            state.value += 1;
        },

        setCount: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const {increment, setCount} = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
