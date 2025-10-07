import React, { useState } from 'react';
import type { UserProfile } from '../types';
import InfoCard from './InfoCard';
import UserProfileForm from './UserProfileForm';
import { useAppContext } from '../contexts/AppContext';

interface ProfilePageProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile, regenerate: boolean) => void;
}

const ProfileInfo: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useAppContext();

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    onUpdateProfile(updatedProfile, false); // Do not regenerate plan on profile-only update
    setIsEditing(false);
  };
  
  return (
    <InfoCard title={t.profilePageTitle}>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t.profilePageSubtitle}</p>

        {isEditing ? (
            <UserProfileForm 
                onSubmit={handleProfileUpdate}
                initialData={userProfile}
                isEditing={true}
            />
        ) : (
            <div>
                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                    <ProfileInfo label={t.ageLabel} value={userProfile.age} />
                    <ProfileInfo label={t.genderLabel} value={userProfile.gender} />
                    <ProfileInfo label={t.weightLabel} value={`${userProfile.weight} kg`} />
                    <ProfileInfo label={t.heightLabel} value={`${userProfile.height} cm`} />
                    <ProfileInfo label={t.goalLabel} value={userProfile.goal} />
                    <ProfileInfo label={t.workoutDaysLabel} value={userProfile.workoutDays} />
                    <ProfileInfo label={t.activityLevelLabel} value={userProfile.activityLevel} />
                    <ProfileInfo label={t.styleLabel} value={userProfile.workoutStyle} />
                    <ProfileInfo label={t.equipmentLabel} value={userProfile.availableEquipment} />
                    <ProfileInfo label={t.dietLabel} value={userProfile.dietaryRestrictions || 'None'} />
                    <ProfileInfo label={t.dislikedExercisesLabel} value={userProfile.dislikedExercises || 'None'} />
                </dl>
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        {t.editProfileButton}
                    </button>
                </div>
            </div>
        )}
    </InfoCard>
  );
};

export default ProfilePage;
