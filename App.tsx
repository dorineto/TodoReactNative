import React from 'react';
import {useState, useCallback, useEffect} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
} from 'react-native';

import {Provider, useDispatch, useSelector} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {store} from './slicers/store';
import {increment, selectCount, setCount} from './slicers/counterSlice';
import {
    Counter,
    getDBConnection,
    getCounter,
    updateCounter,
    createTables,
    insertCounter,
} from './database/todo-db';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

let tstInitializedDB = false;
async function getCounterDB(): Promise<Counter> {
    let dbConnection: SQLiteDatabase | null = null;
    let counter: Counter = {id: 0, count: 0};

    try {
        dbConnection = await getDBConnection();

        if (!tstInitializedDB) {
            await createTables(dbConnection);
            tstInitializedDB = true;
        }

        counter = await getCounter(dbConnection);
    } catch (error) {
        console.log(error);
    } finally {
        if (dbConnection) dbConnection.close();
    }

    return counter;
}

async function updateCounterDB(counter: Counter): Promise<Counter> {
    let dbConnection: SQLiteDatabase | null = null;
    let returnedCounter = {...counter};

    try {
        dbConnection = await getDBConnection();

        if (!tstInitializedDB) {
            await createTables(dbConnection);
            tstInitializedDB = true;
        }

        if (counter.id <= 0)
            returnedCounter.id = await insertCounter(dbConnection, counter);
        else
            await updateCounter(dbConnection, counter);
    } catch (error) {
        console.log(error);
    } finally {
        if (dbConnection) dbConnection.close();
    }

    return returnedCounter;
}

function Content(): JSX.Element {
    const [counter, setCounter] = useState({id: 0, count: 0});
    const count = useSelector(selectCount);
    const dispatch = useDispatch();

    const getCounterDBCallBack = useCallback(() => {
        const updateStateCounter = async () => {
            let counterReturned = await getCounterDB();

            if (counterReturned.id === 0)
                counterReturned = await updateCounterDB(counterReturned);

            setCounter(counterReturned);
            dispatch(setCount(counterReturned.count));
        };

        updateStateCounter();
    }, [setCounter, dispatch]);

    useEffect(() => {
        getCounterDBCallBack();
    }, [getCounterDBCallBack]);

    const [textPlaceHolder, settextPlaceHolder] = useState('Hello World');
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <View
                    style={{
                        backgroundColor: isDarkMode
                            ? Colors.black
                            : Colors.white,
                    }}>
                    <Text style={styles.padBottom}>
                        <Text style={styles.bold}>{textPlaceHolder} </Text>
                        I'm using react native, and that
                        <Text style={styles.bold}> Rocks </Text>
                        Olá
                    </Text>
                    <Text style={styles.padBottom}>
                        <Text style={styles.bold}>Counter: </Text>
                        {count}
                    </Text>
                    <Button
                        title={textPlaceHolder}
                        onPress={() => {
                            settextPlaceHolder(
                                textPlaceHolder === 'Hello World'
                                    ? 'Yeah!'
                                    : 'Hello World',
                            );
                        }}
                    />
                    <Button
                        title="Increment"
                        onPress={() => {
                            const newCounter = {
                                ...counter,
                                count: counter.count + 1,
                            };

                            updateCounterDB(newCounter);
                            setCounter(newCounter);
                            
                            dispatch(increment());
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function App(): JSX.Element {
    return (
        <Provider store={store}>
            <Content />
        </Provider>
    );
}

const styles = StyleSheet.create({
    bold: {
        fontWeight: '700',
    },
    padBottom: {
        paddingBottom: 25,
    },
});

export default App;
