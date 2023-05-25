import {
    TodoOperacoes,
    TodoRepositorio,
} from '../src/Modelo/CasoUso/TodoOperacoes';
import {Prioridade} from '../src/Modelo/Dominio/Todos';
import {TodoSet} from '../src/Modelo/Dominio/Todos';
import {Todo} from '../src/Modelo/Dominio/Todos';

import {jest} from '@jest/globals';

let repositorioTodo: TodoRepositorio;
let todoOperacoesTest: TodoOperacoes;

beforeEach(() => {
    repositorioTodo = {
        salva: jest.fn((_: Todo) => false),
        exclui: jest.fn((_: Todo) => false),
        selecionaTodos: jest.fn(() => TestTodoSetBuilder.buildVazio()),
    };

    todoOperacoesTest = new TodoOperacoes(repositorioTodo);
});

describe('Adiciona todo', () => {
    beforeEach(() => {
        repositorioTodo.salva = jest.fn((todo: Todo) => {
            todo.id = 1;
            return true;
        });
    });

    test('Novo todo no TodoSet', () => {
        // Dado - Given
        const todoNovo: Todo = {
            id: 0,
            descricao: 'Teste Todo Novo',
            prioridade: Prioridade.Media,
        };

        // Quando - When
        const resultado = todoOperacoesTest.adiciona(
            TestTodoSetBuilder.buildVazio(),
            todoNovo,
        );

        // Entao - Then
        expect(resultado).not.toBeNull();
        expect(resultado[Prioridade.Alta]).toHaveLength(0);
        expect(resultado[Prioridade.Baixa]).toHaveLength(0);
        expect(resultado[Prioridade.Media]).not.toHaveLength(0);

        expect(resultado[Prioridade.Media][0]).toEqual({
            ...todoNovo,
            id: 1,
        });

        expect(repositorioTodo.salva).toBeCalled();
    });

    test.each([
        {id: -1, descricao: 'Teste', prioridade: Prioridade.Media},
        {id: 1, descricao: 'Teste', prioridade: Prioridade.Media},
        {id: 0, descricao: '', prioridade: Prioridade.Media},
        null,
    ])(
        'Deve lançar excessão quando os valores do todo são invalidos. %j',
        (todoTeste: Todo | null) => {
            // Quando e Então - When and then
            expect(() => {
                todoOperacoesTest.adiciona(
                    TestTodoSetBuilder.buildVazio(),
                    todoTeste,
                );
            }).toThrowError();

            expect(repositorioTodo.salva).not.toBeCalled();
            expect(repositorioTodo.exclui).not.toBeCalled();
            expect(repositorioTodo.selecionaTodos).not.toBeCalled();
        },
    );

    test('O TodoSet sendo null', () => {
        // Dado - Given
        const todoNovo: Todo = {
            id: 0,
            descricao: 'Teste Todo Novo',
            prioridade: Prioridade.Media,
        };

        // Quando - When
        expect(() => {
            todoOperacoesTest.adiciona(null, todoNovo);
        }).toThrowError();

        // Entao - Then
        expect(repositorioTodo.salva).not.toBeCalled();
        expect(repositorioTodo.exclui).not.toBeCalled();
        expect(repositorioTodo.selecionaTodos).not.toBeCalled();
    });
});

class TestTodoSetBuilder {
    _listaTodosAltaPrioridade: Array<Todo>;
    _listaTodosMediaPrioridade: Array<Todo>;
    _listaTodosBaixaPrioridade: Array<Todo>;

    constructor() {
        this._listaTodosAltaPrioridade = [];
        this._listaTodosMediaPrioridade = [];
        this._listaTodosBaixaPrioridade = [];
    }

    comTodosAltaPrioridade(...todos: Array<Todo>): TestTodoSetBuilder {
        this._listaTodosAltaPrioridade.push(...todos);
        return this;
    }

    comTodosMediaPrioridade(...todos: Array<Todo>): TestTodoSetBuilder {
        this._listaTodosMediaPrioridade.push(...todos);
        return this;
    }

    comTodosBaixaPrioridade(...todos: Array<Todo>): TestTodoSetBuilder {
        this._listaTodosBaixaPrioridade.push(...todos);
        return this;
    }

    build(): TodoSet {
        return {
            [Prioridade.Alta]: [...this._listaTodosAltaPrioridade],
            [Prioridade.Media]: [...this._listaTodosMediaPrioridade],
            [Prioridade.Baixa]: [...this._listaTodosBaixaPrioridade],
        };
    }

    static buildVazio(): TodoSet {
        return {
            [Prioridade.Alta]: [],
            [Prioridade.Media]: [],
            [Prioridade.Baixa]: [],
        };
    }
}
