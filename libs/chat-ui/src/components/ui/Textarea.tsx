import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = true, onChange, ...props }, ref) => {
    const defaultRef = React.useRef<HTMLTextAreaElement>(null);
    const resolvedRef = (ref as React.MutableRefObject<HTMLTextAreaElement>) || defaultRef;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize && resolvedRef.current) {
        resolvedRef.current.style.height = 'auto';
        resolvedRef.current.style.height = `${resolvedRef.current.scrollHeight}px`;
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <textarea
        className={cn(
          'flex min-h-[40px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none',
          className
        )}
        ref={resolvedRef}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
