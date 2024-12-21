// Home.js

import React, { useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { listWorkoutTemplates, addUserWorkout } from "../../lib/appwrite";
import { EmptyState, SearchInput, Loader } from "../../components";

const Home = () => {
  // Fetch workout templates using the useAppwrite hook
  const { data: workoutTemplates, loading, refetch } = useAppwrite(listWorkoutTemplates);

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
    } catch (error) {
      Alert.alert("Subscription Error", error.message || "Failed to subscribe to the workout.");
    } finally {
      setSubscribing((prev) => ({ ...prev, [templateId]: false }));
    }
  };

  // Render each workout template item
  const renderWorkoutTemplate = ({ item }) => (
    <View className="flex-row items-center bg-white rounded-lg shadow-md p-4 mb-4 mx-4">
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        className="w-20 h-20 rounded-lg"
      />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-psemibold text-gray-800">{item.Name}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.Exercises.length} Exercises</Text>
      </View>
      <TouchableOpacity
        className="bg-amber-500 px-4 py-2 rounded-lg"
        onPress={() => handleSubscribe(item.$id)}
        disabled={subscribing[item.$id]}
      >
        {subscribing[item.$id] ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-pregular">Subscribe</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header Section */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <View>
          <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
          <Text className="text-2xl font-psemibold text-white">Your Workouts</Text>
        </View>
        <View>
          <Image
            source={images.logoSmall}
            className="w-9 h-10"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Search Input */}
      <View className="px-4 mb-4">
        <SearchInput placeholder="Search Workouts..." />
      </View>

      {/* Workout Templates List */}
      <FlatList
        data={workoutTemplates}
        keyExtractor={(item) => item.$id}
        renderItem={renderWorkoutTemplate}
        ListHeaderComponent={() => (
          <View className="px-4 mb-4">
            <Text className="text-lg font-pregular text-gray-100 mb-3">
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={workoutTemplates.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />

      {/* Loader for initial loading */}
      <Loader isLoading={loading} />
    </SafeAreaView>
  );
};

export default Home;
