'use client';

import { useState } from 'react';
import { mockCategoryExpenses, mockSavingsGoals, SavingsGoal } from '@/data/mockData';

export default function AnalyticsPage() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(mockSavingsGoals);
  
  // Calculate total expense for percentage math
  const totalExpense = mockCategoryExpenses.reduce((sum, item) => sum + item.amount, 0);

  const handleAddSavings = (goalId: string) => {
    const amountStr = prompt('Enter amount to transfer from wallet to this savings goal:');
    if (!amountStr) return;
    const amountVal = parseFloat(amountStr);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    setSavingsGoals(savingsGoals.map(g => {
      if (g.id === goalId) {
        const updatedCurrent = g.current + amountVal;
        if (updatedCurrent > g.target) {
          alert(`Congratulations! You've reached your target for "${g.name}"! 🎉`);
        }
        return { ...g, current: Math.min(updatedCurrent, g.target) };
      }
      return g;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Financial Insights</h2>
        <p className="text-xs text-slate-400">Deep-dive analysis of your category budgeting and savings progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Section: Expense Breakdown by Category */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-glass-border space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Category Budgeting</h3>
            <p className="text-[10px] text-slate-400">Monthly expense distributions by category</p>
          </div>

          <div className="space-y-5">
            {mockCategoryExpenses.map((item) => {
              const pct = ((item.amount / totalExpense) * 100).toFixed(0);
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${item.color.replace('text', 'bg')}`} />
                      <span className="text-white">{item.category}</span>
                    </div>
                    <div className="text-right text-slate-300">
                      <span>฿{item.amount.toLocaleString()} </span>
                      <span className="text-[10px] text-slate-400 font-medium">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 border border-white/5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${item.color.replace('text', 'bg')}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Savings Goals */}
        <div className="glass-panel rounded-2xl p-6 border border-glass-border space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Savings Goals</h3>
            <p className="text-[10px] text-slate-400">Allocate funds to accomplish purchase targets</p>
          </div>

          <div className="space-y-6">
            {savingsGoals.map((goal) => {
              const pct = ((goal.current / goal.target) * 100).toFixed(0);
              return (
                <div key={goal.id} className="bg-white/5 border border-glass-border/40 p-4 rounded-xl space-y-3 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-white leading-none">{goal.name}</p>
                      <span className="text-[9px] text-slate-400 block mt-1">
                        ฿{goal.current.toLocaleString()} saved of ฿{goal.target.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddSavings(goal.id)}
                      className="text-[9px] font-bold text-cyan-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-glass-border transition-all cursor-pointer"
                    >
                      + Add Fund
                    </button>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${goal.color}`}
                      style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-semibold text-slate-400">
                    <span>{pct}% Completed</span>
                    {parseFloat(pct) >= 100 && (
                      <span className="text-accent animate-pulse font-bold">✓ Target Met!</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
