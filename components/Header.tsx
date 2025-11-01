import React from 'react';
import { WalletIcon } from './icons/WalletIcon';

interface HeaderProps {
  totalEarnings: number;
  viewTitle: string;
}

const Header: React.FC<HeaderProps> = ({ totalEarnings, viewTitle }) => {
  const formatCurrency = (value: number) => {
    return `RS ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <header className="bg-card shadow-sm sticky top-0 z-10 border-b border-gray-200 flex-shrink-0">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary tracking-tight">
          {viewTitle}
        </h1>
        <div className="flex items-center space-x-2 bg-primary/10 text-primary p-2 rounded-lg">
          <WalletIcon className="h-6 w-6" />
          <span className="font-semibold">
            {formatCurrency(totalEarnings)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;