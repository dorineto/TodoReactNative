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
        salva: jest.fn(async (_: Todo) => false),
        exclui: jest.fn(async (_: Todo) => false),
        selecionaTodos: jest.fn(async () => TestTodoSetBuilder.buildVazio()),
    };

    todoOperacoesTest = new TodoOperacoes(repositorioTodo);
});

describe('Adiciona todo', () => {
    beforeEach(() => {
        repositorioTodo.salva = jest.fn(async (todo: Todo) => {
            todo.id = 1;
            return true;
        });
    });

    test('Novo todo no TodoSet', async () => {
        // Dado - Given
        const todoNovo: Todo = {
            id: 0,
            descricao: 'Teste Todo Novo',
            prioridade: Prioridade.Media,
        };

        // Quando - When
        const resultado = await todoOperacoesTest.adiciona(
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
        async (todoTeste: Todo | null) => {
            // Quando e Então - When and then
            await expect(
                todoOperacoesTest.adiciona(
                    TestTodoSetBuilder.buildVazio(),
                    todoTeste,
                ),
            ).rejects.toThrowError();

            expect(repositorioTodo.salva).not.toBeCalled();
            expect(repositorioTodo.exclui).not.toBeCalled();
            expect(repositorioTodo.selecionaTodos).not.toBeCalled();
        },
    );

    test('O TodoSet sendo null', async () => {
        // Dado - Given
        const todoNovo: Todo = {
            id: 0,
            descricao: 'Teste Todo Novo',
            prioridade: Prioridade.Media,
        };

        // Quando - When
        await expect(
            todoOperacoesTest.adiciona(null, todoNovo),
        ).rejects.toThrowError();

        // Entao - Then
        expect(repositorioTodo.salva).not.toBeCalled();
        expect(repositorioTodo.exclui).not.toBeCalled();
        expect(repositorioTodo.selecionaTodos).not.toBeCalled();
    });

    test('Quando o repositorio retornar false deve lançar um error', async () => {
        // Dado - Given
        const todoNovo: Todo = {
            id: 0,
            descricao: 'Teste Todo Novo',
            prioridade: Prioridade.Media,
        };

        const todoSetTest = TestTodoSetBuilder.buildVazio();

        repositorioTodo.salva = jest.fn(async (_: Todo) => {
            return false;
        });

        // Quando - When
        await expect(
            todoOperacoesTest.adiciona(todoSetTest, todoNovo),
        ).rejects.toThrowError();

        // Entao - Then
        expect(repositorioTodo.salva).toBeCalled();

        expect(todoSetTest[Prioridade.Alta]).toHaveLength(0);
        expect(todoSetTest[Prioridade.Baixa]).toHaveLength(0);
        expect(todoSetTest[Prioridade.Media]).toHaveLength(0);
    });
});

describe('Delete Todo', () => {
    beforeEach(() => {
        repositorioTodo.exclui = jest.fn(async (_: Todo) => {
            return true;
        });
    });

    test('Deleta todo com sucesso', async () => {
        // Given
        const todoRemover: Todo = {
            id: 1,
            descricao: 'Teste Delete',
            prioridade: Prioridade.Media,
        };

        const todosSetTest = new TestTodoSetBuilder()
            .comTodosMediaPrioridade(todoRemover)
            .build();

        // When
        const resultado = await todoOperacoesTest.remove(
            todosSetTest,
            todoRemover,
        );

        // Then
        expect(resultado).not.toBeNull();

        expect(resultado[Prioridade.Alta]).toHaveLength(0);
        expect(resultado[Prioridade.Baixa]).toHaveLength(0);
        expect(resultado[Prioridade.Media]).toHaveLength(0);

        expect(repositorioTodo.exclui).toBeCalled();
    });

    test('Quando não existe todo que está sendo removido deve retornar o todoset sem alterar', async () => {
        // Given
        const todoRemover: Todo = {
            id: 2,
            descricao: 'Teste Delete',
            prioridade: Prioridade.Media,
        };

        const todosSetTest = new TestTodoSetBuilder()
            .comTodosMediaPrioridade({
                id: 1,
                descricao: 'Teste Não Delete',
                prioridade: Prioridade.Media,
            })
            .build();

        // When
        const resultado = await todoOperacoesTest.remove(
            todosSetTest,
            todoRemover,
        );

        // Then
        expect(resultado).not.toBeNull();

        expect(resultado[Prioridade.Alta]).toHaveLength(0);
        expect(resultado[Prioridade.Baixa]).toHaveLength(0);
        expect(resultado[Prioridade.Media]).toHaveLength(1);

        expect(repositorioTodo.exclui).not.toBeCalled();
    });

    test('Quando o repositorio retorna false lançar um erro', async () => {
        // Given
        const todoRemover: Todo = {
            id: 1,
            descricao: 'Teste Delete',
            prioridade: Prioridade.Media,
        };

        const todosSetTest = new TestTodoSetBuilder()
            .comTodosMediaPrioridade(todoRemover)
            .build();

        repositorioTodo.exclui = jest.fn(async (_: Todo) => {
            return false;
        });

        // When
        await expect(
            todoOperacoesTest.remove(todosSetTest, todoRemover),
        ).rejects.toThrowError();

        // Then
        expect(repositorioTodo.exclui).toBeCalled();

        expect(todosSetTest[Prioridade.Alta]).toHaveLength(0);
        expect(todosSetTest[Prioridade.Baixa]).toHaveLength(0);
        expect(todosSetTest[Prioridade.Media]).toHaveLength(1);
    });

    test.each([
        {id: 0, descricao: 'Teste', prioridade: Prioridade.Media},
        null,
    ])(
        'Deve lançar excessão quando os valores do todo são invalidos. %j',
        async (todoTeste: Todo | null) => {
            // Quando e Então - When and then
            await expect(
                todoOperacoesTest.remove(
                    TestTodoSetBuilder.buildVazio(),
                    todoTeste,
                ),
            ).rejects.toThrowError();

            expect(repositorioTodo.salva).not.toBeCalled();
            expect(repositorioTodo.exclui).not.toBeCalled();
            expect(repositorioTodo.selecionaTodos).not.toBeCalled();
        },
    );

    test('O TodoSet sendo null', async () => {
        // Dado - Given
        const todoExcluir: Todo = {
            id: 1,
            descricao: 'Teste Todo Novo',
            prioridade: Prioridade.Media,
        };

        // Quando - When
        await expect(
            todoOperacoesTest.remove(null, todoExcluir),
        ).rejects.toThrowError();

        // Entao - Then
        expect(repositorioTodo.salva).not.toBeCalled();
        expect(repositorioTodo.exclui).not.toBeCalled();
        expect(repositorioTodo.selecionaTodos).not.toBeCalled();
    });
});

describe('Atualiza todo', () => {
    beforeEach(() => {
        repositorioTodo.salva = jest.fn(async (_: Todo) => true);
    });

    test('Quando informações corretas deve atualiza com suceso', async () => {
        // Given
        const todoSetTest = new TestTodoSetBuilder()
            .comTodosMediaPrioridade({
                id: 1,
                descricao: 'Teste Atualização',
                prioridade: Prioridade.Media,
            })
            .build();

        const todoTest: Todo = {
            id: 1,
            descricao: 'Teste Atualizado',
            prioridade: Prioridade.Media,
        };

        // when
        const retorno = await todoOperacoesTest.atualiza(todoSetTest, todoTest);

        // then
        expect(retorno[Prioridade.Alta]).toHaveLength(0);
        expect(retorno[Prioridade.Baixa]).toHaveLength(0);

        expect(retorno[Prioridade.Media]).toHaveLength(1);
        expect(retorno[Prioridade.Media][0]).toEqual(todoTest);

        expect(repositorioTodo.salva).toBeCalled();
    });

    test('Quando repositorio retorna false deve lançar error', async () => {
        // Given
        const todoSetTest = new TestTodoSetBuilder()
            .comTodosMediaPrioridade({
                id: 1,
                descricao: 'Teste Atualização',
                prioridade: Prioridade.Media,
            })
            .build();

        const todoTest: Todo = {
            id: 1,
            descricao: 'Teste Atualizado',
            prioridade: Prioridade.Media,
        };

        repositorioTodo.salva = jest.fn(async (_: Todo) => false);

        // when and then
        await expect(
            todoOperacoesTest.atualiza(todoSetTest, todoTest),
        ).rejects.toThrowError();

        expect(repositorioTodo.salva).toBeCalled();

        expect(todoSetTest[Prioridade.Alta]).toHaveLength(0);
        expect(todoSetTest[Prioridade.Baixa]).toHaveLength(0);

        expect(todoSetTest[Prioridade.Media]).toHaveLength(1);
        expect(todoSetTest[Prioridade.Media][0]).not.toEqual(todoTest);
    });

    test('Quando não existe todo deve retornar sem atualizar nenhum todo', async () => {
        // Given
        const todoSalvo = {
            id: 1,
            descricao: 'Teste Atualização',
            prioridade: Prioridade.Media,
        };

        const todoSetTest = new TestTodoSetBuilder()
            .comTodosMediaPrioridade(Object.assign({}, todoSalvo))
            .build();

        const todoTest: Todo = {
            id: 2,
            descricao: 'Teste Atualizado',
            prioridade: Prioridade.Media,
        };

        // when
        const retorno = await todoOperacoesTest.atualiza(todoSetTest, todoTest);

        // then
        expect(repositorioTodo.salva).not.toBeCalled();

        expect(retorno[Prioridade.Alta]).toHaveLength(0);
        expect(retorno[Prioridade.Baixa]).toHaveLength(0);

        expect(retorno[Prioridade.Media]).toHaveLength(1);
        expect(retorno[Prioridade.Media][0]).toEqual(todoSalvo);
    });

    test.each([
        {id: 0, descricao: 'Teste', prioridade: Prioridade.Media},
        null,
    ])(
        'Deve lançar excessão quando os valores do todo são invalidos. %j',
        async (todoTeste: Todo | null) => {
            //Given
            const todoSetTest = new TestTodoSetBuilder()
                .comTodosMediaPrioridade({
                    ...(todoTeste ?? {
                        id: 1,
                        descricao: 'Teste',
                        prioridade: Prioridade.Media,
                    }),
                    descricao: 'Teste',
                })
                .build();

            // Quando e Então - When and then
            await expect(
                todoOperacoesTest.atualiza(todoSetTest, todoTeste),
            ).rejects.toThrowError();

            expect(repositorioTodo.salva).not.toBeCalled();
            expect(repositorioTodo.exclui).not.toBeCalled();
            expect(repositorioTodo.selecionaTodos).not.toBeCalled();
        },
    );

    test('O TodoSet sendo null', async () => {
        // Dado - Given
        const todoExcluir: Todo = {
            id: 1,
            descricao: 'Teste Todo Atualiza',
            prioridade: Prioridade.Media,
        };

        // Quando - When
        await expect(
            todoOperacoesTest.atualiza(null, todoExcluir),
        ).rejects.toThrowError();

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
