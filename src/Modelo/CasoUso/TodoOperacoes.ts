import {TodoSet, Todo} from '../Dominio/Todos';

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

    adiciona(todos: TodoSet | null, todoNovo: Todo | null): TodoSet {
        if (todos == null) {
            throw new Error('Os todos não pode ser nulo');
        }

        if (todoNovo == null) {
            throw new Error('O todoNovo não pode ser nulo');
        }

        if (todoNovo.id !== 0) {
            throw new Error('O id do novo todo tem que ser 0');
        }

        if (todoNovo.descricao.trim() === '') {
            throw new Error('A descrição do novo todo não pode ser vazia');
        }

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
