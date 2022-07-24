import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Button,Alert } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ScannerComponent = ({navigation}) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        Alert.alert(
            "입력완료",
            `Bar code with type ${type} and data ${data} has been scanned!`,
            [
              {
                text: "다시 입력하기",
                onPress: () => setScanned(false),
                style: "cancel"
              },
              { text: "OK", onPress: () => navigation.navigate('MeterialInputComponent',{ code: data }) }
            ]
          );

    };

    if (hasPermission === null) { return <Text>Requesting for camera permission</Text>;}
    if (hasPermission === false) { return <Text>No access to camera</Text>;}

    return (
        <SafeAreaView style={{flex:1}}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFillObject]}
            />
            <View style={{flex:1,flexDirection: 'row', justifyContent: 'center',position:'absolute', top: '90%', alignItems: 'center', width:'100%' }} >
                <Button style={{width: 100}} title={'직접 입력하기'} onPress={() => {
                    setScanned(false);
                    // navigation.navigate('MeterialInputComponent', {code: 'data' });
                    navigation.navigate('MeterialInputComponent');
                }} />
            </View>
        </SafeAreaView>);
}

export default ScannerComponent;