// Base type for all Appwrite documents
export interface AppwriteDocument {
    $id: string;
    $createdAt?: string;
    $updatedAt?: string;
    $permissions?: string[];
}

export type User = AppwriteDocument & {
    username: string;
    email: string;
    avatar: string;
    accountId: string;
}

export enum ExerciseType {
    TIME_BASED = 'TIME_BASED',
    REPETITION_BASED = 'REPETITION_BASED',
    DISTANCE_BASED = 'DISTANCE_BASED'
}

export type Exercise = AppwriteDocument & {
    name: string;
    description: string;
    videoUrl?: string;
    imageUrl?: string;
    type: ExerciseType;
    howMany: number;
}

// Workout - Collection of exercises that form a complete routine
export type Workout = AppwriteDocument & {
    name: string;
    description: string;
    imageUrl?: string;
    createdBy?: string; // trainer's accountId
    workoutExercise: WorkoutExercise[];
    estimatedDuration?: number; // in minutes
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    tags?: string[]; // for categorization (e.g., "upper body", "cardio")
}

// WorkoutExercise - Exercise with specific parameters within a workout
export type WorkoutExercise = AppwriteDocument & {
    exercise: Exercise | string;
    exerciseId?: string; // kept for backward compatibility
    sets: number;
    // For time-based: seconds, for reps: count, for distance: meters
    targetValue: number;
    restBetweenSets?: number; // in seconds
    notes?: string;
    order: number; // sequence within workout
}

// Frequency patterns for workout assignments
export enum FrequencyType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    CUSTOM = 'CUSTOM'
}

// WorkoutAssignment - Associates workouts with users and defines schedule
export type WorkoutAssignment = AppwriteDocument & {
    user: User[] | string[] | string; // can be an array of Users, array of IDs, or a single ID
    workout: Workout | string; // can be a Workout object or an ID
    workoutId?: string; // kept for backward compatibility
    assignedBy: User | string; // can be a User object or an ID
    startDate: string; // ISO date string
    endDate?: string; // ISO date string
    frequencyType: FrequencyType;
    // For WEEKLY: array of weekdays [0-6], for CUSTOM: array of specific dates
    frequencyValues: string[];
    status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | 'TODO';
    notes?: string;
}

// WorkoutHistory - Records of completed workouts
export type WorkoutHistory = AppwriteDocument & {
    user: User | string;
    workout: Workout | string;
    assignment?: WorkoutAssignment | string; // reference to assignment if applicable
    assignmentId?: string; // kept for backward compatibility
    completedDate: string; // ISO date string
    duration: number; // in minutes
    exercises: CompletedExercise[];
    notes?: string;
    rating?: number; // user's rating (e.g., 1-5)
    feedback?: string; // user's feedback
}

// CompletedExercise - Records actual performance for each exercise
export type CompletedExercise = AppwriteDocument & {
    exercise: Exercise | string;
    exerciseId?: string; // kept for backward compatibility
    sets: CompletedSet[] | string[]; // can be array of IDs or actual CompletedSet objects
}

// CompletedSet - Performance details for each set
export type CompletedSet = AppwriteDocument & {
    // Actual value achieved (reps, time, or distance)
    actualValue: number;
    // For weight training
    weight?: number;
    // User's perceived difficulty (e.g., 1-10)
    difficultyRating?: number;
}

// ActiveWorkout - Represents a workout in progress
export type ActiveWorkout = AppwriteDocument & {
    user: User | string;
    userId?: string; // kept for backward compatibility
    workout: Workout | string;
    workoutId?: string; // kept for backward compatibility
    workoutAssignment?: WorkoutAssignment | string; // reference to assignment if applicable
    assignmentId?: string; // kept for backward compatibility
    startTime: string; // ISO datetime string
    exercises: ActiveExercise[] | string[]; // can be array of IDs or actual ActiveExercise objects
    status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
    lastUpdated: string; // ISO datetime string
}

// ActiveExercise - Tracks progress of an individual exercise
export type ActiveExercise = AppwriteDocument & {
    exercise: Exercise | string;
    exerciseId?: string; // kept for backward compatibility
    order: number;
    sets: ActiveSet[] | string[]; // can be array of IDs or actual ActiveSet objects
    isCompleted: boolean;
    notes?: string;
}

// ActiveSet - Records data for each set as it's being performed
export type ActiveSet = AppwriteDocument & {
    setNumber: number;
    isCompleted: boolean;
    actualValue?: number; // The value achieved (reps, time, distance)
    weight?: number; // For weight training
    difficultyRating?: number;
    completedAt?: string | null; // ISO datetime string
}