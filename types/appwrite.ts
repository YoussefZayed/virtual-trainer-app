export type User = {
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

export type Exercise = {
    id: string;
    name: string;
    description: string;
    videoUrl?: string;
    imageUrl?: string;
    type: ExerciseType;
    howMany: number;
}

// Workout - Collection of exercises that form a complete routine
export type Workout = {
    id: string;
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
export type WorkoutExercise = {
    exerciseId: string;
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
export type WorkoutAssignment = {
    id: string;
    user: string;
    workoutId: string;
    assignedBy: string; // trainer's accountId
    startDate: string; // ISO date string
    endDate?: string; // ISO date string
    frequencyType: FrequencyType;
    // For WEEKLY: array of weekdays [0-6], for CUSTOM: array of specific dates
    frequencyValues: string[];
    status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | 'TODO';
    notes?: string;
}

// WorkoutHistory - Records of completed workouts
export type WorkoutHistory = {
    id: string;
    user: string;
    workout: string;
    assignmentId?: string; // reference to assignment if applicable
    completedDate: string; // ISO date string
    duration: number; // in minutes
    exercises: CompletedExercise[];
    notes?: string;
    rating?: number; // user's rating (e.g., 1-5)
    feedback?: string; // user's feedback
}

// CompletedExercise - Records actual performance for each exercise
export type CompletedExercise = {
    exerciseId: string;
    sets: CompletedSet[];
}

// CompletedSet - Performance details for each set
export type CompletedSet = {
    // Actual value achieved (reps, time, or distance)
    actualValue: number;
    // For weight training
    weight?: number;
    // User's perceived difficulty (e.g., 1-10)
    difficultyRating?: number;
}

// ActiveWorkout - Represents a workout in progress
export type ActiveWorkout = {
    id: string;
    userId: string;
    workoutId: string;
    assignmentId?: string; // reference to assignment if applicable
    startTime: string; // ISO datetime string
    exercises: ActiveExercise[];
    status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
    lastUpdated: string; // ISO datetime string
}

// ActiveExercise - Tracks progress of an individual exercise
export type ActiveExercise = {
    exerciseId: string;
    order: number;
    sets: ActiveSet[];
    isCompleted: boolean;
    notes?: string;
}

// ActiveSet - Records data for each set as it's being performed
export type ActiveSet = {
    setNumber: number;
    isCompleted: boolean;
    actualValue?: number; // The value achieved (reps, time, distance)
    weight?: number; // For weight training
    difficultyRating?: number;
    completedAt?: string; // ISO datetime string
}