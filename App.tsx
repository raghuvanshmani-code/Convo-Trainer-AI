
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Analysis, Scenario } from './types';
import { getAiResponse, getSessionSummary } from './services/geminiService';
import ScenarioSetup from './components/ScenarioSetup';
import ChatWindow from './components/ChatWindow';
import FeedbackPanel from './components/FeedbackPanel';
import { BotIcon } from './components/icons/BotIcon';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const handleStartScenario = (selectedScenario: Scenario) => {
    setScenario(selectedScenario);
    setMessages([
      {
        sender: 'ai',
        text: `Scenario started. Role: ${selectedScenario.role}, Mode: ${selectedScenario.mode}. You can start the conversation.`,
      },
    ]);
    setAnalysis(null);
    setError(null);
    setSessionEnded(false);
  };
  
  const handleNewScenario = () => {
      setScenario(null);
      setMessages([]);
      setAnalysis(null);
      setError(null);
      setSessionEnded(false);
  }

  const handleSendMessage = useCallback(async (text: string) => {
    if (!scenario || isLoading) return;

    const userMessage: Message = { sender: 'user', text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);
    setAnalysis(prev => prev ? {...prev, summary: "Analyzing..."} : null);


    try {
        if (text.trim().toUpperCase() === 'END SESSION') {
            const summaryText = await getSessionSummary(newMessages);
            const summaryMessage: Message = { sender: 'ai', text: summaryText };
            setMessages(prev => [...prev, summaryMessage]);
            setSessionEnded(true);
        } else if (text.trim().toUpperCase() === 'NEW SCENARIO') {
            handleNewScenario();
        } else {
            const response = await getAiResponse(newMessages, scenario);
            const aiMessage: Message = { sender: 'ai', text: response.reply };
            setMessages(prev => [...prev, aiMessage]);
            if (response.analysis.trigger) {
                setAnalysis(response.analysis);
            } else {
                setAnalysis(null);
            }
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        const aiErrorMessage: Message = { sender: 'ai', text: `Sorry, I encountered an error: ${errorMessage}` };
        setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
        setIsLoading(false);
    }
  }, [scenario, messages, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <BotIcon className="w-8 h-8 text-indigo-500" />
        <h1 className="text-2xl font-bold ml-3 tracking-tight">Convo Trainer AI</h1>
        {scenario && (
            <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Scenario</p>
                    <p className="font-semibold">{scenario.role} - {scenario.mode}</p>
                </div>
                 <button 
                    onClick={handleNewScenario}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    New Scenario
                </button>
            </div>
        )}
      </header>
      
      {!scenario ? (
        <ScenarioSetup onStart={handleStartScenario} />
      ) : (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
          <div className="lg:col-span-2 flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <ChatWindow 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage}
              sessionEnded={sessionEnded}
            />
          </div>
          <div className="hidden lg:flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <FeedbackPanel analysis={analysis} isLoading={isLoading} />
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
