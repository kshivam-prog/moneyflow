export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string; // ISO string
  sender?: string;
  category?: string;
}

export interface AppState {
  initialBalance: number;
  transactions: Transaction[];
  isDarkMode: boolean;
  pin: string | null;
}
