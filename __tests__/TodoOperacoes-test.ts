import { TodoOperacoes, TodoRepositorio } from "../src/Modelo/CasoUso/TodoOperacoes";
import { Prioridade } from "../src/Modelo/Dominio/Todos";
import { TodoSet } from "../src/Modelo/Dominio/Todos";
import { Todo } from "../src/Modelo/Dominio/Todos";

let repositorioTodo: TodoRepositorio;
let todoOperacoesTest: TodoOperacoes;

beforeEach(() => {
    repositorioTodo = {
        salva: jest.fn()
        ,exclui: jest.fn()
        ,selecionaTodos: jest.fn()
    };

    todoOperacoesTest = new TodoOperacoes(repositorioTodo);
});

describe("Adiciona todo", () => {
    test("novo todo no TodoSet", () => {

        // Dado - Given
        const todoSetTest = TestTodoSetBuilder.buildVazio();

        const todoNovo: Todo = {
            id: 0
            ,descricao: "Teste Todo Novo"
            ,prioridade: Prioridade.Media
        };

        // Quando - When
        const resultado = todoOperacoesTest.adiciona(todoSetTest, todoNovo);

        // Entao - Then
        expect(resultado).not.toBeNull();
        expect(resultado[Prioridade.Alta]).toHaveLength(0);
        expect(resultado[Prioridade.Baixa]).toHaveLength(0);
        expect(resultado[Prioridade.Media]).not.toHaveLength(0);

        expect(resultado[Prioridade.Media][0]).toEqual({
            ...todoNovo
            ,id: 1
        });

        expect(repositorioTodo.salva).toBeCalled();
    })
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
            [Prioridade.Alta]: [...this._listaTodosAltaPrioridade]
            ,[Prioridade.Media]: [...this._listaTodosMediaPrioridade]
            ,[Prioridade.Baixa]: [...this._listaTodosBaixaPrioridade]
        };
    }

    static buildVazio(): TodoSet{
        return {
            [Prioridade.Alta]: []
            ,[Prioridade.Media]: []
            ,[Prioridade.Baixa]: []
        };
    }
}
