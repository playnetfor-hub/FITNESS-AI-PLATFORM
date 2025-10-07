import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const Footer: React.FC = () => {
  const { t } = useAppContext();
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 dark:text-gray-500">
        <p>&copy; {new Date().getFullYear()} {t.headerTitle}. {t.footerRights}</p>
        <p className="text-sm mt-1">{t.footerTagline}</p>
      </div>
    </footer>
  );
};

export default Footer;