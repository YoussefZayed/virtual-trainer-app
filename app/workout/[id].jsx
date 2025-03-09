import React, { useEffect, useState } from 'react';
import { Loader } from "../../components";
import { useGlobalSearchParams } from 'expo-router';
import useAppwrite from "../../lib/useAppwrite";
import { getWorkoutDetails, addUserWorkout, viewUserWorkouts } from "../../lib/appwrite";
import { VideoPlayer } from "../../components";
import { Alert, FlatList, Image, RefreshControl, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";

export default function workoutDetails() {
    const { id } = useGlobalSearchParams();


    const { data: workout, loading, refetch } = useAppwrite(async () => await getWorkoutDetails(id));
    const [subscribing, setSubscribing] = useState({});



    useEffect(() => {
        console.log('id', id);
    }, [id]);

    useEffect(() => {
        console.log('workout', workout);
    }, [workout]);


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

    const formatedTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        return `${minutes > 0 ? minutes + ' mins' : ''} ${seconds > 0 ? seconds + ' secs' : ''}`
    }


    if (loading) return <Loader />;

    return (
        <SafeAreaView>

            <Text>Workout s Details</Text>
            <FlatList data={workout.excerciseTemplate} renderItem={({ item }) => (

                <View>
                    {/* show name, show video, if not found show image, if type is time show how many seconds (format it nicely) */}
                    <Text>{item.name}</Text>
                    {item.image && <Image source={item.image} />}
                    {item.video && <VideoPlayer videoSource={item.video} />}
                    {item.type == 'time' && (
                        <Text>
                            Exercise duration: {formatedTime(item.howMany)}
                        </Text>
                    )}
                    <TouchableOpacity onPress={() => console.log('item', item)}>
                        <Text>Start</Text>
                    </TouchableOpacity>
                </View>
            )} />
        </SafeAreaView>
    );
}