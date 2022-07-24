import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigator/MainStack'
import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';


const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
    </PaperProvider>
   </Provider>

  );
}
export default App;