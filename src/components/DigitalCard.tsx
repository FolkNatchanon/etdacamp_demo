'use client';

import { useState } from 'react';
import { CardData } from '@/data/mockData';

interface DigitalCardProps {
  card: CardData;
  onToggleFreeze?: (id: string) => void;
}

export default function DigitalCard({ card, onToggleFreeze }: DigitalCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNumber, setShowNumber] = useState(false);

  const formatCardNumber = (num: string) => {
    if (card.type === 'crypto') return num;
    if (showNumber) return num;
    // Mask all but last 4 digits
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  const handleFlip = (e: React.MouseEvent) => {
    // Avoid flipping when clicking buttons/interactive items inside the card
    const target = e.target as HTMLElement;
    if (target.closest('.card-action-btn')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-sm h-56 perspective-1000 select-none cursor-pointer">
      <div
        onClick={handleFlip}
        className={`relative w-full h-full card-inner duration-500 rounded-2xl ${
          isFlipped ? 'card-flipped' : ''
        }`}
      >
        {/* Card Front */}
        <div
          className={`card-front w-full h-full rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br ${card.color} shadow-2xl relative overflow-hidden`}
        >
          {/* Background decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top */}
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-300 font-medium">Digital Card Balance</p>
              <h3 className="text-xl font-bold text-white mt-1">
                {card.type === 'crypto'
                  ? `${(card.balance / 640000).toFixed(4)} ETH`
                  : `฿${card.balance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`}
              </h3>
            </div>
            {/* Card Chip & Network Brand */}
            <div className="flex items-center space-x-3">
              {/* Gold SIM Card Chip */}
              <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-500 p-[3px] flex flex-col justify-between border border-amber-400/50 shadow-inner">
                <div className="flex justify-between h-[30%]">
                  <div className="w-[25%] border-r border-amber-600/30 h-full" />
                  <div className="w-[30%] border-x border-amber-600/30 h-full" />
                  <div className="w-[25%] border-l border-amber-600/30 h-full" />
                </div>
                <div className="h-[2px] bg-amber-600/30 w-full" />
                <div className="flex justify-between h-[30%]">
                  <div className="w-[25%] border-r border-amber-600/30 h-full" />
                  <div className="w-[30%] border-x border-amber-600/30 h-full" />
                  <div className="w-[25%] border-l border-amber-600/30 h-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Middle: Card Number */}
          <div className="z-10 flex justify-between items-center my-auto">
            <p className="text-lg font-mono tracking-widest text-white">
              {formatCardNumber(card.number)}
            </p>
            {card.type !== 'crypto' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNumber(!showNumber);
                }}
                className="card-action-btn text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                title={showNumber ? 'Hide card number' : 'Show card number'}
              >
                {showNumber ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Card Bottom: Holder, Expiry & Logo */}
          <div className="flex justify-between items-end z-10">
            <div>
              <p className="text-[8px] uppercase tracking-wider text-slate-300">Card Holder</p>
              <p className="text-sm font-semibold text-white tracking-wide truncate max-w-[160px] mt-0.5">
                {card.holder}
              </p>
            </div>
            <div className="flex space-x-6">
              <div>
                <p className="text-[8px] uppercase tracking-wider text-slate-300">Expires</p>
                <p className="text-xs font-semibold text-white mt-0.5">{card.expiry}</p>
              </div>
              <div className="flex items-center">
                {card.type === 'visa' && (
                  <span className="text-xl italic font-black text-white tracking-tighter">VISA</span>
                )}
                {card.type === 'mastercard' && (
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-red-500 opacity-90" />
                    <div className="w-6 h-6 rounded-full bg-amber-500 opacity-90" />
                  </div>
                )}
                {card.type === 'crypto' && (
                  <span className="text-xs font-bold text-cyan-200 border border-cyan-300/30 px-2 py-0.5 rounded-full bg-white/5">
                    Web3
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Frozen State Overlay */}
          {card.isFrozen && (
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-20 rounded-2xl flex flex-col items-center justify-center text-white">
              <svg className="w-10 h-10 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm font-bold tracking-wider mt-2 text-cyan-400">CARD FROZEN</p>
              <p className="text-[10px] text-slate-400 mt-1">Tap controls to unfreeze</p>
            </div>
          )}
        </div>

        {/* Card Back */}
        <div
          className="card-back w-full h-full rounded-2xl p-6 flex flex-col justify-between bg-zinc-900 border border-glass-border shadow-2xl relative"
        >
          {/* Black Magnetic Strip */}
          <div className="absolute top-6 left-0 w-full h-11 bg-black" />

          {/* CVV panel */}
          <div className="mt-14 flex items-center justify-end">
            <div className="text-right mr-3">
              <p className="text-[7px] text-slate-400 uppercase tracking-widest">Authorized Signature</p>
              <div className="w-36 h-8 bg-slate-300/10 border border-slate-700/50 rounded flex items-center justify-end px-3">
                <span className="font-mono text-xs text-slate-400 select-all">CVV: {card.cvv}</span>
              </div>
            </div>
          </div>

          {/* Bottom warning note */}
          <div className="flex justify-between items-center text-[7px] text-slate-400">
            <p className="max-w-[200px] leading-relaxed">
              This card is a digital demo mock properties. Do not share or attempt transactions using these numbers.
            </p>
            <div className="card-action-btn">
              {onToggleFreeze && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFreeze(card.id);
                  }}
                  className="bg-primary/20 hover:bg-primary/30 text-white font-medium border border-primary/30 px-3 py-1.5 rounded-lg text-[9px] transition-colors"
                >
                  {card.isFrozen ? 'Unfreeze' : 'Freeze Card'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
