import React from 'react';
import { createStackNavigator  } from '@react-navigation/stack';
import RestaurantMainScreen from './RestaurantStack'
import MeterialInputComponent from '../component/MeterialInputComponent';
import ScannerComponent from '../component/ScannerComponent';
import NoticeDetail from '../screen/NoticeDetail';
import LoginScreen from '../screen/LoginScreen';
import SignUpScreen from '../screen/SignUpScreen'
const Stack = createStackNavigator();

const MainStack = () => {
    return(
      
    <Stack.Navigator initialRouteName='LoginScreen'>
      <Stack.Screen name='RestaurantMainScreen' component={RestaurantMainScreen} options={{headerShown:false}}/>
      <Stack.Screen name='ScannerComponent' component={ScannerComponent} options={{headerShown:false}}/>
      <Stack.Screen name='MeterialInputComponent' component={MeterialInputComponent} options={{headerShown:false}}/>
      <Stack.Screen name='NoticeDetail' component={NoticeDetail} options={{headerShown:false}}/>
      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
    )
}

export default MainStack;