import {
    enablePromise,
    openDatabase,
    SQLiteDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async () => {
    return openDatabase({name: 'todo-db.db', location: 'default'});
};

export const createTables = async (dbConnection: SQLiteDatabase) => {
    const queryCreateTableCounter = `
        create table if not exists Counter (
            count int not null
        );
    `;

    const querysCreateTablesTodoDB = queryCreateTableCounter;

    await dbConnection.executeSql(querysCreateTablesTodoDB);
};

export const getCounter = async (
    dbConnection: SQLiteDatabase,
): Promise<Counter> => {
    try {
        const results = await dbConnection.executeSql(
            'select rowid as id, count from Counter;',
        );

        if (results[0].rows.length > 0)
            return results[0].rows.item(0);
    } catch (error) {
        console.log(error);
    }

    return {
        id: 0,
        count: 0,
    };
};

export const updateCounter = async (
    dbConnection: SQLiteDatabase,
    counter: Counter,
) => {
    const queryUpdate = `
        update Counter set count = (${counter.count})
        where rowid = ${counter.id};
    `;

    await dbConnection.executeSql(queryUpdate);
};

export const insertCounter = async (
    dbConnection: SQLiteDatabase,
    counter: Counter,
): Promise<number> => {
    const queryInsert = `
        insert into Counter (count) values (${counter.count});
    `;

    const results = await dbConnection.executeSql(queryInsert);

    return results[0].insertId;
};

export type Counter = {
    id: number;
    count: number;
};
