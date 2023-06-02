import {TodoRepositorio} from '../Modelo/CasoUso/TodoOperacoes';
import {Todo, TodoSet, Prioridade} from '../Modelo/Dominio/Todos';

import Sqlite from 'react-native-sqlite-2';
import type {
    WebsqlDatabase,
    SQLResultSet,
    SQLError,
} from 'react-native-sqlite-2';

export class TodoRepositorioSqlite2 implements TodoRepositorio {
    estruturaBancoCriada: boolean = false;

    private async pegaConexaoBanco(): Promise<WebsqlDatabase> {
        const connection = Sqlite.openDatabase(
            'todo-db-sqlite2.db',
            '',
            '1.0',
            0,
        );

        if (!this.estruturaBancoCriada) {
            await this.iniciaEstruturaBanco(connection);
            this.estruturaBancoCriada = true;
        }

        return connection;
    }

    private async iniciaEstruturaBanco(connection: WebsqlDatabase) {
        try {
            const querysCreateTables: Array<string> = [];

            querysCreateTables.push(`
                create table if not exists Prioridade (
                    prioridade_id int not null primary key,
                    descricao varchar(50) not null
                );
            `);

            querysCreateTables.push(`
                insert or ignore into Prioridade (
                    prioridade_id, 
                    descricao
                ) 
                values 
                (1, 'Alta')
                ,(2, 'Media')
                ,(3, 'Baixa');
            `);

            querysCreateTables.push(`
                create table if not exists Todo (
                    todo_id int not null primary key,
                    descricao varchar(255) not null,
                    prioridade_id tinyint not null,
                    foreign key(prioridade_id) references Prioridade(prioridade_id)
                );
            `);

            for (let query of querysCreateTables) {
                await this.executeReadQueryAsync(connection, query);
            }
        } catch (e) {
            console.log(`[iniciaEstruturaBanco] Error: ${JSON.stringify(e)}`);
            throw e;
        }
    }

    async salva(todo: Todo): Promise<boolean> {
        let connection: WebsqlDatabase | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            let querySalva: string = '';
            if (todo.id === 0) {
                const rowUltimoId = await this.executeReadQueryAsync(
                    connection,
                    `
                        select todo_id ultimo_id 
                        from Todo 
                        order by todo_id desc
                        limit 1;
                    `,
                );

                let newTodoId =
                    rowUltimoId.length > 0 ? rowUltimoId[0].ultimo_id + 1 : 1;

                todo.id = newTodoId;

                querySalva = `
                    insert into Todo (
                        todo_id
                        ,descricao
                        ,prioridade_id
                    )
                    values
                    (${todo.id}, '${todo.descricao}', ${todo.prioridade});
                `;
            } else {
                querySalva = `
                    update Todo set descricao = '${todo.descricao}'
                    where todo_id = ${todo.id}
                `;
            }

            await this.executeReadQueryAsync(connection, querySalva);

            return true;
        } catch (e) {
            console.log(`[salva]: ${JSON.stringify(e)}`);
            return false;
        }
    }

    async exclui(todo: Todo): Promise<boolean> {
        let connection: WebsqlDatabase | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            await this.executeReadQueryAsync(
                connection,
                `delete from Todo where todo_id = ${todo.id};`,
            );

            return true;
        } catch (e) {
            console.log(`[exclui]: ${JSON.stringify(e)}`);
            return false;
        }
    }

    private traduzSQLTodoParaTodo(sqlTodo: any): Todo {
        let prioridade: Prioridade;
        switch (sqlTodo.prioridade_id) {
            case 1:
                prioridade = Prioridade.Alta;
                break;
            case 3:
                prioridade = Prioridade.Baixa;
                break;
            case 2:
            default:
                prioridade = Prioridade.Media;
                break;
        }

        return {
            id: sqlTodo.todo_id,
            descricao: sqlTodo.descricao,
            prioridade: prioridade,
        };
    }

    private async executeReadQueryAsync(
        connection: WebsqlDatabase,
        sqlquery: string,
    ): Promise<any[]> {
        const retornoSQlResult = await new Promise<SQLResultSet>(
            (resolve, reject) => {
                connection.transaction(tx => {
                    tx.executeSql(
                        sqlquery,
                        [],
                        (_, results: SQLResultSet) => {
                            resolve(results);
                        },
                        (_, error: SQLError): boolean => {
                            reject(`${error.message} [ERROR:${error.code}]`);
                            return false;
                        },
                    );
                });
            },
        );

        const retorno = [];
        for (let i = 0; i < retornoSQlResult.rows.length; i++) {
            retorno.push(retornoSQlResult.rows.item(i));
        }

        return retorno;
    }

    async selecionaTodos(): Promise<TodoSet> {
        let connection: WebsqlDatabase | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            let retorno: TodoSet = {
                [Prioridade.Alta]: [],
                [Prioridade.Media]: [],
                [Prioridade.Baixa]: [],
            };

            let rowsTodos = await this.executeReadQueryAsync(
                connection,
                `
                    select *
                    from Todo
                    order by prioridade_id, todo_id;
                `,
            );
            
            rowsTodos.forEach(rowTodo => {
                const todoTraduzida = this.traduzSQLTodoParaTodo(rowTodo);

                retorno[todoTraduzida.prioridade].push(todoTraduzida);
            });

            return retorno;
        } catch (e) {
            console.log(`[selecionaTodos]: ${JSON.stringify(e)}`);
            throw e;
        }
    }
}

export function criaTodoRepositorioImpl(): TodoRepositorioSqlite2 {
    return new TodoRepositorioSqlite2();
}
