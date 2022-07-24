import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import LookupRestaurant from '../screen/publicChild/LookupRestaurant';
import WriteNotice from '../screen/publicChild/WriteNotice';
import { setValueOut } from '../store/publicReducer';
import { useDispatch } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();


const PublicStack = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    useEffect(()=>{
        navigation.addListener('blur', (e) => {
            dispatch(setValueOut());
        });
          
    },[]);
    return(
    <Tab.Navigator screenOptions={() => ({
        tabBarInactiveTintColor: 'grey',  //선택 안되어 있을때 색
        tabBarActiveTintColor: '#3EC70B', //선택 되어 있을때 색
        tabBarStyle: {
            display: 'flex',
        },
    })}>
      <Tab.Screen name="식당정보조회" component={LookupRestaurant} options={({ route, navigation }) => ({
                    headerShown: false,
                    title: "식당정보조회",
                    tabBarLabel: '식당정보조회',
                    tabBarIcon: ({ color, size }) => {
                        return <MaterialIcons name="image-search" size={24} color={color} />;
                       
                    },
                })} />
      <Tab.Screen name="공지작성" component={WriteNotice} options={({ route, navigation }) => ({
                    headerShown: false,
                    title: "공지작성",
                    tabBarLabel: '공지작성',
                    tabBarIcon: ({ color, size }) => {
                        return  <MaterialIcons name="assignment" size={24} color={color}/>;
                    },
                })} />
    </Tab.Navigator>
    )
}

export default PublicStack;