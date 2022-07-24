import React, { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import RestaurantStack from '../navigator/RestaurantStack';
import LoginScreen from '../component/LoginScreen';

const RestaurantMainScreen = ({navigation}) =>{
    const {value} = useSelector(state => state.publicReducer);

    return(
        <>
        {value?<RestaurantStack/>:<LoginScreen/>}
        </>
    );
}

export default RestaurantMainScreen;