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
      console.log('====================================');
      console.log('khush',infoString);
      console.log('====================================');
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
 

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error.message);
    return null;
  }
};