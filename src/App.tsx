import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';

import {store} from './Slicers/store';
import TodoScreen from './Components/TodoScreen';
import {Provider} from 'react-redux';

function App(): JSX.Element {
    return (
        <SafeAreaView>
            <StatusBar />
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Provider store={store}>
                    <TodoScreen />
                </Provider>
            </ScrollView>
        </SafeAreaView>
    );
}

export default App;
