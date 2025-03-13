// Simple script to test Appwrite functions
import { 
  createUser,
  signIn, 
  getAccount, 
  getCurrentUser,
  signOut,
  getExercise,
  getWorkout,
  getWorkoutExercise,
  getWorkoutAssignment,
  getWorkoutHistory,
  getCompletedSet,
  getCompletedExercise,
  getActiveWorkout,
  getActiveExercise,
  getActiveSet
} from '../lib/appwrite.ts';

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'Password123!', 
  username: 'testuser'
};

// Sample IDs - replace with real ones from your database
const SAMPLE_IDS = {
  exercise: '67bf2a170022e8c8fb61',
  workout: '67bf2b120013c38947de',
  workoutExercise: '67bf2baf00055bf7be30',
  workoutAssignment: '67bf2d1400315ec41d72',
  workoutHistory: '67bf322e0019c62cd65c',
  completedSet: '67bf32cd002628a7aa21',
  completedExercise: '67bf33440005d597ad55',
  activeWorkout: '67d269920039da4d006c',
  activeExercise: '67d27bba000ef960443e',
  activeSet: '67d27b1a0003fd339926',
};

// Main test function
async function testAppwriteFunctions() {
  try {
    console.log("🚀 Testing Appwrite functions with real API calls (NO MOCKING)");
    
    // Sign in
    console.log("\n--- Testing Authentication ---");
    try {
      console.log("Signing in...");
      const session = await signIn(TEST_USER.email, TEST_USER.password);
      console.log("✅ Sign in successful");
    } catch (error) {
      console.error("❌ Sign in failed:", error);
      
      // Try to create a user if sign in fails
      try {
        console.log("Creating new user...");
        const newUser = await createUser(TEST_USER.email, TEST_USER.password, TEST_USER.username);
        console.log("✅ User created successfully");
      } catch (createError) {
        console.error("❌ User creation failed:", createError);
      }
    }
    
    // Get account & user info
    try {
      const account = await getAccount();
      console.log("✅ Got account:", account.name);
      
      const currentUser = await getCurrentUser();
      console.log("✅ Got current user:", currentUser?.username);
    } catch (error) {
      console.error("❌ Error getting account/user:", error);
    }
    
    // Test get functions with real IDs
    console.log("\n--- Testing Data Retrieval ---");
    
    // Exercise
    try {
      console.log("Getting exercise...");
      const exercise = await getExercise(SAMPLE_IDS.exercise);
      console.log("✅ Got exercise:", exercise.name);
    } catch (error) {
      console.error("❌ Error getting exercise:", error);
    }
    
    // Workout
    try {
      console.log("Getting workout...");
      const workout = await getWorkout(SAMPLE_IDS.workout);
      console.log("✅ Got workout:", workout.name);
    } catch (error) {
      console.error("❌ Error getting workout:", error);
    }
    
    // WorkoutExercise
    try {
      console.log("Getting workout exercise...");
      const workoutExercise = await getWorkoutExercise(SAMPLE_IDS.workoutExercise);
      console.log("✅ Got workout exercise, sets:", workoutExercise.sets);
    } catch (error) {
      console.error("❌ Error getting workout exercise:", error);
    }
    
    // WorkoutAssignment
    try {
      console.log("Getting workout assignment...");
      const workoutAssignment = await getWorkoutAssignment(SAMPLE_IDS.workoutAssignment);
      console.log("✅ Got workout assignment, status:", workoutAssignment.status);
    } catch (error) {
      console.error("❌ Error getting workout assignment:", error);
    }
    
    // WorkoutHistory
    try {
      console.log("Getting workout history...");
      const workoutHistory = await getWorkoutHistory(SAMPLE_IDS.workoutHistory);
      console.log("✅ Got workout history, completed on:", workoutHistory.completedDate);
    } catch (error) {
      console.error("❌ Error getting workout history:", error);
    }
    
    // CompletedSet
    try {
      console.log("Getting completed set...");
      const completedSet = await getCompletedSet(SAMPLE_IDS.completedSet);
      console.log("✅ Got completed set, value:", completedSet.actualValue);
    } catch (error) {
      console.error("❌ Error getting completed set:", error);
    }
    
    // CompletedExercise
    try {
      console.log("Getting completed exercise...");
      const completedExercise = await getCompletedExercise(SAMPLE_IDS.completedExercise);
      console.log("✅ Got completed exercise");
    } catch (error) {
      console.error("❌ Error getting completed exercise:", error);
    }
    
    // ActiveWorkout
    try {
      console.log("Getting active workout...");
      const activeWorkout = await getActiveWorkout(SAMPLE_IDS.activeWorkout);
      console.log("✅ Got active workout, status:", activeWorkout.status);
    } catch (error) {
      console.error("❌ Error getting active workout:", error);
    }
    
    // ActiveExercise
    try {
      console.log("Getting active exercise...");
      const activeExercise = await getActiveExercise(SAMPLE_IDS.activeExercise);
      console.log("✅ Got active exercise, completed:", activeExercise.isCompleted);
    } catch (error) {
      console.error("❌ Error getting active exercise:", error);
    }
    
    // ActiveSet
    try {
      console.log("Getting active set...");
      const activeSet = await getActiveSet(SAMPLE_IDS.activeSet);
      console.log("✅ Got active set, completed:", activeSet.isCompleted);
    } catch (error) {
      console.error("❌ Error getting active set:", error);
    }
    
    // Sign out
    try {
      await signOut();
      console.log("✅ Sign out successful");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
    
    console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Error during testing:", error);
  }
}

// Run the tests
testAppwriteFunctions().catch(console.error);