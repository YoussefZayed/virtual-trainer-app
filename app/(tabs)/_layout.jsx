// Layout.js

import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import React from 'react';


const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex flex-col items-center justify-center w-16">
      <Text
        className={`text-xs text-nowrap text-center font-psemibold ${focused ? 'text-amber-500' : 'text-gray-400'}`}
      >
        {name}
      </Text>
    </View>
  );
};




const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: false, // We're handling labels manually in TabIcon
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84, // Ensure this height accommodates both icon and text
            paddingBottom: 10, // Optional: Adjust padding as needed
          },
          tabBarItemStyle: {
            flex: 1, // Ensure each tab item takes equal space
            justifyContent: 'center',
          },
        }}
      >
        <Tabs.Screen
          name="my-workouts" // Ensure this matches your routing setup
          options={{
            title: 'Workouts',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.workout} // Ensure you have a workout icon
                color={color}
                name="My Workouts"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />


      </Tabs>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
