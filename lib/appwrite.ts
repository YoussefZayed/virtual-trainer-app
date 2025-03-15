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
    WorkoutHistory,
    CompletedExercise,
    ActiveWorkout,
    ActiveExercise,
    ActiveSet,
} from "../types/appwrite";

export const appwriteConfig = {
    endpoint: 'https://appwrite-excer.youssefsoftware.com/v1',
    project: '6748ef0c00248aade2d0',
    platform: 'com.youssef.virtual-trainer',
    databaseId: '6748f0a60028e62f07a5',
    userCollectionId: '6748f0e2000c72adb75c',
    exerciseCollectionId: '67bf2a170022e8c8fb60',
    workoutCollectionId: '67bf2b120013c38947dd',
    workoutExerciseCollectionId: '67bf2baf00055bf7be29',
    workoutAssignmentCollectionId: '67bf2d1400315ec41d71',
    workoutHistoryCollectionId: '67bf322e0019c62cd65b',
    completedSetCollectionId: '67bf32cd002628a7aa20',
    completedExerciseCollectionId: '67bf33440005d597ad54',
    activeWorkoutCollectionId: '67d269920039da4d006b',
    activeSetCollectionId: '67d27b1a0003fd339925',
    activeExerciseCollectionId: '67d27bba000ef960443d',
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
export async function createUser(email: string, password: string, username: string): Promise<User> {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Failed to create account');

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

        return newUser as unknown as User;
    } catch (error: any) {
        throw new Error(error?.message || 'Unknown error during user creation');
    }
}

// Sign In
export async function signIn(email: string, password: string): Promise<any> {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error: any) {
        throw new Error(error?.message || 'Authentication failed');
    }
}

// Get Account
export async function getAccount(): Promise<any> {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to get account');
    }
}

// Get Current User
export async function getCurrentUser(): Promise<User | null> {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw new Error('No account found');

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser || currentUser.documents.length === 0) {
            throw new Error('User not found');
        }

        return currentUser.documents[0] as unknown as User;
    } catch (error: any) {
        console.log(error?.message || 'Error fetching current user');
        return null;
    }
}

// Sign Out
export async function signOut(): Promise<any> {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to sign out');
    }
}

// Get Exercise by ID
export async function getExercise(id: string): Promise<Exercise> {
    try {
        const exercise = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.exerciseCollectionId,
            id
        );
        
        return exercise as unknown as Exercise;
    } catch (error: any) {
        console.error("Error fetching exercise:", error);
        throw new Error(error?.message || 'Failed to fetch exercise');
    }
}

// Get Workout by ID
export async function getWorkout(id: string): Promise<Workout> {
    try {
        const workout = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutCollectionId,
            id
        );
        
        return workout as unknown as Workout;
    } catch (error: any) {
        console.error("Error fetching workout:", error);
        throw new Error(error?.message || 'Failed to fetch workout');
    }
}

// Get WorkoutExercise by ID
export async function getWorkoutExercise(id: string): Promise<WorkoutExercise> {
    try {
        const workoutExercise = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutExerciseCollectionId,
            id
        );
        
        return workoutExercise as unknown as WorkoutExercise;
    } catch (error: any) {
        console.error("Error fetching workout exercise:", error);
        throw new Error(error?.message || 'Failed to fetch workout exercise');
    }
}

// Get WorkoutAssignment by ID
export async function getWorkoutAssignment(id: string): Promise<WorkoutAssignment> {
    try {
        const workoutAssignment = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutAssignmentCollectionId,
            id
        );
        
        return workoutAssignment as unknown as WorkoutAssignment;
    } catch (error: any) {
        console.error("Error fetching workout assignment:", error);
        throw new Error(error?.message || 'Failed to fetch workout assignment');
    }
}

// Get WorkoutHistory by ID
export async function getWorkoutHistory(id: string): Promise<WorkoutHistory> {
    try {
        const workoutHistory = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutHistoryCollectionId,
            id
        );
        
        return workoutHistory as unknown as WorkoutHistory;
    } catch (error: any) {
        console.error("Error fetching workout history:", error);
        throw new Error(error?.message || 'Failed to fetch workout history');
    }
}

// Get CompletedSet by ID
export async function getCompletedSet(id: string): Promise<CompletedSet> {
    try {
        const completedSet = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.completedSetCollectionId,
            id
        );
        
        return completedSet as unknown as CompletedSet;
    } catch (error: any) {
        console.error("Error fetching completed set:", error);
        throw new Error(error?.message || 'Failed to fetch completed set');
    }
}

// Get CompletedExercise by ID
export async function getCompletedExercise(id: string): Promise<CompletedExercise> {
    try {
        const completedExercise = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.completedExerciseCollectionId,
            id
        );
        
        return completedExercise as unknown as CompletedExercise;
    } catch (error: any) {
        console.error("Error fetching completed exercise:", error);
        throw new Error(error?.message || 'Failed to fetch completed exercise');
    }
}

// Get ActiveWorkout by ID
export async function getActiveWorkout(id: string): Promise<ActiveWorkout> {
    try {
        const activeWorkout = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.activeWorkoutCollectionId,
            id
        );
        
        return activeWorkout as unknown as ActiveWorkout;
    } catch (error: any) {
        console.error("Error fetching active workout:", error);
        throw new Error(error?.message || 'Failed to fetch active workout');
    }
}

