import React, { useState } from 'react';
import { Gender, FitnessGoal, ActivityLevel, WorkoutStyle } from '../types';
import type { UserProfile } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  initialData?: UserProfile;
  isEditing?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const { t } = useAppContext();
  const [formData, setFormData] = useState<UserProfile>(initialData || {
    age: 25,
    gender: Gender.MALE,
    weight: 70,
    height: 175,
    goal: FitnessGoal.BUILD_MUSCLE,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    workoutDays: 4,
    dietaryRestrictions: '',
    availableEquipment: 'Full Gym Access',
    workoutStyle: WorkoutStyle.STRENGTH_TRAINING,
    dislikedExercises: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' || name === 'workoutDays' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
  const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">{isEditing ? t.editProfileButton : t.formTitle}</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">{isEditing ? t.profilePageSubtitle : t.formSubtitle}</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className={labelClasses}>{t.ageLabel}</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className={inputClasses} required min="12" max="100" />
          </div>
          <div>
            <label htmlFor="gender" className={labelClasses}>{t.genderLabel}</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
              {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="weight" className={labelClasses}>{t.weightLabel}</label>
            <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} required min="30" max="300" />
          </div>
          <div>
            <label htmlFor="height" className={labelClasses}>{t.heightLabel}</label>
            <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} className={inputClasses} required min="100" max="250" />
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="goal" className={labelClasses}>{t.goalLabel}</label>
                <select id="goal" name="goal" value={formData.goal} onChange={handleChange} className={inputClasses}>
                {Object.values(FitnessGoal).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="workoutDays" className={labelClasses}>{t.workoutDaysLabel}</label>
                <input type="number" id="workoutDays" name="workoutDays" value={formData.workoutDays} onChange={handleChange} className={inputClasses} required min="1" max="7" />
            </div>
        </div>
        
        {/* Lifestyle */}
        <div>
            <label htmlFor="activityLevel" className={labelClasses}>{t.activityLevelLabel}</label>
            <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={inputClasses}>
            {Object.values(ActivityLevel).map(level => <option key={level} value={level}>{level}</option>)}
            </select>
        </div>

        {/* Preferences */}
        <div>
            <label htmlFor="availableEquipment" className={labelClasses}>{t.equipmentLabel}</label>
            <input type="text" id="availableEquipment" name="availableEquipment" value={formData.availableEquipment} onChange={handleChange} className={inputClasses} placeholder={t.equipmentPlaceholder} />
        </div>
        <div>
          <label htmlFor="workoutStyle" className={labelClasses}>{t.styleLabel}</label>
          <select id="workoutStyle" name="workoutStyle" value={formData.workoutStyle} onChange={handleChange} className={inputClasses}>
            {Object.values(WorkoutStyle).map(style => <option key={style} value={style}>{style}</option>)}
          </select>
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
        
        <div className="pt-4">
            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            {isEditing ? t.saveProfileButton : t.generatePlanButton}
            </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;