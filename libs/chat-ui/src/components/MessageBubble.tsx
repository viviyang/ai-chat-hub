import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';
import { ChatMessage, ChatPlugin } from '../types';
import { cn } from '../utils/cn';

export interface MessageBubbleProps {
  message: ChatMessage;
  plugins?: ChatPlugin[];
}

export function MessageBubble({ message, plugins = [] }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  const renderContent = () => {
    // 1. Give plugins a chance to intercept and render custom UI
    for (const plugin of plugins) {
      if (plugin.renderMessage) {
        const customRender = plugin.renderMessage(message);
        if (customRender) return customRender;
      }
    }

    // 2. Fallback to default Markdown rendering
    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        className="prose prose-sm max-w-none break-words"
      >
        {message.content}
      </ReactMarkdown>
    );
  };

  const renderThoughtChain = () => {
    // Render thought chain via plugins if they provide it
    for (const plugin of plugins) {
      if (plugin.renderThoughtChain) {
        const thoughtChainRender = plugin.renderThoughtChain(message);
        if (thoughtChainRender) return thoughtChainRender;
      }
    }
    return null;
  };

  return (
    <div className={cn('flex w-full gap-4 py-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn('flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full', isUser ? 'bg-black text-white' : 'bg-gray-100 text-gray-700')}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={cn('flex flex-col gap-2 max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
        {renderThoughtChain()}
        <div className={cn('rounded-2xl px-4 py-3', isUser ? 'bg-gray-100 text-gray-900' : 'bg-white border border-gray-200 shadow-sm')}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
