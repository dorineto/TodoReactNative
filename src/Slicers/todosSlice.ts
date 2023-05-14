import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from './store';
import {Todo, Prioridade} from '../Model/Todos';

export type TodoSet = {
    [Prioridade.Alta]: Array<Todo>;
    [Prioridade.Media]: Array<Todo>;
    [Prioridade.Baixa]: Array<Todo>;
};

const todoSet: TodoSet = {
    [Prioridade.Alta]: [
        {
            id: 1,
            descricao: 'Tarefa com prioridade Alta',
            prioridade: Prioridade.Alta,
        },
        {
            id: 2,
            descricao: 'Terminar esse projeto',
            prioridade: Prioridade.Alta,
        },
    ],
    [Prioridade.Media]: [
        {
            id: 3,
            descricao: 'Tarefa com prioridade Media',
            prioridade: Prioridade.Media,
        },
    ],
    [Prioridade.Baixa]: [
        {
            id: 4,
            descricao: 'Tarefa com prioridade Baixa',
            prioridade: Prioridade.Alta,
        },
        {
            id: 5,
            descricao: 'O estilo desse projeto',
            prioridade: Prioridade.Alta,
        },
    ],
};

export const todoSlice = createSlice({
    name: 'todos',
    initialState: {todos: todoSet},
    reducers: {
        setTodoSet: (state, action) => {
            state.todos = action.payload;
        },
    },
});

export const {setTodoSet} = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;

export default todoSlice.reducer;
