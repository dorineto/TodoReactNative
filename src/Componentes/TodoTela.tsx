import React from 'react';
import {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {selectTodos, loadTodoSet} from '../Slicers/todosSlice';
import TodoLista from './TodoLista';
import {TodoFormsAdiciona} from './TodoFormsAdiciona';
import {useAppDispatch} from '../Slicers/store';

export default function TodoTela(): JSX.Element {
    //const dispatch = useDispatch();
    const dispatch = useAppDispatch();
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
