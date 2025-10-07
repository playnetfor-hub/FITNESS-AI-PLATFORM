import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const Hero: React.FC = () => {
  const { t } = useAppContext();
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
        {t.heroTitle}
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
        {t.heroSubtitle}
      </p>
    </div>
  );
};

export default Hero;