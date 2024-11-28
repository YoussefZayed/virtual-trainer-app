import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const App = () => {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-3xl font-bold text-center text-black'>
        Virtual Trainer 
     </Text>
     <StatusBar style="auto" />
    </View>
  )
}

export default App