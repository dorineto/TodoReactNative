import {
    TodoOperacoes,
    TodoRepositorio,
    criaTodoOperacoes,
} from '../Modelo/CasoUso/TodoOperacoes';
import {criaTodoRepositorioImpl} from '../BancoDados/TodoRepositorioImpl';
import {criaTodoRepositorioImpl as criaTodoRepositorioImplSqlite2} from '../BancoDados/TodoRepositorioSqlite2';
import {criaTodoRepositorioImpl as criaTodoRepositorioImplRealm} from '../BancoDados/TodoRepositorioRealm';

enum TipoTodoRepositorioImpl {
    SQLITE,
    SQLITE2,
    REALM,
}

const tipoUtilizado: TipoTodoRepositorioImpl = TipoTodoRepositorioImpl.REALM;

export function criaTodoOperacoesConfigurado(): TodoOperacoes {
    let todoRepositorio: TodoRepositorio;

    switch (tipoUtilizado) {
        case TipoTodoRepositorioImpl.SQLITE2:
            todoRepositorio = criaTodoRepositorioImplSqlite2();
            break;

        case TipoTodoRepositorioImpl.REALM:
            todoRepositorio = criaTodoRepositorioImplRealm();
            break;

        case TipoTodoRepositorioImpl.SQLITE:
        default:
            todoRepositorio = criaTodoRepositorioImpl();
            break;
    }

    return criaTodoOperacoes(todoRepositorio);
}
