import React, { useState } from 'react';
import type { WorkoutDay, UserProfile, ExerciseVariation } from '../types';
import { VideoIcon, GitBranchIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { getExerciseVariations } from '../services/geminiService';

interface WorkoutPlanProps {
  workoutPlan: WorkoutDay[];
  userProfile: UserProfile;
}

const RoutineStep: React.FC<{title: string; content: string}> = ({title, content}) => (
    <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-900/40 rounded-lg">
        <h4 className="font-semibold text-lg text-cyan-600 dark:text-cyan-300">{title}</h4>
        <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-line leading-relaxed">{content}</p>
    </div>
);


const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ workoutPlan, userProfile }) => {
    const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);
    const { t } = useAppContext();

    const [variations, setVariations] = useState<{ [exerciseName: string]: ExerciseVariation[] }>({});
    const [loadingVariationsFor, setLoadingVariationsFor] = useState<string | null>(null);
    const [errorVariationsFor, setErrorVariationsFor] = useState<string | null>(null);
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

    const toggleDay = (index: number) => {
        setOpenDayIndex(openDayIndex === index ? null : index);
    };
    
    const handleToggleVariations = async (exerciseName: string) => {
        if (expandedExercise === exerciseName) {
            setExpandedExercise(null);
            return;
        }

        // If we already have the data, just show it
        if (variations[exerciseName]) {
            setExpandedExercise(exerciseName);
            return;
        }

        setLoadingVariationsFor(exerciseName);
        setErrorVariationsFor(null);
        setExpandedExercise(exerciseName);

        try {
            const fetchedVariations = await getExerciseVariations(
                exerciseName,
                userProfile.goal,
                userProfile.workoutStyle
            );
            setVariations(prev => ({ ...prev, [exerciseName]: fetchedVariations }));
        } catch (err) {
            console.error(err);
            setErrorVariationsFor(exerciseName);
        } finally {
            setLoadingVariationsFor(null);
        }
    };


    return (
        <div className="space-y-4">
            {workoutPlan.map((day, index) => (
                <div key={index} className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md transition-all duration-300 hover:border-cyan-500/60 hover:shadow-cyan-500/10">
                    <button 
                        onClick={() => toggleDay(index)}
                        className="w-full flex justify-between items-center p-5 text-left transition-colors bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800"
                        aria-expanded={openDayIndex === index}
                        aria-controls={`workout-day-${index}`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">{day.day}</span>
                            <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
                                <span className="text-gray-900 dark:text-white font-semibold text-lg">{day.focus}</span>
                                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium px-2 py-1 rounded-full">
                                    {day.exercises.length} {t.exercises}
                                </span>
                            </div>
                        </div>
                        <svg 
                            className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${openDayIndex === index ? 'rotate-180' : ''}`} 
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {openDayIndex === index && (
                         <div id={`workout-day-${index}`} className="p-5 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700/80">
                            <RoutineStep title={t.warmup} content={day.warmup} />
                             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-6">{t.exercises}</h3>
                            <ul className="space-y-6">
                                {day.exercises.map((exercise, exIndex) => (
                                    <li key={exIndex} className="p-0.5 bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-xl">
                                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                        <div className="w-full">
                                            <h4 className="font-bold text-xl text-gray-900 dark:text-white">{exercise.name}</h4>
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 my-3 text-sm text-gray-600 dark:text-gray-300 border-y border-gray-200 dark:border-gray-700 py-3">
                                                <div>
                                                  <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t.sets}</p>
                                                  <p className="font-bold text-lg text-gray-900 dark:text-white">{exercise.sets}</p>
                                                </div>
                                                <div>
                                                  <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t.reps}</p>
                                                  <p className="font-bold text-lg text-gray-900 dark:text-white">{exercise.reps}</p>
                                                </div>
                                                <div>
                                                  <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t.rest}</p>
                                                  <p className="font-bold text-lg text-gray-900 dark:text-white">{exercise.rest}</p>
                                                </div>
                                            </div>
                                            {exercise.techniqueFocus && <p className="mb-4 text-sm text-gray-500 dark:text-gray-400"><strong className="font-semibold text-cyan-600 dark:text-cyan-300">{t.techniqueFocus}:</strong> {exercise.techniqueFocus}</p>}
                                            <div className="flex items-center gap-4">
                                                <a 
                                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeSearchQuery)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/80 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <VideoIcon className="w-5 h-5" />
                                                    <span>{t.watchTutorial}</span>
                                                </a>
                                                 <button 
                                                    onClick={() => handleToggleVariations(exercise.name)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                    disabled={loadingVariationsFor === exercise.name}
                                                >
                                                    <GitBranchIcon className="w-5 h-5" />
                                                    <span>{expandedExercise === exercise.name ? t.hideVariations : t.showVariations}</span>
                                                </button>
                                            </div>
                                            {expandedExercise === exercise.name && (
                                                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/40 rounded-lg animate-fade-in">
                                                    <h5 className="font-semibold text-md text-cyan-600 dark:text-cyan-300 mb-3">{t.variationsTitle}</h5>
                                                    {loadingVariationsFor === exercise.name && <p className="text-sm text-gray-600 dark:text-gray-400">{t.loadingVariations}</p>}
                                                    {errorVariationsFor === exercise.name && <p className="text-sm text-red-500">{t.variationsError}</p>}
                                                    {variations[exercise.name] && (
                                                        <ul className="space-y-3">
                                                            {variations[exercise.name].map((v, i) => (
                                                                <li key={i} className="border-l-2 border-cyan-500 pl-3">
                                                                    <strong className="block text-gray-800 dark:text-gray-100">{v.name}</strong>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{v.description}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                      </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                              <RoutineStep title={t.cooldown} content={day.cooldown} />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default WorkoutPlan;