import React, { useState, useEffect, useRef } from 'react';
import { WorkoutStyle } from '../types';
import type { UserProfile } from '../types';
import { CloseIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface SettingsModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onUpdateProfile: (profile: UserProfile, regenerate: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ userProfile, onClose, onUpdateProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const { t } = useAppContext();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus Trapping for Accessibility
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    modalElement.addEventListener('keydown', handleKeyDown);

    return () => {
      modalElement.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['workoutDays', 'targetCalories', 'targetProtein', 'targetCarbs', 'targetFat'];
    
    setFormData(prev => ({
        ...prev,
        [name]: numericFields.includes(name)
            ? (value === '' ? undefined : parseInt(value, 10))
            : value
    }));
  };

  const handleSave = () => {
    onUpdateProfile(formData, false);
    onClose();
  };

  const handleSaveAndRegenerate = () => {
    onUpdateProfile(formData, true);
    onClose();
  };
  
  const inputClasses = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
  const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1";

  return (
    <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        aria-labelledby="settings-modal-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 id="settings-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">{t.settingsTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
            <div>
                <label htmlFor="workoutDays" className={labelClasses}>{t.workoutDaysLabel}</label>
                <input type="number" id="workoutDays" name="workoutDays" value={formData.workoutDays} onChange={handleChange} className={inputClasses} required min="1" max="7" />
            </div>
            <div>
              <label htmlFor="workoutStyle" className={labelClasses}>{t.styleLabel}</label>
              <select id="workoutStyle" name="workoutStyle" value={formData.workoutStyle} onChange={handleChange} className={inputClasses}>
                {Object.values(WorkoutStyle).map(style => <option key={style} value={style}>{style}</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="availableEquipment" className={labelClasses}>{t.equipmentLabel}</label>
                <input type="text" id="availableEquipment" name="availableEquipment" value={formData.availableEquipment} onChange={handleChange} className={inputClasses} placeholder={t.equipmentPlaceholder} />
            </div>
            <div>
                <label htmlFor="dietaryRestrictions" className={labelClasses}>{t.dietLabel}</label>
                <input type="text" id="dietaryRestrictions" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} className={inputClasses} placeholder={t.dietPlaceholder} />
            </div>
            <div>
              <label htmlFor="dislikedExercises" className={labelClasses}>{t.dislikedExercisesLabel}</label>
              <input 
                type="text"
                id="dislikedExercises" 
                name="dislikedExercises" 
                value={formData.dislikedExercises} 
                onChange={handleChange} 
                className={inputClasses}
                placeholder={t.dislikedExercisesPlaceholder}
              />
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.customTargetsTitle}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.customTargetsSubtitle}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="targetCalories" className={labelClasses}>{t.targetCaloriesLabel}</label>
                        <input type="number" id="targetCalories" name="targetCalories" value={formData.targetCalories || ''} onChange={handleChange} className={inputClasses} placeholder="e.g., 2500" min="0" />
                    </div>
                    <div>
                        <label htmlFor="targetProtein" className={labelClasses}>{t.targetProteinLabel}</label>
                        <input type="number" id="targetProtein" name="targetProtein" value={formData.targetProtein || ''} onChange={handleChange} className={inputClasses} placeholder="e.g., 180" min="0" />
                    </div>
                    <div>
                        <label htmlFor="targetCarbs" className={labelClasses}>{t.targetCarbsLabel}</label>
                        <input type="number" id="targetCarbs" name="targetCarbs" value={formData.targetCarbs || ''} onChange={handleChange} className={inputClasses} placeholder="e.g., 250" min="0" />
                    </div>
                    <div>
                        <label htmlFor="targetFat" className={labelClasses}>{t.targetFatLabel}</label>
                        <input type="number" id="targetFat" name="targetFat" value={formData.targetFat || ''} onChange={handleChange} className={inputClasses} placeholder="e.g., 80" min="0" />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-5 mt-auto bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <button 
                onClick={onClose}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {t.cancel}
            </button>
            <button 
                onClick={handleSave}
                className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {t.saveChanges}
            </button>
            <button 
                onClick={handleSaveAndRegenerate}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
                {t.saveAndRegenerate}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;