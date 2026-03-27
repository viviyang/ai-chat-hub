import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { cn } from '../utils/cn';

export interface SenderProps {
  onSend: (value: string) => void;
  isLoading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function Sender({
  onSend,
  isLoading,
  prefix,
  suffix,
  placeholder = 'Type a message...',
  className,
}: SenderProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm', className)}>
      <div className="flex items-end gap-2">
        {prefix && <div className="flex-shrink-0">{prefix}</div>}
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-[200px] border-none shadow-none focus-visible:ring-0 px-0 py-1.5"
          rows={1}
        />
        {suffix && <div className="flex-shrink-0">{suffix}</div>}
        <Button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="h-9 w-9 p-0 flex-shrink-0 rounded-full"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
