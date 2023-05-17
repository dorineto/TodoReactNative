import React from 'react';

import {Text, View} from 'react-native';

import {Todo, Prioridade} from '../Modelo/Dominio/Todos';

import {TodoSet} from '../Modelo/Dominio/Todos';

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

function TodoGroupo({prioridade, todos}: TodoGroupProp): JSX.Element {
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
    todosAgrupados: TodoSet | null;
};

function TodoLista({todosAgrupados}: TodoListProp): JSX.Element {
    let todoGrupos: JSX.Element | null = null;
    if (todosAgrupados) {
        todoGrupos = (
            <>
                <TodoGroupo
                    prioridade={Prioridade.Alta}
                    todos={todosAgrupados[Prioridade.Alta]}
                />
                <TodoGroupo
                    prioridade={Prioridade.Media}
                    todos={todosAgrupados[Prioridade.Media]}
                />
                <TodoGroupo
                    prioridade={Prioridade.Baixa}
                    todos={todosAgrupados[Prioridade.Baixa]}
                />
            </>
        );
    }

    return <View>{todoGrupos}</View>;
}

export default TodoLista;
