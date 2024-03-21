import React from 'react';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
// import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {getUniqueId} from 'react-native-device-info';
// import {KEYS, storeData} from 'api/UserPreference';
import {KEYS, getData, storeData} from '../api/User_Preference';
import {BASE_URL, makeRequest} from '../api/Api_info';
class NotificationHandler {
  onNotification(notification) {
    // console.log('NotificationHandler:', notification);

    if (typeof this._onNotification === 'function') {
      this._onNotification(notification);
    }
  }

  async onRegister(token) {
    // const info = await getData(KEYS.USER_INFO);
    // console.log('User Info:', info);
    if (Platform.OS === token.os) {
      let uniqueId = getUniqueId();
      // console.log('====================================');
      // console.log('dada', uniqueId);
      // console.log('====================================');
      const params = {
        token: token.token,
        // userId: null,
        uniqueDeviceId: uniqueId,
      };
      const response = await makeRequest(
        BASE_URL + '/mobile/uploadToken',
        params,
      );
      if (response.success) {
        //   const deviceId = response.userInfo.deviceId;
        await storeData(KEYS.USER_INFO);
      }
    }
    if (typeof this._onRegister === 'function') {
      this._onRegister(token);
    }
  }

  onAction(notification) {
    console.log('Notification action received:');
    console.log(notification.action);
    console.log(notification);

    if (notification.action === 'Yes') {
      PushNotification.invokeApp(notification);
    }
  }

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError(err) {
    console.log(err);
  }

  attachRegister(handler) {
    this._onRegister = handler;
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
}

const handler = new NotificationHandler();

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: handler.onRegister.bind(handler),

  // (required) Called when a remote or local notification is opened or received
  onNotification: handler.onNotification.bind(handler),

  // (optional) Called when Action is pressed (Android)
  onAction: handler.onAction.bind(handler),

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: handler.onRegistrationError.bind(handler),

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});

export default handler;