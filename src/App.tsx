import React, { useState, useEffect } from 'react';
import { AppState, Transaction } from './types';
import { loadState, saveState, defaultState } from './utils/storage';
import { Dashboard } from './components/Dashboard';
import { Charts } from './components/Charts';
import { SimulateSmsModal } from './components/SimulateSmsModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { Plus, MessageSquare, Settings, PieChart, LayoutDashboard, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'charts'>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  
  // Modals
  const [showSimulateSms, setShowSimulateSms] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setIsLoaded(true);

    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState(state);
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [state, isLoaded]);

  const handleAddTransaction = (t: Transaction) => {
    setState(prev => {
      const existingIndex = prev.transactions.findIndex(tx => tx.id === t.id);
      if (existingIndex >= 0) {
        // Edit existing transaction
        const newTransactions = [...prev.transactions];
        newTransactions[existingIndex] = t;
        return { ...prev, transactions: newTransactions };
      }
      // Add new transaction
      return {
        ...prev,
        transactions: [t, ...prev.transactions]
      };
    });
  };

  const handleEditTransaction = (t: Transaction) => {
    setEditingTransaction(t);
    setShowAddTransaction(true);
  };

  const handleUpdateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncMessage("Requesting READ_SMS permissions...");
    
    // Simulate the permission check and background fetch process
    setTimeout(() => {
      setSyncMessage("Scanning inbox for bank messages...");
      
      setTimeout(() => {
        setIsSyncing(false);
        setSyncMessage(null);
        alert("Background SMS listener is not available in this web environment. Please use 'Simulate SMS' or manually add transactions.");
      }, 1500);
    }, 1000);
  };

  if (!isLoaded) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" isDarkMode={state.isDarkMode} />}
      </AnimatePresence>

      <div className={clsx(
        "min-h-screen font-sans transition-colors duration-200",
        state.isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      )}>
      {/* Header */}
      <header className={clsx(
        "sticky top-0 z-30 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b",
        state.isDarkMode ? "bg-zinc-950/80 border-zinc-800" : "bg-white/80 border-zinc-200"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
            ₹
          </div>
          <h1 className="text-xl font-bold tracking-tight">MoneyFlow</h1>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className={clsx(
              "p-2 rounded-full transition-colors flex items-center gap-2",
              isSyncing ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
            )}
            title="Sync SMS"
          >
            <RefreshCw size={20} className={isSyncing ? "animate-spin text-emerald-500" : ""} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Sync Toast */}
      {syncMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <RefreshCw size={14} className="animate-spin" />
          {syncMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 pb-32">
        {activeTab === 'dashboard' ? (
          <Dashboard state={state} onEditTransaction={handleEditTransaction} />
        ) : (
          <Charts state={state} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={clsx(
        "fixed bottom-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-around border-t backdrop-blur-lg pb-safe",
        state.isDarkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-white/90 border-zinc-200"
      )}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={clsx(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            activeTab === 'dashboard' ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
          )}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Home</span>
        </button>

        <div className="relative -top-6">
          <button 
            onClick={() => {
            setEditingTransaction(null);
            setShowAddTransaction(true);
          }}
            className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-105 transition-all"
          >
            <Plus size={28} />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('charts')}
          className={clsx(
            "flex flex-col items-center gap-1 p-2 transition-colors",
            activeTab === 'charts' ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
          )}
        >
          <PieChart size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Stats</span>
        </button>
      </nav>

      {/* Floating Action Button for SMS Simulation */}
      <button
        onClick={() => setShowSimulateSms(true)}
        className={clsx(
          "fixed bottom-24 right-4 z-40 p-3 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2",
          state.isDarkMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white"
        )}
      >
        <MessageSquare size={20} />
        <span className="text-sm font-medium pr-2">Simulate SMS</span>
      </button>

      {/* Modals */}
      {showSimulateSms && (
        <SimulateSmsModal 
          onClose={() => setShowSimulateSms(false)} 
          onAddTransaction={handleAddTransaction}
          isDarkMode={state.isDarkMode}
        />
      )}
      
      {showAddTransaction && (
        <AddTransactionModal 
          onClose={() => {
            setShowAddTransaction(false);
            setEditingTransaction(null);
          }} 
          onAddTransaction={handleAddTransaction}
          isDarkMode={state.isDarkMode}
          initialData={editingTransaction}
        />
      )}

      {showSettings && (
        <SettingsModal 
          state={state}
          onClose={() => setShowSettings(false)} 
          onUpdateState={handleUpdateState}
        />
      )}
    </div>
    </>
  );
}
