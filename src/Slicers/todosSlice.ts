import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {RootState} from './store';
import {TodoSet, Todo} from '../Modelo/Dominio/Todos';

import {criaTodoOperacoesConfigurado} from '../Config/Setup';

const todoOperacoes = criaTodoOperacoesConfigurado();

export const addTodo = createAsyncThunk<
    TodoSet,
    Todo,
    {state: {todos: {todos: TodoSet | null}}}
>('todos/addTodo', async (todo: Todo, {getState}) => {
    const {todos} = getState().todos;

    try {
        return await todoOperacoes.adiciona(todos, todo);
    } catch (e) {
        console.log(`[addTodo]: ${e}`);
        throw e;
    }
});

export const deleteTodo = createAsyncThunk<
    TodoSet,
    Todo,
    {state: {todos: {todos: TodoSet | null}}}
>('todos/deleteTodo', async (todo: Todo, {getState}) => {
    const {todos} = getState().todos;

    try {
        return await todoOperacoes.remove(todos, todo);
    } catch (e) {
        console.log(`[deleteTodo]: ${e}`);
        throw e;
    }
});

export const updateTodo = createAsyncThunk<
    TodoSet,
    Todo,
    {state: {todos: {todos: TodoSet | null}}}
>('todos/updateTodo', async (todo: Todo, {getState}) => {
    const {todos} = getState().todos;

    try {
        return await todoOperacoes.atualiza(todos, todo);
    } catch (e) {
        console.log(`[updateTodo]: ${e}`);
        throw e;
    }
});

export const loadTodoSet = createAsyncThunk('todos/loadTodoSet', async () => {
    try {
        return await todoOperacoes.lista();
    } catch (e) {
        console.log(`[loadTodoSet]: ${JSON.stringify(e)}`);
        throw e;
    }
});

export const todoSlice = createSlice({
    name: 'todos',
    initialState: {todos: <TodoSet | null>null},
    reducers: {
        setTodoSet: (state, action) => {
            state.todos = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(addTodo.fulfilled, (state, action) => {
            state.todos = action.payload;
        });
        builder.addCase(deleteTodo.fulfilled, (state, action) => {
            state.todos = action.payload;
        });
        builder.addCase(updateTodo.fulfilled, (state, action) => {
            state.todos = action.payload;
        });
        builder.addCase(loadTodoSet.fulfilled, (state, action) => {
            state.todos = action.payload;
        });
        builder.addCase(loadTodoSet.rejected, (state, action) => {
            console.log(JSON.stringify(action));
        });
    },
});

export const {setTodoSet} = todoSlice.actions;

export const selectTodos = (state: RootState) => state.todos.todos;

export default todoSlice.reducer;
