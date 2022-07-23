import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, FlatList, StatusBar } from 'react-native';
import { Button, Card, Divider, Paragraph, Text } from 'react-native-paper';

/* *
    바코드 이름
    상품이름
    종류
    유통기한
*/
const DATA = [
    {
      bcdnum: 'First Item',
      address: "서울특별시 강동구 둔촌동"
    },
  ];

const Header = () => (
    <Card style={{ backgroundColor: '#FCF8E8', borderColor: '#FCF8E8' }}>
      <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Paragraph style={styles.fieldWrap}>제목</Paragraph>
          <Paragraph style={styles.fieldWrap}>공지사항</Paragraph>
        </ScrollView>
      </Card.Content>
    </Card>
  );
  
  const Item = ({ title }) => (
    /* 인가번호 상호 주소 메인메뉴 지정일자 인허가연도 */
    <Card>
      <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Paragraph style={styles.paragraphWrap}>제목</Paragraph>
          <Paragraph style={styles.paragraphWrap}>공지사항</Paragraph>
        </ScrollView>
      </Card.Content>
    </Card>
  );
  const menuSeparator = () => { return <Divider /> }
  
  const renderItem = ({ item }) => (<Item title={item.title} />);
  
const GovernmentNotice = ({ navigation }) => {
  
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <Header/>
        <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={menuSeparator}
      />
        </SafeAreaView>);
}

export default GovernmentNotice;

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
    },
  });