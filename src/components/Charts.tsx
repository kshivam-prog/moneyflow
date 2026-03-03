import React, { useMemo } from 'react';
import { AppState } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { clsx } from 'clsx';

interface ChartsProps {
  state: AppState;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export function Charts({ state }: ChartsProps) {
  const categoryData = useMemo(() => {
    const expenses = state.transactions.filter(t => t.type === 'debit');
    const grouped = expenses.reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [state.transactions]);

  if (categoryData.length === 0) {
    return (
      <div className="text-center py-10 opacity-50">
        No expense data available for charts.
      </div>
    );
  }

  return (
    <div className={clsx(
      "rounded-3xl p-6 shadow-sm",
      state.isDarkMode ? "bg-zinc-800" : "bg-white"
    )}>
      <h2 className={clsx("text-lg font-bold mb-4", state.isDarkMode ? "text-zinc-200" : "text-zinc-800")}>
        Expense Breakdown
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
