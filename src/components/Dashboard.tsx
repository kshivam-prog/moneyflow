import React, { useMemo } from 'react';
import { AppState } from '../types';
import { ArrowDownRight, ArrowUpRight, IndianRupee, Wallet, Pencil } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { clsx } from 'clsx';

interface DashboardProps {
  state: AppState;
  onEditTransaction: (t: Transaction) => void;
}

export function Dashboard({ state, onEditTransaction }: DashboardProps) {
  const currentBalance = useMemo(() => {
    return state.transactions.reduce((acc, t) => {
      return t.type === 'credit' ? acc + t.amount : acc - t.amount;
    }, state.initialBalance);
  }, [state.transactions, state.initialBalance]);

  const todaySpent = useMemo(() => {
    return state.transactions
      .filter(t => t.type === 'debit' && isToday(new Date(t.date)))
      .reduce((acc, t) => acc + t.amount, 0);
  }, [state.transactions]);

  const groupedTransactions = useMemo(() => {
    const groups: { title: string; data: typeof state.transactions }[] = [
      { title: 'Today', data: [] },
      { title: 'Yesterday', data: [] },
      { title: 'This Week', data: [] },
      { title: 'Older', data: [] },
    ];

    const sorted = [...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sorted.forEach(t => {
      const date = new Date(t.date);
      if (isToday(date)) groups[0].data.push(t);
      else if (isYesterday(date)) groups[1].data.push(t);
      else if (isThisWeek(date)) groups[2].data.push(t);
      else groups[3].data.push(t);
    });

    return groups.filter(g => g.data.length > 0);
  }, [state.transactions]);

  return (
    <div className="flex flex-col gap-6">
      {/* Balance Card */}
      <div className={clsx(
        "rounded-3xl p-6 shadow-lg",
        state.isDarkMode ? "bg-zinc-800 text-white" : "bg-emerald-600 text-white"
      )}>
        <div className="flex items-center gap-2 opacity-80 mb-2">
          <Wallet size={20} />
          <span className="text-sm font-medium uppercase tracking-wider">Current Balance</span>
        </div>
        <div className="text-4xl font-bold flex items-center gap-1">
          <IndianRupee size={32} />
          {currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
          <div>
            <div className="text-xs opacity-80">Today's Spends</div>
            <div className="font-semibold flex items-center">
              <IndianRupee size={14} />
              {todaySpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1">
        <h2 className={clsx("text-lg font-bold mb-4", state.isDarkMode ? "text-zinc-200" : "text-zinc-800")}>
          Recent Transactions
        </h2>
        
        {groupedTransactions.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            No transactions yet. Add one manually or simulate an SMS.
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTransactions.map(group => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.data.map(t => (
                    <div key={t.id} className={clsx(
                      "flex items-center justify-between p-4 rounded-2xl",
                      state.isDarkMode ? "bg-zinc-800" : "bg-white shadow-sm"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          t.type === 'credit' 
                            ? "bg-emerald-100 text-emerald-600" 
                            : "bg-rose-100 text-rose-600"
                        )}>
                          {t.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p className={clsx("font-medium", state.isDarkMode ? "text-zinc-200" : "text-zinc-900")}>
                            {t.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                            <span>{format(new Date(t.date), 'h:mm a')}</span>
                            {t.category && (
                              <>
                                <span>•</span>
                                <span>{t.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                          "font-semibold flex items-center",
                          t.type === 'credit' ? "text-emerald-600" : "text-zinc-900 dark:text-zinc-200"
                        )}>
                          {t.type === 'credit' ? '+' : '-'}
                          <IndianRupee size={14} />
                          {t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <button 
                          onClick={() => onEditTransaction(t)}
                          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-emerald-500"
                          title="Edit transaction"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
