import React, { useState } from 'react';
import type { ProgressEntry } from '../types';
import WeightChart from './WeightChart';
import { useAppContext } from '../contexts/AppContext';

interface ProgressTrackerProps {
  data: ProgressEntry[];
  onAddEntry: (entry: ProgressEntry) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ data, onAddEntry }) => {
  const { t } = useAppContext();
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: today,
    weight: '',
    waist: '',
    chest: '',
    hips: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.weight) {
        alert("Please enter at least a date and weight.");
        return;
    }
    const newEntry: ProgressEntry = {
        date: formData.date,
        weight: parseFloat(formData.weight),
        ...(formData.waist && { waist: parseFloat(formData.waist) }),
        ...(formData.chest && { chest: parseFloat(formData.chest) }),
        ...(formData.hips && { hips: parseFloat(formData.hips) }),
    };
    onAddEntry(newEntry);
    setFormData({
        date: today,
        weight: '',
        waist: '',
        chest: '',
        hips: '',
    });
  };

  const handleCopyLatest = () => {
    if (data.length === 0) return;
    const latestEntry = data[data.length - 1];
    setFormData({
      date: today,
      weight: latestEntry.weight.toString(),
      waist: latestEntry.waist?.toString() || '',
      chest: latestEntry.chest?.toString() || '',
      hips: latestEntry.hips?.toString() || '',
    });
  };

  const inputClasses = "w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm";
  const labelClasses = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

  const sortedData = [...data].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const weightChange = data.length >= 2 ? data[data.length - 1].weight - data[0].weight : 0;
  const changeColor = weightChange < 0 ? 'text-green-500 dark:text-green-400' : weightChange > 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';


  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.logNewEntry}</h3>
              {data.length > 0 && (
                <button onClick={handleCopyLatest} className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-cyan-600 dark:text-cyan-400 font-semibold py-1 px-2 rounded-md transition-colors">
                  {t.copyLatest}
                </button>
              )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label htmlFor="date" className={labelClasses}>{t.date}</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses} required />
              </div>
              <div>
                  <label htmlFor="weight" className={labelClasses}>{t.weightLabel}</label>
                  <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} required step="0.1" placeholder="e.g., 75.5" />
              </div>
              <div>
                  <label htmlFor="waist" className={labelClasses}>{t.waist}</label>
                  <input type="number" id="waist" name="waist" value={formData.waist} onChange={handleChange} className={inputClasses} step="0.1" placeholder="e.g., 80" />
              </div>
              <div>
                  <label htmlFor="chest" className={labelClasses}>{t.chest}</label>
                  <input type="number" id="chest" name="chest" value={formData.chest} onChange={handleChange} className={inputClasses} step="0.1" placeholder="e.g., 102" />
              </div>
               <div>
                  <label htmlFor="hips" className={labelClasses}>{t.hips}</label>
                  <input type="number" id="hips" name="hips" value={formData.hips} onChange={handleChange} className={inputClasses} step="0.1" placeholder="e.g., 95" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-md transition transform hover:scale-105">
                  {t.saveEntry}
              </button>
          </form>
      </div>
      <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.weightHistory}</h3>
              {data.length >= 2 && (
                  <div className="text-right rtl:text-left">
                      <span className={`text-lg font-semibold ${changeColor}`}>
                          {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalChange}</p>
                  </div>
              )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-64">
              <WeightChart data={data} />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{t.logbook}</h3>
          <div className="max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-300">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 sticky top-0 backdrop-blur-sm">
                      <tr>
                          <th scope="col" className="px-6 py-3">{t.date}</th>
                          <th scope="col" className="px-6 py-3">{t.weightLabel}</th>
                          <th scope="col" className="px-6 py-3 hidden sm:table-cell">{t.waist}</th>
                          <th scope="col" className="px-6 py-3 hidden sm:table-cell">{t.chest}</th>
                          <th scope="col" className="px-6 py-3 hidden sm:table-cell">{t.hips}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {sortedData.length > 0 ? sortedData.map(entry => (
                          <tr key={entry.date} className="border-b border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{entry.date}</td>
                              <td className="px-6 py-4 font-bold text-cyan-600 dark:text-cyan-400">{entry.weight.toFixed(1)}</td>
                              <td className="px-6 py-4 hidden sm:table-cell">{entry.waist || '–'}</td>
                              <td className="px-6 py-4 hidden sm:table-cell">{entry.chest || '–'}</td>
                              <td className="px-6 py-4 hidden sm:table-cell">{entry.hips || '–'}</td>
                          </tr>
                      )) : (
                          <tr>
                              <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-500">{t.noEntries}</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default ProgressTracker;