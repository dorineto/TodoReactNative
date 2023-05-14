import React from 'react';
import {useState} from 'react';

import {Button, TextInput, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Prioridade} from '../Model/Todos';

type PrioridadeItem = {
    id: Prioridade;
    descricao: string;
};

type DropDownPrioridadesProps = {
    onChange: (item: object) => void;
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

export function TodoFormsAdd(): JSX.Element {
    const [prioridadeSelecionada, _] = useState(prioridades[1]);

    return (
        <View>
            <TextInput id="todo-descricao" placeholder="Descricao" />
            <DropDownPrioridades
                onChange={() => {
                    return;
                }}
                value={prioridadeSelecionada}
            />
            <Button title="Adiciona Todo" />
        </View>
    );
}
