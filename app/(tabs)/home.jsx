// Home.js

import React, { useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { 
  listWorkoutTemplates, 
  addUserWorkout, 
  viewUserWorkouts,
  listExercises,
  listWorkoutExercises,
  listWorkoutHistory,
  listCompletedSets,
  listCompletedExercises,
  listActiveWorkouts,
  listActiveExercises,
  listActiveSets
} from "../../lib/appwrite";
import { EmptyState, SearchInput, Loader } from "../../components";
import { router } from "expo-router";

const Home = () => {
  // Fetch workout templates using the useAppwrite hook
  const { data: workoutTemplates, loading, refetch } = useAppwrite(listWorkoutTemplates);
  const { refetch: userWorkoutsRefetch } = useAppwrite(viewUserWorkouts);
  const [refreshing, setRefreshing] = useState(false);
  const [subscribing, setSubscribing] = useState({}); // Track subscribing state per workout
  
  // Collection data states
  const [collectionData, setCollectionData] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [fetchingCollection, setFetchingCollection] = useState(false);

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
  
  // Function to fetch collection data
  const fetchCollection = async (fetchFunction, name) => {
    try {
      setFetchingCollection(true);
      setCollectionName(name);
      setCollectionData(null);
      
      const data = await fetchFunction();
      
      // Make sure data is an array and not undefined
      if (data && Array.isArray(data)) {
        setCollectionData(data);
        console.log(`Fetched ${name}:`, data);
        Alert.alert(
          `${name} Fetched`,
          `Successfully fetched ${data.length} items from ${name} collection`
        );
      } else {
        console.warn(`Unexpected data format for ${name}:`, data);
        setCollectionData([]);
        Alert.alert(
          `${name} Fetched`,
          `Retrieved data for ${name} but it's empty or in unexpected format`
        );
      }
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      Alert.alert("Error", `Failed to fetch ${name}: ${error.message}`);
      setCollectionData([]);
    } finally {
      setFetchingCollection(false);
    }
  };

  // Render each workout template item
  const renderWorkoutTemplate = ({ item }) => {
    // Return empty view if item is undefined
    if (!item) return null;
    
    // Safely access properties
    const imageUri = item.image || 'https://placehold.co/600x400/png';
    const name = item.Name || 'Workout';
    const exercisesCount = item.Exercises && Array.isArray(item.Exercises) ? item.Exercises.length : 0;
    const workoutId = item.$id || '';
    
    return (
      <View className="bg-white rounded-lg shadow-md p-5 mb-5 mx-4">
        <Image
          source={{ uri: imageUri }}
          resizeMode="cover"
          className="w-full h-40 rounded-lg mb-3"
        />
        <View className="mb-4">
          <Text className="text-xl font-psemibold text-gray-800">{name}</Text>
          <Text className="text-sm text-gray-600 mt-1">{exercisesCount} Exercises</Text>
        </View>
        
        <View className="flex items-center justify-center">
          <TouchableOpacity
            className="bg-amber-500 py-3 rounded-lg w-40 flex items-center justify-center"
            onPress={() => router.push(`/workout/${workoutId}`)}
            disabled={!workoutId}
          >
            <Text className="text-white font-pbold" style={{ textAlign: 'center', width: '100%' }}>Explore</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

      {/* Collection Fetch Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="px-4 mb-4"
      >
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listExercises, "Exercises")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Exercises</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listWorkoutTemplates, "Workout Templates")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Workouts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listWorkoutExercises, "Workout Exercises")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Workout Exercises</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(viewUserWorkouts, "User Workouts")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch User Workouts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listWorkoutHistory, "Workout History")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Workout History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listCompletedSets, "Completed Sets")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Completed Sets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listCompletedExercises, "Completed Exercises")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Completed Exercises</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listActiveWorkouts, "Active Workouts")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Active Workouts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listActiveExercises, "Active Exercises")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Active Exercises</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-amber-500 py-2 px-3 rounded-lg mr-2"
          onPress={() => fetchCollection(listActiveSets, "Active Sets")}
          disabled={fetchingCollection}
        >
          <Text className="text-white font-pbold text-xs">Fetch Active Sets</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Loading indicator for fetching collections */}
      {fetchingCollection && (
        <View className="px-4 py-2 mb-4 bg-gray-800 rounded-lg mx-4">
          <Text className="text-white text-center">
            Fetching {collectionName}...
          </Text>
          <ActivityIndicator color="#f59e0b" style={{ marginTop: 5 }} />
        </View>
      )}
      
      {/* Collection data display */}
      {collectionData && Array.isArray(collectionData) && collectionData.length > 0 && (
        <View className="px-4 py-2 mb-4 bg-gray-800 rounded-lg mx-4">
          <Text className="text-white font-pbold mb-1">
            {collectionName}: {collectionData.length} items
          </Text>
          <Text className="text-gray-300 text-xs">
            Tap to view collection details in console
          </Text>
        </View>
      )}

      {/* Search Input */}
      {/* <View className="px-4 mb-4">
        <SearchInput placeholder="Search Workouts..." />
      </View> */}

      {/* Workout Templates List */}
      <FlatList
        data={workoutTemplates || []}
        keyExtractor={(item) => item?.$id || Math.random().toString()}
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
          !workoutTemplates || !Array.isArray(workoutTemplates) || workoutTemplates.length === 0 
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
