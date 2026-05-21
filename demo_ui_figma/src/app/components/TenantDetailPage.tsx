import { useState } from 'react';
import {
  ArrowLeft, Building2, BedDouble, CalendarDays, User, CheckCircle2,
  AlertCircle, Home, Zap, Droplets, Wifi, Send, Receipt, Clock,
  BadgeCheck, ChevronRight, History,
} from 'lucide-react';

interface TenantDetailPageProps {
  onNavigate: (screen: string) => void;
}

interface Bill {
  id: string;
  labelTh: string;
  icon: React.ReactNode;
  amount: number;
  unit: string;
  usage: string;
  due: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: 'paid' | 'pending';
}

const MOCK_TENANT = {
  id: 't1',
  name: 'นาย ก.',
  fullName: 'นายกิตติ แสงดาว',
  room: '304',
  floor: '3',
  type: 'Deluxe Single',
  sqm: 26,
  rent: 4000,
  startDate: '1 ส.ค. 2568',
  moveInDate: 'ส.ค. 2568',
  university: 'จุฬาลงกรณ์มหาวิทยาลัย',
  faculty: 'คณะวิศวกรรมศาสตร์',
  year: 3,
  verified: true,
  avatar: 'ก',
  hasPendingBills: true,
};

const TENANT_BILLS: Bill[] = [
  { id: 'rent',     labelTh: 'ค่าเช่า',          icon: <Home size={16} />,     amount: 4000, unit: '/ เดือน', usage: 'มิ.ย. 2569',       due: '5 มิ.ย. 2569' },
  { id: 'electric', labelTh: 'ค่าไฟฟ้า',          icon: <Zap size={16} />,      amount: 340,  unit: 'หน่วย',   usage: '68 หน่วย × ฿5',    due: '5 มิ.ย. 2569' },
  { id: 'water',    labelTh: 'ค่าน้ำ',             icon: <Droplets size={16} />, amount: 90,   unit: 'หน่วย',   usage: '9 หน่วย × ฿10',    due: '5 มิ.ย. 2569' },
  { id: 'wifi',     labelTh: 'ค่าอินเทอร์เน็ต',   icon: <Wifi size={16} />,     amount: 200,  unit: '/ เดือน', usage: 'Fiber 100 Mbps',    due: '5 มิ.ย. 2569' },
];

const PAYMENT_HISTORY: PaymentHistory[] = [
  { id: 'ph1', date: '3 พ.ค. 2569', amount: 4630, type: 'ค่าเช่า + ค่าน้ำค่าไฟ', status: 'paid' },
  { id: 'ph2', date: '2 เม.ย. 2569', amount: 4580, type: 'ค่าเช่า + ค่าน้ำค่าไฟ', status: 'paid' },
  { id: 'ph3', date: '1 มี.ค. 2569', amount: 4620, type: 'ค่าเช่า + ค่าน้ำค่าไฟ', status: 'paid' },
];

function baht(n: number) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

