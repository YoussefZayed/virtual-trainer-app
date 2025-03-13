/**
 * This script calls real Appwrite functions to fetch data
 * NO MOCKING - This uses actual Appwrite API calls
 */

const { Client, Databases, Account, ID, Query } = require('node-appwrite');

// Appwrite configuration
const appwriteConfig = {
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
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.project)
  // The node-appwrite SDK doesn't have setPlatform, so we'll use key authentication
  .setKey('standard_c61c58e3101231e341eb056e6e301bdb6ce38cf081d5be1b63b40cd065a4bed5e0a53982e0b4d7d066ade66badc0c31c6599b4fc43abf457becbf5c7d978a60aec90e230718e2ff65e2110d9ebd8724f70c5e85ee2af453ccf4d4ef7a2d732434495c841252884c97220bf4ad8c68c34d0749cc534472b5ebeb5a7f41782c5e2');

// Initialize services
const account = new Account(client);
const databases = new Databases(client);

// Sample IDs to use for testing - these should be actual IDs from your Appwrite database
const SAMPLE_IDS = {
  exercise: '67bf2a170022e8c8fb61', // Example ID - replace with real one
  workout: '67bf2b120013c38947de', // Example ID - replace with real one
  workoutExercise: '67bf2baf00055bf7be30', // Example ID - replace with real one
  workoutAssignment: '67bf2d1400315ec41d72', // Example ID - replace with real one
  workoutHistory: '67bf322e0019c62cd65c', // Example ID - replace with real one
  completedSet: '67bf32cd002628a7aa21', // Example ID - replace with real one
  completedExercise: '67bf33440005d597ad55', // Example ID - replace with real one
  activeWorkout: '67d269920039da4d006c', // Example ID - replace with real one
  activeExercise: '67d27bba000ef960443e', // Example ID - replace with real one
  activeSet: '67d27b1a0003fd339926', // Example ID - replace with real one
};

// Sample user credentials - use real test credentials
const TEST_USER = {
  email: 'test@youssefsoftware.com',  // Update with your actual test email
  password: 'Test123!',  // Update with your actual test password
  username: 'testuser'
};

// User authentication functions
// Register user
async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Sign In
async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

// Get Account
async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.error("Error getting account:", error);
    throw error;
  }
}

// Get Current User
async function getCurrentUser() {
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
    console.error("Error getting current user:", error);
    return null;
  }
}

// Sign Out
async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Get Exercise by ID
async function getExercise(id) {
  try {
    const exercise = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.exerciseCollectionId,
      id
    );
    
    return exercise;
  } catch (error) {
    console.error("Error fetching exercise:", error);
    throw error;
  }
}

// Get Workout by ID
async function getWorkout(id) {
  try {
    const workout = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutCollectionId,
      id
    );
    
    return workout;
  } catch (error) {
    console.error("Error fetching workout:", error);
    throw error;
  }
}

// Get WorkoutExercise by ID
async function getWorkoutExercise(id) {
  try {
    const workoutExercise = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutExerciseCollectionId,
      id
    );
    
    return workoutExercise;
  } catch (error) {
    console.error("Error fetching workout exercise:", error);
    throw error;
  }
}

// Get WorkoutAssignment by ID
async function getWorkoutAssignment(id) {
  try {
    const workoutAssignment = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutAssignmentCollectionId,
      id
    );
    
    return workoutAssignment;
  } catch (error) {
    console.error("Error fetching workout assignment:", error);
    throw error;
  }
}

// Get WorkoutHistory by ID
async function getWorkoutHistory(id) {
  try {
    const workoutHistory = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.workoutHistoryCollectionId,
      id
    );
    
    return workoutHistory;
  } catch (error) {
    console.error("Error fetching workout history:", error);
    throw error;
  }
}

// Get CompletedSet by ID
async function getCompletedSet(id) {
  try {
    const completedSet = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.completedSetCollectionId,
      id
    );
    
    return completedSet;
  } catch (error) {
    console.error("Error fetching completed set:", error);
    throw error;
  }
}

// Get CompletedExercise by ID
async function getCompletedExercise(id) {
  try {
    const completedExercise = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.completedExerciseCollectionId,
      id
    );
    
    return completedExercise;
  } catch (error) {
    console.error("Error fetching completed exercise:", error);
    throw error;
  }
}

