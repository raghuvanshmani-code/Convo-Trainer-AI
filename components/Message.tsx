
import React from 'react';
import { Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

const LoadingDots: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLoading = false }) => {
  const isUser = message.sender === 'user';

  const wrapperClasses = `flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
    isUser
      ? 'bg-indigo-600 text-white rounded-br-lg'
      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-lg'
  }`;
   const Icon = isUser ? UserIcon : BotIcon;
   const iconClasses = `w-8 h-8 rounded-full p-1.5 flex-shrink-0 ${
       isUser ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300' : 'bg-indigo-200 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
   }`

  return (
    <div className={wrapperClasses}>
      {!isUser && <Icon className={iconClasses} />}
      <div className={bubbleClasses} style={{ whiteSpace: 'pre-wrap' }}>
        {isLoading ? <LoadingDots /> : message.text}
      </div>
      {isUser && <Icon className={iconClasses} />}
    </div>
  );
};

export default MessageBubble;
