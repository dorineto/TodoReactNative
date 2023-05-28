import {TodoSet, Todo} from '../Dominio/Todos';
import {cloneDeep} from 'lodash';

export interface TodoRepositorio {
    salva: (todo: Todo) => Promise<boolean>;
    exclui: (todo: Todo) => Promise<boolean>;
    selecionaTodos: () => Promise<TodoSet>;
}

export class TodoOperacoes {
    _repositorioTodo: TodoRepositorio;

    constructor(repositorioTodo: TodoRepositorio) {
        this._repositorioTodo = repositorioTodo;
    }

    async lista(): Promise<TodoSet> {
        return await this._repositorioTodo.selecionaTodos();
    }

    async adiciona(
        todos: TodoSet | null,
        todoNovo: Todo | null,
    ): Promise<TodoSet> {
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

        let retorno = cloneDeep(todos);

        if (!(await this._repositorioTodo.salva(todoNovo))) {
            throw new Error('Houve um erro ao salvar o todo');
        }

        retorno[todoNovo.prioridade].push(todoNovo);

        return retorno;
    }

    async remove(
        todos: TodoSet | null,
        todoRemover: Todo | null,
    ): Promise<TodoSet> {
        if (todos == null) {
            throw new Error('Os todos não pode ser nulo');
        }

        if (todoRemover == null) {
            throw new Error('O todo a remover não pode ser nulo');
        }

        if (todoRemover.id <= 0) {
            throw new Error('O todo a remover tem que estar gravado');
        }

        const retorno = cloneDeep(todos);

        const indiceTodoRemover = retorno[todoRemover.prioridade].findIndex(
            t => t.id === todoRemover.id,
        );

        if (indiceTodoRemover < 0) {
            return retorno;
        }

        if (!(await this._repositorioTodo.exclui(todoRemover))) {
            throw new Error('Houve um erro na exclusão do todo');
        }

        retorno[todoRemover.prioridade].splice(indiceTodoRemover, 1);

        return retorno;
    }

    async atualiza(
        todos: TodoSet | null,
        todoValoresAtualizar: Todo | null,
    ): Promise<TodoSet> {
        if (todos == null) {
            throw new Error('Os todos não pode ser nulo');
        }

        if (todoValoresAtualizar == null) {
            throw new Error('O todo que será atualizado não pode ser nulo');
        }

        if (todoValoresAtualizar.id <= 0) {
            throw new Error(
                'O todo tem que estar salvo para poder ser atualizado',
            );
        }

        const retorno = cloneDeep(todos);

        const todoAtualizar = retorno[todoValoresAtualizar.prioridade].find(
            val => val.id === todoValoresAtualizar.id,
        );

        if (todoAtualizar === undefined) {
            return retorno;
        }

        if (!(await this._repositorioTodo.salva(todoValoresAtualizar))) {
            throw new Error('Houve um erro a o atualizar o todo');
        }

        if (todoAtualizar.descricao !== todoValoresAtualizar.descricao) {
            todoAtualizar.descricao = todoValoresAtualizar.descricao;
        }

        return retorno;
    }
}

export function criaTodoOperacoes(
    repositorioTodo: TodoRepositorio,
): TodoOperacoes {
    return new TodoOperacoes(repositorioTodo);
}
