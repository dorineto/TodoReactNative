import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectTodos} from '../Slicers/todosSlice';
import TodoList from './TodoList';



export default function TodoScreen(): JSX.Element {
    const dispatch = useDispatch();
    const todos = useSelector(selectTodos);

    return (
        <View>
            <TodoList todosAgrupados={todos} />
        </View>
    );
}

