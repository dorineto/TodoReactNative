import React from 'react';
import {useState} from 'react';
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

import {store} from './Slicers/store';

import TodoList from './Components/TodoList';
import {Provider} from 'react-redux';

function App(): JSX.Element {
    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Provider store={store}>
                    <TodoList />
                </Provider>
            </ScrollView>
        </SafeAreaView>
    );
}

export default App;
