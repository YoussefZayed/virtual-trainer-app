// Test screen for Appwrite functions
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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
} from '../lib/appwrite';

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

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'Password123!', 
  username: 'testuser'
};

export default function TestAppwritePage() {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(true);

  // Add log messages
  const addLog = (message, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now(),
      timestamp,
      message,
      isError
    };
    setLogs(prevLogs => [...prevLogs, logEntry]);
  };

  // Function to run all tests
  const runTests = async () => {
    try {
      addLog("🚀 Testing Appwrite functions with real API calls (NO MOCKING)");
      
      // Sign in
      addLog("\n--- Testing Authentication ---");
      try {
        addLog("Signing in...");
        const session = await signIn(TEST_USER.email, TEST_USER.password);
        addLog("✅ Sign in successful");
      } catch (error) {
        addLog(`❌ Sign in failed: ${error.message}`, true);
        
        // Try to create a user if sign in fails
        try {
          addLog("Creating new user...");
          const newUser = await createUser(TEST_USER.email, TEST_USER.password, TEST_USER.username);
          addLog("✅ User created successfully");
        } catch (createError) {
          addLog(`❌ User creation failed: ${createError.message}`, true);
        }
      }
      
      // Get account & user info
      try {
        const account = await getAccount();
        addLog(`✅ Got account: ${account.name}`);
        
        const currentUser = await getCurrentUser();
        addLog(`✅ Got current user: ${currentUser?.username}`);
      } catch (error) {
        addLog(`❌ Error getting account/user: ${error.message}`, true);
      }
      
      // Test get functions with real IDs
      addLog("\n--- Testing Data Retrieval ---");
      
      // Exercise
      try {
        addLog("Getting exercise...");
        const exercise = await getExercise(SAMPLE_IDS.exercise);
        addLog(`✅ Got exercise: ${exercise.name}`);
      } catch (error) {
        addLog(`❌ Error getting exercise: ${error.message}`, true);
      }
      
      // Workout
      try {
        addLog("Getting workout...");
        const workout = await getWorkout(SAMPLE_IDS.workout);
        addLog(`✅ Got workout: ${workout.name}`);
      } catch (error) {
        addLog(`❌ Error getting workout: ${error.message}`, true);
      }
      
      // WorkoutExercise
      try {
        addLog("Getting workout exercise...");
        const workoutExercise = await getWorkoutExercise(SAMPLE_IDS.workoutExercise);
        addLog(`✅ Got workout exercise, sets: ${workoutExercise.sets}`);
      } catch (error) {
        addLog(`❌ Error getting workout exercise: ${error.message}`, true);
      }
      
      // WorkoutAssignment
      try {
        addLog("Getting workout assignment...");
        const workoutAssignment = await getWorkoutAssignment(SAMPLE_IDS.workoutAssignment);
        addLog(`✅ Got workout assignment, status: ${workoutAssignment.status}`);
      } catch (error) {
        addLog(`❌ Error getting workout assignment: ${error.message}`, true);
      }
      
      // WorkoutHistory
      try {
        addLog("Getting workout history...");
        const workoutHistory = await getWorkoutHistory(SAMPLE_IDS.workoutHistory);
        addLog(`✅ Got workout history, completed on: ${workoutHistory.completedDate}`);
      } catch (error) {
        addLog(`❌ Error getting workout history: ${error.message}`, true);
      }
      
      // CompletedSet
      try {
        addLog("Getting completed set...");
        const completedSet = await getCompletedSet(SAMPLE_IDS.completedSet);
        addLog(`✅ Got completed set, value: ${completedSet.actualValue}`);
      } catch (error) {
        addLog(`❌ Error getting completed set: ${error.message}`, true);
      }
      
      // CompletedExercise
      try {
        addLog("Getting completed exercise...");
        const completedExercise = await getCompletedExercise(SAMPLE_IDS.completedExercise);
        addLog("✅ Got completed exercise");
      } catch (error) {
        addLog(`❌ Error getting completed exercise: ${error.message}`, true);
      }
      
      // ActiveWorkout
      try {
        addLog("Getting active workout...");
        const activeWorkout = await getActiveWorkout(SAMPLE_IDS.activeWorkout);
        addLog(`✅ Got active workout, status: ${activeWorkout.status}`);
      } catch (error) {
        addLog(`❌ Error getting active workout: ${error.message}`, true);
      }
      
      // ActiveExercise
      try {
        addLog("Getting active exercise...");
        const activeExercise = await getActiveExercise(SAMPLE_IDS.activeExercise);
        addLog(`✅ Got active exercise, completed: ${activeExercise.isCompleted}`);
      } catch (error) {
        addLog(`❌ Error getting active exercise: ${error.message}`, true);
      }
      
      // ActiveSet
      try {
        addLog("Getting active set...");
        const activeSet = await getActiveSet(SAMPLE_IDS.activeSet);
        addLog(`✅ Got active set, completed: ${activeSet.isCompleted}`);
      } catch (error) {
        addLog(`❌ Error getting active set: ${error.message}`, true);
      }
      
      // Sign out
      try {
        await signOut();
        addLog("✅ Sign out successful");
      } catch (error) {
        addLog(`❌ Error signing out: ${error.message}`, true);
      }
      
      addLog("\n🎉 All tests completed!");
    } catch (error) {
      addLog(`❌ Error during testing: ${error.message}`, true);
    } finally {
      setIsRunning(false);
    }
  };

  // Run tests on component mount
  useEffect(() => {
    runTests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appwrite Function Tests</Text>
      <Text style={styles.subtitle}>
        {isRunning ? 'Running tests...' : 'Tests completed'}
      </Text>
      
      <ScrollView style={styles.logContainer}>
        {logs.map(log => (
          <Text 
            key={log.id} 
            style={[
              styles.logEntry, 
              log.isError ? styles.errorLog : styles.successLog
            ]}
          >
            [{log.timestamp}] {log.message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
  },
  logEntry: {
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 4,
    color: '#fff',
  },
  successLog: {
    color: '#a3f7bf',
  },
  errorLog: {
    color: '#ff7675',
  },
});