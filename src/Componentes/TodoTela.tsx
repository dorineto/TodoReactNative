import React from 'react';
import {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectTodos, loadTodoSet} from '../Slicers/todosSlice';
import TodoLista from './TodoLista';
import {TodoFormsAdiciona} from './TodoFormsAdiciona';

export default function TodoTela(): JSX.Element {
    const dispatch = useDispatch();
    const todos = useSelector(selectTodos);

    const loadTodoSetCallback = useCallback(() => {
        dispatch(loadTodoSet());
    }, [dispatch]);

    useEffect(() => {
        loadTodoSetCallback();
    }, [loadTodoSetCallback]);

    return (
        <View style={{padding: 10}}>
            <TodoLista todosAgrupados={todos} />
            <TodoFormsAdiciona />
        </View>
    );
}
