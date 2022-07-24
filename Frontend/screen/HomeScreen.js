import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

const HomeScreen = ({ navigation, route }) => {
    
    const dispatch = useDispatch();

    const isLogedout = () =>{
        dispatch(setValue(0));
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                barStyle='dark-content'
                hidden={false} />
                <View style={{flex:1,alignItems:'center'}}>
                    <Text style={{fontSize:28, marginTop:100}}>식중독이 없는 그날까지</Text>
                </View>
                {/* 
                # navigation list
                 UserMainScreen
                 PublicMainScreen 
                 RestaurantMainScreen 
                */}
                <View style={styles.btnContainer}>
                    <Button style={styles.btn}  mode="contained" color='#D9F8C4' onPress={() => navigation.navigate('UserMainScreen')}>일반 사용자로 시작하기</Button>
                    <Button style={styles.btn}  mode="contained" color='#FFE7BF' onPress={() => navigation.navigate('RestaurantMainScreen')}>식당업주로 시작하기</Button>
                    <Button style={styles.btn}  mode="contained" color='#6E85B7' onPress={() => navigation.navigate('PublicMainScreen')}>기관으로 시작하기</Button>
                </View>

        </SafeAreaView>
    )
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#CDF0EA',
        justifyContent: 'center'
    },
    btnContainer:{
        position:'absolute',
        top:'70%',
        backgroundColor: '#FAF4B7',
        borderRadius:30,
        flexDirection: 'column', 
        width: '100%',
        padding:14,
        height:300,
        // justifyContent: 'center',
        alignItems:'center',

    },
    btn:{
        width: '80%',
        margin:5
    }

});
