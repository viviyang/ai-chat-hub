import React from 'react';

// Core model
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
  // Allows attaching plugin-specific extensions
  [key: string]: any;
}

// Adapter interface connecting to the AI agent
export interface AgentAdapter {
  sendMessage: (messages: ChatMessage[], updateMessage: (delta: string) => void) => Promise<void>;
  abort?: () => void;
}

// Plugin system definition
export interface ChatPlugin {
  name: string;
  // If renderMessage returns a ReactNode, the default Markdown renderer is skipped
  renderMessage?: (msg: ChatMessage) => React.ReactNode | null | undefined;
  renderThoughtChain?: (msg: ChatMessage) => React.ReactNode | null | undefined;
}

// Main Chat UI properties
export interface ChatUIProps {
  adapter: AgentAdapter;
  plugins?: ChatPlugin[];
  className?: string;
  systemMessage?: string;
}
