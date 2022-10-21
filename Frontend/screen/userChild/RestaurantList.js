import React, { useState, useEffect, memo, useCallback } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Avatar, Paragraph, Text, Button, Title, Searchbar,Snackbar } from 'react-native-paper';
import * as Location from 'expo-location';
import { fetchUser, userPush } from '../../api';

import * as Linking from 'expo-linking';

// console.disableYellowBox = true;

const Item = memo(({ title, address }) => {
  /* 인가번호 상호 주소 메인메뉴 지정일자 인허가연도 */
  const [destination, setDestination] = useState(``);
  useEffect(() => { getScheme(); }, [])
  const getScheme = async () => {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
    const { latitude, longitude } = location.coords;
    let lat, long;
    fetch("https://address.dawul.co.kr/input_pro.php", {
      "headers": {
        "accept": "*/*",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "pragma": "no-cache",
        "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://address.dawul.co.kr/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `refine_ty=8&protocol_=${address}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(res => res.text()).then(data => {
      var x = data.split('|');
      long = x[3];
      lat = x[4];
      setDestination(`nmap://route/car?slat=${latitude}&slng=${longitude}&sname=내위치&dlat=${lat}&dlng=${long}&dname=${address}&appname=com.example.myapp`)
    });
  };
  return (
    <Card>
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{address}</Paragraph>
      </Card.Content>
      {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
      <Card.Actions>
        <Avatar.Image size={24} source={{ uri: 'https://clova-phinf.pstatic.net/MjAxODAzMjlfOTIg/MDAxNTIyMjg3MzM3OTAy.WkiZikYhauL1hnpLWmCUBJvKjr6xnkmzP99rZPFXVwgg.mNH66A47eL0Mf8G34mPlwBFKP0nZBf2ZJn5D4Rvs8Vwg.PNG/image.png' }} />
        <Button color='green' onPress={() => {
          Linking.openURL(destination);
        }}>네이버 지도로 이동하기</Button>
      </Card.Actions>
    </Card>
  );
});

const menuSeparator = () => { return <View style={{ height: 10, }}></View> }

const renderItem = ({ index, item }) => (<Item title={item.title} address={item.address} />);

const RestaurantList = () => {
  const [list, setList] = useState([{
    "address": "강원도 원주시 우산동 90-4",
    "title": "청솔식당",
  }, {
    "address": "강원도 원주시 중앙로 46",
    "title": "민생회관",
  }, {
    "address": "강원도 원주시 장미공원길 74 (단계동)",
    "title": "영월장칼국수",
  }, {
    "address": "강원도 원주시 중평길 59 (평원동)",
    "title": "무궁화집",
  }]);
  const [buf, setBuf] = useState([]);
  const [myloc, setMyloc] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const [message, setMessage] = useState('')
  const [visibles, setVisibles] = useState(false);
  const onToggleSnackBar = () => setVisibles(!visibles);
  const onDismissSnackBar = () => setVisibles(false);

  useEffect(() => {
    setLocation();
    _dsa();
    return () => { }
  }, []);
  const setLocation = async () => {
    let setLoc = "";
    let { status } = await Location.requestForegroundPermissionsAsync();
    let _error = '';
    if (status !== 'granted') { _error = '위치 권한을 허용해주세요.'; }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
    const { latitude, longitude } = location;
    let geocode = await Location.reverseGeocodeAsync({ latitude, longitude })
    console.log(geocode);
    geocode[0].region == "서울특별시" ? setLoc = geocode[0].district : setLoc = geocode[0].region
    setLoc = "세종특별자치시 조치원읍";
    fetchUser(setLoc, setList, setBuf);
    setBuf(list);
    console.log(list);
   
  
  }

  const _dsa = async()=>{
    let res = await userPush();
    console.log(res);
    setMessage(res.message);
    setTimeout(() => {
      setVisibles(true);
    }, 1000);
  }


  const searchFilterFunction = (text) => {
    // // Check if searched text is not blank
    // if (text) {
    //   // Inserted text is not blank
    //   // Filter the masterDataSource and update FilteredDataSource
    //   const newData = list.filter(function (item) {
    //     // Applying filter for the inserted text in search bar
    //     return item.title.indexOf(searchQuery) > -1;
    //   });
    //   setList(newData);
    //   setSearchQuery(text);
    // } else {
    //   // Inserted text is blank
    //   // Update FilteredDataSource with masterDataSource
    //   setList(buf);
    //   setSearchQuery(text);
    // }
  };
  return (
    <SafeAreaView style={styles.container}>
      

      {/* 시 단위 */ }
      <View style={{alignItems:'center'}}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10 }}>모범음식점 찾기</Text>
      </View>
      <View style={{padding:10}}>
        <Searchbar
        placeholder="식당이름 검색"
        onChangeText={(text) => searchFilterFunction(text)}
        value={searchQuery}/>
      </View>
  {/* <Header /> */ }
  <View style={{ padding: 10 }}>
    <FlatList
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => <ActivityIndicator style={{ position: StyleSheet.absoluteFill, top: 200 }} size="large" color="#7FBCD2" />}
      data={list}
      // windowSize={2}
      renderItem={renderItem}
      keyExtractor={item => item.title}
      ItemSeparatorComponent={menuSeparator} />
  </View>
  <Snackbar
        visible={visibles}
        onDismiss={onDismissSnackBar}
        duration={6000}
        theme={{ colors: { accent: 'white', text: 'red', inversePrimary: 'red' } }}
        style={{
          backgroundColor: 'orange',
          fontSize: 130
        }}
        action={{
          label: '알림',
          color: 'white',
        }}>
        <TouchableOpacity onPress={onDismissSnackBar}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'black', flex: 1 }} >
       
            {
              ((message).length > 10) ?
              (((message).substring(0,40)) + '...') :
              message
            }
          </Text></TouchableOpacity>
      </Snackbar>

    </SafeAreaView >
  );
}

export default RestaurantList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#B5E0F0'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  title: {
    fontSize: 32,
  }
});
