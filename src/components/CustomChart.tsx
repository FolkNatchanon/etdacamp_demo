'use client';

import { useState } from 'react';
import { mockWeeklyAnalytics } from '@/data/mockData';

export default function CustomChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { days, income, expense } = mockWeeklyAnalytics;
  
  // Find maximum value for scaling the height of bars
  const maxVal = Math.max(...income, ...expense, 1000); // minimum 1000 to avoid divide-by-zero

  const chartHeight = 160; // Max height of SVG bars
  
  return (
    <div className="glass-panel rounded-2xl p-6 border border-glass-border w-full flex flex-col justify-between">
      {/* Chart Title */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Activity Analytics</h3>
          <p className="text-[10px] text-slate-400">Weekly cashflow overview</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-4 text-[10px] font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-slate-300">Income</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-slate-300">Expense</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart container */}
      <div className="relative h-44 w-full flex items-end">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          <div className="w-full border-t border-white/5" />
          <div className="w-full border-t border-white/5" />
          <div className="w-full border-t border-white/5" />
          <div className="w-full border-t border-white/5" />
        </div>

        {/* Days visualization */}
        <div className="w-full h-full flex justify-between items-end relative z-10 pt-2">
          {days.map((day, idx) => {
            // Scale values relative to max
            // We use math.log or a square root to prevent salary from completely crushing other values visually
            // Log-scaling looks much better when one value is 65k and others are 2k
            const scaleAmount = (val: number) => {
              if (val === 0) return 0;
              // Simple non-linear scaling (square root) for beautiful dashboard ergonomics
              const scaledMax = Math.sqrt(maxVal);
              const scaledVal = Math.sqrt(val);
              return (scaledVal / scaledMax) * chartHeight;
            };

            const incomeH = scaleAmount(income[idx]);
            const expenseH = scaleAmount(expense[idx]);

            return (
              <div 
                key={day} 
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip Overlay */}
                {hoveredIndex === idx && (
                  <div className="absolute bottom-full mb-2 bg-zinc-950/95 border border-glass-border px-3 py-2 rounded-xl text-[10px] text-white flex flex-col space-y-1 shadow-xl z-30 pointer-events-none min-w-[100px]">
                    <p className="font-bold text-center border-b border-white/5 pb-1 mb-1 text-slate-300">{day} Transactions</p>
                    <p className="flex justify-between text-accent font-semibold">
                      <span>In:</span>
                      <span>฿{income[idx].toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between text-primary-light font-semibold">
                      <span>Out:</span>
                      <span>฿{expense[idx].toLocaleString()}</span>
                    </p>
                  </div>
                )}

                {/* Double Bars */}
                <div className="flex items-end space-x-1.5 h-full pb-2">
                  {/* Income Bar (Green) */}
                  <div 
                    className="w-2.5 rounded-t-sm bg-gradient-to-t from-accent/40 to-accent hover:from-accent hover:to-accent-light transition-all duration-500 ease-out cursor-pointer relative group-hover:opacity-100"
                    style={{ 
                      height: `${Math.max(incomeH, 4)}px`,
                      opacity: hoveredIndex !== null && hoveredIndex !== idx ? 0.4 : 0.85
                    }}
                  />
                  {/* Expense Bar (Indigo) */}
                  <div 
                    className="w-2.5 rounded-t-sm bg-gradient-to-t from-primary/40 to-primary hover:from-primary hover:to-primary-light transition-all duration-500 ease-out cursor-pointer relative group-hover:opacity-100"
                    style={{ 
                      height: `${Math.max(expenseH, 4)}px`,
                      opacity: hoveredIndex !== null && hoveredIndex !== idx ? 0.4 : 0.85
                    }}
                  />
                </div>

                {/* Day Label */}
                <span className={`text-[10px] tracking-wide mt-1 font-semibold transition-colors duration-200 ${
                  hoveredIndex === idx ? 'text-white' : 'text-slate-400'
                }`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
