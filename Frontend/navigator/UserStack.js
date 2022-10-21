import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PoisonMap from '../screen/userChild/PoisonMap';
import RestaurantList from '../screen/userChild/RestaurantList';

const Tab = createBottomTabNavigator();


const UserStack = () => {

    return(
    <Tab.Navigator screenOptions={() => ({
        tabBarInactiveTintColor: 'grey',  //선택 안되어 있을때 색
        tabBarActiveTintColor: '#0085ea', //선택 되어 있을때 색
        tabBarStyle: {
            display: 'flex',
        },
    })}>
      <Tab.Screen name="모범음식점" component={RestaurantList} options={({ route, navigation }) => ({
                    headerShown: false,
                    title: "모범음식점",
                    tabBarLabel: '모범음식점',
                    tabBarIcon: ({ color, size }) => {
                        return <MaterialIcons name="restaurant" size={24} color={color} />;
                    },
                })} />
      <Tab.Screen name="식중독지도" component={PoisonMap} options={({ route, navigation }) => ({
                    headerShown: false,
                    title: "식중독지도",
                    tabBarLabel: '식중독지도',
                    tabBarIcon: ({ color, size }) => {
                        return <MaterialIcons name="dangerous" size={24} color={color} />;
                    },
                })} />
    </Tab.Navigator>
    )
}

export default UserStack;