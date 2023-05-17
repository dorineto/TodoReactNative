import {
    TodoOperacoes,
    criaTodoOperacoes,
} from '../Modelo/CasoUso/TodoOperacoes';
import {criaTodoRepositorioImpl} from '../BancoDados/TodoRepositorioImpl';

export function criaTodoOperacoesConfigurado(): TodoOperacoes {
    const todoRepositorio = criaTodoRepositorioImpl();

    return criaTodoOperacoes(todoRepositorio);
}
