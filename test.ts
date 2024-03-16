import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Image } from "react-native";
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
import { getData } from "./src/yourDataFetchingUtility";

const Stack = createNativeStackNavigator()

export default function APP() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialSetup = async () => {
      try {
        const userInfo = await getData(KEYS.USER_INFO);
        const isLoggedIn = userInfo ? true : false;
        setIsLoggedIn(isLoggedIn);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    initialSetup();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="login" component={Login} />
        ) : (
          <>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

function MyTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { alignItems: 'center' },
        tabBarActiveTintColor: "#81D4FA",
        tabBarInactiveTintColor: "#0277BD",
        tabBarLabelStyle: {
          marginTop: wp(-2),
          fontSize: wp(3.2),
          fontWeight: '500',
        },
      }}>
      {/* Tab Screens */}
    </Tab.Navigator>
  );
}
