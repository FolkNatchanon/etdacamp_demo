'use client';

import { useState } from 'react';
import { mockCards, CardData } from '@/data/mockData';
import DigitalCard from '@/components/DigitalCard';

export default function CardsPage() {
  const [cards, setCards] = useState<CardData[]>(mockCards);
  const [selectedCardId, setSelectedCardId] = useState<string>(mockCards[0].id);

  // Toggle freeze state
  const handleToggleFreeze = (id: string) => {
    setCards(cards.map(c => c.id === id ? { ...c, isFrozen: !c.isFrozen } : c));
  };

  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  // Update limit
  const handleLimitChange = (val: number) => {
    setCards(cards.map(c => c.id === selectedCard.id ? { ...c, spendingLimit: val } : c));
  };

  // Virtual switches for cards
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [intlPayments, setIntlPayments] = useState(false);

  const handleResetPin = () => {
    alert(`A secure temporary PIN reset link has been dispatched to ${selectedCard.holder}'s registered phone number.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Card Management</h2>
        <p className="text-xs text-slate-400">Configure safety limits, freeze status, and toggles for your cards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Card Selector / Cards Slider */}
        <div className="lg:col-span-2 space-y-6">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Select Card</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cards.map((card) => {
              const isSelected = card.id === selectedCardId;
              return (
                <div 
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`flex flex-col items-center p-4 rounded-3xl transition-all border relative cursor-pointer group ${
                    isSelected 
                      ? 'bg-gradient-to-tr from-primary/10 to-transparent border-primary/40 shadow-xl'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-full border border-primary-light/20">
                      Active Config
                    </span>
                  )}
                  
                  <div className="pointer-events-none w-full max-w-sm flex justify-center py-2 scale-95 group-hover:scale-100 transition-transform">
                    <DigitalCard card={card} onToggleFreeze={handleToggleFreeze} />
                  </div>

                  <div className="mt-2 text-center">
                    <p className="text-xs font-semibold text-white">
                      {card.type === 'crypto' ? 'Ethereum Crypto Card' : `${card.type.toUpperCase()} Card`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {card.number.slice(0, 4)} •••• •••• {card.number.slice(-4)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Controls Panel */}
        <div className="lg:sticky lg:top-8">
          <div className="glass-panel rounded-2xl border border-glass-border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Controls Center</h3>
              <p className="text-[10px] text-slate-400">Managing: {selectedCard.type.toUpperCase()} (***{selectedCard.number.slice(-4)})</p>
            </div>

            {/* Spent vs Limit progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Current Spent</span>
                <span className="text-white">
                  ฿{selectedCard.currentSpent.toLocaleString()} / ฿{selectedCard.spendingLimit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 border border-white/5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((selectedCard.currentSpent / selectedCard.spendingLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-400 text-right">
                {((selectedCard.currentSpent / selectedCard.spendingLimit) * 100).toFixed(0)}% of limit utilized
              </p>
            </div>

            {/* Limit Adjustment Slider */}
            <div className="space-y-2 pt-2 border-t border-glass-border/30">
              <label htmlFor="limit-slider" className="block text-xs font-semibold text-slate-400">
                Monthly Spending Limit
              </label>
              <input
                id="limit-slider"
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={selectedCard.spendingLimit}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                disabled={selectedCard.isFrozen}
                className="w-full accent-primary bg-white/10 h-1.5 rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>฿10,000</span>
                <span>฿300,000</span>
              </div>
            </div>

            {/* Quick Toggle Settings */}
            <div className="space-y-4 pt-4 border-t border-glass-border/30">
              {/* Freeze Toggle */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-white">Freeze Card</p>
                  <p className="text-[10px] text-slate-400">Temporarily lock transactions</p>
                </div>
                <button
                  onClick={() => handleToggleFreeze(selectedCard.id)}
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative border ${
                    selectedCard.isFrozen 
                      ? 'bg-cyan-500 border-cyan-400' 
                      : 'bg-white/5 border-glass-border'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow ${
                    selectedCard.isFrozen ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Online Payments Toggle */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-white">Online E-Commerce</p>
                  <p className="text-[10px] text-slate-400">Permit online web shopping</p>
                </div>
                <button
                  onClick={() => setOnlinePayments(!onlinePayments)}
                  disabled={selectedCard.isFrozen}
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative border disabled:opacity-30 disabled:cursor-not-allowed ${
                    onlinePayments 
                      ? 'bg-primary border-primary-light/50' 
                      : 'bg-white/5 border-glass-border'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow ${
                    onlinePayments ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* International Payments Toggle */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-white">International Gateways</p>
                  <p className="text-[10px] text-slate-400">Enable cross-border usage</p>
                </div>
                <button
                  onClick={() => setIntlPayments(!intlPayments)}
                  disabled={selectedCard.isFrozen}
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative border disabled:opacity-30 disabled:cursor-not-allowed ${
                    intlPayments 
                      ? 'bg-primary border-primary-light/50' 
                      : 'bg-white/5 border-glass-border'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all shadow ${
                    intlPayments ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-glass-border/30">
              <button
                onClick={handleResetPin}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-glass-border font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Reset ATM PIN Securely
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
