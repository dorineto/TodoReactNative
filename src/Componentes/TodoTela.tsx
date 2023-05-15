import React from 'react';
import {View} from 'react-native';
//import {useDispatch, useSelector} from 'react-redux';
import {useSelector} from 'react-redux';
import {selectTodos} from '../Slicers/todosSlice';
import TodoLista from './TodoLista';
import {TodoFormsAdiciona} from './TodoFormsAdiciona';

export default function TodoScreen(): JSX.Element {
    //const dispatch = useDispatch();
    const todos = useSelector(selectTodos);

    return (
        <View style={{padding: 10}}>
            <TodoLista todosAgrupados={todos} />
            <TodoFormsAdiciona />
        </View>
    );
}
