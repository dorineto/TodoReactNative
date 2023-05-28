import {configureStore} from '@reduxjs/toolkit';
import todosSliceReducer from './todosSlice';
import {useDispatch} from 'react-redux';

export const store = configureStore({
    reducer: {todos: todosSliceReducer},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
