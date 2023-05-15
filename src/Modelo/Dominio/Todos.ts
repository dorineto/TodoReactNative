export enum Prioridade {
    Alta = 1,
    Media = 2,
    Baixa = 3,
}

export type Todo = {
    id: number;
    descricao: string;
    prioridade: Prioridade;
};

export type TodoSet = {
    [Prioridade.Alta]: Array<Todo>;
    [Prioridade.Media]: Array<Todo>;
    [Prioridade.Baixa]: Array<Todo>;
};
