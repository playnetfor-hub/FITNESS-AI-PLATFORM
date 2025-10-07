import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateExerciseImage } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';

interface ExerciseImageProps {
  exerciseName: string;
  staggerIndex?: number;
}

const ImagePlaceholder: React.FC = () => (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden relative">
        <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/30 dark:via-gray-600/30 to-transparent"></div>
        </div>
        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
        </svg>
    </div>
);


const ExerciseImage: React.FC<ExerciseImageProps> = ({ exerciseName, staggerIndex }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStartedFetch, setHasStartedFetch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const { t } = useAppContext();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchImage = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    const maxRetries = 4;
    const baseDelay = 2000; // ms

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const url = await generateExerciseImage(exerciseName);
        if (isMountedRef.current) {
          setImageUrl(url);
          setIsLoading(false);
        }
        return; // Success
      } catch (err: any) {
        console.error(`Image generation attempt ${attempt + 1} failed for ${exerciseName}:`, err);
        
        const errorMessage = typeof err?.message === 'string' ? err.message : JSON.stringify(err);
        const isRateLimitError = errorMessage.includes('"code":429') || errorMessage.includes('RESOURCE_EXHAUSTED');

        if (isRateLimitError && attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          console.log(`Rate limit hit for ${exerciseName}. Retrying in ${delay.toFixed(0)}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          // Continue to next loop iteration for retry
        } else {
          // Not a rate limit error, or max retries reached.
          if (isMountedRef.current) {
            setError(t.imageError);
            setIsLoading(false);
          }
          return; // Final failure
        }
      }
    }
  }, [exerciseName, t]);

  useEffect(() => {
    if (hasStartedFetch || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStartedFetch(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading images 100px before they enter the viewport
        threshold: 0.01,
      }
    );
    
    const currentRef = containerRef.current;
    if (currentRef) {
        observer.observe(currentRef);
    }
    
    return () => {
      if(currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasStartedFetch]);

  useEffect(() => {
    // Only trigger the initial fetch automatically if there isn't already an image or a persistent error.
    if (hasStartedFetch && !imageUrl && !error) {
      const staggerDelay = (staggerIndex ?? 0) * 500; // 500ms delay per image in the list
      const timeoutId = setTimeout(() => {
        fetchImage();
      }, staggerDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [exerciseName, hasStartedFetch, fetchImage, imageUrl, error, staggerIndex]);

  let content;
  if (error) {
    content = (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex flex-col items-center justify-center text-center p-2" title={error}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">{error}</p>
          <button 
            onClick={fetchImage}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1 px-3 rounded-md text-xs transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? t.retrying : t.retry}
          </button>
      </div>
    );
  } else if (imageUrl) {
    content = (
      <img
        src={imageUrl}
        alt={`Demonstration of ${exerciseName}`}
        className="w-full h-full object-cover rounded-md"
      />
    );
  } else {
    // This state covers both before fetching starts and during loading.
    content = <ImagePlaceholder />;
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      {content}
    </div>
  );
};

export default ExerciseImage;