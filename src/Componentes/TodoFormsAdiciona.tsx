import React from 'react';
import {useState} from 'react';

import {Button, TextInput, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Prioridade} from '../Modelo/Dominio/Todos';
import {addTodo} from '../Slicers/todosSlice';
import {useAppDispatch} from '../Slicers/store';

type PrioridadeItem = {
    id: Prioridade;
    descricao: string;
};

type DropDownPrioridadesProps = {
    onChange: (item: PrioridadeItem) => void;
    value: PrioridadeItem;
};

const prioridades: Array<PrioridadeItem> = [
    {
        id: 1,
        descricao: 'Alta',
    },
    {
        id: 2,
        descricao: 'Média',
    },
    {
        id: 3,
        descricao: 'Baixa',
    },
];

function DropDownPrioridades({
    onChange,
    value,
}: DropDownPrioridadesProps): JSX.Element {
    const disabledHandle = () => {
        return;
    };

    return (
        <View>
            <Text>Prioridade:</Text>
            <Dropdown
                data={prioridades}
                labelField="descricao"
                valueField="id"
                searchField="descricao"
                onChange={onChange}
                onChangeText={disabledHandle}
                value={value}
            />
        </View>
    );
}

export function TodoFormsAdiciona(): JSX.Element {
    //const dispatch = useDispatch();
    const dispatch = useAppDispatch();
    const defaultPrioridadeItem = prioridades[1];

    const [prioridadeSelecionada, setPrioridadeSelecionada] = useState(
        defaultPrioridadeItem,
    );
    const [descricaoInserida, setDescricaoInserida] = useState('');

    function adicionaNovoTodo(
        descricao: string,
        prioridadeItem: PrioridadeItem,
    ) {
        let prioridade: Prioridade;

        switch (prioridadeItem.id) {
            case Prioridade.Alta:
                prioridade = Prioridade.Alta;
                break;
            case Prioridade.Baixa:
                prioridade = Prioridade.Baixa;
                break;
            case Prioridade.Media:
            default:
                prioridade = Prioridade.Media;
                break;
        }

        dispatch(
            addTodo({
                id: 0,
                descricao: descricao,
                prioridade: prioridade,
            }),
        );

        setPrioridadeSelecionada(defaultPrioridadeItem);
        setDescricaoInserida('');
    }

    return (
        <View>
            <TextInput
                id="todo-descricao"
                placeholder="Descricao"
                value={descricaoInserida}
                onChangeText={val => setDescricaoInserida(val)}
            />
            <DropDownPrioridades
                onChange={(item: PrioridadeItem) => {
                    setPrioridadeSelecionada(item);
                }}
                value={prioridadeSelecionada}
            />
            <Button
                title="Adiciona Todo"
                onPress={() =>
                    adicionaNovoTodo(descricaoInserida, prioridadeSelecionada)
                }
            />
        </View>
    );
}
