# MoneyFlow Tracker

A personal finance tracking app that simulates reading bank/UPI transaction SMS notifications to automatically log and categorize expenses.

## Features
- **Dashboard**: View your current balance, today's spends, and a chronological list of transactions.
- **Smart SMS Parsing**: Uses Regex and AI to extract transaction type, amount, description, and category from SMS messages.
- **Expense Charts**: Visual breakdown of your expenses categorized automatically.
- **Local Storage**: All data is stored locally in the browser.
- **Settings**: Toggle Dark Mode, export transactions to CSV, or reset app data.

## Development

To run the app locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

## Tech Stack
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- date-fns
