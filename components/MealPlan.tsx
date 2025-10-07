import React from 'react';
import type { MealPlanDay } from '../types';
import { WaterIcon, PillIcon, SunriseIcon, SunIconFull, MoonIcon, SnackIcon, BoltIcon } from '../constants';
import NutritionSearch from './NutritionSearch';
import { useAppContext } from '../contexts/AppContext';

interface MealPlanProps {
  mealPlan: MealPlanDay;
}

const MealCard: React.FC<{ title: string; meal: any; icon: React.ReactNode }> = ({ title, meal, icon }) => {
    const { t } = useAppContext();
    if (!meal) return null;
    return (
        <div className="bg-white dark:bg-gray-800/60 p-5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-cyan-500/60 hover:shadow-cyan-500/10 hover:-translate-y-1 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-cyan-500 dark:text-cyan-400 bg-gray-100 dark:bg-gray-900/50 p-2 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
                    <p className="text-md font-semibold text-gray-700 dark:text-gray-300">{meal.name}</p>
                </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow mb-4">{meal.description}</p>
            <div className="mt-auto grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm bg-gray-100 dark:bg-gray-900/50 p-2 rounded-lg">
                <div><span className="font-bold text-lg text-gray-800 dark:text-white">{meal.calories}</span><span className="text-gray-500 dark:text-gray-400 block text-xs">{t.calories}</span></div>
                <div><span className="font-bold text-lg text-green-600 dark:text-green-400">{meal.protein}g</span><span className="text-gray-500 dark:text-gray-400 block text-xs">{t.protein}</span></div>
                <div><span className="font-bold text-lg text-orange-600 dark:text-orange-400">{meal.carbs}g</span><span className="text-gray-500 dark:text-gray-400 block text-xs">{t.carbs}</span></div>
                <div><span className="font-bold text-lg text-yellow-500 dark:text-yellow-400">{meal.fat}g</span><span className="text-gray-500 dark:text-gray-400 block text-xs">{t.fat}</span></div>
            </div>
        </div>
    );
};

const AdditionalInfo: React.FC<{title: string, content: string, icon: React.ReactNode}> = ({title, content, icon}) => (
    <div className="bg-white dark:bg-gray-800/60 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4 h-full transition-all duration-300 hover:border-cyan-500/60 hover:shadow-cyan-500/10 hover:-translate-y-1">
        <div className="flex-shrink-0 mt-1 text-cyan-500 dark:text-cyan-400 bg-gray-100 dark:bg-gray-900/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{content}</p>
        </div>
    </div>
);

const MacroStatCard: React.FC<{value: string, label: string, color: string}> = ({ value, label, color }) => (
    <div className={`bg-white dark:bg-gray-800/80 p-4 rounded-lg text-center border-b-4 ${color}`}>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
);


const MealPlan: React.FC<MealPlanProps> = ({ mealPlan }) => {
  const { t } = useAppContext();
  const { totalCalories, totalProtein, totalCarbs, totalFat } = mealPlan;
  
  const proteinCals = totalProtein * 4;
  const carbsCals = totalCarbs * 4;
  const fatCals = totalFat * 9;
  const totalMacroCals = proteinCals + carbsCals + fatCals;

  const proteinPercentage = totalMacroCals > 0 ? (proteinCals / totalMacroCals) * 100 : 0;
  const carbsPercentage = totalMacroCals > 0 ? (carbsCals / totalMacroCals) * 100 : 0;
  const fatPercentage = totalMacroCals > 0 ? (fatCals / totalMacroCals) * 100 : 0;

  return (
    <>
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{t.macroDashboardTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MacroStatCard value={`${totalCalories}`} label={t.calories} color="border-cyan-500" />
                <MacroStatCard value={`${totalProtein}g`} label={t.protein} color="border-green-500" />
                <MacroStatCard value={`${totalCarbs}g`} label={t.carbs} color="border-orange-500" />
                <MacroStatCard value={`${totalFat}g`} label={t.fat} color="border-yellow-500" />
            </div>
            <div className="mt-4">
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-2">{t.calorieSplit}</p>
                <div className="flex h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 text-xs text-white font-bold text-center">
                    <div style={{ width: `${proteinPercentage}%` }} className="bg-green-500 flex items-center justify-center" title={`${t.protein}: ${proteinPercentage.toFixed(0)}%`}>
                        P
                    </div>
                    <div style={{ width: `${carbsPercentage}%` }} className="bg-orange-500 flex items-center justify-center" title={`${t.carbs}: ${carbsPercentage.toFixed(0)}%`}>
                        C
                    </div>
                    <div style={{ width: `${fatPercentage}%` }} className="bg-yellow-500 flex items-center justify-center" title={`${t.fat}: ${fatPercentage.toFixed(0)}%`}>
                        F
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <MealCard title={t.breakfast} meal={mealPlan.breakfast} icon={<SunriseIcon className="w-8 h-8"/>} />
            <MealCard title={t.lunch} meal={mealPlan.lunch} icon={<SunIconFull className="w-8 h-8"/>} />
            <MealCard title={t.dinner} meal={mealPlan.dinner} icon={<MoonIcon className="w-8 h-8"/>} />
            {mealPlan.snack && <MealCard title={t.snack} meal={mealPlan.snack} icon={<SnackIcon className="w-8 h-8"/>} />}
            {mealPlan.postWorkoutSnack && <MealCard title={t.postWorkout} meal={mealPlan.postWorkoutSnack} icon={<BoltIcon className="w-8 h-8"/>} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdditionalInfo 
                title={t.hydration} 
                content={mealPlan.hydration} 
                icon={<WaterIcon className="w-8 h-8" />}
            />
            <AdditionalInfo 
                title={t.supplements} 
                content={mealPlan.supplementSuggestions}
                icon={<PillIcon className="w-8 h-8" />}
            />
        </div>

        <NutritionSearch />
    </>
  );
};

export default MealPlan;