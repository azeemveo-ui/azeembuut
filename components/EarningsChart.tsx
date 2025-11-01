import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Earning } from '../types';

interface EarningsChartProps {
  earnings: Earning[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ earnings }) => {
  const chartData = useMemo(() => {
    if (earnings.length === 0) return [];
    
    const monthlyTotals: { [key: string]: number } = {};
    
    earnings.forEach(earning => {
      // Create a date object, ensuring it's treated as UTC to avoid timezone issues.
      const date = new Date(earning.date + 'T00:00:00Z');
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit', timeZone: 'UTC' });
      
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += earning.amount;
    });

    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const dateA = new Date(`${monthA} 1, 20${yearA}`);
        const dateB = new Date(`${monthB} 1, 20${yearB}`);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map(month => ({
      name: month,
      Earnings: monthlyTotals[month]
    })).slice(-12); // Show last 12 months max
  }, [earnings]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          <p className="intro text-secondary">{`Earnings: RS ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg h-96">
      <h2 className="text-xl font-bold text-text-primary mb-4">Monthly Earnings</h2>
       {earnings.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `RS ${value}`} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} />
            <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}} />
            <Bar dataKey="Earnings" fill="#4F46E5" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
       ) : (
        <div className="flex items-center justify-center h-full text-text-secondary">
          <p>Chart will be displayed once you add some earnings.</p>
        </div>
       )}
    </div>
  );
};

export default EarningsChart;