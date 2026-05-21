export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'topup' | 'bill';
  title: string;
  subtitle: string;
  amount: number;
  currency: 'THB' | 'USD';
  category: 'Food & Drinks' | 'Shopping' | 'Utilities' | 'Entertainment' | 'Salary' | 'Transfer' | 'Investment';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  icon: string;
}

export interface CardData {
  id: string;
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  type: 'visa' | 'mastercard' | 'crypto';
  isFrozen: boolean;
  balance: number;
  spendingLimit: number;
  currentSpent: number;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  walletAddress?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
}

export const mockUser = {
  name: 'Natchanon Folk',
  email: 'natchanon@etdacamp.demo',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
  walletAddress: '0x71C...438F',
  balances: {
    THB: 124500.50,
    USD: 3820.75,
    BTC: 0.14205,
    ETH: 2.341
  }
};

export const mockCards: CardData[] = [
  {
    id: 'card-1',
    number: '4532 7812 9023 4812',
    holder: 'NATCHANON FOLK',
    expiry: '12/29',
    cvv: '382',
    type: 'visa',
    isFrozen: false,
    balance: 85200.00,
    spendingLimit: 100000,
    currentSpent: 14800,
    color: 'from-indigo-600 via-purple-600 to-pink-600'
  },
  {
    id: 'card-2',
    number: '5412 8923 1102 7831',
    holder: 'NATCHANON FOLK',
    expiry: '08/28',
    cvv: '109',
    type: 'mastercard',
    isFrozen: false,
    balance: 39300.50,
    spendingLimit: 50000,
    currentSpent: 10699.50,
    color: 'from-cyan-500 via-blue-600 to-indigo-700'
  },
  {
    id: 'card-3',
    number: 'ETH-0x71C7...438F',
    holder: 'METAMASK WALLET',
    expiry: 'N/A',
    cvv: 'N/A',
    type: 'crypto',
    isFrozen: false,
    balance: 89000.00, // Equiv in THB
    spendingLimit: 200000,
    currentSpent: 54000,
    color: 'from-emerald-500 via-teal-600 to-cyan-700'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'receive',
    title: 'Salary Deposit',
    subtitle: 'ETDA Camp Co., Ltd.',
    amount: 65000.00,
    currency: 'THB',
    category: 'Salary',
    status: 'completed',
    date: '2026-05-20T09:00:00Z',
    icon: '💼'
  },
  {
    id: 'tx-2',
    type: 'send',
    title: 'Transfer to Prim',
    subtitle: 'Kasikorn Bank',
    amount: 4500.00,
    currency: 'THB',
    category: 'Transfer',
    status: 'completed',
    date: '2026-05-19T14:32:00Z',
    icon: '💸'
  },
  {
    id: 'tx-3',
    type: 'bill',
    title: 'Electricity Bill',
    subtitle: 'MEA Authority',
    amount: 2150.40,
    currency: 'THB',
    category: 'Utilities',
    status: 'completed',
    date: '2026-05-18T18:15:00Z',
    icon: '⚡'
  },
  {
    id: 'tx-4',
    type: 'send',
    title: 'Starbucks Coffee',
    subtitle: 'Siam Paragon Branch',
    amount: 325.00,
    currency: 'THB',
    category: 'Food & Drinks',
    status: 'completed',
    date: '2026-05-18T08:45:00Z',
    icon: '☕'
  },
  {
    id: 'tx-5',
    type: 'topup',
    title: 'Binance Wallet Top-Up',
    subtitle: 'Ethereum Node',
    amount: 15000.00,
    currency: 'THB',
    category: 'Investment',
    status: 'completed',
    date: '2026-05-17T11:20:00Z',
    icon: '🪙'
  },
  {
    id: 'tx-6',
    type: 'send',
    title: 'Netflix Subscription',
    subtitle: 'Monthly Premium Plan',
    amount: 419.00,
    currency: 'THB',
    category: 'Entertainment',
    status: 'completed',
    date: '2026-05-15T00:05:00Z',
    icon: '🎬'
  },
  {
    id: 'tx-7',
    type: 'send',
    title: 'Uniqlo Clothes',
    subtitle: 'Online Store Purchase',
    amount: 1980.00,
    currency: 'THB',
    category: 'Shopping',
    status: 'completed',
    date: '2026-05-14T15:10:00Z',
    icon: '🛍️'
  },
  {
    id: 'tx-8',
    type: 'receive',
    title: 'Refund from Agoda',
    subtitle: 'Hotel Cancellation',
    amount: 3820.00,
    currency: 'THB',
    category: 'Transfer',
    status: 'completed',
    date: '2026-05-12T10:40:00Z',
    icon: '🏨'
  },
  {
    id: 'tx-9',
    type: 'send',
    title: 'Steam Games',
    subtitle: 'Valve Software purchase',
    amount: 1250.00,
    currency: 'THB',
    category: 'Entertainment',
    status: 'failed',
    date: '2026-05-10T21:30:00Z',
    icon: '🎮'
  }
];

export const mockContacts: Contact[] = [
  {
    id: 'c-1',
    name: 'Prim Pimsara',
    email: 'prim.p@etdacamp.demo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80',
    bankName: 'Kasikorn Bank',
    accountNumber: '098-X-XX342-1'
  },
  {
    id: 'c-2',
    name: 'Mona Methasit',
    email: 'methasit.m@etdacamp.demo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
    bankName: 'Siam Commercial Bank',
    accountNumber: '112-X-XX984-2'
  },
  {
    id: 'c-3',
    name: 'Chaiwat K.',
    email: 'chaiwat.k@etdacamp.demo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80',
    bankName: 'Bangkok Bank',
    accountNumber: '243-X-XX455-8'
  },
  {
    id: 'c-4',
    name: 'Kavin T.',
    email: 'kavin.t@etdacamp.demo',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80',
    walletAddress: '0x99A...7B82'
  }
];

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 'g-1',
    name: 'New Gaming Laptop',
    target: 55000,
    current: 42000,
    color: 'bg-indigo-500'
  },
  {
    id: 'g-2',
    name: 'Japan Trip 2026',
    target: 80000,
    current: 35000,
    color: 'bg-cyan-500'
  },
  {
    id: 'g-3',
    name: 'Ethereum Accumulation',
    target: 150000,
    current: 110000,
    color: 'bg-emerald-500'
  }
];

export const mockWeeklyAnalytics = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  income: [65000, 2000, 0, 500, 3820, 0, 0],
  expense: [4500, 2150, 325, 1980, 419, 1250, 600]
};

export const mockCategoryExpenses = [
  { category: 'Food & Drinks', amount: 3820, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { category: 'Shopping', amount: 8490, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { category: 'Utilities', amount: 4120, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { category: 'Entertainment', amount: 5690, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { category: 'Transfer', amount: 12500, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { category: 'Investment', amount: 15000, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
];
