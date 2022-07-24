import React, { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import LoginScreen from '../component/LoginScreen';
import PublicStack from '../navigator/PublicStack';

const PublicMainScreen = ({navigation}) =>{
    const {value} = useSelector(state => state.publicReducer);
    return(
        <>
        {value?<PublicStack/>:<LoginScreen/>}
        </>
    );

}

export default PublicMainScreen;