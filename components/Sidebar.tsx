import React, { useState } from 'react';
import type { Page } from '../types';
import { 
    LayoutDashboardIcon, UserIcon, SettingsIcon, DumbbellIcon,
    AppleIcon, TrendingUpIcon, LightbulbIcon, BrainIcon, ClipboardListIcon, ChevronDownIcon, FolderClockIcon
} from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  hasSavedPlans: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen, isLoggedIn, hasSavedPlans }) => {
  const { t } = useAppContext();
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isPlanOpen, setIsPlanOpen] = useState(true);

  const accountPages: { page: Page, label: string, icon: React.FC<{className?: string}> }[] = [
    { page: 'dashboard', label: t.sidebarDashboard, icon: LayoutDashboardIcon },
    { page: 'profile', label: t.sidebarProfile, icon: UserIcon },
    { page: 'myplans', label: t.sidebarMyPlans, icon: FolderClockIcon },
  ];

  const planPages: { page: Page, label: string, icon: React.FC<{className?: string}> }[] = [
    { page: 'workout', label: t.workoutTab, icon: DumbbellIcon },
    { page: 'nutrition', label: t.nutritionTab, icon: AppleIcon },
    { page: 'progress', label: t.progressTab, icon: TrendingUpIcon },
    { page: 'protips', label: t.protipsTab, icon: LightbulbIcon },
    { page: 'research', label: t.researchTab, icon: BrainIcon },
  ];

  const topLevelPages = [
    { page: 'settings' as Page, label: t.sidebarSettings, icon: SettingsIcon },
  ];

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };
  
  const NavButton: React.FC<{
      page: Page;
      label: string;
      icon: React.FC<{className?: string}>;
      isActive: boolean;
      isDisabled?: boolean;
      isSubItem?: boolean;
    }> = ({ page, label, icon: Icon, isActive, isDisabled = false, isSubItem = false }) => {

      const baseClasses = `flex items-center space-x-3 rtl:space-x-reverse py-3 font-semibold rounded-lg transition-all duration-200 w-full text-left text-base ${isSubItem ? 'pl-11 rtl:pr-11' : 'px-4'}`;

      let finalClasses = '';
      if (isDisabled) {
        finalClasses = `${baseClasses} text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-70`;
      } else if (isActive) {
        finalClasses = `${baseClasses} bg-gradient-to-r from-cyan-500/10 to-blue-600/10 text-cyan-600 dark:text-cyan-300 border-l-4 border-cyan-500`;
      } else {
        finalClasses = `${baseClasses} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white cursor-pointer`;
      }

      return (
          <button
            onClick={() => !isDisabled && handleNavigation(page)}
            className={finalClasses}
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </button>
      );
  };

  const isAccountPageActive = accountPages.some(p => p.page === currentPage);
  const isPlanPageActive = planPages.some(p => p.page === currentPage);

  const sidebarContent = (
    <div className="flex flex-col h-full">
        <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse text-gray-800 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700">
            <DumbbellIcon className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
            <span className="text-2xl font-bold tracking-tight">{t.headerTitle}</span>
        </a>
        <nav className="flex-grow p-4 space-y-2">
            {!isLoggedIn && (
                <NavButton
                    page="welcome"
                    label={t.sidebarWelcome}
                    icon={DumbbellIcon}
                    isActive={currentPage === 'welcome'}
                />
            )}
            
            {/* Collapsible My Account section */}
            <div className="pt-2">
                <button 
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className={`flex items-center justify-between w-full px-4 py-3 font-semibold rounded-lg text-left text-base transition-colors duration-200 ${isAccountPageActive ? 'text-cyan-600 dark:text-cyan-300 bg-gray-200/50 dark:bg-gray-700/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <UserIcon className="w-6 h-6" />
                        <span>{t.sidebarMyAccount}</span>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isAccountOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAccountOpen && (
                    <div className="mt-2 space-y-1">
                        {accountPages.map(item => (
                            <NavButton
                                key={item.page}
                                page={item.page}
                                label={item.label}
                                icon={item.icon}
                                isActive={currentPage === item.page}
                                isSubItem
                                isDisabled={!isLoggedIn && (item.page !== 'myplans' || !hasSavedPlans)}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Collapsible My Plan section */}
            <div className="pt-2">
                <button 
                    onClick={() => setIsPlanOpen(!isPlanOpen)}
                    className={`flex items-center justify-between w-full px-4 py-3 font-semibold rounded-lg text-left text-base transition-colors duration-200 ${isPlanPageActive ? 'text-cyan-600 dark:text-cyan-300 bg-gray-200/50 dark:bg-gray-700/30' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <ClipboardListIcon className="w-6 h-6" />
                        <span>{t.sidebarMyPlan}</span>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isPlanOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPlanOpen && (
                    <div className="mt-2 space-y-1">
                        {planPages.map(item => (
                            <NavButton
                                key={item.page}
                                page={item.page}
                                label={item.label}
                                icon={item.icon}
                                isActive={currentPage === item.page}
                                isDisabled={!isLoggedIn}
                                isSubItem
                            />
                        ))}
                    </div>
                )}
            </div>

             {topLevelPages.map(item => (
                <NavButton
                  key={item.page}
                  page={item.page}
                  label={item.label}
                  icon={item.icon}
                  isActive={currentPage === item.page}
                  isDisabled={false} // Settings is always enabled
                />
            ))}
        </nav>
        <div className="p-4 text-xs text-center text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700">
            <p>&copy; {new Date().getFullYear()} {t.headerTitle}.</p>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar with Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      <aside className={`fixed top-0 left-0 rtl:left-auto rtl:right-0 h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-r dark:border-gray-700 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0 rtl:-translate-x-0' : '-translate-x-full rtl:translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 rtl:left-auto rtl:right-0 h-full w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
