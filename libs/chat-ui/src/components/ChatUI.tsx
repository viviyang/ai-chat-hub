import React, { useState, useRef, useEffect } from 'react';
import { ChatUIProps, ChatMessage } from '../types';
import { Sender } from './Sender';
import { MessageBubble } from './MessageBubble';
import { cn } from '../utils/cn';

export function ChatUI({ adapter, plugins = [], className, systemMessage }: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(systemMessage ? [{
    id: 'system',
    role: 'system',
    content: systemMessage,
    createdAt: new Date(),
  }] : []);
  
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '', // initial empty
      createdAt: new Date(),
    }]);

    try {
      await adapter.sendMessage(newMessages, (delta: string) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === assistantId) {
            return { ...msg, content: msg.content + delta };
          }
          return msg;
        }));
      });
    } catch (e) {
      console.error(e);
      // basic error handling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-white relative', className)}>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.filter(m => m.role !== 'system').map(msg => (
            <MessageBubble key={msg.id} message={msg} plugins={plugins} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md px-4 py-4 border-t border-gray-100">
        <div className="mx-auto max-w-3xl">
          <Sender onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
