/**
 * Appwrite Configuration File
 * This file contains the configuration, initialization of Appwrite services, 
 * and various functions for user authentication and database operations.
 */

import {
    Account,
    Avatars,
    Client,
    Databases,
    Functions,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: 'https://appwrite-excer.youssefsoftware.com/v1',
    project: '6748ef0c00248aade2d0',
    platform: 'com.youssef.virtual-trainer',
    databaseId: '6748f0a60028e62f07a5',
    userCollectionId: '6748f0e2000c72adb75c',
    workoutCollectionId: '6757b5df0008ac26b715',
    userWorkoutCollectionId: '6757bc7e003df15645cd',
    excerciseCollectionId: '6757b65300343ef583d4',
    userExcerciseCollectionId: '6757bc9f003d8b52e5ea',
    storageID: '6748f2310011290fec69'
}
/**
 * Collections Documentation
 * 
 * 1. **Users Collection (ID: 6748f0e2000c72adb75c)**
 *    - username: (String, Required) - Unique username of the user.
 *    - email: (Email, Required) - Email address of the user.
 *    - avatar: (URL, Required) - URL to user's avatar image.
 *    - accountId: (String, Required) - Unique Appwrite account ID.
 * 
 * 2. **Workout Template Collection (ID: 6757b5df0008ac26b715)**
 *    - users: (Relationship with 'users') - Relationship to a user.
 *    - image: (URL) - Image URL for the workout template.
 *    - Name: (String, Required) - Workout template name.
 *    - excerciseTemplate: (Relationship with 'excerciseTemplate') - Link to exercises.
 *    - Exercises: (String[]) - Array of exercise IDs used for order of workout exercises.
 * 
 * 3. **Exercise Template Collection (ID: 6757b65300343ef583d4)**
 *    - name: (String, Required) - Name of the exercise.
 *    - type: (Enum, Required) - Type/category of the exercise.
 *    - howMany: (Integer) - Default number of repetitions (default: 1).
 *    - image: (URL) - URL to exercise image.
 *    - video: (URL) - URL to exercise video.
 * 
 * 4. **User Exercise Collection (ID: 6757bc9f003d8b52e5ea)**
 *    - excerciseTemplate: (Relationship with 'excerciseTemplate') - Link to exercise template.
 *    - userWorkout: (Relationship with 'userWorkout') - Link to user workout.
 *    - completions: (Integer) - Number of exercise completions (default: 0).
 *    - isActive: (Boolean) - Activity status (default: false).
 * 
 * 5. **User Workout Collection (ID: 6757bc7e003df15645cd)**
 *    - userExercise: (Relationship with 'userExercise') - Link to user exercise.
 *    - isActive: (Boolean) - Activity status (default: false).
 *    - completionNum: (Integer) - Number of completed workouts (default: 0).
 *   - template: (Relationship with 'workoutTemplate') - Link to workout template
 */

const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.project)
    .setPlatform(appwriteConfig.platform);


const account = new Account(client);
const functions = new Functions(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Sign Out
export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * 1. List All Workout Templates for the User
 */
export async function listWorkoutTemplates() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("User not authenticated.");

        const workouts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.workoutCollectionId,
            [
                Query.orderAsc("Name") // Optional: Order by workout name
            ]
        );

        return workouts.documents;
    } catch (error) {
        console.error("Error listing workout templates:", error);
        throw error;
    }
}

/**
 * 2. Add a User Workout Based on a Chosen Template
 */
export async function addUserWorkout(templateId) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("User not authenticated.");

        // Fetch the selected workout template
        const workoutTemplate = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutCollectionId,
            templateId
        );

        if (!workoutTemplate) throw new Error("Workout template not found.");


        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.$id
        );
        console.log(user);

        // Create a new user workout document
        const userWorkout = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userWorkoutCollectionId,
            ID.unique(),
            {
                users: currentUser.$id, // Assuming you have a 'user' field to link the workout
                isActive: false,
                completionNum: 0,
                template: templateId, // Reference to the template
                // Add other necessary fields if required
            }
        );

        // Clone exercises from the template to the user workout
        if (workoutTemplate.Exercises && Array.isArray(workoutTemplate.Exercises)) {
            const exercisePromises = workoutTemplate.Exercises.map(async (exerciseId) => {
                const newUserExercise = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.userExcerciseCollectionId,
                    ID.unique(),
                    {
                        excerciseTemplate: exerciseId,
                        userWorkout: userWorkout.$id,
                        completions: 0,
                        isActive: false,
                    }
                );
                return newUserExercise;
            });

            await Promise.all(exercisePromises);
        }

        return userWorkout;
    } catch (error) {
        console.error("Error adding user workout:", error);
        throw error;
    }
}


