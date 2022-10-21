import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, Text } from 'react-native';
import { TextInput, Button, ActivityIndicator, Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { enrollInventory } from '../api';
import { setDialogState, setInventory } from '../store/mainStore';

const MeterialInputComponent = ({ navigation, route }) => {

    const [inputHolder, setInputHolder] = useState(true);
    useEffect(() => {
        console.log(route.params);
        route.params.code != '' ? setInputHolder(false) : setInputHolder(true)
    }, []);

    const [barcodeNumber, onChangebarcodeNumber] = useState(route.params.code);
    const [productName, onChangeProductName] = useState("");
    const [kindof, onChangeKindof] = useState("");
    const [expiryDate, onChangeExpiryDate] = useState("");
    const { inventory } = useSelector((state) => state.mainStore)

    const [ActivityIndicatorRun, setActivityIndicatorRun] = useState(false);

    const dispatch = useDispatch();
    const _enrollInventory = async () => {
        setActivityIndicatorRun(true);
        setTimeout(async () => {
            try {
                let res = await enrollInventory({
                    barcode_number: barcodeNumber,
                    product_name: productName,
                    kindof: kindof,
                    expiry_date: expiryDate,
                });

                if (res.result == 'success') {
                    console.log(res.inventory_list);
                    dispatch(setInventory(res.inventory_list));
                    let text = await _findInventory_list();
                    dispatch(setDialogState({
                        isVisible: true,
                        content: `등록완료 \n${text}`
                    }));
                    navigation.pop();
                }
            } catch (error) { console.log(error); }
        }, 2000);

    }

    const _findInventory_list = async () => {
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
            <SafeAreaView style={[styles.container, { alignItems: 'center', backgroundColor: '#2ad3e7' }]}>
                <ActivityIndicator animating={true} size={'large'} color={'white'} />
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>잠시만 기다려주세요</Text>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                barStyle='dark-content'
                hidden={false} />
                
            <View style={{ alignItems: 'center', flex: 0.2, flexDirection: 'row', justifyContent: 'center',padding:10 }}>
                <Avatar.Image size={24} style={{ backgroundColor: '#ffffff' }} source={{ uri: 'https://www.msit.go.kr/images/user/img_mi_symbol.png' }} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: 'black' }}>재고입력</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center',flex:3 }}>
                <TextInput
                    style={{ width: '80%',  backgroundColor: 'white', }}
                    onChangeText={onChangeProductName}
                    underlineColor={'black'}
                    value={productName}
                    editable={inputHolder}
                    label="제품이름"
                    placeholder="순창고추장 1kg"
                    activeUnderlineColor='black' />

                <TextInput
                    style={{ width: '80%',  backgroundColor: 'white' }}
                    label="식자재 종류"
                    value={kindof}
                    underlineColor={'black'}
                    editable={inputHolder}
                    onChangeText={onChangeKindof}
                    placeholder="고추장"
                    activeUnderlineColor='black' />

                <TextInput
                    style={{ width: '80%',  backgroundColor: 'white' }}
                    onChangeText={onChangeExpiryDate}
                    editable={inputHolder}
                    value={expiryDate}
                    underlineColor={'black'}
                    label="유통기한"
                    placeholder="2022.02.02"
                    activeUnderlineColor='black' />

                <View style={styles.btnContainer}>
                    <Button style={styles.btn} mode="contained" color='#008bff' onPress={_enrollInventory}>입력하기</Button>
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