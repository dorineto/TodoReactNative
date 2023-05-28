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
            prioridade: Prioridade.Baixa,
        },
        {
            id: 5,
            descricao: 'O estilo desse projeto',
            prioridade: Prioridade.Baixa,
        },
    ],
};

export class TodoRepositorioStub implements TodoRepositorio {
    async salva(todo: Todo): Promise<boolean> {
        if (todo.id === 0) {
            todo.id = Math.ceil(Math.random() * 1000);
        }

        return true;
    }

    async exclui(_: Todo): Promise<boolean> {
        return true;
    }

    async selecionaTodos(): Promise<TodoSet> {
        return todoSetTestValues;
    }
}

export function criaTodoRepositorioStub(): TodoRepositorioStub {
    return new TodoRepositorioStub();
}
