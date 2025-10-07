import React, { useState, useRef } from 'react';
import type { FitnessPlan, UserProfile, Page } from '../types';
import InfoCard from './InfoCard';
import { SettingsIcon, ShareIcon, DownloadIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PrintablePlan from './PrintablePlan';
import { generateExerciseImage } from '../services/geminiService';

interface FitnessDashboardProps {
  plan: FitnessPlan;
  profile: UserProfile;
  onReset: () => void;
  setCurrentPage: (page: Page) => void;
}

interface PrintableData {
    plan: FitnessPlan;
    profile: UserProfile;
    images: { [key: string]: string | null };
}


const FitnessDashboard: React.FC<FitnessDashboardProps> = ({ plan, profile, onReset, setCurrentPage }) => {
  const [showCopied, setShowCopied] = useState(false);
  const { t } = useAppContext();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [printableData, setPrintableData] = useState<PrintableData | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    let shareText = t.shareGenericText(plan.proTips[0]?.title || 'my fitness goal') + `\n\n${window.location.href}`;

    if (navigator.share) {
        try {
            await navigator.share({ title: t.headerTitle, text: shareText });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        });
    }
  };

  const handleDownloadPdf = async () => {
    if (!plan) return;
    setIsGeneratingPdf(true);

    try {
        // Step 1: Fetch all images
        const allExercises = plan.workoutPlan.flatMap(day => day.exercises.map(ex => ex.name));
        // FIX: Explicitly type `uniqueExercises` to prevent it from being inferred as `unknown[]`.
        // This ensures `name` is a string, fixing errors when it's used as a function argument and an object key.
        // FIX: Explicitly typed `uniqueExercises` as `string[]` to resolve the type inference error.
        const uniqueExercises: string[] = [...new Set(allExercises)];
        
        const imagePromises = uniqueExercises.map(name => 
            generateExerciseImage(name).catch(e => {
                console.error(`Failed to generate image for ${name}`, e);
                return null; // Return null on failure
            })
        );
        const imageUrls = await Promise.all(imagePromises);
        
        const exerciseImageMap: { [key: string]: string | null } = {};
        uniqueExercises.forEach((name, index) => {
            exerciseImageMap[name] = imageUrls[index];
        });

        // Step 2: Set the data for the printable component to render
        setPrintableData({
            plan,
            profile,
            images: exerciseImageMap
        });

        // Step 3: Wait for render and generate PDF
        await new Promise(resolve => setTimeout(resolve, 500)); 

        if (!printableRef.current) {
            throw new Error("Printable component reference is missing after render.");
        }
        
        const element = printableRef.current;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff', allowTaint: true });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('ai-fitness-plan.pdf');

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
        setPrintableData(null);
        setIsGeneratingPdf(false);
    }
  };


  const today = new Date().toLocaleString('en-us', {  weekday: 'long' });
  const todaysWorkout = plan.workoutPlan.find(p => p.day.toLowerCase().includes(today.toLowerCase())) || plan.workoutPlan[0];

  return (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t.dashboardTitle}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{t.dashboardSubtitle}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleShare}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold p-2 rounded-lg transition-colors duration-200"
                    aria-label={t.sharePlanButton}
                >
                    <ShareIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={t.downloadPlanButton}
                >
                    {isGeneratingPdf ? (
                        <svg className="animate-spin h-6 w-6 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <DownloadIcon className="w-6 h-6" />
                    )}
                </button>
                 {showCopied && <div className="absolute top-12 right-0 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-md">{t.copied}</div>}
                <button
                    onClick={() => setCurrentPage('settings')}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold p-2 rounded-lg transition-colors duration-200"
                    aria-label={t.settingsButtonLabel}
                >
                    <SettingsIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={onReset}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    {t.newPlanButton}
                </button>
            </div>
        </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InfoCard title={t.dashboardTodayWorkout}>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{todaysWorkout.focus}</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    {todaysWorkout.exercises.slice(0, 4).map((ex, i) => (
                        <li key={i} className="flex justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-900/50">
                            <span>{ex.name}</span>
                            <span className="font-semibold">{ex.sets}x{ex.reps}</span>
                        </li>
                    ))}
                    {todaysWorkout.exercises.length > 4 && <li>...and {todaysWorkout.exercises.length - 4} more.</li>}
                </ul>
                <button onClick={() => setCurrentPage('workout')} className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all">
                    {t.dashboardViewFullPlan}
                </button>
            </div>
        </InfoCard>

        <InfoCard title={t.dashboardTodayNutrition}>
            <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{plan.mealPlan.totalCalories}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.calories}</p>
                    </div>
                     <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{plan.mealPlan.totalProtein}g</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.protein}</p>
                    </div>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-900/50"><span>{t.breakfast}:</span> <span className="font-semibold">{plan.mealPlan.breakfast.name}</span></li>
                    <li className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-900/50"><span>{t.lunch}:</span> <span className="font-semibold">{plan.mealPlan.lunch.name}</span></li>
                    <li className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-900/50"><span>{t.dinner}:</span> <span className="font-semibold">{plan.mealPlan.dinner.name}</span></li>
                </ul>
                 <button onClick={() => setCurrentPage('nutrition')} className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all">
                    {t.dashboardViewFullPlan}
                </button>
            </div>
        </InfoCard>
      </div>

      {/* Hidden printable component */}
      {printableData && (
        <div className="absolute -left-[9999px] top-auto w-[210mm] h-auto" aria-hidden="true">
            <div ref={printableRef}>
                <PrintablePlan
                    plan={printableData.plan}
                    profile={printableData.profile}
                    images={printableData.images}
                    t={t}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default FitnessDashboard;
