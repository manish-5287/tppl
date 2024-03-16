import React, { Component, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Image, Text } from "react-native";
import SplashScreen from "./src/Screens/Splash/Splash_Screen";
import Login from "./src/Screens/Login_Screen/Login";
import PO from "./src/Screens/PO/PO";
import Production from "./src/Screens/Production/Production";
import GRN from "./src/Screens/GRN/GRN";
import Contract from "./src/Screens/Contract/Contract";
import { Indent } from "./src/Screens/Indent/Indent";
import { Reverses } from "./src/Screens/Reverses/Reverses";
import VendorReport from "./src/Screens/Supplier/VendorReport";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "./src/Screens/Home/Home_screen";
import Stock from "./src/Screens/Stock/Stock";
import { Supllier } from "./src/Screens/Supplier/Supllier";
import Search_Contract from "./src/Screens/Contract/Search_Contract";
import Search_Production from "./src/Screens/Production/Search_Production";
import { Search_Reverse } from "./src/Screens/Reverses/Search_Reverse";
import { Search_Indent } from "./src/Screens/Indent/Search_Indent";
import { KEYS, getData } from "./src/api/User_Preference";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Search_Supplier from "./src/Screens/Supplier/Search_supplier";
import Search_VendorReports from "./src/Screens/Supplier/Search_VendorReports";


const Stack = createNativeStackNavigator()

export default function APP() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getData(KEYS.USER_INFO);
        console.log('User Info:', info);
        setUserInfo(info);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userInfo ? 'mytab' : 'login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="splash" component={SplashScreen} />
        <Stack.Screen name="PO" component={PO} />
        <Stack.Screen name="Production" component={Production} />
        <Stack.Screen name="Search_Product" component={Search_Production} />
        <Stack.Screen name="GRN" component={GRN} />
        <Stack.Screen name="Contract" component={Contract} />
        <Stack.Screen name="Search_Contract" component={Search_Contract} />
        <Stack.Screen name="Indent" component={Indent} />
        <Stack.Screen name="Search_Indent" component={Search_Indent} />
        <Stack.Screen name="Reverse" component={Reverses} />
        <Stack.Screen name="Search_Reverse" component={Search_Reverse} />
        <Stack.Screen name="report" component={VendorReport} />
        <Stack.Screen name="mytab" component={MyTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const Tab = createBottomTabNavigator()
function MyTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { alignItems: 'center' },
        tabBarActiveTintColor: "#0277BD",
        tabBarInactiveTintColor: "#29B6F6",
        tabBarLabelStyle: {
          marginTop: wp(-2),
          fontSize: wp(3.2),
          fontWeight: '500',
        },

      }}>
      <Tab.Screen name='home' component={Dashboard} options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ size, focused }) => (
          <Image
            source={focused ? require('../tppl/src/Assets/bottom_icon/home-icon-silhouette.png') : require('../tppl/src/Assets/bottom_icon/home-icon-silhouette.png')}
            style={[{ width: wp(6), height: wp(6), tintColor: '#29B6F6' }, focused && { tintColor: '#0277BD' }]}
          />
        ),

      }} />


      <Tab.Screen name='po' component={PO} options={{
        tabBarLabel: 'P.O',
        tabBarIcon: ({ size, focused }) => (
          <Image
            source={focused ? require('../tppl/src/Assets/bottom_icon/production.png') : require('../tppl/src/Assets/bottom_icon/production.png')}
            style={[{ width: wp(6), height: wp(6), tintColor: '#29B6F6' }, focused && { tintColor: '#0277BD' }]}
          />)
      }} />


      <Tab.Screen name='grn' component={GRN} options={{
        tabBarLabel: 'GRN',
        tabBarIcon: ({ size, focused }) => (
          <Image
            source={focused ? require('../tppl/src/Assets/bottom_icon/boxes.png') : require('../tppl/src/Assets/bottom_icon/boxes.png')}
            style={[{ width: wp(6), height: wp(6), tintColor: '#29B6F6' }, focused && { tintColor: '#0277BD' }]}
          />
        ),
      }} />

      <Tab.Screen name='stock' component={Stock} options={{
        tabBarLabel: 'Stock',

        tabBarIcon: ({ size, focused }) => (
          <Image
            source={focused ? require('../tppl/src/Assets/bottom_icon/store.png') : require('../tppl/src/Assets/bottom_icon/store.png')}
            style={[{ width: wp(6), height: wp(6), tintColor: '#29B6F6' }, focused && { tintColor: '#0277BD' }]}
          />
        ),
      }} />


      <Tab.Screen name='supplier' component={Supllier} options={{
        tabBarLabel: 'Supplier',
        tabBarIcon: ({ size, focused }) => (
          <Image
            source={focused ? require('../tppl/src/Assets/bottom_icon/fast-delivery.png') : require('../tppl/src/Assets/bottom_icon/fast-delivery.png')}
            style={[{ width: wp(6), height: wp(6), tintColor: '#29B6F6' }, focused && { tintColor: '#0277BD' }]}
          />
        ),
      }} />

      <Tab.Screen name='indent' component={Indent} options={{
        tabBarLabel: 'Indent',
        tabBarIcon: ({ focused, size }) => (
          <Image
            source={focused ? require('../tppl/src/Assets/bottom_icon/playlist.png') : require('../tppl/src/Assets/bottom_icon/playlist.png')}
            style={[{ width: wp(6), height: wp(6), tintColor: '#29B6F6' }, focused && { tintColor: '#0277BD' }]}
          />
        ),
      }} />

      <Tab.Screen name='Reverse' component={Reverses} options={{
        tabBarLabel: 'Reverse',
        tabBarIcon: ({ focused, size }) => (
          <Image
            source={focused ? require('../tppl/src/Assets/bottom_icon/reverse-logistic.png') : require('../tppl/src/Assets/bottom_icon/reverse-logistic.png')}
            style={[{ width: wp(6), height: wp(6), tintColor: '#29B6F6' }, focused && { tintColor: '#0277BD' }]}
          />
        ),
      }} />
    </Tab.Navigator>

  )
}



// return(

// <NavigationContainer>
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="contract" component={Contract}/>
//     <Stack.Screen name="Search_Contract" component={Search_Contract}/>
//   </Stack.Navigator>
// </NavigationContainer>
// )}
