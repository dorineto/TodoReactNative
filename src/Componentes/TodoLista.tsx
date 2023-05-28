import React, {useState} from 'react';

import {Text, TextInput, View} from 'react-native';

import {Todo, Prioridade} from '../Modelo/Dominio/Todos';

import {TodoSet} from '../Modelo/Dominio/Todos';
import {deleteTodo, updateTodo} from '../Slicers/todosSlice';
import {useAppDispatch} from '../Slicers/store';

type TodoItemUpdateInputsProp = {
    todo: Todo;
    onTerminoAlteracao: (todoAlterado: Todo) => void;
};

function TodoItemUpdateInputs({
    todo,
    onTerminoAlteracao,
}: TodoItemUpdateInputsProp): JSX.Element {
    const [descricaoAlterada, setDescricaoAlterada] = useState(todo.descricao);

    function realizaAlteracoesTodo() {
        const todoAlterado = Object.assign({}, todo);

        todoAlterado.descricao = descricaoAlterada;

        onTerminoAlteracao(todoAlterado);
    }

    return (
        <TextInput
            id={`txtTodoDescricao-${todo.id}`}
            value={descricaoAlterada}
            onBlur={() => realizaAlteracoesTodo()}
            onChangeText={value => setDescricaoAlterada(value)}
            autoFocus={true}
        />
    );
}

type TodoItemProp = {
    todo: Todo;
};

function TodoItem({todo}: TodoItemProp): JSX.Element {
    //const dispatch = useDispatch();
    const dispatch = useAppDispatch();
    const [alterando, setAlterando] = useState(false);

    let descricaoElement: JSX.Element;

    if (alterando) {
        function terminoAlteracaoHandler(todoAlterado: Todo) {
            dispatch(updateTodo(todoAlterado));
            setAlterando(false);
        }

        descricaoElement = (
            <TodoItemUpdateInputs
                todo={todo}
                onTerminoAlteracao={terminoAlteracaoHandler}
            />
        );
    } else {
        descricaoElement = (
            <Text onLongPress={() => setAlterando(true)}>{todo.descricao}</Text>
        );
    }

    return (
        <View id={todo.id.toString()}>
            {descricaoElement}
            <Text onPress={() => dispatch(deleteTodo(todo))}>(X)</Text>
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
