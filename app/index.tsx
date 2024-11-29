import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { createAccount } from '../lib/appwrite'
const App = () => {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-3xl text-center font-pblack'>
        Virtual Trainer
      </Text>
      <TouchableOpacity className='bg-blue-500 p-2 rounded-md' onPress={() => createAccount()}>
        <Text className='text-white'>Sign In</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  )
}

export default App