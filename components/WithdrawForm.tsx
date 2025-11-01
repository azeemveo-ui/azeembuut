import React, { useState } from 'react';
import type { Earning } from '../types';
import { WithdrawIcon } from './icons/WithdrawIcon';

interface WithdrawFormProps {
  onWithdraw: (earning: Omit<Earning, 'id'>) => void;
  currentBalance: number;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw, currentBalance }) => {
  const [method, setMethod] = useState('jazzcash');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setMethod('jazzcash');
    setBankName('');
    setAccountName('');
    setAccountNumber('');
    setAmount('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount to withdraw.');
      return;
    }

    if (parsedAmount > currentBalance) {
      setError('Withdrawal amount cannot exceed your current balance.');
      return;
    }
    
    if (!accountName.trim() || !accountNumber.trim()) {
      setError('Account name and number are required.');
      return;
    }
    
    if (method === 'bank' && !bankName.trim()) {
        setError('Bank name is required for bank transfers.');
        return;
    }

    let source = '';
    switch (method) {
        case 'jazzcash':
            source = `Withdrawal via Jazz Cash`;
            break;
        case 'easypaisa':
            source = `Withdrawal via Easypaisa`;
            break;
        case 'bank':
            source = `Withdrawal via ${bankName}`;
            break;
    }

    onWithdraw({ source, amount: -parsedAmount, date: new Date().toISOString().split('T')[0] });
    setSuccess(`Successfully withdrew RS ${parsedAmount.toFixed(2)}!`);
    resetForm();
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-text-primary mb-2">Withdraw Funds</h2>
      <p className="text-sm text-text-secondary mb-4">Current Balance: <span className="font-semibold text-primary">RS {currentBalance.toFixed(2)}</span></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="jazzcash">Jazz Cash</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {method === 'bank' && (
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-text-secondary">Bank Name</label>
            <input
              type="text"
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g., HBL, Meezan Bank"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}

        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-text-secondary">Account Holder Name</label>
          <input
            type="text"
            id="accountName"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="e.g., John Doe"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-text-secondary">Account/IBAN Number</label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Your account or mobile number"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="withdrawAmount" className="block text-sm font-medium text-text-secondary">Amount (RS)</label>
          <input
            type="number"
            id="withdrawAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500.00"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            step="0.01"
            min="0.01"
            max={currentBalance}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={currentBalance <= 0}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <WithdrawIcon className="w-5 h-5 mr-2" />
          Withdraw
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;
