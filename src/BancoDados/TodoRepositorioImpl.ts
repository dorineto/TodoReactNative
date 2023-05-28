import {TodoRepositorio} from '../Modelo/CasoUso/TodoOperacoes';
import {Todo, TodoSet, Prioridade} from '../Modelo/Dominio/Todos';
import {
    openDatabase,
    enablePromise,
    SQLiteDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);

export class TodoRepositorioImpl implements TodoRepositorio {
    estruturaBancoCriada: boolean = false;

    private async pegaConexaoBanco(): Promise<SQLiteDatabase> {
        const connection = await openDatabase({
            name: 'todo-db.db',
            location: 'default',
        });

        if (!this.estruturaBancoCriada) {
            await this.iniciaEstruturaBanco(connection);
            this.estruturaBancoCriada = true;
        }

        return connection;
    }

    private async iniciaEstruturaBanco(connection: SQLiteDatabase) {
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
                await connection.executeSql(query);
            }
        } catch (e) {
            console.log(`[iniciaEstruturaBanco] Error: ${JSON.stringify(e)}`);
            throw e;
        }
    }

    async salva(todo: Todo): Promise<boolean> {
        let connection: SQLiteDatabase | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            let querySalva: string = '';
            if (todo.id === 0) {
                const rowUltimoId = (
                    await connection.executeSql(
                        `
                            select todo_id ultimo_id 
                            from Todo 
                            order by todo_id desc
                            limit 1;
                        `,
                    )
                )[0];

                let newTodoId =
                    rowUltimoId.rows.length > 0
                        ? rowUltimoId.rows.item(0).ultimo_id + 1
                        : 1;

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

            await connection.executeSql(querySalva);

            return true;
        } catch (e) {
            console.log(`[salva]: ${JSON.stringify(e)}`);
            return false;
        } finally {
            connection?.close();
        }
    }

    async exclui(todo: Todo): Promise<boolean> {
        let connection: SQLiteDatabase | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            await connection.executeSql(
                `delete from Todo where todo_id = ${todo.id};`,
            );

            return true;
        } catch (e) {
            console.log(`[exclui]: ${JSON.stringify(e)}`);
            return false;
        } finally {
            connection?.close();
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

    async selecionaTodos(): Promise<TodoSet> {
        let connection: SQLiteDatabase | null = null;
        try {
            connection = await this.pegaConexaoBanco();

            let retorno: TodoSet = {
                [Prioridade.Alta]: [],
                [Prioridade.Media]: [],
                [Prioridade.Baixa]: [],
            };

            const rowsTodos = (
                await connection.executeSql(`
                    select *
                    from Todo
                    order by prioridade_id, todo_id;
                `)
            )[0];

            for (let rowTodo of rowsTodos.rows.raw()) {
                const todoTraduzida = this.traduzSQLTodoParaTodo(rowTodo);

                retorno[todoTraduzida.prioridade].push(todoTraduzida);
            }

            return retorno;
        } finally {
            connection?.close();
        }
    }
}

export function criaTodoRepositorioImpl(): TodoRepositorioImpl {
    return new TodoRepositorioImpl();
}
