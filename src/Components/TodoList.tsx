import React from 'react';

import {Text, View} from 'react-native';

import {Todo, Prioridade} from '../Model/Todos';

import {TodoSet} from '../Slicers/todosSlice';

type TodoItemProp = {
    todo: Todo;
};

function TodoItem({todo}: TodoItemProp): JSX.Element {
    return (
        <View id={todo.id.toString()}>
            <Text>{todo.descricao}</Text>
        </View>
    );
}

type TodoGroupProp = {
    prioridade: Prioridade;
    todos: Array<Todo>;
};

function TodoGroup({prioridade, todos}: TodoGroupProp): JSX.Element {
    let prioridadeLabel: JSX.Element;

    switch (prioridade) {
        case Prioridade.Alta:
            prioridadeLabel = <Text>Alta:{'\n'}</Text>;
            break;
        case Prioridade.Baixa:
            prioridadeLabel = <Text>Baixa:{'\n'}</Text>;
            break;
        case Prioridade.Media:
        default:
            prioridadeLabel = <Text>Media:{'\n'}</Text>;
            break;
    }

    return (
        <View>
            {prioridadeLabel}
            {todos.map(todo => (
                <TodoItem todo={todo} key={todo.id} />
            ))}
            <Text>{'\n'}</Text>
        </View>
    );
}

export type TodoListProp = {
    todosAgrupados: TodoSet;
};

function TodoList({todosAgrupados}: TodoListProp): JSX.Element {
    return (
        <View>
            <TodoGroup
                prioridade={Prioridade.Alta}
                todos={todosAgrupados[Prioridade.Alta]}
            />
            <TodoGroup
                prioridade={Prioridade.Media}
                todos={todosAgrupados[Prioridade.Media]}
            />
            <TodoGroup
                prioridade={Prioridade.Baixa}
                todos={todosAgrupados[Prioridade.Baixa]}
            />
        </View>
    );
}

export default TodoList;