// Get ActiveExercise by ID
export async function getActiveExercise(id: string): Promise<ActiveExercise> {
    try {
        const activeExercise = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.activeExerciseCollectionId,
            id
        );
        
        return activeExercise as unknown as ActiveExercise;
    } catch (error: any) {
        console.error("Error fetching active exercise:", error);
        throw new Error(error?.message || 'Failed to fetch active exercise');
    }
}

// Get ActiveSet by ID
export async function getActiveSet(id: string): Promise<ActiveSet> {
    try {
        const activeSet = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.activeSetCollectionId,
            id
        );
        
        return activeSet as unknown as ActiveSet;
    } catch (error: any) {
        console.error("Error fetching active set:", error);
        throw new Error(error?.message || 'Failed to fetch active set');
    }
}

// List all exercises
export async function listExercises(): Promise<Exercise[]> {
    try {
        const exercises = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.exerciseCollectionId
        );
        
        return exercises.documents as unknown as Exercise[];
    } catch (error: any) {
        console.error("Error listing exercises:", error);
        throw new Error(error?.message || 'Failed to list exercises');
    }
}

// List all workouts (templates)
export async function listWorkoutTemplates(): Promise<Workout[]> {
    try {
        const workouts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.workoutCollectionId
        );
        
        return workouts.documents as unknown as Workout[];
    } catch (error: any) {
        console.error("Error listing workout templates:", error);
        throw new Error(error?.message || 'Failed to list workout templates');
    }
}

// List all workout exercises
export async function listWorkoutExercises(): Promise<WorkoutExercise[]> {
    try {
        const workoutExercises = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.workoutExerciseCollectionId
        );
        
        return workoutExercises.documents as unknown as WorkoutExercise[];
    } catch (error: any) {
        console.error("Error listing workout exercises:", error);
        throw new Error(error?.message || 'Failed to list workout exercises');
    }
}

// List workout assignments for a user
export async function viewUserWorkouts(): Promise<WorkoutAssignment[]> {
    try {
        // Fetch all workout assignments without filtering by user
        // We can't query on virtual relationship fields
        const workoutAssignments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.workoutAssignmentCollectionId
        );
        
        // Ensure we return an array even if documents is undefined
        return (workoutAssignments?.documents || []) as unknown as WorkoutAssignment[];
    } catch (error: any) {
        console.error("Error listing user workouts:", error);
        // Return an empty array instead of throwing an error
        return [];
    }
}

// Add a workout to a user
export async function addUserWorkout(workoutId: string): Promise<WorkoutAssignment> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not authenticated');

        // Use correct field names according to the schema
        const workoutAssignment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workoutAssignmentCollectionId,
            ID.unique(),
            {
                user: currentUser.$id,
                workout: workoutId,
                assignedBy: currentUser.$id,
                startDate: new Date().toISOString(),
                frequencyType: 'DAILY',
                frequencyValues: ['0', '1', '2', '3', '4', '5', '6'],
                status: 'ACTIVE'
            }
        );
        
        return workoutAssignment as unknown as WorkoutAssignment;
    } catch (error: any) {
        console.error("Error adding user workout:", error);
        throw new Error(error?.message || 'Failed to add user workout');
    }
}

// List all workout history
export async function listWorkoutHistory(): Promise<WorkoutHistory[]> {
    try {
        const workoutHistory = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.workoutHistoryCollectionId
        );
        
        return workoutHistory.documents as unknown as WorkoutHistory[];
    } catch (error: any) {
        console.error("Error listing workout history:", error);
        throw new Error(error?.message || 'Failed to list workout history');
    }
}

// List all completed sets
export async function listCompletedSets(): Promise<CompletedSet[]> {
    try {
        const completedSets = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.completedSetCollectionId
        );
        
        return completedSets.documents as unknown as CompletedSet[];
    } catch (error: any) {
        console.error("Error listing completed sets:", error);
        throw new Error(error?.message || 'Failed to list completed sets');
    }
}

// List all completed exercises
export async function listCompletedExercises(): Promise<CompletedExercise[]> {
    try {
        const completedExercises = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.completedExerciseCollectionId
        );
        
        return completedExercises.documents as unknown as CompletedExercise[];
    } catch (error: any) {
        console.error("Error listing completed exercises:", error);
        throw new Error(error?.message || 'Failed to list completed exercises');
    }
}

// List all active workouts
export async function listActiveWorkouts(): Promise<ActiveWorkout[]> {
    try {
        const activeWorkouts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.activeWorkoutCollectionId
        );
        
        return activeWorkouts.documents as unknown as ActiveWorkout[];
    } catch (error: any) {
        console.error("Error listing active workouts:", error);
        throw new Error(error?.message || 'Failed to list active workouts');
    }
}

// List all active exercises
export async function listActiveExercises(): Promise<ActiveExercise[]> {
    try {
        const activeExercises = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.activeExerciseCollectionId
        );
        
        return activeExercises.documents as unknown as ActiveExercise[];
    } catch (error: any) {
        console.error("Error listing active exercises:", error);
        throw new Error(error?.message || 'Failed to list active exercises');
    }
}

// List all active sets
export async function listActiveSets(): Promise<ActiveSet[]> {
    try {
        const activeSets = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.activeSetCollectionId
        );
        
        return activeSets.documents as unknown as ActiveSet[];
    } catch (error: any) {
        console.error("Error listing active sets:", error);
        throw new Error(error?.message || 'Failed to list active sets');
    }
}