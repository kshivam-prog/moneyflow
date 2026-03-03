import { AppState, Transaction } from '../types';

const STORAGE_KEY = 'moneyflow_state';

export const defaultState: AppState = {
  initialBalance: 0,
  transactions: [],
  isDarkMode: false,
  pin: null,
};

export function loadState(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load state', error);
  }
  return defaultState;
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state', error);
  }
}

export function exportToCSV(transactions: Transaction[]) {
  const headers = ['Date', 'Type', 'Amount', 'Description', 'Category'];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleString(),
    t.type,
    t.amount.toString(),
    `"${t.description.replace(/"/g, '""')}"`,
    `"${(t.category || 'Other').replace(/"/g, '""')}"`
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'moneyflow_transactions.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
