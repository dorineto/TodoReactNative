import {TodoSet, Todo, Prioridade} from '../Dominio/Todos';

export interface TodoRepositorio {
    salva: (todo: Todo) => boolean;
    exclui: (todo: Todo) => boolean;
    selecionaTodos: () => TodoSet;
}

export class TodoOperacoes {
    _repositorioTodo: TodoRepositorio;

    constructor(repositorioTodo: TodoRepositorio) {
        this._repositorioTodo = repositorioTodo;
    }

    lista(): TodoSet {
        return this._repositorioTodo.selecionaTodos();
    }

    adiciona(todos: TodoSet, todoNovo: Todo): TodoSet {
        return {
            [Prioridade.Alta]: []
            ,[Prioridade.Media]: [todoNovo]
            ,[Prioridade.Baixa]: []
        };
    }

    remove(todos: TodoSet, todoRemover: Todo): TodoSet {
        throw 'Não implementado';
    }

    atualiza(todos: TodoSet, todoAtualizar: Todo): TodoSet {
        throw 'Não implementado';
    }
}

export function criaTodoOperacoes(
    repositorioTodo: TodoRepositorio,
): TodoOperacoes {
    return new TodoOperacoes(repositorioTodo);
}
