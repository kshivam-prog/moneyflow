import React, { useState } from 'react';
import { AppState } from '../types';
import { exportToCSV } from '../utils/storage';
import { X, Settings, Download, Trash2, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';

interface SettingsModalProps {
  state: AppState;
  onClose: () => void;
  onUpdateState: (updates: Partial<AppState>) => void;
}

export function SettingsModal({ state, onClose, onUpdateState }: SettingsModalProps) {
  const [initialBalance, setInitialBalance] = useState(state.initialBalance.toString());

  const handleSaveBalance = () => {
    const val = parseFloat(initialBalance);
    if (!isNaN(val)) {
      onUpdateState({ initialBalance: val });
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all transactions? This cannot be undone.")) {
      onUpdateState({ transactions: [] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={clsx(
        "w-full max-w-md rounded-3xl p-6 shadow-2xl",
        state.isDarkMode ? "bg-zinc-900 text-zinc-200" : "bg-white text-zinc-900"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings size={24} className="text-emerald-500" />
            Settings
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              {state.isDarkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500" />}
              <span className="font-medium">Dark Mode</span>
            </div>
            <button 
              onClick={() => onUpdateState({ isDarkMode: !state.isDarkMode })}
              className={clsx(
                "w-12 h-6 rounded-full transition-colors relative",
                state.isDarkMode ? "bg-emerald-500" : "bg-zinc-300"
              )}
            >
              <div className={clsx(
                "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform",
                state.isDarkMode ? "translate-x-7" : "translate-x-1"
              )} />
            </button>
          </div>

          {/* Initial Balance */}
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Starting Balance (₹)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className={clsx(
                  "flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                  state.isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
                )}
              />
              <button 
                onClick={handleSaveBalance}
                className="px-4 py-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={() => exportToCSV(state.transactions)}
            className={clsx(
              "w-full flex items-center justify-center gap-2 p-4 rounded-xl border font-medium transition-colors",
              state.isDarkMode 
                ? "border-zinc-700 hover:bg-zinc-800 text-zinc-300" 
                : "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
            )}
          >
            <Download size={18} />
            Export to CSV
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 font-medium transition-colors"
          >
            <Trash2 size={18} />
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}
