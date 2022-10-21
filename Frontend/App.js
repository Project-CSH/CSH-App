/**
* 청신한 앱 프론트앤드 작업
* 
* @author JungMin-Kan
* @version 1.0,
* @see None
*/

import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigator/MainStack'
import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import * as SplashScreen from 'expo-splash-screen';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';

SplashScreen.preventAutoHideAsync().then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)).catch(console.warn);
console.disableYellowBox = true;


/**
 * @Explain 푸쉬알림 기본 설정
 */
 Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * background notification
 */
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!');
  // Do something with the notification data
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);


/**
 * @expalin token 생성 및 서버에 토큰 등록
 * @returns 
 */
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    try {
      let res = await registerToken(token);
      console.log(res)
    } catch (error) { }
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}


const App = () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Hides native splash screen after 2s
    setTimeout(async () => { await SplashScreen.hideAsync();}, 2000);
   
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // setNotification(notification);
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
    </PaperProvider>
   </Provider>

  );
}
export default App;