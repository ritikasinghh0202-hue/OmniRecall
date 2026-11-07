import React, { useState } from 'react';
import { SupportProvider, useSupport } from './context/SupportContext';
import { Header } from './components/Header';
import { LinkedInBanner } from './components/LinkedInBanner';
import { LeftSidebar } from './components/LeftSidebar';
import { ChatPanel } from './components/ChatPanel';
import { MemoryInspectorPanel } from './components/MemoryInspectorPanel';
import { PromptInspectorModal } from './components/PromptInspectorModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SplitComparisonModal } from './components/SplitComparisonModal';
import { ToastContainer } from './components/ToastContainer';
import { Users, MessageSquare, Cpu } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat' | 'memory'>('chat');
  const { activePersona } = useSupport();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      <Header />
      <LinkedInBanner />

      {/* Mobile Tab Navigation (visible only on small screens) */}
      <div className="flex lg:hidden bg-slate-900 border-b border-slate-800 p-1 shrink-0 justify-around text-xs">
        <button
          onClick={() => setMobileView('sidebar')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 font-medium transition-all ${
            mobileView === 'sidebar'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Customers</span>
        </button>

        <button
          onClick={() => setMobileView('chat')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 font-medium transition-all ${
            mobileView === 'chat'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat ({activePersona.initials})</span>
        </button>

        <button
          onClick={() => setMobileView('memory')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 font-medium transition-all ${
            mobileView === 'memory'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Memory Graph</span>
        </button>
      </div>

      {/* Main 3-Column Enterprise Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left Column: Customer Switcher & Mode Toggle */}
        <div
          className={`${
            mobileView === 'sidebar' ? 'block' : 'hidden'
          } lg:block h-full shrink-0 z-20 w-full lg:w-80`}
        >
          <LeftSidebar />
        </div>

        {/* Center Column: Interactive Support Chat Interface */}
        <div
          className={`${
            mobileView === 'chat' ? 'flex' : 'hidden'
          } lg:flex flex-1 h-full min-w-0`}
        >
          <ChatPanel />
        </div>

        {/* Right Column: Live Memory Graph & Context Inspector */}
        <div
          className={`${
            mobileView === 'memory' ? 'block' : 'hidden'
          } lg:block h-full shrink-0 z-20 w-full lg:w-96`}
        >
          <MemoryInspectorPanel />
        </div>
      </div>

      {/* Modals & Toasts */}
      <SplitComparisonModal />
      <PromptInspectorModal />
      <NewCustomerModal />
      <ApiKeyModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SupportProvider>
      <DashboardContent />
    </SupportProvider>
  );
}
