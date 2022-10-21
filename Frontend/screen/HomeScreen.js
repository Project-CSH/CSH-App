import React, { useState } from 'react'
import { FlatList, Image, StyleSheet, TouchableOpacity, View, Text,Animated } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Paragraph, Card, Divider, Avatar } from 'react-native-paper';

class VerticalMotionExample extends React.Component {
    state = {
      animation: new Animated.Value(0)
    }
    
    
    componentDidMount() {
        this.createAnimation();
    }
    createAnimation = () => {
        Animated.sequence([
            Animated.timing(this.state.animation, { toValue: 10, duration: 500, useNativeDriver: true }),
            Animated.timing(this.state.animation, { toValue: -10, duration: 500, useNativeDriver: true }),
            Animated.timing(this.state.animation, { toValue: 10, duration: 500, useNativeDriver: true }),
            Animated.timing(this.state.animation, { toValue: 0, duration: 500, useNativeDriver: true })
          ]).start(() => {
          this.createAnimation()
        });
    }
  
    render() {
      const animationStyles = {
        transform: [
          { translateY: this.state.animation }
        ]
      };
  
      return (
        <View>
        <Animated.View style={[{
            width: 30,
            height: 30,
          }, animationStyles,{alignItems:'center'}]}>
            <AntDesign name="caretdown" size={24} color="white" />
        </Animated.View>
        <Animated.View style={[{
            width: 30,
            height: 30
          }, animationStyles,{alignItems:'center'}]}>
            <AntDesign name="caretdown" size={24} color="white" />
        </Animated.View>
        </View>
      );
    }
  }

const HomeScreen = ({ navigation, route }) => {
    const [viewHeight, setHeight] = useState(null)
    return (
        <View style={styles.container} onLayout={e => setHeight(e.nativeEvent.layout.height)}>
           
            <View style={{position:'absolute',top:'70%',flex:1,backgroundColor:'#ffffff00', width:'100%', zIndex:1,alignItems:'center'}}>
                <VerticalMotionExample/>
            </View>

            {viewHeight && (
                <FlatList
                    data={data}
                    pagingEnabled
                    keyExtractor={(index) => index}
                    decelerationRate='fast'
                    renderItem={({ index, item }) => (
                        <View style={[styles.item, { height: viewHeight }]}>
                            {index == 2 &&  <View style={{position:'absolute', bottom:80, zIndex:2,width:'100%', alignItems:'center'}}>
                <TouchableOpacity style={{backgroundColor:'#ffffff80', padding:20, borderRadius:10, flexDirection:'row', alignItems:'center'}} onPress={()=>{navigation.replace('UserMainScreen');}}>
                    <Avatar.Image size={30} style={{backgroundColor:'#ffffff', marginRight:10}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} />
                    <Text style={{fontSize:20, color:'black', fontWeight:'bold'}}>시작하기</Text>
                </TouchableOpacity>
            </View>}
                            <View style={{flexDirection:'row',position:'absolute', backgroundColor:'#ffffff00',width:'100%', height:'100%',alignItems:'center',justifyContent:'center',zIndex:1}}>
                                {/* <Avatar.Image size={30} style={{backgroundColor:'#ffffff'}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} /> */}
                                <Text style={{
                                    fontWeight: '700',
                                    padding:20,
                                    overflow:'hidden',
                                    color:'black', 
                                    fontSize:20, 
                                    // fontWeight:'bold',
                                    backgroundColor:'#ddddddd0',
                                    borderWidth:0, 
                                    borderRadius:10}}>{item.text}</Text>
                            </View>
                            
                            {/* <View style={{flexDirection:'row',position:'absolute', backgroundColor:'#ffffff00', bottom:30,right:30,zIndex:1}}>
                                <Text style={{padding:5,overflow:'hidden',color:'black', fontSize:20, fontWeight:'bold',backgroundColor:'#ffffff90',borderWidth:0, borderRadius:10}}>{index+1}</Text>
                            </View> */}

                            <Image style={styles.img} source={{ uri: item.url }} />

                        </View>
                    )}
                />
            )}
        </View>
    )
}

export default HomeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: '#444'
    },
    img: {
        height: '100%',
        width: '100%'
    }
})

const data = [
    {
        text:'우리동네 안전한 식당은 어딜까?',
        url :'https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
    },
    {
        text:'쉽고 빠르게 안내까지?',
        url :'https://images.unsplash.com/photo-1488900128323-21503983a07e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
    },
    {
        text:'청신한으로 안내받기',
        url :'https://images.unsplash.com/photo-1526318896980-cf78c088247c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
    }
    
]