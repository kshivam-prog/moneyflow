import React, { useState } from 'react';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { X, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface AddTransactionModalProps {
  onClose: () => void;
  onAddTransaction: (t: Transaction) => void;
  isDarkMode: boolean;
  initialData?: Transaction | null;
}

export function AddTransactionModal({ onClose, onAddTransaction, isDarkMode, initialData }: AddTransactionModalProps) {
  const [type, setType] = useState<'credit' | 'debit'>(initialData?.type || 'debit');
  const [amount, setAmount] = useState(initialData ? initialData.amount.toString() : '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Other');

  const categories = ['Food', 'Travel', 'Shopping', 'Utilities', 'Transfer', 'Salary', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onAddTransaction({
      id: initialData ? initialData.id : uuidv4(),
      type,
      amount: Number(amount),
      description: description || 'Manual Entry',
      date: initialData ? initialData.date : new Date().toISOString(),
      category
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={clsx(
        "w-full max-w-md rounded-3xl p-6 shadow-2xl",
        isDarkMode ? "bg-zinc-900 text-zinc-200" : "bg-white text-zinc-900"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PlusCircle size={24} className="text-emerald-500" />
            {initialData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setType('debit')}
              className={clsx(
                "flex-1 py-3 rounded-xl font-semibold transition-all border-2",
                type === 'debit' 
                  ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" 
                  : "border-transparent bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('credit')}
              className={clsx(
                "flex-1 py-3 rounded-xl font-semibold transition-all border-2",
                type === 'credit' 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                  : "border-transparent bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              )}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Amount (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={clsx(
                "w-full p-4 rounded-xl border text-lg font-semibold focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
              )}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={clsx(
                "w-full p-4 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
              )}
              placeholder="e.g. Groceries, Salary, Rent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={clsx(
                "w-full p-4 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
              )}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg transition-colors"
          >
            {initialData ? 'Save Changes' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
