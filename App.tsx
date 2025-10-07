import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import UserProfileForm from './components/UserProfileForm';
import FitnessDashboard from './components/FitnessDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import Sidebar from './components/Sidebar';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import InfoCard from './components/InfoCard';
import WorkoutPlan from './components/WorkoutPlan';
import MealPlan from './components/MealPlan';
import ProgressTracker from './components/ProgressTracker';
import ProTips from './components/ProTips';
import Search from './components/Search';
import MyPlansPage from './components/MyPlansPage';
import SavePlanModal from './components/SavePlanModal';
import { generateFitnessPlan } from './services/geminiService';
import type { UserProfile, FitnessPlan, ProgressEntry, Page, SavedPlan } from './types';
import { useAppContext } from './contexts/AppContext';
import PlanNavigation from './components/PlanNavigation';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fitnessPlan, setFitnessPlan] = useState<FitnessPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [planToSave, setPlanToSave] = useState<SavedPlan | null>(null);
  const { t } = useAppContext();

  useEffect(() => {
    try {
      const savedPlansString = localStorage.getItem('savedPlans');
      if (savedPlansString) {
          const plans: SavedPlan[] = JSON.parse(savedPlansString);
          if (plans.length > 0) {
              setSavedPlans(plans);
          }
      }

      const savedProgress = localStorage.getItem('progressData');
      if (savedProgress) {
        setProgressData(JSON.parse(savedProgress));
      }
    } catch (err) {
      console.error("Failed to load saved data from localStorage:", err);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const authRequiredPages: Page[] = ['dashboard', 'profile', 'workout', 'nutrition', 'progress', 'protips', 'research'];
    if (!userProfile && authRequiredPages.includes(currentPage)) {
      setCurrentPage('welcome');
    }
  }, [currentPage, userProfile]);

  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsGenerating(true);
    setError(null);
    setFitnessPlan(null);
    try {
      const plan = await generateFitnessPlan(profile);
      
      const newSavedPlan: SavedPlan = {
        id: new Date().toISOString() + Math.random(), // Add random number for better uniqueness
        name: t.planNameDefault(profile.goal),
        createdAt: new Date().toISOString(),
        profile: profile,
        plan: plan,
      };

      setPlanToSave(newSavedPlan);
      setIsSaveModalOpen(true);
    } catch (err) {
      console.error(err);
      setError(t.generationError);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSavePlanWithName = (name: string) => {
    if (!planToSave) return;

    const planWithCustomName = { ...planToSave, name };

    const updatedSavedPlans = [...savedPlans, planWithCustomName];
    setSavedPlans(updatedSavedPlans);
    localStorage.setItem('savedPlans', JSON.stringify(updatedSavedPlans));

    setUserProfile(planWithCustomName.profile);
    setFitnessPlan(planWithCustomName.plan);
    setCurrentPage('dashboard');
    setIsSaveModalOpen(false);
    setPlanToSave(null);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile, regenerate: boolean) => {
    setUserProfile(updatedProfile);
    // Update profile in the currently active plan if it exists
    const activePlanId = savedPlans.find(p => p.profile === userProfile)?.id;
    if (activePlanId) {
        const updatedPlans = savedPlans.map(p => p.id === activePlanId ? { ...p, profile: updatedProfile } : p);
        setSavedPlans(updatedPlans);
        localStorage.setItem('savedPlans', JSON.stringify(updatedPlans));
    }

    if (regenerate) {
        handleProfileSubmit(updatedProfile);
    }
  };
  
  const handleLoadPlan = (id: string) => {
    const planToLoad = savedPlans.find(p => p.id === id);
    if (planToLoad) {
      setUserProfile(planToLoad.profile);
      setFitnessPlan(planToLoad.plan);
      setCurrentPage('dashboard');
    }
  };

  const handleDeletePlan = (id: string) => {
    const isConfirmed = window.confirm(t.confirmDeletePlan);
    if (!isConfirmed) return;

    const updatedPlans = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updatedPlans);
    localStorage.setItem('savedPlans', JSON.stringify(updatedPlans));
    
    if (updatedPlans.length === 0) {
      handleReset();
    } else {
        const activePlanWasDeleted = !updatedPlans.some(p => p.profile === userProfile && p.plan === fitnessPlan);
        if (activePlanWasDeleted) {
            const latestPlan = updatedPlans[updatedPlans.length - 1];
            setUserProfile(latestPlan.profile);
            setFitnessPlan(latestPlan.plan);
        }
    }
  };

  const handleAddProgress = (newEntry: ProgressEntry) => {
    const otherEntries = progressData.filter(e => e.date !== newEntry.date);
    const updatedProgress = [...otherEntries, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setProgressData(updatedProgress);
    localStorage.setItem('progressData', JSON.stringify(updatedProgress));
  };

  const handleReset = () => {
    setUserProfile(null);
    setFitnessPlan(null);
    setError(null);
    setProgressData([]);
    setSavedPlans([]);
    setCurrentPage('welcome');
    localStorage.clear();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-white dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  const renderMainContent = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <LoadingSpinner />
          <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-4">{t.generatingPlan}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">{t.generatingPlanSubtext}</p>
        </div>
      );
    }

    if (currentPage === 'settings') {
      return <SettingsPage />;
    }

    if (currentPage === 'myplans') {
        return <InfoCard title={t.myPlansPageTitle}><MyPlansPage savedPlans={savedPlans} onLoadPlan={handleLoadPlan} onDeletePlan={handleDeletePlan} /></InfoCard>;
    }

    if (currentPage === 'welcome' || !userProfile || !fitnessPlan) {
      return (
        <>
          <Hero />
          <div className="mt-12">
            {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 text-center" role="alert">{error}</div>}
            <UserProfileForm onSubmit={handleProfileSubmit} />
          </div>

          {currentPage === 'welcome' && savedPlans.length > 0 && (
            <div className="my-16">
              <InfoCard title={t.myPlansPageTitle}>
                <MyPlansPage 
                  savedPlans={savedPlans} 
                  onLoadPlan={handleLoadPlan} 
                  onDeletePlan={handleDeletePlan} 
                />
              </InfoCard>
            </div>
          )}
        </>
      );
    }
    
    const planPages: Page[] = ['dashboard', 'workout', 'nutrition', 'progress', 'protips', 'research'];
    if (planPages.includes(currentPage)) {
        const renderPlanPageContent = () => {
            switch (currentPage) {
              case 'dashboard':
                return <FitnessDashboard plan={fitnessPlan} profile={userProfile} onReset={handleReset} setCurrentPage={setCurrentPage} />;
              case 'workout':
                return <InfoCard title={t.workoutTab}><WorkoutPlan workoutPlan={fitnessPlan.workoutPlan} userProfile={userProfile} /></InfoCard>;
              case 'nutrition':
                return <InfoCard title={t.nutritionTab}><MealPlan mealPlan={fitnessPlan.mealPlan} /></InfoCard>;
              case 'progress':
                return <InfoCard title={t.progressTab}><ProgressTracker data={progressData} onAddEntry={handleAddProgress} /></InfoCard>;
              case 'protips':
                return <InfoCard title={t.protipsTab}><ProTips tips={fitnessPlan.proTips} /></InfoCard>;
              case 'research':
                return <InfoCard title={t.researchTab}><Search /></InfoCard>;
              default:
                return null;
            }
        }
        return (
            <>
                <PlanNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
                <div className="mt-8">{renderPlanPageContent()}</div>
            </>
        )
    }

    switch (currentPage) {
      case 'profile':
        return <ProfilePage userProfile={userProfile} onUpdateProfile={handleProfileUpdate} />;
      default:
        setCurrentPage('dashboard');
        return null;
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isLoggedIn={!!userProfile}
        hasSavedPlans={savedPlans.length > 0}
      />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {renderMainContent()}
        </main>
        <Footer />
      </div>
      
      {planToSave && (
        <SavePlanModal 
          isOpen={isSaveModalOpen}
          defaultName={planToSave.name}
          onSave={handleSavePlanWithName}
          onClose={() => {
            setIsSaveModalOpen(false);
            setPlanToSave(null);
          }}
        />
      )}
    </div>
  );
};

export default App;