import React from 'react';
import { Globe, DollarSign } from 'lucide-react';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rateToUSD: number; // 1 USD = X Currency
  label: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', rateToUSD: 1.0, label: 'USD ($) - United States' },
  { code: 'INR', symbol: '₹', rateToUSD: 83.5, label: 'INR (₹) - India' },
  { code: 'EUR', symbol: '€', rateToUSD: 0.92, label: 'EUR (€) - Eurozone' },
  { code: 'GBP', symbol: '£', rateToUSD: 0.78, label: 'GBP (£) - United Kingdom' },
  { code: 'CAD', symbol: 'CA$', rateToUSD: 1.36, label: 'CAD (CA$) - Canada' },
  { code: 'AUD', symbol: 'A$', rateToUSD: 1.52, label: 'AUD (A$) - Australia' },
  { code: 'JPY', symbol: '¥', rateToUSD: 155.2, label: 'JPY (¥) - Japan' }
];

interface CurrencySelectorProps {
  currentCurrency: CurrencyConfig;
  onCurrencyChange: (currency: CurrencyConfig) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onCurrencyChange
}) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
      <Globe className="w-3.5 h-3.5 text-sky-400" />
      <select
        value={currentCurrency.code}
        onChange={(e) => {
          const found = CURRENCIES.find(c => c.code === e.target.value);
          if (found) onCurrencyChange(found);
        }}
        className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-slate-900 text-white">
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
};
