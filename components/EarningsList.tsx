import React from 'react';
import type { Earning } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';

interface EarningsListProps {
  earnings: Earning[];
}

const EarningsList: React.FC<EarningsListProps> = ({ earnings }) => {
  const formatCurrency = (value: number) => {
    return `RS ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Adjust for timezone offset
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(adjustedDate);
  };
  
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-text-primary mb-4">Recent Transactions</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {earnings.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No transactions recorded yet. Add one to get started!</p>
        ) : (
          earnings.map((earning) => (
            <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-semibold text-text-primary">{earning.source}</p>
                <p className="text-sm text-text-secondary flex items-center mt-1">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  {formatDate(earning.date)}
                </p>
              </div>
              <div className={`flex items-center font-semibold ${earning.amount >= 0 ? 'text-secondary' : 'text-red-600'}`}>
                {formatCurrency(earning.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EarningsList;