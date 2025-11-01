import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Earning } from './types';
import Header from './components/Header';
import EarningsList from './components/EarningsList';
import Summary from './components/Summary';
import EarningsChart from './components/EarningsChart';
import ClickToEarn from './components/ClickToEarn';
import LikeToEarn from './components/LikeToEarn';
import CommentToEarn from './components/CommentToEarn';
import ShareToEarn from './components/ShareToEarn';
import WithdrawForm from './components/WithdrawForm';
import Sidebar from './components/Sidebar';
import AgentAI from './components/AgentAI';

export type View = 'tasks' | 'transactions' | 'withdraw';

const App: React.FC = () => {
  const [earnings, setEarnings] = useState<Earning[]>(() => {
    try {
      const savedEarnings = localStorage.getItem('earnings');
      return savedEarnings ? JSON.parse(savedEarnings) : [];
    } catch (error) {
      console.error("Could not parse earnings from localStorage", error);
      return [];
    }
  });

  const [activeView, setActiveView] = useState<View>('tasks');

  useEffect(() => {
    try {
      localStorage.setItem('earnings', JSON.stringify(earnings));
    } catch (error) {
      console.error("Could not save earnings to localStorage", error);
    }
  }, [earnings]);

  const addEarning = useCallback((earning: Omit<Earning, 'id'>) => {
    const newEarning: Earning = {
      ...earning,
      id: new Date().toISOString() + Math.random().toString(),
    };
    setEarnings(prevEarnings => [newEarning, ...prevEarnings]);
  }, []);

  const totalEarnings = useMemo(() => earnings.reduce((acc, curr) => acc + curr.amount, 0), [earnings]);

  const viewTitles: Record<View, string> = {
    tasks: 'Tasks Dashboard',
    transactions: 'Transaction History',
    withdraw: 'Withdraw Funds'
  };

  const renderContent = () => {
    switch (activeView) {
      case 'tasks':
        return (
          <div className="space-y-8 max-w-2xl mx-auto">
            <ClickToEarn onAddEarning={addEarning} />
            <LikeToEarn onAddEarning={addEarning} />
            <CommentToEarn onAddEarning={addEarning} />
            <ShareToEarn onAddEarning={addEarning} />
            <Summary earnings={earnings} />
          </div>
        );
      case 'transactions':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="xl:col-span-2">
              <EarningsChart earnings={earnings} />
            </div>
            <div className="xl:col-span-2">
              <EarningsList earnings={earnings} />
            </div>
          </div>
        );
      case 'withdraw':
        return <div className="max-w-md mx-auto"><WithdrawForm onWithdraw={addEarning} currentBalance={totalEarnings} /></div>;
      default:
        return <ClickToEarn onAddEarning={addEarning} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col md:flex-row">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col max-h-screen">
        <Header totalEarnings={totalEarnings} viewTitle={viewTitles[activeView]} />
        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <AgentAI />
    </div>
  );
};

export default App;