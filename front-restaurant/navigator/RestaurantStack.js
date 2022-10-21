import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import GovernmentNotice from '../screen/GovernmentNotice';
import MaterialManagement from '../screen/MaterialManagement';
import RealTimeInspection from '../screen/RealTimeInspection';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

const RestaurantStack = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    useEffect(() => {
        navigation.addListener('blur', (e) => {
        });
    }, []);
    return (
        <Tab.Navigator screenOptions={() => ({
            tabBarInactiveTintColor: 'grey',  //선택 안되어 있을때 색
            tabBarActiveTintColor: '#008bff', //선택 되어 있을때 색
            tabBarStyle: { display: 'flex',},
        })}>
            <Tab.Screen name="자재관리" component={MaterialManagement} options={({ route, navigation }) => ({
                headerShown: false,
                title: "자재관리",
                tabBarLabel: '자재관리',
                tabBarIcon: ({ color, size }) => {
                    return <MaterialIcons name="playlist-add-check" size={24} color={color} />
                },
            })} />
            <Tab.Screen name="검사" component={RealTimeInspection} options={({ route, navigation }) => ({
                headerShown: false,
                title: "검사",
                tabBarLabel: '검사',
                tabBarIcon: ({ color, size }) => {
                    return <MaterialIcons name="check" size={24} color={color} />
                },
            })} />

            <Tab.Screen name="기관공지" component={GovernmentNotice} options={({ route, navigation }) => ({
                headerShown: false,
                title: "기관공지",
                tabBarLabel: '기관공지',
                tabBarIcon: ({ color, size }) => {
                    return <MaterialIcons name="account-balance" size={24} color={color} />
                },
            })} />
        </Tab.Navigator>
    )
}

export default RestaurantStack;