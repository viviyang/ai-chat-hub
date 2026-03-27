import React from 'react';
import { ChatUI, AgentAdapter, ChatPlugin, ChatMessage } from '@ai-chat-hub/chat-ui';

// Mock Adapter matching AgentAdapter
const mockAdapter: AgentAdapter = {
  sendMessage: async (messages, updateMessage) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    // Determine mock response
    const lastMsg = messages[messages.length - 1].content;
    let mockResponse = `I received: "${lastMsg}". Here is a standard markdown response:\n\n- Item 1\n- Item 2\n\nAnd here is some bold **text**.`;

    if (lastMsg.toLowerCase().includes('chart')) {
      mockResponse = `I generated a chart for you based on our data: [CHART]`;
    }

    // Simple Streaming simulation
    const chunks = mockResponse.split(/(?=[ \n])/);
    let accumulated = '';
    for (const chunk of chunks) {
      accumulated += chunk;
      updateMessage(accumulated);
      await new Promise(r => setTimeout(r, 30));
    }
  }
};

// Mock Plugin
const MockChartPlugin: ChatPlugin = {
  name: 'mock-chart',
  renderMessage: (msg: ChatMessage) => {
    if (msg.content.includes('[CHART]')) {
      return (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg space-y-3 w-full max-w-sm">
          <h3 className="font-bold border-b border-white/20 pb-2 sticky top-0">Daily Active Users</h3>
          <div className="h-32 bg-white/10 rounded-sm flex flex-row items-end p-2 gap-2">
            <div className="flex-1 bg-white/30 h-1/3 rounded-t hover:bg-white/40 transition-colors"></div>
            <div className="flex-1 bg-white/50 h-2/3 rounded-t hover:bg-white/60 transition-colors"></div>
            <div className="flex-1 bg-white/70 h-full rounded-t hover:bg-white/80 transition-colors"></div>
            <div className="flex-1 bg-white/90 h-1/2 rounded-t hover:bg-white transition-colors"></div>
          </div>
          <p className="text-xs opacity-80 pt-1">Custom Plugin intercepting [CHART] token</p>
        </div>
      );
    }
    return null;
  }
}

export function App() {
  return (
    <div className="h-screen w-full flex bg-gray-50 flex-col font-sans">
      <header className="px-6 py-4 bg-white shadow-sm shrink-0 border-b border-gray-100 z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>❖</span> AI Chat Hub
        </h1>
        <span className="text-sm text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">v1.0 Demo</span>
      </header>
      <main className="flex-1 overflow-hidden relative">
        <ChatUI 
          adapter={mockAdapter} 
          plugins={[MockChartPlugin]} 
          systemMessage="Welcome to AI Chat Hub! Try typing something with the word 'chart' to see the mock plugin intercept and render a dynamic component."
          className="h-full w-full"
        />
      </main>
    </div>
  );
}

export default App;
