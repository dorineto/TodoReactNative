import { TodoSet, Todo } from "../Dominio/Todos";

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
        throw "Não implementado";
    }

    adiciona(todos: TodoSet, todoNovo: Todo): TodoSet {
        throw "Não implementado";
    }

    remove(todos: TodoSet, todoRemover: Todo): TodoSet {
        throw "Não implementado";
    }

    atualiza(todos: TodoSet, todoAtualizar: Todo): TodoSet {
        throw "Não implementado";
    }
}

