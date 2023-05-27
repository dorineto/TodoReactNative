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
            try {
                state.todos = todoOperacoes.adiciona(
                    state.todos,
                    action.payload,
                );
            } catch (e) {
                console.log(`[addTodo]: ${e}`);
            }
        },

        deleteTodo: (state, action) => {
            try {
                state.todos = todoOperacoes.remove(state.todos, action.payload);
            } catch (e) {
                console.log(`[deleteTodo]: ${e}`);
            }
        },
    },
});

export const {setTodoSet, loadTodoSet, addTodo, deleteTodo} = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;

export default todoSlice.reducer;
