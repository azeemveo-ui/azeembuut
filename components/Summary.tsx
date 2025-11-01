import React, { useMemo } from 'react';
import type { Earning } from '../types';

interface SummaryProps {
  earnings: Earning[];
}

const SummaryCard: React.FC<{ title: string; value: string; description: string }> = ({ title, value, description }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
    <p className="mt-1 text-2xl font-semibold text-text-primary">{value}</p>
    <p className="text-xs text-text-secondary">{description}</p>
  </div>
);

const Summary: React.FC<SummaryProps> = ({ earnings }) => {
  const { total, average, count, topSource } = useMemo(() => {
    const positiveEarnings = earnings.filter(e => e.amount > 0);
    const count = positiveEarnings.length;
    
    if (earnings.length === 0) {
      return { total: 0, average: 0, count: 0, topSource: 'N/A' };
    }
    const total = earnings.reduce((sum, e) => sum + e.amount, 0);
    const totalPositive = positiveEarnings.reduce((sum, e) => sum + e.amount, 0);
    const average = count > 0 ? totalPositive / count : 0;

    const sourceCounts = positiveEarnings.reduce((acc, earning) => {
        acc[earning.source] = (acc[earning.source] || 0) + earning.amount;
        return acc;
    }, {} as Record<string, number>);

    const topSource = Object.keys(sourceCounts).length > 0
        ? Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b)
        : 'N/A';


    return { total, average, count, topSource };
  }, [earnings]);

  const formatCurrency = (value: number) => {
    return `RS ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-text-primary mb-4">Dashboard</h2>
      <div className="space-y-3">
        <SummaryCard 
            title="Current Balance" 
            value={formatCurrency(total)} 
            description={`From ${earnings.length} transactions`}
        />
        <SummaryCard 
            title="Average Earning" 
            value={formatCurrency(average)} 
            description="Per entry (earnings only)"
        />
        <SummaryCard 
            title="Top Earning Source" 
            value={topSource}
            description="By total amount"
        />
      </div>
    </div>
  );
};

export default Summary;