import {TodoRepositorio} from '../Modelo/CasoUso/TodoOperacoes';
import {Todo, TodoSet, Prioridade} from '../Modelo/Dominio/Todos';

const todoSetTestValues: TodoSet = {
    [Prioridade.Alta]: [
        {
            id: 1,
            descricao: 'Tarefa com prioridade Alta',
            prioridade: Prioridade.Alta,
        },
        {
            id: 2,
            descricao: 'Terminar esse projeto',
            prioridade: Prioridade.Alta,
        },
    ],
    [Prioridade.Media]: [
        {
            id: 3,
            descricao: 'Tarefa com prioridade Media',
            prioridade: Prioridade.Media,
        },
    ],
    [Prioridade.Baixa]: [
        {
            id: 4,
            descricao: 'Tarefa com prioridade Baixa',
            prioridade: Prioridade.Alta,
        },
        {
            id: 5,
            descricao: 'O estilo desse projeto',
            prioridade: Prioridade.Alta,
        },
    ],
};

export class TodoRepositorioImpl implements TodoRepositorio {
    salva(todo: Todo): boolean {
        return false;
    }

    exclui(todo: Todo): boolean {
        return false;
    }

    selecionaTodos(): TodoSet {
        return todoSetTestValues;
    }
}

export function criaTodoRepositorioImpl(): TodoRepositorioImpl {
    return new TodoRepositorioImpl();
}