import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SaveIcon } from '../constants';
import { useAppContext } from '../contexts/AppContext';

interface SavePlanModalProps {
  isOpen: boolean;
  defaultName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

const SavePlanModal: React.FC<SavePlanModalProps> = ({ isOpen, defaultName, onSave, onClose }) => {
  const [name, setName] = useState(defaultName);
  const { t } = useAppContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      // Focus the input field when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultName]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
        onSave(name.trim());
    }
  };

  if (!isOpen) return null;

  const inputClasses = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition";
  const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2";

  return (
    <div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
        aria-labelledby="save-plan-modal-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 id="save-plan-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">{t.savePlanModalTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label={t.cancel}>
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <label htmlFor="planName" className={labelClasses}>{t.planNameLabel}</label>
                <input 
                    ref={inputRef}
                    type="text" 
                    id="planName" 
                    name="planName" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className={inputClasses} 
                    required 
                />
            </div>

            <div className="flex items-center justify-end gap-3 p-5 mt-auto bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <button 
                    type="button"
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {t.cancel}
                </button>
                <button 
                    type="submit"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    <SaveIcon className="w-5 h-5" />
                    <span>{t.savePlanButton}</span>
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default SavePlanModal;