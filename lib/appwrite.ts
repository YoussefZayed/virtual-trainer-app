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

import {
    User,
    Exercise,
    Workout,
    WorkoutExercise,
    FrequencyType,
    WorkoutAssignment,
    CompletedSet,
} from "../types/appwrite";

export const appwriteConfig = {
    endpoint: 'https://appwrite-excer.youssefsoftware.com/v1',
    project: '6748ef0c00248aade2d0',
    platform: 'com.youssef.virtual-trainer',
    databaseId: '6748f0a60028e62f07a5',
    userCollectionId: '6748f0e2000c72adb75c',
    excerciseCollectionId: '67bf2a170022e8c8fb60',
    workoutCollectionId: '67bf2b120013c38947dd',
    workoutExcerciseCollectionId: '67bf2baf00055bf7be29',
    workoutAssignmentCollectionId: '67bf2d1400315ec41d71',
    workoutHistoryCollectionId: '67bf322e0019c62cd65b',
    completedSetCollectionId: '67bf32cd002628a7aa20',
    completedExerciseCollectionId: '67bf33440005d597ad54',
    activeWorkout: '67d269920039da4d006b',
    activeSet: '67d27b1a0003fd339925',
    ActiveExercise: '67d27bba000ef960443d',
    storageID: '6748f2310011290fec69'
}


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
