'use client';

import { useState } from 'react';
import { Contact, Transaction, mockContacts } from '@/data/mockData';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: (transaction: Transaction) => void;
  userBalance: number;
}

export default function SendMoneyModal({ isOpen, onClose, onSendSuccess, userBalance }: SendMoneyModalProps) {
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success'>('input');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [refId, setRefId] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setError('');
  };

  const handleNextToConfirm = () => {
    if (!selectedContact) {
      setError('Please select a recipient');
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (val > userBalance) {
      setError(`Insufficient balance. Your current balance is ฿${userBalance.toLocaleString()}`);
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleConfirmSend = () => {
    setStep('processing');
    
    // Simulate transaction delay
    setTimeout(() => {
      const val = parseFloat(amount);
      const newTx: Transaction = {
        id: `tx-user-${Date.now()}`,
        type: 'send',
        title: `Transfer to ${selectedContact?.name}`,
        subtitle: selectedContact?.bankName || selectedContact?.walletAddress || 'Digital Wallet',
        amount: val,
        currency: 'THB',
        category: 'Transfer',
        status: 'completed',
        date: new Date().toISOString(),
        icon: '💸'
      };
      
      const generatedRefId = `TXN-${Math.floor(Math.random() * 90000000 + 10000000)}`;
      setRefId(generatedRefId);
      onSendSuccess(newTx);
      setStep('success');
    }, 1800);
  };

  const resetState = () => {
    setStep('input');
    setSelectedContact(null);
    setAmount('');
    setDescription('');
    setError('');
    setRefId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={step !== 'processing' ? resetState : undefined}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md glass-panel rounded-2xl overflow-hidden shadow-2xl border border-glass-border transform transition-all p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">
            {step === 'input' && 'Send Money'}
            {step === 'confirm' && 'Confirm Transfer'}
            {step === 'processing' && 'Processing...'}
            {step === 'success' && 'Transfer Receipt'}
          </h3>
          {step !== 'processing' && step !== 'success' && (
            <button 
              onClick={resetState} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* STEP 1: INPUT DETAILS */}
        {step === 'input' && (
          <div className="space-y-5">
            {/* Quick Contacts */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Select Recipient</p>
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {mockContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className={`flex flex-col items-center space-y-1.5 p-2 rounded-xl transition-all min-w-[76px] ${
                      selectedContact?.id === contact.id
                        ? 'bg-primary/20 border border-primary text-white scale-105'
                        : 'bg-white/5 border border-transparent text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="w-10 h-10 rounded-full object-cover border border-glass-border" 
                    />
                    <span className="text-[10px] text-center truncate w-14 font-medium">{contact.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Details display */}
            {selectedContact && (
              <div className="bg-white/5 border border-glass-border rounded-xl p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
                  👤
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{selectedContact.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {selectedContact.bankName 
                      ? `${selectedContact.bankName} (${selectedContact.accountNumber})`
                      : `Wallet Address: ${selectedContact.walletAddress}`
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label htmlFor="amount" className="block text-xs text-slate-400 mb-2 font-medium">
                Enter Amount (THB)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">฿</span>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-4 py-3 glass-input text-lg font-bold text-white"
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-slate-400">
                  Available Balance: ฿{userBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <button
                  type="button"
                  onClick={() => setAmount(userBalance.toString())}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Send Max
                </button>
              </div>
            </div>

            {/* Note input */}
            <div>
              <label htmlFor="description" className="block text-xs text-slate-400 mb-2 font-medium">Memo / Note (Optional)</label>
              <input
                id="description"
                type="text"
                placeholder="What is this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 glass-input text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-danger font-semibold bg-danger/10 border border-danger/20 p-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleNextToConfirm}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary-light hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer text-center"
            >
              Review Transfer
            </button>
          </div>
        )}

        {/* STEP 2: CONFIRM TRANSACTION */}
        {step === 'confirm' && selectedContact && (
          <div className="space-y-6">
            <div className="text-center py-4 bg-white/5 rounded-xl border border-glass-border">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Transfer Amount</p>
              <h2 className="text-3xl font-extrabold text-white mt-2">
                ฿{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              {description && <p className="text-xs text-slate-300 mt-2 font-light">&quot;{description}&quot;</p>}
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between text-xs py-1 border-b border-glass-border/30">
                <span className="text-slate-400">Recipient Name</span>
                <span className="text-white font-semibold">{selectedContact.name}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-glass-border/30">
                <span className="text-slate-400">Account / Destination</span>
                <span className="text-white font-semibold text-right max-w-[200px] truncate">
                  {selectedContact.bankName || 'Digital Wallet address'}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-glass-border/30">
                <span className="text-slate-400">Account Number</span>
                <span className="text-white font-mono font-semibold">
                  {selectedContact.accountNumber || selectedContact.walletAddress}
                </span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-400">Transaction Fee</span>
                <span className="text-accent font-semibold">FREE (฿0.00)</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep('input')}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl border border-glass-border transition-colors cursor-pointer text-center"
              >
                Back
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 bg-gradient-to-r from-accent to-emerald-600 hover:from-accent-light hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer text-center"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm text-white font-semibold">Verifying secure pipeline</p>
              <p className="text-xs text-slate-400">Moving funds securely...</p>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS RECEIPT */}
        {step === 'success' && selectedContact && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center pt-2">
              <div className="w-16 h-16 bg-accent/20 border border-accent/30 rounded-full flex items-center justify-center text-accent animate-bounce">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-white mt-4">Transfer Successful!</h4>
              <p className="text-[10px] text-slate-400 mt-1">Ref ID: {refId}</p>
            </div>

            <div className="bg-white/5 border border-glass-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Amount Sent</span>
                <span className="text-white font-extrabold text-sm">
                  ฿{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Sent To</span>
                <span className="text-white font-semibold">{selectedContact.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Bank Provider</span>
                <span className="text-white font-semibold">{selectedContact.bankName || 'Web3 Network'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Completed On</span>
                <span className="text-slate-300 font-mono text-[10px]">
                  {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            <button
              onClick={resetState}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 px-4 rounded-xl border border-glass-border transition-colors cursor-pointer text-center"
            >
              Done & Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
