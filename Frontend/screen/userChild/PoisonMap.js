import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, Dimensions, Text, FlatList, Image } from 'react-native';
import { Paragraph, Card, FAB, Button, Divider } from 'react-native-paper';
import MapView, { Geojson, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Modalize } from 'react-native-modalize';
import { ALL_LOCATION } from '../../dummy';
import RNSpeedometer from 'react-native-speedometer'
import { fetchBigCity, fetchCildCity, fetchMapGaguer } from '../../api';

// console.disableYellowBox = true;

/* 
* 관심	0 ≤ P ＜ 55
* 주의	55 ≤ P ＜ 71
* 경고	71 ≤ P ＜ 86
* 위험	86 ≤ P ≤ 100 
*/
 {/* <View style={{flex:1,marginTop:20 ,flexDirection:'row',  alignItems:'center', justifyContent:'center'}}>
                    <Image style={styles.tinyLogo} source={{uri:'https://cdn-icons-png.flaticon.com/512/3143/3143643.png'}}/>

                    <Image style={styles.tinyLogo} source={{uri:'https://cdn-icons.flaticon.com/png/512/2821/premium/2821805.png?token=exp=1659260580~hmac=00de98802ca763e95a0230bcbc30d03d'}}/>
               </View>
               <View style={{flex:1, marginTop:20,flexDirection:'row', backgroundColor:'red', alignItems:'center', justifyContent:'center'}}>
                    <Text>
                       고기
                    </Text>
               </View> */}

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: '고기',
        img : 'https://cdn-icons-png.flaticon.com/512/3143/3143643.png'
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: '샌드위치',
        img : 'https://cdn-icons.flaticon.com/png/512/2821/premium/2821805.png?token=exp=1659260580~hmac=00de98802ca763e95a0230bcbc30d03d'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: '계란',
        img : 'https://toppng.com/uploads/preview/eggs-11528350931egreshkuji.png'
   
    },
];

const ItemText = ({ title, img }) => (
    <View style={styles.item}>
        <Image style={styles.tinyLogo} source={{uri:img}}/>
        <Text style={styles.title}>{title}</Text>
    </View>
);



const LOCATIONLENGTH = 17;
let _array = [];

const LOCATION_GEN = () => {
    let _bigCity = fetchBigCity();
    console.log(_bigCity)
    for (const property in _bigCity) {
        var fillColor = '';
        if (0 <= _bigCity[property] && _bigCity[property] < 55) {
            fillColor = '#00c0de';
        } else if (55 <= _bigCity[property] && _bigCity[property] < 71) {
            fillColor = '#339955';
        } else if (71 <= _bigCity[property] && _bigCity[property] < 86) {
            fillColor = '#FF7711';
        } else if (86 <= _bigCity[property] && _bigCity[property] <= 100) {
            fillColor = '#ff2211';
        }
        _array.push(fillColor);
    }
    return _array;
}

const GeoGen = ({ modal, setSendLocation }) => {
    const [fill, setFill] = useState(()=>LOCATION_GEN());
    const locName = useRef([
        '강원도',
        '경기도',
        '경상남도',
        '경상북도',
        '광주시',
        '대구시',
        '대전시',
        '부산시',
        '서울시',
        '세종시',
        '울산시',
        '인천시',
        '전라남도',
        '전라북도',
        '제주도',
        '충청남도',
        '충청북도',
    ]);
    useEffect(()=>{

    },[]);
    const updateFillChanged = index => {
        console.log('index: ' + index);
        let newArr = [...fill];
        for (let index = 0; index < newArr.length; index++) {
            newArr[index] = _array[index];
        }
        newArr[index] = '#abffbe'
        setFill(newArr);
    }
   

    return <>
        {ALL_LOCATION.map((loc, index) => {
            return <Geojson
                tappable={true}
                onPress={() => {
                    updateFillChanged(index);
                    console.log(locName.current[index]);
                    setSendLocation(locName.current[index]);
                    modal();
                }}
                geojson={loc}
                strokeColor="blue"
                fillColor={fill[index]}
                strokeWidth={2} />
        })}
    </>
}

const Item = ({ title, jisu }) => {
    const [fillColor,setFillColor] = useState('');
    useEffect(()=>{
        if (0 <= jisu && jisu < 55) {
            setFillColor('#00c0de');
        } else if (55 <= jisu&& jisu < 71) {
            setFillColor('#339955');
        } else if (71 <= jisu && jisu < 86) {
            setFillColor('#FF7711');
        } else if (86 <= jisu && jisu <= 100) {
            setFillColor('#ff2211');
        }
    },[])
    /* 인가번호 상호 주소 메인메뉴 지정일자 인허가연도 */
    return(<View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10 }}>
            <Paragraph style={{flex:1,textAlign:'center', fontSize:20}}>{title}</Paragraph>
            <Paragraph style={{flex:1,textAlign:'center', color:fillColor,fontSize:20}}>{jisu}</Paragraph>
    </View>)
};


const Header = () => (
    <View style={{ backgroundColor: '#7FBCD2', borderColor: '#FCF8E8', flexDirection:'row', padding:10,borderTopLeftRadius:8, borderTopRight:8 }}>
        <Paragraph style={{flex:1,textAlign:'center', fontSize:20, color:'white', fontWeight:'bold'}}>도시</Paragraph>
        <Paragraph style={{flex:1,textAlign:'center', fontSize:20, color:'white', fontWeight:'bold'}}>식중독 지수</Paragraph>
    </View>
);