export default function TenantDetailPage({ onNavigate }: TenantDetailPageProps) {
  const [showSentSuccess, setShowSentSuccess] = useState(false);
  const total = TENANT_BILLS.reduce((s, b) => s + b.amount, 0);

  const handleSendRequest = () => {
    setShowSentSuccess(true);
    setTimeout(() => setShowSentSuccess(false), 3000);
  };

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] overflow-hidden relative">

      {/* ── Header ── */}
      <div className="shrink-0 relative"
        style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1e3a5f 50%,#1e40af 100%)', paddingBottom: 20 }}
      >
        <div className="flex items-center gap-3 px-4 pt-10 pb-3">
          <button
            onClick={() => onNavigate('06')}
            className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center active:bg-white/25"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <p className="text-white/70" style={{ fontSize: '12px' }}>Landlord Console</p>
        </div>

        <div className="px-4 pb-4">
          <p className="text-blue-300" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>Tenant Detail</p>
          <div className="flex items-center gap-3 mt-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)' }}
            >
              <span className="text-white" style={{ fontSize: 22, fontWeight: 900 }}>{MOCK_TENANT.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-white" style={{ fontSize: '18px', fontWeight: 900 }}>{MOCK_TENANT.fullName}</p>
                {MOCK_TENANT.verified && <BadgeCheck size={16} className="text-emerald-400" />}
              </div>
              <p className="text-blue-200" style={{ fontSize: '11px' }}>ห้อง {MOCK_TENANT.room} · {MOCK_TENANT.type}</p>
              <p className="text-blue-300" style={{ fontSize: '10px' }}>เข้าอยู่ {MOCK_TENANT.moveInDate}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-white/15">
              <Building2 size={11} className="text-blue-200" />
              <p className="text-white" style={{ fontSize: '10px', fontWeight: 600 }}>ชั้น {MOCK_TENANT.floor}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-white/15">
              <User size={11} className="text-blue-200" />
              <p className="text-white" style={{ fontSize: '10px', fontWeight: 600 }}>{MOCK_TENANT.university}</p>
            </div>
          </div>
        </div>

        <div className="flex absolute bottom-0 left-0 right-0" style={{ height: 3 }}>
          <div className="flex-1 bg-indigo-500" /><div className="flex-1 bg-blue-400" />
          <div className="flex-1 bg-cyan-400" /><div className="flex-1 bg-emerald-400" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4">

        {/* ── Pending Bills Section ── */}
        {MOCK_TENANT.hasPendingBills ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-gray-400" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                บิลค้างชำระ
              </p>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                <AlertCircle size={11} className="text-amber-500" />
                <p className="text-amber-700" style={{ fontSize: '10px', fontWeight: 600 }}>ครบกำหนด {TENANT_BILLS[0]?.due}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {TENANT_BILLS.map((bill, i) => (
                <div key={bill.id}>
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      bill.id === 'rent' ? 'bg-indigo-100 text-indigo-600'
                      : bill.id === 'electric' ? 'bg-amber-100 text-amber-600'
                      : bill.id === 'water' ? 'bg-cyan-100 text-cyan-600'
                      : 'bg-purple-100 text-purple-600'
                    }`}>
                      {bill.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 600 }}>{bill.labelTh}</p>
                      <p className="text-gray-400" style={{ fontSize: '10px' }}>{bill.usage}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>฿{baht(bill.amount)}</p>
                      <p className="text-gray-400" style={{ fontSize: '10px' }}>{bill.unit}</p>
                    </div>
                  </div>
                  {i < TENANT_BILLS.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 border-t border-gray-100">
                <p className="text-gray-700" style={{ fontSize: '13px', fontWeight: 700 }}>รวมทั้งหมด</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>฿{baht(total)}</p>
              </div>
            </div>

            <button
              onClick={handleSendRequest}
              className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-white"
              style={{
                background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                boxShadow: '0 8px 24px rgba(220,38,38,0.35)',
                fontSize: '15px', fontWeight: 800,
              }}
            >
              <Send size={18} />
              ส่งคำขอชำระเงินให้ผู้เช่า
              <ChevronRight size={16} />
            </button>
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-8 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-gray-900" style={{ fontSize: '15px', fontWeight: 700 }}>ไม่มีบิลค้างชำระ</p>
              <p className="text-gray-500 mt-1" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                ผู้เช่าชำระครบทุกรายการแล้ว
              </p>
            </div>
          </div>
        )}

        {/* ── Payment History ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History size={14} className="text-gray-400" />
            <p className="text-gray-400" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
              ประวัติการชำระเงิน
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {PAYMENT_HISTORY.map((payment, i) => (
              <div key={payment.id}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Receipt size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 600 }}>{payment.type}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-gray-400" style={{ fontSize: '10px' }}>{payment.date}</p>
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5" style={{ fontSize: '9px', fontWeight: 700 }}>
                        <CheckCircle2 size={9} />ชำระแล้ว
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-emerald-600" style={{ fontSize: '14px', fontWeight: 700 }}>฿{baht(payment.amount)}</p>
                  </div>
                </div>
                {i < PAYMENT_HISTORY.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {showSentSuccess && (
        <div className="absolute top-20 left-4 right-4 bg-emerald-600 text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg animate-[slideDown_0.3s_ease-out]">
          <CheckCircle2 size={20} />
          <div className="flex-1">
            <p style={{ fontSize: '13px', fontWeight: 700 }}>ส่งคำขอสำเร็จ!</p>
            <p style={{ fontSize: '11px', opacity: 0.9 }}>ส่งคำขอชำระเงินให้ผู้เช่าแล้ว</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
