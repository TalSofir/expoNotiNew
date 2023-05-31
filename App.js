import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

//Notifications set up
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false
    }
  }
})

export default function App() {


  //Permission handler for when the app is in the foreground
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Perrnission required', 'Failed to get push token for push notification!');
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync({ projectId: '0209b2de-eb68-4d4e-9901-5d13f339531d' })
      console.log(pushTokenData.data);
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH
      });
    }
    configurePushNotifications();
  }, [])



  //Listener for when the app is in the foreground
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received')
      console.log(JSON.stringify(notification));
      const userName = notification.request.content.data.userName;
      console.log(userName)
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {

      console.log('Notification response received')
      console.log(response);
      alert('Notification response received')

    });


    return () => {
      subscription1.remove()
      subscription2.remove()
    }
  }, [])

  //Messege handler for when the app is in the foreground
  function schedulePushNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'This is the first local notification we are sending!',
        data: { userName: 'John Doe', userId: '123', message: 'Hello there!' },
        sound: 'default'
      },
      trigger: {
        seconds: 5
      }
    })
  }


  return (
    <View style={styles.container}>
      <Button title="Schedule notification" onPress={schedulePushNotificationHandler} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
