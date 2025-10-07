import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, FitnessPlan, SearchResult, ExerciseVariation, FitnessGoal, WorkoutStyle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER },
    carbs: { type: Type.NUMBER },
    fat: { type: Type.NUMBER },
  },
  required: ["name", "description", "calories", "protein", "carbs", "fat"],
};

const fitnessPlanSchema = {
  type: Type.OBJECT,
  properties: {
    workoutPlan: {
      type: Type.ARRAY,
      description: "A detailed weekly workout plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "e.g., 'Monday', 'Tuesday', or 'Day 1'" },
          focus: { type: Type.STRING, description: "e.g., 'Chest & Triceps' or 'Full Body'" },
          warmup: { type: Type.STRING, description: "A brief warmup routine for the session." },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING, description: "e.g., '3-4'" },
                reps: { type: Type.STRING, description: "e.g., '8-12'" },
                rest: { type: Type.STRING, description: "e.g., '60 seconds'" },
                techniqueFocus: { type: Type.STRING, description: "A key tip for proper form." },
                youtubeSearchQuery: { type: Type.STRING, description: "A simple, effective YouTube search query to find a tutorial video for this exercise. e.g., 'how to do barbell bench press'" },
              },
              required: ["name", "sets", "reps", "rest", "youtubeSearchQuery"],
            },
          },
          cooldown: { type: Type.STRING, description: "A brief cooldown and stretching routine." },
        },
        required: ["day", "focus", "warmup", "exercises", "cooldown"],
      },
    },
    mealPlan: {
      type: Type.OBJECT,
      description: "A detailed daily meal plan with macronutrient breakdown.",
      properties: {
        breakfast: mealSchema,
        lunch: mealSchema,
        dinner: mealSchema,
        snack: { ...mealSchema, required: mealSchema.required.filter(p => p !== 'description') }, // Make description optional for snacks
        postWorkoutSnack: {
            ...mealSchema,
            description: "An optional post-workout snack, especially for muscle gain or endurance goals.",
            required: mealSchema.required.filter(p => p !== 'description')
        },
        totalCalories: { type: Type.NUMBER },
        totalProtein: { type: Type.NUMBER },
        totalCarbs: { type: Type.NUMBER },
        totalFat: { type: Type.NUMBER },
        hydration: { type: Type.STRING, description: "Recommended daily water intake and hydration tips." },
        supplementSuggestions: { type: Type.STRING, description: "Optional supplement advice based on the user's goal." },
      },
      required: ["breakfast", "lunch", "dinner", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "hydration", "supplementSuggestions"],
    },
    proTips: {
      type: Type.ARRAY,
      description: "A list of actionable, high-level tips for the user.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["workoutPlan", "mealPlan", "proTips"],
};

