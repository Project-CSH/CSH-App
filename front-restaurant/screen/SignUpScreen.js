import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import { Snackbar } from 'react-native-paper';

import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default class SignUpScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      email   : '',
      password: '',
      auth : false,
      visibles : false
    }
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  render() {
    return (
      <View style={styles.container}>
         <Snackbar
        visible={this.state.visibles}
        duration={6000}
        theme={{ colors: { accent: 'white', text:'white',inversePrimary:'white' }}}
        style={{
          backgroundColor: 'green',
          fontSize: 130
        }}
        action={{
          label: '알림',
          color:'white',
        }}>
      <TouchableOpacity onPress={()=>{
        this.setState({
          visibles: false
        })
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color:'white',flex:1 }}>
          {'회원가입을 완료했습니다.'}
        </Text></TouchableOpacity>
      </Snackbar>


        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="이름"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(fullName) => this.setState({fullName})}/>
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="이메일"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="비밀번호"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputIcon} onPress={()=>{
            setTimeout(() => {
              this.setState({
                auth:true
              })
            }, 1000);
          }}>
            {this.state.auth ? <AntDesign name="downcircle" size={24} color="black" /> : <AntDesign name="downcircleo" size={24} color="black" />}
          </TouchableOpacity>
          <TextInput style={styles.inputs}
              placeholder="사업자번호"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>


        <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => {
          this.setState({
            visibles: true
          })
          setTimeout(() => {
            this.setState({
              visibles: false
            })
            this.props.navigation.navigate('LoginScreen');
          }, 2000);
        }}>
          <Text style={styles.signUpText}>회원가입</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:10,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:10,
  },
  signupButton: {
    backgroundColor: "#00b5ec",
  },
  signUpText: {
    color: 'white',
  }
});
