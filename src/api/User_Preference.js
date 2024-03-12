import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from '@react-native-community/async-storage';
// KEYS


export const KEYS ={
  ROLE : 'role',
  USER_INFO:'userInfo'
}
const USER_PROFILE = 'userProfile';

export const storeData = async userInfo => {
  try {
      const infoString = JSON.stringify(userInfo);
      await AsyncStorage.setItem(USER_PROFILE, infoString);
  } catch (error) {
      console.log('Failed to store data!', error);
  }
};

export const getData = async () => {
  try {
      const rawData = await AsyncStorage.getItem(USER_PROFILE);
      const userInfo = rawData ? JSON.parse(rawData) : null;
      return userInfo;
  } catch (error) {
      console.log('Failed to retrieve data!', error);
      return null;
  }
};
// export const getUserId = async (callback = null) => {
//   try {
//     const rawData = await AsyncStorage.getItem(USER_PROFILE);
//     const userInfo = JSON.parse(rawData);
//     const userId = userInfo ? userInfo.userId : null;

//     if (callback) {
//       callback(userId);
//       return;
//     }

//     return userId;
//   } catch (error) {
//     const errMessage = error.message;
//     console.log('Failed to retrieve data!\nError: ' + errMessage);
//     return null;
//   }
// };

// export const getRoleId = async () => {
//   try {
//     const rawData = await AsyncStorage.getItem(USER_PROFILE);
//     const userInfo = JSON.parse(rawData);
//     const roleId = userInfo ? userInfo.roleId : null;


//     return roleId;
//   } catch (error) {
//     const errMessage = error.message;
//     console.log('Failed to retrieve data!\nError: ' + errMessage);
//     return null;
//   }
// };

// export const storeFCMToken = async (key, data) => {
//   try {
//     const info = JSON.stringify(data);
//     await AsyncStorage.setItem(key, info);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const getFCMToken = async key => {
//   try {
//     const data = await AsyncStorage.getItem(key);
//     const info = JSON.parse(data);
//     return info;
//   } catch (error) {
//     console.log(error.message);
//     return null;
//   }
// };

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error.message);
    return null;
  }
};