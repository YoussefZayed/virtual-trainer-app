// Home.js

import React, { useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { listWorkoutTemplates, addUserWorkout, viewUserWorkouts } from "../../lib/appwrite";
import { EmptyState, SearchInput, Loader } from "../../components";
import { router } from "expo-router";

const Home = () => {
  // Fetch workout templates using the useAppwrite hook
  const { data: workoutTemplates, loading, refetch } = useAppwrite(listWorkoutTemplates);
  const { refetch: userWorkoutsRefetch } = useAppwrite(viewUserWorkouts);
  const [refreshing, setRefreshing] = useState(false);
  const [subscribing, setSubscribing] = useState({}); // Track subscribing state per workout

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Handle subscribing to a workout
  const handleSubscribe = async (templateId) => {
    try {
      setSubscribing((prev) => ({ ...prev, [templateId]: true }));
      await addUserWorkout(templateId);
      Alert.alert("Success", "You have successfully subscribed to this workout!");
      refetch(); // Optionally refetch to update the list if needed
      userWorkoutsRefetch(); // Refetch user workouts to update the active workout
    } catch (error) {
      Alert.alert("Subscription Error", error.message || "Failed to subscribe to the workout.");
    } finally {
      setSubscribing((prev) => ({ ...prev, [templateId]: false }));
    }
  };

  // Render each workout template item
  const renderWorkoutTemplate = ({ item }) => (
    <View className="bg-white rounded-lg shadow-md p-5 mb-5 mx-4">
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        className="w-full h-40 rounded-lg mb-3"
      />
      <View className="mb-4">
        <Text className="text-xl font-psemibold text-gray-800">{item.Name}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.Exercises.length} Exercises</Text>
      </View>
      
      <View className="flex items-center justify-center">
        <TouchableOpacity
          className="bg-amber-500 py-3 rounded-lg w-40 flex items-center justify-center"
          onPress={() => router.push(`/workout/${item.$id}`)}
        >
          <Text className="text-white font-pbold" style={{ textAlign: 'center', width: '100%' }}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header Section */}
      <View className="px-4 py-5">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">Welcome Back!</Text>
            <Text className="text-2xl font-pbold text-white">Find Workouts</Text>
          </View>
          <View>
            <Image
              source={images.logoSmall}
              className="w-10 h-11"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Search Input */}
      {/* <View className="px-4 mb-4">
        <SearchInput placeholder="Search Workouts..." />
      </View> */}

      {/* Workout Templates List */}
      <FlatList
        data={workoutTemplates}
        keyExtractor={(item) => item.$id}
        renderItem={renderWorkoutTemplate}
        ListHeaderComponent={() => (
          <View className="px-4 mb-6">
            <Text className="text-xl font-pbold text-white mb-3 text-center">
              Available Workouts
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          !loading && (
            <EmptyState
              title="No Workouts Available"
              subtitle="Please check back later or subscribe to a workout."
            />
          )
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#f59e0b"]} />
        }
        contentContainerStyle={
          workoutTemplates.length === 0 
            ? { flex: 1, justifyContent: 'center', alignItems: 'center' } 
            : { paddingBottom: 20 }
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Loader for initial loading */}
      <Loader isLoading={loading} />
    </SafeAreaView>
  );
};

export default Home;
