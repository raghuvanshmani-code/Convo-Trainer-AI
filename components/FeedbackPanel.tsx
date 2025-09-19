
import React from 'react';
import { Analysis } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface FeedbackPanelProps {
  analysis: Analysis | null;
  isLoading: boolean;
}

const FeedbackItem: React.FC<{ title: string; items: string[]; icon: string; color: string }> = ({ title, items, icon, color }) => (
    <div>
        <h3 className={`flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200`}>
            <span className={`mr-2 ${color}`}>{icon}</span>
            {title}
        </h3>
        <ul className="mt-2 ml-2 list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
);


const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ analysis, isLoading }) => {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center mb-6">
        <SparklesIcon className="w-7 h-7 text-indigo-500" />
        <h2 className="text-2xl font-bold ml-3">Feedback Coach</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {isLoading && !analysis && (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-lg">Waiting for your first message...</p>
            </div>
        )}

        {!isLoading && !analysis && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                 <SparklesIcon className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"/>
                <p className="text-lg">Your feedback will appear here after you send a message.</p>
            </div>
        )}
        
        {analysis && (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary</h3>
                    <p className={`mt-1 text-xl font-semibold italic ${isLoading ? 'text-gray-400 dark:text-gray-500 animate-pulse' : 'text-gray-800 dark:text-gray-200'}`}>
                       "{analysis.summary}"
                    </p>
                </div>

                <div className="space-y-6">
                    <FeedbackItem title="Positives" items={analysis.positives} icon="👍" color="text-green-500" />
                    <FeedbackItem title="Improvements" items={analysis.improvements} icon="💡" color="text-yellow-500" />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;
