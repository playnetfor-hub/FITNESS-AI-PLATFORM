import React from 'react';
import type { SavedPlan } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { DumbbellIcon } from '../constants';

interface MyPlansPageProps {
  savedPlans: SavedPlan[];
  onLoadPlan: (id: string) => void;
  onDeletePlan: (id: string) => void;
}

const MyPlansPage: React.FC<MyPlansPageProps> = ({ savedPlans, onLoadPlan, onDeletePlan }) => {
  const { t } = useAppContext();

  const sortedPlans = [...savedPlans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sortedPlans.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">{t.noSavedPlans}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <p className="text-gray-500 dark:text-gray-400">{t.myPlansPageSubtitle}</p>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlans.map(plan => (
          <div key={plan.id} className="bg-white dark:bg-gray-800/60 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-shadow hover:shadow-lg">
            <div>
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                    <span className="flex-shrink-0 text-xs bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 font-semibold px-2 py-1 rounded-full">{plan.profile.goal}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                    {new Date(plan.createdAt).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <button 
                onClick={() => onLoadPlan(plan.id)}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
              >
                {t.loadPlan}
              </button>
              <button 
                onClick={() => onDeletePlan(plan.id)}
                className="bg-gray-200 hover:bg-red-200 dark:bg-gray-700 dark:hover:bg-red-900/50 text-gray-700 hover:text-red-700 dark:text-gray-300 dark:hover:text-red-300 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                {t.deletePlan}
              </button>
            </div>
          </div>
        ))}
       </div>
    </div>
  );
};

export default MyPlansPage;
