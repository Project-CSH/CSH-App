import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const MeterialInputComponent = ({ navigation, route }) => {
    useEffect(() => {
        try {
            console.log(route.params.code)
        } catch (error) {
            console.log("데이터 없음")
        }
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                barStyle='dark-content'
                hidden={false} />
            <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <TextInput
                    style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                    label="자재번호"
                    placeholder="8801234560016"
                    activeUnderlineColor='black'
                />
                <TextInput
                    style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                    label="자재이름"
                    placeholder="대형옥수수"
                    activeUnderlineColor='black'
                />
                 <TextInput
                    style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                    label="유통날짜"                    
                    placeholder="20200102"
                    activeUnderlineColor='black'
                />
                <TextInput
                    style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                    label="결제자"                    
                    placeholder="홍길동"
                    activeUnderlineColor='black'
                />

                <View style={styles.btnContainer}>
                    <Button style={styles.btn} mode="contained" color='#ff9900' onPress={() => {
                        // navigation.pop();
                        navigation.navigate('RestaurantMainScreen');
                        }}>입력하기</Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default MeterialInputComponent;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    btnContainer: {
        flexDirection: 'row', width: '100%', justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        width: 100,
        margin: 5
    }

});