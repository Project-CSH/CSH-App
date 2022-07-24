import React from 'react';
import { createStackNavigator  } from '@react-navigation/stack';
import HomeScreen from '../screen/HomeScreen';
import UserMainScreen from '../screen/UserMainScreen';
import PublicMainScreen from '../screen/PublicMainScreen';
import RestaurantMainScreen from '../screen/RestaurantMainScreen';
import LoginScreen from '../component/LoginScreen';
import ScannerComponent from '../component/ScannerComponent';
import MeterialInputComponent from '../component/MeterialInputComponent';

import SignUpScreen from '../component/SignUpScreen';

const Stack = createStackNavigator();
const MainStack = () => {
    return(
      // screenOptions={{gestureEnabled:true}}
    <Stack.Navigator initialRouteName='HomeScreen'>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false,}}/>
      <Stack.Screen name='UserMainScreen' component={UserMainScreen} options={{headerShown:false}}/>
      <Stack.Screen name='PublicMainScreen' component={PublicMainScreen} options={{headerShown:false}}/>
      <Stack.Screen name='RestaurantMainScreen' component={RestaurantMainScreen} options={{headerShown:false}}/>
      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{headerShown:false}}/>
      <Stack.Screen name='ScannerComponent' component={ScannerComponent} options={{headerShown:false}}/>
      <Stack.Screen name='MeterialInputComponent' component={MeterialInputComponent} options={{headerShown:false}}/>
    </Stack.Navigator>
    )
}

export default MainStack;