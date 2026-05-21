'use client';

interface QuickActionsProps {
  onOpenSend: () => void;
  onOpenTopUp?: () => void;
  onOpenRequest?: () => void;
  onOpenPayBills?: () => void;
}

export default function QuickActions({ onOpenSend, onOpenTopUp, onOpenRequest, onOpenPayBills }: QuickActionsProps) {
  const actions = [
    {
      name: 'Send Money',
      color: 'bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/40 text-primary-light',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      onClick: onOpenSend,
    },
    {
      name: 'Request Pay',
      color: 'bg-secondary/10 hover:bg-secondary/20 border-secondary/20 hover:border-secondary/40 text-secondary-light',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      ),
      onClick: onOpenRequest || (() => alert('Request Money feature is mocked. Try "Send Money"!')),
    },
    {
      name: 'Top Up Cash',
      color: 'bg-accent/10 hover:bg-accent/20 border-accent/20 hover:border-accent/40 text-accent-light',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: onOpenTopUp || (() => alert('Top Up Cash feature is mocked. Funds can be simulated here!')),
    },
    {
      name: 'Pay Utility',
      color: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/40 text-amber-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: onOpenPayBills || (() => alert('Pay Utility bills is currently in simulation. Please try "Send Money" for functional demo!')),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      {actions.map((act) => (
        <button
          key={act.name}
          onClick={act.onClick}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 transform hover:scale-[1.03] glass-btn select-none cursor-pointer ${act.color}`}
        >
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 shadow-inner mb-3">
            {act.icon}
          </div>
          <span className="text-xs font-semibold tracking-wide">{act.name}</span>
        </button>
      ))}
    </div>
  );
}
