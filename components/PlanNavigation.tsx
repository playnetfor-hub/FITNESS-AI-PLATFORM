import React from 'react';
import type { Page } from '../types';
import { 
    LayoutDashboardIcon, DumbbellIcon, AppleIcon, TrendingUpIcon, LightbulbIcon, BrainIcon
} from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface PlanNavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const PlanNavigation: React.FC<PlanNavigationProps> = ({ currentPage, setCurrentPage }) => {
    const { t } = useAppContext();

    const planPages: { page: Page, label: string, icon: React.FC<{className?: string}> }[] = [
        { page: 'dashboard', label: t.sidebarDashboard, icon: LayoutDashboardIcon },
        { page: 'workout', label: t.workoutTab, icon: DumbbellIcon },
        { page: 'nutrition', label: t.nutritionTab, icon: AppleIcon },
        { page: 'progress', label: t.progressTab, icon: TrendingUpIcon },
        { page: 'protips', label: t.protipsTab, icon: LightbulbIcon },
        { page: 'research', label: t.researchTab, icon: BrainIcon },
    ];

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2">
            <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse flex-wrap">
                {planPages.map(({ page, label, icon: Icon }) => {
                    const isActive = currentPage === page;
                    return (
                        <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`flex-grow sm:flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse px-3 py-3 font-semibold rounded-lg transition-all duration-200 text-sm md:text-base whitespace-nowrap
                            ${isActive 
                                ? 'bg-cyan-500 text-white shadow-md' 
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default PlanNavigation;
