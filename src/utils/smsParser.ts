import { GoogleGenAI, Type } from '@google/genai';
import { Transaction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseTransactionSms(text: string): Promise<Partial<Transaction> | null> {
  try {
    // 1. Try Regex first for common patterns
    const debitRegex = /(?:debited|paid|sent|deducted).*(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i;
    const creditRegex = /(?:credited|received|added).*(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*)/i;
    const upiRegex = /UPI.*(?:rs\.?|inr|₹)\s*([\d,]+\.?\d*).*(?:to|from)\s+([a-zA-Z0-9\s]+)/i;
    
    let type: 'credit' | 'debit' | undefined;
    let amount: number | undefined;
    let description: string | undefined;
    
    if (debitRegex.test(text)) {
      type = 'debit';
      const match = text.match(debitRegex);
      if (match) amount = parseFloat(match[1].replace(/,/g, ''));
    } else if (creditRegex.test(text)) {
      type = 'credit';
      const match = text.match(creditRegex);
      if (match) amount = parseFloat(match[1].replace(/,/g, ''));
    }
    
    if (upiRegex.test(text)) {
      const match = text.match(upiRegex);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ''));
        description = match[2].trim();
        type = text.toLowerCase().includes('from') ? 'credit' : 'debit';
      }
    }
    
    // If regex fails or is incomplete, use Gemini
    if (!type || !amount) {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Extract transaction details from this SMS: "${text}". If it's not a financial transaction, return isTransaction: false.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isTransaction: { type: Type.BOOLEAN },
              type: { type: Type.STRING, description: "'credit' or 'debit'" },
              amount: { type: Type.NUMBER },
              description: { type: Type.STRING, description: "Sender, receiver, or merchant name" },
              category: { type: Type.STRING, description: "e.g., Food, Travel, Shopping, Utilities, Transfer, Other" }
            },
            required: ["isTransaction"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      if (result.isTransaction && result.type && result.amount) {
        return {
          type: result.type as 'credit' | 'debit',
          amount: result.amount,
          description: result.description || 'Unknown',
          category: result.category || 'Other',
          date: new Date().toISOString()
        };
      }
      return null;
    }
    
    // Auto-categorize based on description if regex worked
    let category = 'Other';
    const lowerDesc = (description || text).toLowerCase();
    if (lowerDesc.includes('zomato') || lowerDesc.includes('swiggy') || lowerDesc.includes('restaurant')) category = 'Food';
    else if (lowerDesc.includes('uber') || lowerDesc.includes('ola') || lowerDesc.includes('irctc')) category = 'Travel';
    else if (lowerDesc.includes('amazon') || lowerDesc.includes('flipkart') || lowerDesc.includes('myntra')) category = 'Shopping';
    
    return {
      type,
      amount,
      description: description || 'Unknown Transaction',
      category,
      date: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error parsing SMS:", error);
    return null;
  }
}