// Get ActiveWorkout by ID
async function getActiveWorkout(id) {
  try {
    const activeWorkout = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.activeWorkoutCollectionId,
      id
    );
    
    return activeWorkout;
  } catch (error) {
    console.error("Error fetching active workout:", error);
    throw error;
  }
}

// Get ActiveExercise by ID
async function getActiveExercise(id) {
  try {
    const activeExercise = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.activeExerciseCollectionId,
      id
    );
    
    return activeExercise;
  } catch (error) {
    console.error("Error fetching active exercise:", error);
    throw error;
  }
}

// Get ActiveSet by ID
async function getActiveSet(id) {
  try {
    const activeSet = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.activeSetCollectionId,
      id
    );
    
    return activeSet;
  } catch (error) {
    console.error("Error fetching active set:", error);
    throw error;
  }
}

// Function to execute all Appwrite functions with real API calls
async function testAllAppwriteFunctions() {
  try {
    console.log("🚀 Starting Appwrite function tests - NO MOCKING");
    
    console.log("\nNote: Skipping user authentication functions as the API key doesn't have account scope");
    
    // Test data retrieval functions - these will try to get data from your Appwrite database
    console.log("\n--- Testing Data Retrieval Functions ---");
    
    // Get all documents from collections to find real IDs to use
    console.log("\n--- Getting sample documents from each collection ---");
    const collections = [
      { name: 'Exercise', id: appwriteConfig.exerciseCollectionId },
      { name: 'Workout', id: appwriteConfig.workoutCollectionId },
      { name: 'WorkoutExercise', id: appwriteConfig.workoutExerciseCollectionId },
      { name: 'WorkoutAssignment', id: appwriteConfig.workoutAssignmentCollectionId },
      { name: 'WorkoutHistory', id: appwriteConfig.workoutHistoryCollectionId },
      { name: 'CompletedSet', id: appwriteConfig.completedSetCollectionId },
      { name: 'CompletedExercise', id: appwriteConfig.completedExerciseCollectionId },
      { name: 'ActiveWorkout', id: appwriteConfig.activeWorkoutCollectionId },
      { name: 'ActiveExercise', id: appwriteConfig.activeExerciseCollectionId },
      { name: 'ActiveSet', id: appwriteConfig.activeSetCollectionId }
    ];

    const results = {};
    const realIds = {};

    // Fetch one document from each collection to get real IDs
    for (const collection of collections) {
      try {
        console.log(`Looking for documents in ${collection.name} collection...`);
        const documents = await databases.listDocuments(
          appwriteConfig.databaseId,
          collection.id,
          [], // No queries
          1   // Limit to 1 document
        );

        if (documents.documents.length > 0) {
          console.log(`\n=== ${collection.name} Sample ===`);
          console.log(JSON.stringify(documents.documents[0], null, 2));
          results[collection.name] = documents.documents[0];
          realIds[collection.name.toLowerCase()] = documents.documents[0].$id;
          console.log(`Found real ID for ${collection.name}: ${documents.documents[0].$id}`);
        } else {
          console.log(`\n=== ${collection.name} ===`);
          console.log('No documents found');
        }
      } catch (error) {
        console.error(`Error fetching ${collection.name}:`, error);
      }
    }

    console.log("\nReal IDs found:", realIds);
    
    // Update our sample IDs with real ones if found
    for (const key in realIds) {
      if (realIds[key]) {
        SAMPLE_IDS[key] = realIds[key];
      }
    }
    
    console.log("\nUsing these IDs for testing:", SAMPLE_IDS);
    
    // Now try fetching individual records using the real IDs
    
    // Get exercise - will make a real API call
    try {
      if (SAMPLE_IDS.exercise) {
        console.log("\nFetching exercise with ID:", SAMPLE_IDS.exercise);
        const exercise = await getExercise(SAMPLE_IDS.exercise);
        console.log("Exercise:", exercise);
      }
    } catch (error) {
      console.error("Failed to get exercise:", error);
    }
    
    // Get workout - will make a real API call
    try {
      if (SAMPLE_IDS.workout) {
        console.log("\nFetching workout with ID:", SAMPLE_IDS.workout);
        const workout = await getWorkout(SAMPLE_IDS.workout);
        console.log("Workout:", workout);
      }
    } catch (error) {
      console.error("Failed to get workout:", error);
    }
    
    // Get workout exercise - will make a real API call
    try {
      if (SAMPLE_IDS.workoutexercise) {
        console.log("\nFetching workout exercise with ID:", SAMPLE_IDS.workoutexercise);
        const workoutExercise = await getWorkoutExercise(SAMPLE_IDS.workoutexercise);
        console.log("Workout Exercise:", workoutExercise);
      }
    } catch (error) {
      console.error("Failed to get workout exercise:", error);
    }
    
    // Get workout assignment - will make a real API call
    try {
      if (SAMPLE_IDS.workoutassignment) {
        console.log("\nFetching workout assignment with ID:", SAMPLE_IDS.workoutassignment);
        const workoutAssignment = await getWorkoutAssignment(SAMPLE_IDS.workoutassignment);
        console.log("Workout Assignment:", workoutAssignment);
      }
    } catch (error) {
      console.error("Failed to get workout assignment:", error);
    }
    
    // Get workout history - will make a real API call
    try {
      if (SAMPLE_IDS.workouthistory) {
        console.log("\nFetching workout history with ID:", SAMPLE_IDS.workouthistory);
        const workoutHistory = await getWorkoutHistory(SAMPLE_IDS.workouthistory);
        console.log("Workout History:", workoutHistory);
      }
    } catch (error) {
      console.error("Failed to get workout history:", error);
    }
    
    // Get completed set - will make a real API call
    try {
      if (SAMPLE_IDS.completedset) {
        console.log("\nFetching completed set with ID:", SAMPLE_IDS.completedset);
        const completedSet = await getCompletedSet(SAMPLE_IDS.completedset);
        console.log("Completed Set:", completedSet);
      }
    } catch (error) {
      console.error("Failed to get completed set:", error);
    }
    
    // Get completed exercise - will make a real API call
    try {
      if (SAMPLE_IDS.completedexercise) {
        console.log("\nFetching completed exercise with ID:", SAMPLE_IDS.completedexercise);
        const completedExercise = await getCompletedExercise(SAMPLE_IDS.completedexercise);
        console.log("Completed Exercise:", completedExercise);
      }
    } catch (error) {
      console.error("Failed to get completed exercise:", error);
    }
    
    // Get active workout - will make a real API call
    try {
      if (SAMPLE_IDS.activeworkout) {
        console.log("\nFetching active workout with ID:", SAMPLE_IDS.activeworkout);
        const activeWorkout = await getActiveWorkout(SAMPLE_IDS.activeworkout);
        console.log("Active Workout:", activeWorkout);
      }
    } catch (error) {
      console.error("Failed to get active workout:", error);
    }
    
    // Get active exercise - will make a real API call
    try {
      if (SAMPLE_IDS.activeexercise) {
        console.log("\nFetching active exercise with ID:", SAMPLE_IDS.activeexercise);
        const activeExercise = await getActiveExercise(SAMPLE_IDS.activeexercise);
        console.log("Active Exercise:", activeExercise);
      }
    } catch (error) {
      console.error("Failed to get active exercise:", error);
    }
    
    // Get active set - will make a real API call
    try {
      if (SAMPLE_IDS.activeset) {
        console.log("\nFetching active set with ID:", SAMPLE_IDS.activeset);
        const activeSet = await getActiveSet(SAMPLE_IDS.activeset);
        console.log("Active Set:", activeSet);
      }
    } catch (error) {
      console.error("Failed to get active set:", error);
    }
    
    // Skipping sign out as it requires account scope
    
    console.log("\n✅ All Appwrite function tests completed");
    
    // Return the results for analysis
    return results;
  } catch (error) {
    console.error("Error during testing:", error);
  }
}

// Execute all tests
testAllAppwriteFunctions().then((results) => {
  console.log("\nScript execution complete");
  
  // Check if we need to update any types based on the data structure
  if (results) {
    console.log("\n--- Type structure analysis ---");
    // Here we would analyze the returned data to determine if type updates are needed
    // For now we'll just print some key properties from each type if available
    
    for (const type in results) {
      console.log(`\nAnalyzing ${type} structure:`);
      const data = results[type];
      const props = Object.keys(data).filter(key => !key.startsWith('$'));
      console.log(`Properties: ${props.join(', ')}`);
    }
  }
}).catch(error => {
  console.error("Script execution failed:", error);
});