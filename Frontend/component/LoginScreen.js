import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as Linking from 'expo-linking';
import { setValue } from '../store/publicReducer';
import { auth } from '../dummy';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({}) => {
    const navigation = useNavigation();
    const [secureTextEntryIndex, setSecureTextEntryIndex] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const isLogedin = () => {
        console.log(inputValue);
        // if(auth.id == inputValue){
        //     if(auth.pw == inputValue2){
        //         dispatch(setValue(1));
        //     }else{
        //         onToggleSnackBar();
        //     }
        // }else{
        //     onToggleSnackBar();
        // }
        dispatch(setValue(1));
    }

    return (
        <SafeAreaView style={styles.container}>
            <Snackbar
            style={{position: 'absolute', bottom:'40%'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Undo',
                    onPress: () => { console.log("test") },
                }}>
                옳바른 계정을 입력해주세요.
            </Snackbar>
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                barStyle='dark-content'
                hidden={false} />
            <View style={{ justifyContent: 'space-between', height: '25%', alignItems: 'center' }}>
                <TextInput
                    autoCapitalize="none"
                    onChangeText={(value) => setInputValue(value)}
                    style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                    label="id"
                    activeUnderlineColor='black'
                />
                <TextInput
                    autoCapitalize="none"
                    style={{ width: '80%', height: 50, backgroundColor: 'white' }}
                    onChangeText={(value) => setInputValue2(value)}
                    label="Password"
                    secureTextEntry={secureTextEntryIndex}
                    activeUnderlineColor='black'
                    right={<TextInput.Icon name="eye" onPress={() => setSecureTextEntryIndex(!secureTextEntryIndex)} />}
                />
                <View style={styles.btnContainer}>
                    <Button style={styles.btn} mode="contained" color='#ff9900' onPress={isLogedin}>로그인</Button>
                    <Button style={styles.btn} mode="contained" color='#ff9900' onPress={() => navigation.navigate('SignUpScreen')}>회원가입</Button>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default LoginScreen;


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
