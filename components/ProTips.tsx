import React from 'react';
import type { ProTip } from '../types';
import { LightbulbIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface ProTipsProps {
  tips: ProTip[];
}

const ProTips: React.FC<ProTipsProps> = ({ tips }) => {
  const { t } = useAppContext();
  return (
    <>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t.proTipsSubtitle}</p>
      <div className="space-y-6">
        {tips.map((tip, index) => (
          <div key={index} className="p-0.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 transition-all duration-300 hover:shadow-cyan-500/20">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 flex items-start gap-5 h-full">
              <div className="flex-shrink-0 mt-1 bg-gray-100 dark:bg-gray-900/50 p-3 rounded-full">
                  <LightbulbIcon className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{tip.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProTips;