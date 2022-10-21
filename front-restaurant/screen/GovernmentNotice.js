import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { Paragraph, Card, Divider, Avatar } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

const DATA = [
  {
    title: '검사명령 대상 수입식품등 재지정 알림',
    content: `검사명령 대상으로 지정되어 검사 실시 중인 품목 중, 당초 검사명령 기간이 종료 예정인 품목이 있어, 기간 종료에 따른 검토결과 검사명령 재지정 내용을 알리고자 함
    <검사명령 대상 수입식품등 재지정 공지>
1. 사유
검사명령 대상으로 지정되어 검사 실시 중인 품목 중, 당초 검사명령 기간이 종료 예정인 품목이 있어, 기간 종료에 따른 검토결과 검사명령 재지정 내용을 알리고자 함
2. 검토결과
O 검사명령 재지정 대상 및 재지정 여부:
- 과자(밀봉제품에 한하며, 발효제품 또는 유산균 함유제품 제외(인도, 대상 해외제조업소 조정)
- 천연향신료 중 분말형태의 제품(중국, 재지정)
- 베리류(블루베리, 링곤베리, 빌베리) 및 이를 원료로 제조한 잼류, 과.채가공품(유럽 7개국, 재지정)
O 재지정 검사명령서 등 상세내용 붙임참조`,
    date: '2020.12.30',
    manager: '김병구',
    ph:'010-6398-0790',
    file:'https://www.mfds.go.kr/brd/m_74/down.do?brd_id=ntc0003&seq=44453&data_tp=A&file_seq=1'
  },
  {
    title: '검사명령 대상 수입식품등 재지정 알림',
    content: `<검사명령 대상 수입식품등 재지정 공지>
    1. 사유
    검사명령 대상으로 지정되어 검사 실시 중인 품목 중, 당초 검사명령 기간이 종료 예정인 품목이 있어, 기간 종료에 따른 검토결과 검사명령 재지정 내용을 알리고자 함
    2. 검토결과
    O 검사명령 재지정 대상 및 재지정 여부:
    - 과자(밀봉제품에 한하며, 발효제품 또는 유산균 함유제품 제외(인도, 대상 해외제조업소 조정)
    - 천연향신료 중 분말형태의 제품(중국, 재지정)
    - 베리류(블루베리, 링곤베리, 빌베리) 및 이를 원료로 제조한 잼류, 과.채가공품(유럽 7개국, 재지정)
    O 재지정 검사명령서 등 상세내용 붙임참조`,
    date: '2020.12.30',
    manager: '김병구',
    ph:'010-6398-0790',
    file:'https://www.mfds.go.kr/brd/m_74/down.do?brd_id=ntc0003&seq=44453&data_tp=A&file_seq=3'
  }


];

const menuSeparator = () => { return <View style={{ height: 10 }}></View> }


const Item = ({ title, content, date, manager, ph, file }) => {
  
  const navigation = useNavigation();
  return (<Card>
    <Card.Content>
      <View style={{ flexDirection: 'row' }}>
      <Avatar.Image size={24} style={{backgroundColor:'#ffffff'}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} />

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>{title}</Text>
        </View>
      </View>
      <Paragraph numberOfLines={2}>{content}</Paragraph>
      <Paragraph>{'작성자 :'}{manager} {date}</Paragraph>
      <TouchableOpacity
       style={{position:'absolute', bottom:10, right:10}}
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('NoticeDetail',{
            title:title, content:content, date:date, manager:manager, ph:ph, file:file
          });
        }}>
        <Text style={{color:'blue', fontWeight:'bold'}}>자세히</Text>
      </TouchableOpacity>
    </Card.Content>
  </Card>)
};

const renderItem = ({ item }) => (<Item 
  title={item.title} 
  content={item.content} 
  date={item.date} 
  manager={item.manager} 
  ph={item.ph} 
  file={item.file} 
  />);


const GovernmentNotice = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', flexDirection:'row', justifyContent:'center' }}>
      <Avatar.Image size={24} style={{backgroundColor:'#ffffff'}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#ffffff' }}>기관공지</Text>
      </View>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <View></View>
        </View>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={menuSeparator} />
      </View>
    </SafeAreaView>);
}

export default GovernmentNotice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#2ad3e7'

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
  },
});