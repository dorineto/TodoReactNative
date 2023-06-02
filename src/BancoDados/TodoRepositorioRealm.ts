import {TodoRepositorio} from '../Modelo/CasoUso/TodoOperacoes';
import {Todo, TodoSet, Prioridade} from '../Modelo/Dominio/Todos';

import Realm from 'realm';

type TodoDocumentValues = {
    _id: number;
    descricao: string;
    prioridade: string;
};

class TodoDocument extends Realm.Object<TodoDocument> {
    _id!: number;
    descricao!: string;
    prioridade!: string;

    static schema = {
        name: 'TodoDocument',
        properties: {
            _id: 'int',
            descricao: 'string',
            prioridade: 'string',
        },
        primaryKey: '_id',
    };
}

export class TodoRepositorioRealm implements TodoRepositorio {
    private async pegaConexaoBanco(): Promise<Realm> {
        const connection = await Realm.open({
            schema: [TodoDocument],
        });

        return connection;
    }

    async salva(todo: Todo): Promise<boolean> {
        let connection: Realm | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            const todos = connection.objects(TodoDocument);
            if (todo.id === 0) {
                const queryUltimoId = todos.sorted('_id', true);

                const rowUltimoId =
                    queryUltimoId.length > 0
                        ? todos.sorted('_id', true)[0]?._id
                        : 0;

                todo.id = rowUltimoId + 1;

                connection.write(() => {
                    connection?.create(
                        TodoDocument,
                        this.traduzTodoParaTodoDocument(todo),
                    );
                });
            } else {
                const todoUpdate = todos.find(
                    todoCol => todoCol._id === todo.id,
                );

                connection.write(() => {
                    todoUpdate!.descricao = todo.descricao;
                });
            }

            return true;
        } catch (e) {
            console.log(`[salva] ERROR: ${JSON.stringify(e)}`);
            return false;
        } finally {
            connection?.close();
        }
    }

    async exclui(todo: Todo): Promise<boolean> {
        let connection: Realm | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            const todoReg = connection.objectForPrimaryKey(
                TodoDocument,
                todo.id,
            );

            connection.write(() => {
                connection?.delete(todoReg);
            });

            return true;
        } catch (e) {
            console.log(`[exclui]: ${JSON.stringify(e)}`);
            return false;
        } finally {
            connection?.close();
        }
    }

    private traduzTodoParaTodoDocument(todo: Todo): TodoDocumentValues {
        let prioridade: string;
        switch (todo.prioridade) {
            case Prioridade.Alta:
                prioridade = 'alta';
                break;

            case Prioridade.Baixa:
                prioridade = 'baixa';
                break;

            case Prioridade.Media:
            default:
                prioridade = 'media';
                break;
        }

        return {
            _id: todo.id,
            descricao: todo.descricao,
            prioridade: prioridade,
        };
    }

    private traduzTodoDocumentTodoParaTodo(todoDocument: TodoDocument): Todo {
        let prioridade: Prioridade;
        switch (todoDocument.prioridade) {
            case 'alta':
                prioridade = Prioridade.Alta;
                break;
            case 'baixa':
                prioridade = Prioridade.Baixa;
                break;
            case 'media':
            default:
                prioridade = Prioridade.Media;
                break;
        }

        return {
            id: todoDocument._id,
            descricao: todoDocument.descricao,
            prioridade: prioridade,
        };
    }

    async selecionaTodos(): Promise<TodoSet> {
        let connection: Realm | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            let retorno: TodoSet = {
                [Prioridade.Alta]: [],
                [Prioridade.Media]: [],
                [Prioridade.Baixa]: [],
            };

            const todos = connection
                .objects(TodoDocument)
                .sorted(['prioridade', '_id']);

            for (let rowTodo of todos) {
                const todoTraduzida =
                    this.traduzTodoDocumentTodoParaTodo(rowTodo);

                retorno[todoTraduzida.prioridade].push(todoTraduzida);
            }

            return retorno;
        } finally {
            connection?.close();
        }
    }
}

export function criaTodoRepositorioImpl(): TodoRepositorioRealm {
    return new TodoRepositorioRealm();
}
