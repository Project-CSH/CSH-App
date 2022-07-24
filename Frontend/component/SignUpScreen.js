import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { RadioButton, Text } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

// 사업자 등록번호, 전화번호, 상호명, 이름
const SignUpScreen = ({ navigation }) => {

    const [value, setValue] = useState('first');

    useEffect(() => {
        console.log(value);
    }, [value])
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                barStyle='dark-content'
                hidden={false} />

            
            <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
                <RadioButton.Item label="기관 사용자" value="public" />
                <RadioButton.Item label="식당 업주" value="restaurant" />
            </RadioButton.Group>
            {
                value == "public" ?
                    <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextInput
                            style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                            label="소속기관"
                            activeUnderlineColor='black' />
                    </View>
                    : <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                         <TextInput
                            style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                            label="식당이름"
                            activeUnderlineColor='black' />
                    </View>
            }
            <View style={styles.btnContainer}>
                <Button style={styles.btn} mode="contained" color='#ff9900' onPress={() => {
                    navigation.pop();
                }}>회원가입</Button>
            </View>
        </SafeAreaView>
    )
}

export default SignUpScreen;


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
