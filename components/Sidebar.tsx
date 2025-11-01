import React from 'react';
import type { View } from '../App';
import { MouseClickIcon } from './icons/MouseClickIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { WithdrawIcon } from './icons/WithdrawIcon';
import { WalletIcon } from './icons/WalletIcon';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="ml-3 hidden md:inline">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-full md:w-auto bg-card p-2 md:p-4 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col">
      <div className="hidden md:flex items-center px-2 mb-8">
        <WalletIcon className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl font-bold text-text-primary tracking-tight">
          Earning App
        </h1>
      </div>
      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start gap-2">
        <NavItem
          icon={<MouseClickIcon className="h-6 w-6" />}
          label="Tasks"
          isActive={activeView === 'tasks'}
          onClick={() => setActiveView('tasks')}
        />
        <NavItem
          icon={<ListBulletIcon className="h-6 w-6" />}
          label="Transactions"
          isActive={activeView === 'transactions'}
          onClick={() => setActiveView('transactions')}
        />
        <NavItem
          icon={<WithdrawIcon className="h-6 w-6" />}
          label="Withdraw"
          isActive={activeView === 'withdraw'}
          onClick={() => setActiveView('withdraw')}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;