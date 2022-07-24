import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import UserStack from '../navigator/UserStack';

const UserMainScreen = () =>{
    return(<UserStack/>);
}

export default UserMainScreen;