/**
 * 3. View a User's Subscribed Workouts
 */
export async function viewUserWorkouts() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("User not authenticated.");

        const userWorkouts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userWorkoutCollectionId,
            [
                Query.equal("users", currentUser.$id),
                Query.orderDesc("$createdAt")
            ]
        );

        console.log("userWorkouts.documents[0]", userWorkouts.documents[0]);
        console.log("userWorkouts.documents[0].template", userWorkouts.documents[0].template);
        console.log("userWorkouts.documents[0].template.Exercises", userWorkouts.documents[0].template.Exercises);


        return userWorkouts.documents;
    } catch (error) {
        console.error("Error viewing user workouts:", error);
        throw error;
    }
}


/**
 * 4a. Set Workout Status to Active
 */
export async function setWorkoutActive(userWorkoutId) {
    try {
        // Fetch the user workout document
        const userWorkout = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userWorkoutCollectionId,
            userWorkoutId
        );

        if (!userWorkout) throw new Error("User workout not found.");

        // Update the workout status to active
        const updatedWorkout = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userWorkoutCollectionId,
            userWorkoutId,
            {
                isActive: true,
            }
        );

        // Optionally, set all related user exercises to active
        const userExercises = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userExcerciseCollectionId,
            [Query.equal("userWorkout", userWorkoutId)]
        );

        const exerciseUpdatePromises = userExercises.documents.map((exercise) =>
            databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userExcerciseCollectionId,
                exercise.$id,
                {
                    isActive: true,
                }
            )
        );

        await Promise.all(exerciseUpdatePromises);

        return updatedWorkout;
    } catch (error) {
        console.error("Error setting workout active:", error);
        throw error;
    }
}

/**
 * 4b. Set Exercise Status to Active
 */
export async function setExerciseActive(userExerciseId) {
    try {
        const userExercise = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userExcerciseCollectionId,
            userExerciseId
        );

        if (!userExercise) throw new Error("User exercise not found.");

        const updatedExercise = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userExcerciseCollectionId,
            userExerciseId,
            {
                isActive: true,
            }
        );

        return updatedExercise;
    } catch (error) {
        console.error("Error setting exercise active:", error);
        throw error;
    }
}

/**
 * 4c. Set Workout Status to Inactive (Optional)
 */
export async function setWorkoutInactive(userWorkoutId) {
    try {
        // Fetch the user workout document
        const userWorkout = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userWorkoutCollectionId,
            userWorkoutId
        );

        if (!userWorkout) throw new Error("User workout not found.");

        // Update the workout status to inactive and increment completionNum
        const updatedWorkout = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userWorkoutCollectionId,
            userWorkoutId,
            {
                isActive: false,
                completionNum: (userWorkout.completionNum || 0) + 1,
            }
        );

        // Optionally, set all related user exercises to inactive
        const userExercises = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userExcerciseCollectionId,
            [Query.equal("userWorkout", userWorkoutId)]
        );

        const exerciseUpdatePromises = userExercises.documents.map((exercise) =>
            databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userExcerciseCollectionId,
                exercise.$id,
                {
                    isActive: false,
                }
            )
        );

        await Promise.all(exerciseUpdatePromises);

        return updatedWorkout;
    } catch (error) {
        console.error("Error setting workout inactive:", error);
        throw error;
    }
}

/**
 * 5a. Get User Exercises for a Workout
 */
export async function getUserExercises(userWorkoutId) {
    try {
        const userExercises = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userExcerciseCollectionId,
            [Query.equal("userWorkout", userWorkoutId)]
        );

        return userExercises.documents;
    } catch (error) {
        console.error("Error fetching user exercises:", error);
        throw error;
    }
}

/**
 * 5b. Increment Exercise Completion
 */
export async function incrementExerciseCompletion(userExerciseId) {
    try {
        const userExercise = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userExcerciseCollectionId,
            userExerciseId
        );

        if (!userExercise) throw new Error("User exercise not found.");

        const updatedExercise = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userExcerciseCollectionId,
            userExerciseId,
            {
                completions: (userExercise.completions || 0) + 1,
            }
        );

        return updatedExercise;
    } catch (error) {
        console.error("Error incrementing exercise completion:", error);
        throw error;
    }
}