import React from 'react';
import InfoCard from './InfoCard';
import { SunIcon, MoonIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useAppContext();

  return (
    <InfoCard title={t.settingsPageTitle}>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t.settingsPageSubtitle}</p>
        <div className="space-y-6">
            {/* Theme Setting */}
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{t.themeSetting}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{theme}</p>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                </button>
            </div>

            {/* Language Setting */}
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                 <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{t.languageSetting}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'en' ? 'English' : 'العربية'}</p>
                </div>
                <button
                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                    className="p-2 w-12 h-10 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle Language"
                >
                    <span className="font-bold text-lg">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
            </div>
        </div>
    </InfoCard>
  );
};

export default SettingsPage;
