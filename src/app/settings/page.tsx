'use client';

import { useState } from 'react';
import { mockUser } from '@/data/mockData';

export default function SettingsPage() {
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [limitAlert, setLimitAlert] = useState(true);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Security profile properties updated successfully inside current session sandbox!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Account Settings</h2>
        <p className="text-xs text-slate-400">Configure profile identity credentials, notifications, and security preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-glass-border">
          <h3 className="text-sm font-bold text-white tracking-wide mb-6">Personal Profile</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <img 
                src={mockUser.avatar} 
                alt="Profile Avatar" 
                className="w-16 h-16 rounded-full border-2 border-primary/40 object-cover"
              />
              <div>
                <p className="text-xs font-bold text-white">Upload New Photo</p>
                <p className="text-[10px] text-slate-400 mt-1">Accepts JPG, PNG formats up to 2MB (Simulated)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name-input" className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs glass-input"
                />
              </div>

              <div>
                <label htmlFor="email-input" className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs glass-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="wallet-input" className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Ethereum Web3 Address
              </label>
              <input
                id="wallet-input"
                type="text"
                value={mockUser.walletAddress}
                disabled
                className="w-full px-4 py-2.5 text-xs glass-input bg-white/5 border-dashed border-glass-border text-slate-400 cursor-not-allowed select-all"
              />
              <span className="text-[9px] text-slate-400 mt-1 block">Web3 account address is verified by cryptographical signature.</span>
            </div>

            <div className="pt-4 border-t border-glass-border/30">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-light text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Save Profile Configuration
              </button>
            </div>
          </form>
        </div>

        {/* Security / Preferences Column */}
        <div className="glass-panel rounded-2xl p-6 border border-glass-border space-y-6">
          <h3 className="text-sm font-bold text-white tracking-wide">Security Sandbox</h3>

          <div className="space-y-4">
            {/* Biometrics Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-white">Biometric Credentials</p>
                <p className="text-[9px] text-slate-400">Unlock via Face ID / Touch ID</p>
              </div>
              <button
                onClick={() => setBiometrics(!biometrics)}
                className={`w-10 h-5.5 rounded-full transition-all duration-300 relative border ${
                  biometrics 
                    ? 'bg-primary border-primary-light/50' 
                    : 'bg-white/5 border-glass-border'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${
                  biometrics ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* 2FA Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-white">Two-Factor Auth (2FA)</p>
                <p className="text-[9px] text-slate-400">Authenticate through SMS OTP</p>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-10 h-5.5 rounded-full transition-all duration-300 relative border ${
                  twoFactor 
                    ? 'bg-primary border-primary-light/50' 
                    : 'bg-white/5 border-glass-border'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${
                  twoFactor ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Limit Warning alerts */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-white">Limit Alert Warns</p>
                <p className="text-[9px] text-slate-400">Alert if spending reaches 80%</p>
              </div>
              <button
                onClick={() => setLimitAlert(!limitAlert)}
                className={`w-10 h-5.5 rounded-full transition-all duration-300 relative border ${
                  limitAlert 
                    ? 'bg-primary border-primary-light/50' 
                    : 'bg-white/5 border-glass-border'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${
                  limitAlert ? 'translate-x-4.5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
