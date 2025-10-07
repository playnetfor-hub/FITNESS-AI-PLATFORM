import React from 'react';
import { DumbbellIcon, MenuIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t } = useAppContext();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {onMenuClick && (
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors lg:hidden"
                    aria-label="Open menu"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>
            )}
            <a href="/" className="flex items-center space-x-2 rtl:space-x-reverse text-gray-800 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
              <DumbbellIcon className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
              <span className="text-2xl font-bold tracking-tight">{t.headerTitle}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;