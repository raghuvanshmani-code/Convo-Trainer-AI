
import React, { useState } from 'react';
import { Scenario } from '../types';
import { ROLES, MODES } from '../constants';

interface ScenarioSetupProps {
  onStart: (scenario: Scenario) => void;
}

const ScenarioCard: React.FC<{option: {name: string, description: string}, isSelected: boolean, onSelect: () => void}> = ({ option, isSelected, onSelect }) => (
    <div
        onClick={onSelect}
        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 ring-2 ring-indigo-500' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-gray-700/50'
        }`}
    >
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{option.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
    </div>
);


const ScenarioSetup: React.FC<ScenarioSetupProps> = ({ onStart }) => {
  const [role, setRole] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);

  const handleSubmit = () => {
    if (role && mode) {
      onStart({ role, mode });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Your Scenario</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Choose a role for the AI and a conversation mode to begin your training.
          </p>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Choose a Role</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ROLES.map(r => (
                        <ScenarioCard key={r.name} option={r} isSelected={role === r.name} onSelect={() => setRole(r.name)} />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Choose a Mode</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {MODES.map(m => (
                        <ScenarioCard key={m.name} option={m} isSelected={mode === m.name} onSelect={() => setMode(m.name)} />
                    ))}
                </div>
            </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={!role || !mode}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform active:scale-95"
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSetup;
