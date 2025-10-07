import React, { useState } from 'react';
import { searchFitnessInfo } from '../services/geminiService';
import type { SearchResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useAppContext } from '../contexts/AppContext';

const exampleQueriesEn = [
    "How much protein do I need to build muscle?",
    "Is creatine safe to take daily?",
    "Best exercises for lower back pain",
    "Benefits of HIIT vs steady-state cardio",
];

const exampleQueriesAr = [
    "كم أحتاج من البروتين لبناء العضلات؟",
    "هل الكرياتين آمن للاستخدام اليومي؟",
    "أفضل التمارين لآلام أسفل الظهر",
    "فوائد HIIT مقابل الكارديو الثابت",
];

const Search: React.FC = () => {
  const { t, language } = useAppContext();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exampleQueries = language === 'ar' ? exampleQueriesAr : exampleQueriesEn;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await searchFitnessInfo(query);
      setResult(searchResult);
    } catch (err) {
      setError(t.searchError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t.researchSubtitle}
      </p>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.researchPlaceholder}
          className="flex-grow bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : t.searchButton}
        </button>
      </form>
      
      {isLoading && <div className="flex justify-center"><LoadingSpinner /></div>}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
      
      {!result && !isLoading && (
        <div className="mt-4">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{t.tryExample}</p>
            <div className="flex flex-wrap gap-2">
                {exampleQueries.map(q => (
                    <button 
                        key={q} 
                        onClick={() => setQuery(q)}
                        className="text-xs bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full transition-colors"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{t.answer}</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.answer}</p>
          </div>

          {result.sources && result.sources.length > 0 && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{t.sources}</h3>
              <ul className="space-y-2 list-disc list-inside">
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Search;