const renderItemC = ({ item }) => (<Item title={item.title} jisu={item.jisu} />);

const menuSeparator = () => { return <View style={{height:10, borderBottomWidth:0.3}}></View> }

const PoisonMap = () => {

    const [location, setLocation] = useState({});

    /* ***** */
    /* 지역 클릭 데이터 호출 */
    const [sendLocation, setSendLocation] = useState('');
    const [childList, setChildList] = useState([]);
    const modalizeRef = useRef(null);
    /* ***** */

    /* ***** */
    /* 유저 지역 기반 게이지 호출 */
    const [geo, setGeo] = useState([]);
    const [gage, setGage] = useState(0);
    const [virus, setVirus] = useState('');
    const [warningFood, setWarningFood] = useState([]);
    const modalgager = useRef(null);
    /* ***** */

    useEffect(() => {
        console.log("request location param >>" + sendLocation);
        fetchCildCity(sendLocation, setChildList);
    }, [sendLocation]);

    const renderItem = ({ item }) => (
        <ItemText title={item.title} img={item.img}/>
    );

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onGagerOpen = () => {
        fetchMapGaguer(geo, setGage, "today", setVirus)
        modalgager.current?.open();
    }

    const onGagerChange = (value) => {
        fetchMapGaguer(geo, setGage, value, setWarningFood)
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            let _error = '';
            if (status !== 'granted') { _error = '위치 권한을 허용해주세요.'; }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
            const { latitude, longitude } = location.coords;
            setLocation({ latitude, longitude })
            let geocode = await Location.reverseGeocodeAsync({ latitude, longitude })
            setGeo(geocode);
            console.log(geocode[0]);
        })();
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <MapView
                showsUserLocation={true}
                loadingEnabled={true}
                style={styles.map} region={{
                    latitude: 127,
                    longitude: 37,
                    latitudeDelta: 10.04,
                    longitudeDelta: 10.05,
                    // latitude: location.latitude,
                    // longitude: location.longitude,
                    // latitudeDelta: 3,
                    // longitudeDelta: 3,
                }}>
                <GeoGen modal={onOpen} setSendLocation={setSendLocation} />
                {/* <Marker coordinate={{
                    latitude:37.4979502,
                    longitude:127.0276368
                }}>
                <Text style={{backgroundColor:'white',width:100,height:100, borderRadius:50, textAlign:'center',justifyContent:'center'}}>hello world</Text>
                </Marker> */}
            </MapView>
            <Modalize modalHeight={400} snapPoint={300} ref={modalizeRef}>
                <View style={{ flex: 1 }}>
                    <Header />
                    <FlatList
                        data={childList}
                        // renderItem={renderItem}
                        renderItem={renderItemC}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={menuSeparator} />
                </View>
            </Modalize>

            <Modalize modalHeight={500} snapPoint={300} ref={modalgager}>
                <View style={{flex:1}}>
                    <RNSpeedometer value={gage} size={300} />
                </View>

                <View style={{marginTop:60,flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={styles.tinyLogo} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1097/1097326.png' }} />
                    <Text style={{ marginLeft:8,fontSize: 30 }}>{virus}</Text>
                </View>

                <View style={{padding:8}}>
                    <View style={{borderWidth:1, borderColor:'#e0e0e0'}}></View>
                </View>

                <View style={{ flex: 1}}>
                    <View style={{alignItems:'center'}}><Text style={{fontSize:20, padding:10}}>주의 음식</Text></View>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={item => item.id} />
                </View>
                
                <View style={{padding:8}}>
                    <View style={{borderWidth:1, borderColor:'#e0e0e0'}}></View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Button mode="contained" onPress={() => onGagerChange('today')}>오늘</Button>
                    <Button mode="contained" style={{ marginLeft: 35 }} onPress={() => onGagerChange('tomorrow')}>내일</Button>
                    <Button mode="contained" style={{ marginLeft: 35 }} onPress={() => onGagerChange('afterTomorrow')}>모레</Button>
                </View>
            </Modalize>
            <FAB
                icon="alert"
                color='red'
                style={styles.fab}
                onPress={onGagerOpen} />
            <View style={{
                flex: 1,
                backgroundColor: '#ffffff',
                position: 'absolute',
                padding: 10,
                top: '5%',
                left: 5,
                borderRadius: 10,
                opacity: 0.9
            }}>
                <Text style={{ color: '#00c0de', fontWeight: 'bold' }}>* 관심 0 ≤ P ＜ 55</Text>
                <Text style={{ color: '#339955', fontWeight: 'bold' }}>* 주의 55 ≤ P ＜ 71</Text>
                <Text style={{ color: '#FF7711', fontWeight: 'bold' }}>* 경고 71 ≤ P ＜ 86</Text>
                <Text style={{ color: '#ff2211', fontWeight: 'bold' }}>* 위험 86 ≤ P ≤ 100 </Text>
            </View>
        </SafeAreaView>
    );
}
export default PoisonMap;

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight || 0,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        marginTop: 50 || 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },

    fab: {
        backgroundColor:'#ffffff',
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    tinyLogo: {
        width: 50,
        height: 50,
    },
    item: {
        width:100,
        height:100,
        borderRadius:8,
        backgroundColor: '#F8F8F8',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    title: {
        fontSize: 14,
    },
});
