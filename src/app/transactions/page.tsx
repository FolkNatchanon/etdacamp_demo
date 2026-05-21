'use client';

import { useState } from 'react';
import { mockTransactions, Transaction } from '@/data/mockData';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'in' | 'out'>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const categories = ['All', 'Salary', 'Food & Drinks', 'Utilities', 'Shopping', 'Transfer', 'Investment', 'Entertainment'];

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = 
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
    
    let matchesType = true;
    if (selectedType === 'in') matchesType = tx.type === 'receive';
    if (selectedType === 'out') matchesType = tx.type === 'send' || tx.type === 'bill' || tx.type === 'topup';

    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate statistics
  const totalIn = mockTransactions
    .filter(tx => tx.type === 'receive' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOut = mockTransactions
    .filter(tx => (tx.type === 'send' || tx.type === 'bill') && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Transactions History</h2>
        <p className="text-xs text-slate-400">Track and filter all wallet transactions and records</p>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-glass-border">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Received (THB)</p>
          <h3 className="text-lg font-bold text-accent mt-1">฿{totalIn.toLocaleString()}</h3>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-glass-border">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Expenses (THB)</p>
          <h3 className="text-lg font-bold text-white mt-1">฿{totalOut.toLocaleString()}</h3>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-glass-border">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Net Cashflow (THB)</p>
          <h3 className={`text-lg font-bold mt-1 ${totalIn - totalOut >= 0 ? 'text-accent' : 'text-danger'}`}>
            {totalIn - totalOut >= 0 ? '+' : '-'}฿{Math.abs(totalIn - totalOut).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-glass-border space-y-4">
        {/* Search & Type Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by merchant, sender, account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs glass-input"
            />
          </div>

          {/* Type filters */}
          <div className="flex space-x-1.5 bg-white/5 border border-glass-border p-1 rounded-xl">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === 'all' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('in')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === 'in' ? 'bg-accent/80 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inflow
            </button>
            <button
              onClick={() => setSelectedType('out')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === 'out' ? 'bg-primary/80 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Outflow
            </button>
          </div>
        </div>

        {/* Category tags selector */}
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white/20 text-white border border-white/20'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Transactions List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* List Section */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-glass-border overflow-hidden">
          <div className="p-4 border-b border-glass-border flex justify-between items-center bg-white/5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Transaction Ledger</span>
            <span className="text-[10px] text-slate-400 font-semibold">{filteredTransactions.length} records found</span>
          </div>

          <div className="divide-y divide-glass-border">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-white/5 ${
                    selectedTx?.id === tx.id ? 'bg-white/5 border-l-4 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5" role="img" aria-label={tx.title}>
                      {tx.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{tx.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">{tx.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-xs font-extrabold ${
                        tx.type === 'receive' ? 'text-accent' : 'text-white'
                      }`}>
                        {tx.type === 'receive' ? '+' : '-'}
                        ฿{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[8px] text-slate-400 font-mono">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      tx.status === 'completed' ? 'bg-accent/15 text-accent border border-accent/20' :
                      tx.status === 'pending' ? 'bg-warning/15 text-warning border border-warning/20' :
                      'bg-danger/15 text-danger border border-danger/20'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <svg className="w-12 h-12 text-slate-600 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-medium">No transactions match your filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed drawer / context view */}
        <div className="lg:sticky lg:top-8">
          {selectedTx ? (
            <div className="glass-panel rounded-2xl border border-glass-border p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-white tracking-wide">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-center py-6 bg-white/5 border border-glass-border rounded-2xl">
                <span className="text-3xl p-3 bg-white/5 rounded-2xl border border-glass-border inline-block mb-4 shadow-lg shadow-black/10">
                  {selectedTx.icon}
                </span>
                <h4 className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{selectedTx.category}</h4>
                <h2 className="text-2xl font-black text-white mt-1">
                  {selectedTx.type === 'receive' ? '+' : '-'}
                  ฿{selectedTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono mt-1">ID: TXN-{selectedTx.id.toUpperCase()}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between py-1 border-b border-glass-border/30">
                  <span className="text-slate-400">Description</span>
                  <span className="text-white font-semibold">{selectedTx.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-glass-border/30">
                  <span className="text-slate-400">Merchant / Sender</span>
                  <span className="text-white font-semibold">{selectedTx.subtitle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-glass-border/30">
                  <span className="text-slate-400">Date Completed</span>
                  <span className="text-white font-mono">
                    {new Date(selectedTx.date).toLocaleString('en-US', { 
                      dateStyle: 'medium', 
                      timeStyle: 'short' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Status</span>
                  <span className={`font-bold uppercase tracking-wider ${
                    selectedTx.status === 'completed' ? 'text-accent' :
                    selectedTx.status === 'pending' ? 'text-warning' :
                    'text-danger'
                  }`}>
                    {selectedTx.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl border border-glass-border p-6 text-center text-slate-500 py-12">
              <svg className="w-10 h-10 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-semibold">Select a transaction from the ledger to view detailed receipt properties.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
