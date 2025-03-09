// MyWorkouts.js

import React, { useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { viewUserWorkouts, setWorkoutActive, setWorkoutInactive, getUserExercises, incrementExerciseCompletion } from "../../lib/appwrite";
import { EmptyState, Loader } from "../../components";

const MyWorkouts = () => {
    // Fetch user's subscribed workouts
    const { data: userWorkouts, loading, refetch } = useAppwrite(viewUserWorkouts);

    const [refreshing, setRefreshing] = useState(false);
    const [updatingWorkout, setUpdatingWorkout] = useState({}); // Track updating state per workout

    // Handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Handle starting a workout
    const handleStartWorkout = async (workoutId) => {
        try {
            setUpdatingWorkout((prev) => ({ ...prev, [workoutId]: true }));
            await setWorkoutActive(workoutId);
            Alert.alert("Workout Started", "Your workout session is now active!");
            refetch(); // Refresh the list to update status
            // Optionally navigate to the Active Workout screen
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to start the workout.");
        } finally {
            setUpdatingWorkout((prev) => ({ ...prev, [workoutId]: false }));
        }
    };

    // Handle completing a workout
    const handleCompleteWorkout = async (workoutId) => {
        try {
            setUpdatingWorkout((prev) => ({ ...prev, [workoutId]: true }));
            const userExercises = await getUserExercises(workoutId);
            for (const exercise of userExercises) {
                await incrementExerciseCompletion(exercise.$id);
            }
            await setWorkoutInactive(workoutId);
            Alert.alert("Workout Completed", "Great job completing your workout!");
            refetch(); // Refresh the list to update status
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to complete the workout.");
        } finally {
            setUpdatingWorkout((prev) => ({ ...prev, [workoutId]: false }));
        }
    };

    // Render each user workout item
    const renderUserWorkout = ({ item }) => {
        // Ensure that the template is expanded and exists
        const template = item.template;

        if (!template) {
            return (
                <View className="flex-row items-center bg-white rounded-lg shadow-md p-4 mb-4 mx-4">
                    <Text className="text-red-500">Workout template not found.</Text>
                </View>
            );
        }

        return (
            <View className="flex-row items-center bg-white rounded-lg shadow-md p-4 mb-4 mx-4">
                <Image
                    source={{ uri: template.image }}
                    resizeMode="cover"
                    className="w-20 h-20 rounded-lg"
                />
                <View className="flex-1 ml-4">
                    <Text className="text-lg font-psemibold text-gray-800">{template.Name}</Text>
                    <Text className="text-sm text-gray-600 mt-1">Completed {item.completionNum || 0} times</Text>
                    <Text className="text-sm text-gray-600 mt-1">Status: {item.isActive ? "Active" : "Inactive"}</Text>
                </View>
                <TouchableOpacity
                    className={`px-4 py-2 rounded-lg ${item.isActive ? "bg-red-500" : "bg-emerald-500"}`}
                    onPress={() => item.isActive ? handleCompleteWorkout(item.$id) : handleStartWorkout(item.$id)}
                    disabled={updatingWorkout[item.$id]}
                >
                    {updatingWorkout[item.$id] ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-pregular">
                            {item.isActive ? "Complete" : "Start"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-primary">
            {/* Header Section */}
            <View className="flex-row justify-between items-center px-4 py-3">
                <View>
                    <Text className="font-pmedium text-sm text-gray-100">Your Workouts</Text>
                    <Text className="text-2xl font-psemibold text-white">My Workouts</Text>
                </View>
                <View>
                    <Image
                        source={images.logoSmall}
                        className="w-9 h-10"
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* Workouts List */}
            <FlatList
                data={userWorkouts}
                keyExtractor={(item) => item.$id}
                renderItem={renderUserWorkout}
                ListHeaderComponent={() => (
                    <View className="px-4 mb-4">
                        <Text className="text-lg font-pregular text-gray-100 mb-3">
                            Your Subscribed Workouts
                        </Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    !loading && (
                        <EmptyState
                            title="No Subscribed Workouts"
                            subtitle="Subscribe to a workout from the Home tab to get started."
                        />
                    )
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={userWorkouts.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
            />

            {/* Loader for initial loading */}
            <Loader isLoading={loading} />
        </SafeAreaView>
    );
};

export default MyWorkouts;
