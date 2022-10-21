
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigator/MainStack'
import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';
import { registerToken } from './api';
import { setDialogState } from './store/mainStore';



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


SplashScreen.preventAutoHideAsync().then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)).catch(console.warn);
const App = () => {
  // 푸쉬알림
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Hides native splash screen after 2s
    setTimeout(async () => { 
      await SplashScreen.hideAsync();
    }, 2000);
    // 서버로부터 전달받은 것은 여기로 받는다.
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(`addNotificationReceivedListener`);
      // console.log(store.getState());
      // console.log(store.dispatch);
      if(notification.request.content.title.includes('유통기한 알림')){
        store.dispatch(setDialogState({isVisible:true, content:notification.request.content.body}))
      }else if(notification.request.content.title.includes('님')){
        store.dispatch(setDialogState({isVisible:true, content:notification.request.content.body}))
      }
      console.log(notification.request.content.body);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { console.log(`addNotificationResponseReceivedListener`)});

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