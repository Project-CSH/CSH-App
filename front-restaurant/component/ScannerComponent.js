import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Button, Alert, Animated } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useDispatch, useSelector } from 'react-redux';
import { enrollInventory } from '../api';
import { setDialogState, setInventory } from '../store/mainStore';



const ScannerComponent = ({ navigation }) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const { inventory } = useSelector((state) => state.mainStore)
    const dispatch = useDispatch();

    const [ActivityIndicatorRun, setActivityIndicatorRun] = useState(false);

    useEffect(() => {
        _BarCodeScannerGetPermissions();
    }, []);
    const _BarCodeScannerGetPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        Alert.alert(
            "입력완료",
            `${data} 스캔 완료!`,
            [
                {
                    text: "OK", onPress: () => {
                        _enrollInventory(data)
                    }
                }
            ]
        );
    };

    const _enrollInventory = async (barcodeNumber) => {
        setActivityIndicatorRun(true);
        setTimeout(async () => {
            try {
                let res = await enrollInventory({
                    barcode_number: barcodeNumber,
                    product_name: '',
                    kindof: '',
                    expiry_date: '',
                });
                if (res.result == 'success') {
                    console.log(res.inventory_list);
                    dispatch(setInventory(res.inventory_list));
                    let text = await _findInventory_list(barcodeNumber);
                    dispatch(setDialogState({
                        isVisible: true,
                        content: `등록완료 \n${text}`
                    }));
                    navigation.pop();
                }
            } catch (error) { console.log(error); }
        }, 2000);
    }

    const _findInventory_list = async (barcodeNumber) => {
        let _text = '';
        inventory.forEach((value, index, arr) => {
            if (barcodeNumber != '') {
                if (barcodeNumber == value.barcode_number) {
                    _text = value.barcode_number + value.product_name + value.kindof
                }
            } else {
                if (productName == value.productName) {
                    _text = value.barcode_number + value.product_name + value.kindof
                }
            }
        });
        return _text;
    }

    if (ActivityIndicatorRun) {
        return (
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'center', alignItems: 'center', backgroundColor: '#2ad3e7'
            }}>
                <ActivityIndicator animating={true} size={'large'} color={'white'} />
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>잠시만 기다려주세요</Text>
            </SafeAreaView>
        )
    }

    if (hasPermission === null) { return <Text>Requesting for camera permission</Text>; }
    if (hasPermission === false) { return <Text>No access to camera</Text>; }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ borderWidth: 3, borderColor: 'red', position: 'absolute', width: '100%', top: '50%', zIndex: 1 }}></View>

            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : (type, data) => {
                    handleBarCodeScanned(type, data);
                }}
                style={[StyleSheet.absoluteFillObject]}
            />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', position: 'absolute', top: '90%', alignItems: 'center', width: '100%' }} >
                <Button style={{ width: 100 }} title={'직접 입력하기'} onPress={() => {
                    setScanned(false);
                    // navigation.navigate('MeterialInputComponent', {code: 'data' });
                    navigation.replace('MeterialInputComponent', { code: '' });
                }} />
            </View>
        </SafeAreaView>);
}

export default ScannerComponent;