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
        let retorno = {
            ...todos,
        };

        this._repositorioTodo.salva(todoNovo);

        retorno[todoNovo.prioridade].push(todoNovo);

        return retorno;
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
