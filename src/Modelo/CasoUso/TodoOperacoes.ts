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

        if (!this._repositorioTodo.salva(todoNovo)) {
            throw new Error('Houve um erro ao salvar o todo');
        }

        retorno[todoNovo.prioridade].push(todoNovo);

        return retorno;
    }

    remove(todos: TodoSet | null, todoRemover: Todo | null): TodoSet {
        if (todos == null) {
            throw new Error('Os todos não pode ser nulo');
        }

        if (todoRemover == null) {
            throw new Error('O todo a remover não pode ser nulo');
        }

        if (todoRemover.id <= 0) {
            throw new Error('O todo a remover tem que estar gravado');
        }

        const retorno = {
            ...todos,
        };

        const indiceTodoRemover = retorno[todoRemover.prioridade].findIndex(
            t => t.id === todoRemover.id,
        );

        if (indiceTodoRemover < 0) {
            return retorno;
        }

        if (!this._repositorioTodo.exclui(todoRemover)) {
            throw new Error('Houve um erro na exclusão do todo');
        }

        retorno[todoRemover.prioridade].splice(indiceTodoRemover, 1);

        return retorno;
    }

    atualiza(todos: TodoSet | null, todoAtualizar: Todo | null): TodoSet {
        throw 'Não implementado';
    }
}

export function criaTodoOperacoes(
    repositorioTodo: TodoRepositorio,
): TodoOperacoes {
    return new TodoOperacoes(repositorioTodo);
}
