import React, { useState } from 'react';
import { parseTransactionSms } from '../utils/smsParser';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { X, MessageSquare, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SimulateSmsModalProps {
  onClose: () => void;
  onAddTransaction: (t: Transaction) => void;
  isDarkMode: boolean;
}

const SAMPLE_SMS = [
  "Rs.1234.56 debited from A/c XX1234 on 12-Oct-23 to Zomato. UPI Ref 123456789",
  "UPI 500.00 from Ramesh received in A/c XX9876. Ref 987654321",
  "Dear Customer, Rs.2000.00 has been credited to your account XX5555 on 15-Oct-23. Info: Salary",
  "Paid Rs. 350.00 to Uber India via UPI. Ref 1122334455",
  "Your HDFC Bank Credit Card ending 1234 was spent for Rs 5,432.10 at Amazon on 2023-10-18."
];

export function SimulateSmsModal({ onClose, onAddTransaction, isDarkMode }: SimulateSmsModalProps) {
  const [smsText, setSmsText] = useState(SAMPLE_SMS[0]);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setIsParsing(true);
    setError(null);
    try {
      const parsed = await parseTransactionSms(smsText);
      if (parsed && parsed.type && parsed.amount) {
        onAddTransaction({
          id: uuidv4(),
          type: parsed.type,
          amount: parsed.amount,
          description: parsed.description || 'Unknown',
          date: parsed.date || new Date().toISOString(),
          category: parsed.category || 'Other'
        });
        onClose();
      } else {
        setError("Could not parse transaction details from this SMS. Try another format or check if it's a valid financial message.");
      }
    } catch (err) {
      setError("An error occurred during parsing.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={clsx(
        "w-full max-w-md rounded-3xl p-6 shadow-2xl",
        isDarkMode ? "bg-zinc-900 text-zinc-200" : "bg-white text-zinc-900"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare size={24} className="text-emerald-500" />
            Simulate SMS
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 opacity-80">
              Select a sample SMS or type your own:
            </label>
            <select 
              className={clsx(
                "w-full p-3 rounded-xl border mb-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
              )}
              onChange={(e) => setSmsText(e.target.value)}
              value={smsText}
            >
              {SAMPLE_SMS.map((sms, i) => (
                <option key={i} value={sms}>Sample {i + 1}: {sms.substring(0, 30)}...</option>
              ))}
            </select>
            
            <textarea
              className={clsx(
                "w-full p-4 rounded-xl border min-h-[120px] focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none",
                isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200"
              )}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Paste SMS text here..."
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-100 text-rose-700 text-sm border border-rose-200">
              {error}
            </div>
          )}

          <button
            onClick={handleSimulate}
            disabled={isParsing || !smsText.trim()}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Parsing with AI...
              </>
            ) : (
              'Process SMS'
            )}
          </button>
          
          <p className="text-xs text-center opacity-60 mt-4">
            In a real React Native app, this would happen automatically in the background using READ_SMS permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
