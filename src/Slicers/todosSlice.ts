import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './store';
import {TodoSet} from '../Modelo/Dominio/Todos';

import {criaTodoOperacoesConfigurado} from '../Config/Setup';

const todoOperacoes = criaTodoOperacoesConfigurado();

export const todoSlice = createSlice({
    name: 'todos',
    initialState: {todos: <TodoSet | null>null},
    reducers: {
        setTodoSet: (state, action) => {
            state.todos = action.payload;
        },

        loadTodoSet: state => {
            state.todos = todoOperacoes.lista();
        },

        addTodo: (state, action) => {
            state.todos = todoOperacoes.adiciona(state.todos, action.payload);
        },
    },
});

export const {setTodoSet, loadTodoSet, addTodo} = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;

export default todoSlice.reducer;
