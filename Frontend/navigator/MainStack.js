import React from 'react';
import { createStackNavigator  } from '@react-navigation/stack';
import HomeScreen from '../screen/HomeScreen';
import UserMainScreen from '../screen/UserMainScreen';

const Stack = createStackNavigator();
const MainStack = () => {
    return(
    <Stack.Navigator initialRouteName='HomeScreen'>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false,}}/>
      <Stack.Screen name='UserMainScreen' component={UserMainScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
    )
}

export default MainStack;