export const generateFitnessPlan = async (
  userProfile: UserProfile, 
  userPreferences?: { dislikedFoods?: string; preferredCuisines?: string }
): Promise<FitnessPlan> => {
  const customTargets = (userProfile.targetCalories || userProfile.targetProtein || userProfile.targetCarbs || userProfile.targetFat) ? `
    Custom Nutrition Targets:
    ${userProfile.targetCalories ? `- Daily Calorie Target: ${userProfile.targetCalories} kcal\n` : ''}
    ${userProfile.targetProtein ? `- Daily Protein Target: ${userProfile.targetProtein} g\n` : ''}
    ${userProfile.targetCarbs ? `- Daily Carbs Target: ${userProfile.targetCarbs} g\n` : ''}
    ${userProfile.targetFat ? `- Daily Fat Target: ${userProfile.targetFat} g\n` : ''}
    ` : '';
    
  const prompt = `
    You are an expert fitness and nutrition coach. Based on the following user profile, create a comprehensive and personalized weekly workout plan, a daily meal plan, and a set of professional tips.
    User Profile:
    - Age: ${userProfile.age}
    - Gender: ${userProfile.gender}
    - Weight: ${userProfile.weight} kg
    - Height: ${userProfile.height} cm
    - Main Goal: ${userProfile.goal}
    - Activity Level: ${userProfile.activityLevel}
    - Workout Days Per Week: ${userProfile.workoutDays}
    - Available Equipment: ${userProfile.availableEquipment}
    - Dietary Restrictions: ${userProfile.dietaryRestrictions || 'None'}
    - Preferred Workout Style: ${userProfile.workoutStyle}
    - Disliked Exercises to Avoid: ${userProfile.dislikedExercises || 'None'}
    ${customTargets}
    ${userPreferences ? `
    User Meal Preferences:
    - Disliked Foods: ${userPreferences.dislikedFoods || 'None'}
    - Preferred Cuisines: ${userPreferences.preferredCuisines || 'None'}` : ''}

    Instructions:
    1.  **Workout Plan:** Create a plan for the specified number of workout days that aligns with their Preferred Workout Style.
        - **Crucially, you MUST NOT include any of the 'Disliked Exercises to Avoid'. Find suitable alternatives if necessary.**
        - For each day, provide a suitable 'focus', a brief 'warmup' routine, a list of 'exercises', and a 'cooldown' routine.
        - For each exercise, provide 'name', 'sets', 'reps', 'rest', a concise 'techniqueFocus' tip, and a simple 'youtubeSearchQuery' to find an instructional video.
        - The exercises must be appropriate for the available equipment.
    2.  **Meal Plan:** Design a single day's meal plan that aligns with the user's goal.
        - **Crucially, if custom daily targets for calories, protein, carbs, or fat are provided above, you MUST create a meal plan that meets these specific targets precisely. Otherwise, calculate appropriate targets yourself.**
        ${userPreferences ? `- **The meal plan MUST NOT include any of the 'Disliked Foods' and should incorporate 'Preferred Cuisines' where possible.**` : ''}
        - Provide realistic and healthy meal options for breakfast, lunch, and dinner.
        - Include one general 'snack'.
        - **If the user's goal is 'Muscle Gain', 'Improve Endurance', or their activity level is 'Very Active' or 'Extra Active', you MUST include a 'postWorkoutSnack' rich in protein and carbohydrates.** For other goals, you can omit it.
        - Ensure the total calories and macros reflect ALL included meals and adhere to any custom targets provided.
        - Include 'hydration' goals (e.g., "Aim for 3-4 liters of water throughout the day.") and relevant 'supplementSuggestions' (e.g., "Consider creatine monohydrate for muscle gain.").
    3.  **Pro Tips:** Provide 3-4 high-level, actionable tips in a 'proTips' array. Each tip should have a 'title' and a 'description'. These should be motivating and educational, covering topics like consistency, progressive overload, sleep, or mindset, tailored to the user's goal.
    4.  **Response Format:** Your response MUST be a valid JSON object that strictly adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object.
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: fitnessPlanSchema,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const jsonText = response.text.trim();
  const plan: FitnessPlan = JSON.parse(jsonText);
  return plan;
};

const exerciseVariationSchema = {
    type: Type.OBJECT,
    properties: {
        variations: {
            type: Type.ARRAY,
            description: "A list of exercise variations.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the variation." },
                    description: { type: Type.STRING, description: "A brief description of why this variation is suitable and how to perform it." }
                },
                required: ["name", "description"]
            }
        }
    },
    required: ["variations"]
};


export const getExerciseVariations = async (exerciseName: string, goal: FitnessGoal, style: WorkoutStyle): Promise<ExerciseVariation[]> => {
    const prompt = `
        You are an expert fitness coach. A user is looking for variations of the exercise "${exerciseName}".
        Their primary fitness goal is "${goal}" and their preferred workout style is "${style}".

        Based on this, provide 3-4 suitable variations for the exercise.
        - For a goal of "Muscle Gain" and style of "Strength Training" or "Hypertrophy", focus on variations that increase intensity, use different equipment, or target the muscle from a slightly different angle for better hypertrophy.
        - For a goal of "Fat Loss" and style of "HIIT", focus on more explosive, plyometric, or compound movement variations that increase heart rate.
        - For a goal of "Improve Endurance", suggest variations that involve higher reps, shorter rest, or unilateral movements.
        - For "Functional Fitness", suggest variations that mimic real-life movements or improve stability and core strength.
        - For "Bodyweight / Calisthenics", provide variations that only use bodyweight and adjust difficulty by changing leverage or adding holds.

        For each variation, provide a clear 'name' and a concise 'description' explaining why it's a good alternative for their goal and how it differs from the original.
        Your response MUST be a valid JSON object that strictly adheres to the provided schema. Do not include any text outside the JSON object.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: exerciseVariationSchema,
            thinkingConfig: { thinkingBudget: 0 },
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.variations;
};


export const searchFitnessInfo = async (query: string): Promise<SearchResult> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Answer the following fitness-related question based on Google Search results: "${query}"`,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    const answer = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    let sources: { uri: string; title: string; }[] = [];
    if (groundingChunks) {
        sources = groundingChunks
            .filter((chunk: any) => chunk.web && chunk.web.uri && chunk.web.title)
            .map((chunk: any) => ({
                uri: chunk.web.uri,
                title: chunk.web.title,
            }));
    }

    return { answer, sources };
};

// FIX: Add and export the generateExerciseImage function
export const generateExerciseImage = async (exerciseName: string): Promise<string> => {
    const prompt = `
      Generate a clean, photorealistic image of a person (gender-neutral) correctly performing the '${exerciseName}' exercise. 
      The image should clearly demonstrate proper form and technique. 
      Use a simple, minimalist background (like a modern gym or a plain studio setting) to keep the focus on the exercise itself.
      The image should be well-lit and have a professional, instructional quality. Avoid any text or overlays on the image.
      Style: photorealistic, high-detail, fitness photography.
    `;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages?.[0]?.image?.imageBytes) {
        throw new Error(`Image generation failed for ${exerciseName}. No image data returned.`);
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
    return imageUrl;
};