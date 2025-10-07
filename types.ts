export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export enum FitnessGoal {
  LOSE_FAT = 'Fat Loss',
  BUILD_MUSCLE = 'Muscle Gain',
  MAINTAIN_WEIGHT = 'Weight Maintenance',
  IMPROVE_ENDURANCE = 'Improve Endurance',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary (little or no exercise)',
  LIGHTLY_ACTIVE = 'Lightly Active (light exercise/sports 1-3 days/week)',
  MODERATELY_ACTIVE = 'Moderately Active (moderate exercise/sports 3-5 days/week)',
  VERY_ACTIVE = 'Very Active (hard exercise/sports 6-7 days a week)',
  EXTRA_ACTIVE = 'Extra Active (very hard exercise/sports & physical job)',
}

export enum WorkoutStyle {
  STRENGTH_TRAINING = 'Strength Training',
  HYPERTROPHY = 'Hypertrophy (Bodybuilding)',
  HIIT = 'High-Intensity Interval Training (HIIT)',
  ENDURANCE = 'Endurance / Cardio',
  FUNCTIONAL_FITNESS = 'Functional Fitness',
  BODYWEIGHT = 'Bodyweight / Calisthenics',
}

export interface UserProfile {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  goal: FitnessGoal;
  activityLevel: ActivityLevel;
  workoutDays: number;
  dietaryRestrictions: string;
  availableEquipment: string;
  workoutStyle: WorkoutStyle;
  dislikedExercises: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  techniqueFocus?: string;
  youtubeSearchQuery: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string;
  exercises: Exercise[];
  cooldown: string;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlanDay {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack?: Meal;
  postWorkoutSnack?: Meal;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  hydration: string;
  supplementSuggestions: string;
}

export interface ProTip {
    title: string;
    description: string;
}

export interface FitnessPlan {
  workoutPlan: WorkoutDay[];
  mealPlan: MealPlanDay;
  proTips: ProTip[];
}

export interface SearchResult {
    answer: string;
    sources: {
        uri: string;
        title: string;
    }[];
}

export interface ProgressEntry {
  date: string; // YYYY-MM-DD
  weight: number;
  waist?: number;
  chest?: number;
  hips?: number;
}

export interface ExerciseVariation {
  name: string;
  description: string;
}

export interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  profile: UserProfile;
  plan: FitnessPlan;
}

export type Page = 'dashboard' | 'profile' | 'settings' | 'welcome' | 'workout' | 'nutrition' | 'progress' | 'protips' | 'research' | 'myplans';