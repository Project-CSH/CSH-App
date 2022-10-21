import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity, Button, Text } from 'react-native';
import { Paragraph, Card, Divider, Avatar } from 'react-native-paper';

import * as Linking from 'expo-linking';

const NoticeDetail = ({route}) => {
    const { title, content, date, manager, ph, file } = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center', flexDirection:'row', justifyContent:'center' }}>
            <Avatar.Image size={24} style={{backgroundColor:'#ffffff'}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#ffffff' }}>공지상세</Text>
            </View>
            {/* <Text>hello Notice Detail</Text>
            <TouchableOpacity
        activeOpacity={1}
          onPress={()=>{
            Linking.openURL('http://freeforms.co.kr/file_download.asp?index=B223203944-46&file=doc');
          }}>
          <Text>Press Here</Text>
        </TouchableOpacity> */}

            <View style={{ backgroundColor: '#2ad3e7', flex: 1, padding: 10 }}>
                <Card style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flex: 1, padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20 }}>{title}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 9, padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15 }}>{content}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1, padding: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>{manager} {ph}</Text>
                            <Text style={{ fontSize: 13 }}>{date}</Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { Linking.openURL(file); }}>
                            <Text style={{color:'blue', fontWeight:'bold'}}>다운로드</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>

        </SafeAreaView>

    );
}
export default NoticeDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#2ad3e7',
    },

    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});