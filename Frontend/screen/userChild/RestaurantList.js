import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Divider, Paragraph, Text, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { fetchUser } from '../../api';
import * as Linking from 'expo-linking';

const Header = () => (
  <Card style={{ backgroundColor: '#FCF8E8', borderColor: '#FCF8E8' }}>
    <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Paragraph style={[styles.fieldWrap,{flex:1}]}>상호</Paragraph>
        <Paragraph style={[styles.fieldWrap,{width:300, justifyContent:'center', alignItems:'center'}]}>
        주소
        </Paragraph>
      </ScrollView>
    </Card.Content>
  </Card>
);

/**
 * @url https://address.dawul.co.kr/
 *  url scheme 값 참고 정보
 * */ 
const Item = ({ title, address }) => (
  /* 인가번호 상호 주소 메인메뉴 지정일자 인허가연도 */
  <Card>
    <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Paragraph style={styles.paragraphWrap}>{title}</Paragraph>
        <Paragraph style={styles.paragraphWrap}>{address}</Paragraph>
        <Paragraph style={styles.paragraphWrap}>
        <Button onPress={async()=>{
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
          }).then(res=>res.text()).then(data=>{
            var x = data.split('|');
            long = x[3];
            lat = x[4];
            // Linking.openURL('nmap://route/public?slat=37.4640070&slng=126.9522394&sname=%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90&dlat=37.5209436&dlng=127.1230074&dname=%EC%98%AC%EB%A6%BC%ED%94%BD%EA%B3%B5%EC%9B%90&appname=com.example.myapp');
            Linking.openURL(`nmap://route/car?slat=${latitude}&slng=${longitude}&sname=내위치&dlat=${lat}&dlng=${long}&dname=${address}&appname=com.example.myapp`);
          });

          }}>click</Button>
        </Paragraph>
        
      </ScrollView>
    </Card.Content>
  </Card>
);
const menuSeparator = () => { return <Divider /> }

const renderItem = ({ item }) => (<Item title={item.title} address={item.address} />);

const RestaurantList = () => {
  const [list, setList] = useState([]);
  const [myloc, setMyloc] = useState({});

  useEffect(() => {
    (async () => {
      let setLoc = "";
      let { status } = await Location.requestForegroundPermissionsAsync();
      let _error = '';
      if (status !== 'granted') { _error = '위치 권한을 허용해주세요.'; }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
      const { latitude, longitude } = location;
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude })
      console.log(geocode);
      // // geocode[0].region =="서울특별시" ? setLoc = geocode[0].district : setLoc = geocode[0].region
      setLoc = "세종시";
      fetchUser(setLoc,setList);
      console.log(list);
  })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 시 단위 */}
      <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 10 }}>행정구역 모범음식점</Text>
      <Header />
      <FlatList
        ListEmptyComponent={()=> <ActivityIndicator style={{ position:StyleSheet.absoluteFill, top: 200 }} size="large" color="#00ff00" /> }
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={menuSeparator}/>
    </SafeAreaView>
  );
}

export default RestaurantList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  fieldWrap: {
    fontSize: 15,
    fontWeight: 'bold',
    borderColor: 'rgba(158, 150, 150, .5)',
    borderRightWidth: 1, paddingHorizontal: 10
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  paragraphWrap: {
    padding: 5
  },
  title: {
    fontSize: 32,
  }
});
