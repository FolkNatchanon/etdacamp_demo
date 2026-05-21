import { useState, useCallback } from 'react';
import {
  ArrowLeft, Building2, BedDouble, CalendarDays, Zap, Droplets,
  Home, ChevronRight, CheckCircle2, Copy, Check, CreditCard,
  ShieldCheck, Lock, Wifi, AlertCircle, Star, Send, MessageSquare,
  Receipt, ThumbsUp, Camera, ChevronDown, ClipboardList, Clock,
  Phone, CircleX, CircleCheck, RefreshCw, ScanLine, ScanFace, EyeOff, X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import ReceiveCredentialModal from './ReceiveCredentialModal';

interface DormPaymentPageProps {
  onNavigate: (screen: string) => void;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab     = 'bills' | 'requests' | 'review';
type PayView = 'bills' | 'pin' | 'options' | 'promptpay' | 'transfer' | 'card' | 'success';

interface Bill {
  id: string;
  labelTh: string;
  icon: React.ReactNode;
  amount: number;
  unit: string;
  usage: string;
  due: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const BILLS: Bill[] = [
  { id: 'rent',     labelTh: 'ค่าเช่า',          icon: <Home size={16} />,     amount: 4500, unit: '/ เดือน', usage: 'มิ.ย. 2569',       due: '5 มิ.ย. 2569' },
  { id: 'electric', labelTh: 'ค่าไฟฟ้า',          icon: <Zap size={16} />,      amount: 320,  unit: 'หน่วย',   usage: '64 หน่วย × ฿5',    due: '5 มิ.ย. 2569' },
  { id: 'water',    labelTh: 'ค่าน้ำ',             icon: <Droplets size={16} />, amount: 80,   unit: 'หน่วย',   usage: '8 หน่วย × ฿10',    due: '5 มิ.ย. 2569' },
  { id: 'wifi',     labelTh: 'ค่าอินเทอร์เน็ต',   icon: <Wifi size={16} />,     amount: 200,  unit: '/ เดือน', usage: 'Fiber 100 Mbps',    due: '5 มิ.ย. 2569' },
];

const BANK_INFO = {
  account: '123-4-56789-0',
  name: 'นายสมศักดิ์ เจ้าของหอ',
  ref: 'A502-JUN69',
};

const REVIEW_CATEGORIES = [
  { id: 'clean',    label: 'ความสะอาด' },
  { id: 'safety',   label: 'ความปลอดภัย' },
  { id: 'internet', label: 'อินเทอร์เน็ต' },
  { id: 'staff',    label: 'เจ้าหน้าที่' },
  { id: 'value',    label: 'ความคุ้มค่า' },
];

const EXISTING_REVIEWS = [
  { name: 'สมหญิง ร.',  date: 'เม.ย. 2569', overall: 5, text: 'หอพักสะอาด ปลอดภัยมาก พนักงานใจดี WiFi เร็วมาก คุ้มค่ากับราคามากๆ แนะนำเลย!', helpful: 12 },
  { name: 'วิชาญ ป.',   date: 'มี.ค. 2569', overall: 4, text: 'ห้องกว้าง สะอาด ทำเลดี ใกล้ BTS แต่ที่จอดรถค่อนข้างน้อย โดยรวมโอเค', helpful: 8 },
  { name: 'ปิยะ ต.',    date: 'ก.พ. 2569', overall: 5, text: 'อยู่มา 6 เดือนแล้ว พึงพอใจมาก ห้องน้ำสะอาด น้ำไหลแรง ไฟฟ้าไม่แพง', helpful: 5 },
];

function baht(n: number) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all active:scale-95 ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500 active:bg-indigo-100 active:text-indigo-600'}`}
      style={{ fontSize: '10px', fontWeight: 700 }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
    </button>
  );
}

function StarRow({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          <Star
            size={26}
            className={`transition-colors ${i <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Residence data + card ────────────────────────────────────────────────────

interface Residence {
  id: string;
  name: string;
  room: string;
  floor: string;
  type: string;
  sqm: number;
  rent: number;
  startDate: string;
  endDate: string;
  daysLeft: number;
  gradient: string;
  accentColors: string[];
  bills: Bill[];
  hasPendingBills: boolean;
}

const RESIDENCES: Residence[] = [
  {
    id: 'r1',
    name: 'Happy Campus Dorm',
    room: 'A-502',
    floor: '5',
    type: 'Suite',
    sqm: 36,
    rent: 4500,
    startDate: '1 มิ.ย. 69',
    endDate: '31 พ.ค. 70',
    daysLeft: 347,
    gradient: 'linear-gradient(145deg,#0f172a 0%,#1e3a5f 55%,#1e40af 100%)',
    accentColors: ['bg-indigo-500', 'bg-blue-400', 'bg-cyan-400', 'bg-emerald-400'],
    hasPendingBills: true,
    bills: [
      { id: 'rent',     labelTh: 'ค่าเช่า',          icon: <Home size={16} />,     amount: 4500, unit: '/ เดือน', usage: 'มิ.ย. 2569',       due: '5 มิ.ย. 2569' },
      { id: 'electric', labelTh: 'ค่าไฟฟ้า',          icon: <Zap size={16} />,      amount: 320,  unit: 'หน่วย',   usage: '64 หน่วย × ฿5',    due: '5 มิ.ย. 2569' },
      { id: 'water',    labelTh: 'ค่าน้ำ',             icon: <Droplets size={16} />, amount: 80,   unit: 'หน่วย',   usage: '8 หน่วย × ฿10',    due: '5 มิ.ย. 2569' },
      { id: 'wifi',     labelTh: 'ค่าอินเทอร์เน็ต',   icon: <Wifi size={16} />,     amount: 200,  unit: '/ เดือน', usage: 'Fiber 100 Mbps',    due: '5 มิ.ย. 2569' },
    ],
  },
  {
    id: 'r2',
    name: 'The Nest Residence',
    room: 'B-101',
    floor: '1',
    type: 'Studio',
    sqm: 22,
    rent: 2800,
    startDate: '1 มี.ค. 69',
    endDate: '28 ก.พ. 70',
    daysLeft: 285,
    gradient: 'linear-gradient(145deg,#134e4a 0%,#0f766e 55%,#0d9488 100%)',
    accentColors: ['bg-teal-600', 'bg-teal-400', 'bg-emerald-400', 'bg-cyan-300'],
    hasPendingBills: false,
    bills: [],
  },
];

type DormSubTab = 'bills' | 'status';

function ResidenceCard({ r, onPay }: { r: Residence; onPay: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [subTab, setSubTab] = useState<DormSubTab>('bills');
  const total = r.bills.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="mx-4 rounded-2xl overflow-hidden border border-white/10 shadow-md">
      {/* ── Collapsed header (always visible) ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left active:opacity-80"
        style={{ background: r.gradient }}
      >
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <Building2 size={17} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white truncate" style={{ fontSize: 13, fontWeight: 800 }}>{r.name}</p>
          <p className="text-white/60" style={{ fontSize: 10 }}>ห้อง {r.room} · {r.type} {r.sqm} ตร.ม.</p>
        </div>
        <div className="shrink-0 text-right mr-1">
          <p className="text-white" style={{ fontSize: 13, fontWeight: 800 }}>฿{r.rent.toLocaleString()}</p>
          <p className="text-white/50" style={{ fontSize: 9 }}>/เดือน</p>
        </div>
        <ChevronDown
          size={16}
          className="text-white/50 shrink-0 transition-transform"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* ── Expanded detail ── */}
      {expanded && (
        <>
          <div className="px-4 pt-3 pb-3" style={{ background: r.gradient }}>
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <BedDouble size={11} className="text-white/50" />
                <p className="text-white/70" style={{ fontSize: 10 }}>ชั้น {r.floor}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={11} className="text-white/50" />
                <p className="text-white/70" style={{ fontSize: 10 }}>{r.startDate} – {r.endDate}</p>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-emerald-300" style={{ fontSize: 10, fontWeight: 600 }}>สัญญาเช่า · Active</p>
              </div>
              <p className="text-white/40" style={{ fontSize: 9 }}>เหลือ {r.daysLeft} วัน</p>
            </div>
          </div>
          <div className="flex" style={{ height: 3 }}>
            {r.accentColors.map(c => <div key={c} className={`flex-1 ${c}`} />)}
          </div>

          {/* ── Sub-tabs ── */}
          <div className="flex border-b border-gray-100 bg-white">
            {([['bills','บิล', <Receipt size={13} />], ['status','การชำระเงิน', <CreditCard size={13} />]] as const).map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => setSubTab(id as DormSubTab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-b-2 transition-all ${subTab === id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}
                style={{ fontSize: '12px', fontWeight: subTab === id ? 700 : 500 }}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* ── Bills Tab Content ── */}
          {subTab === 'bills' && (
            <div className="bg-[#F5F6FA] px-4 py-4 space-y-3">
              {r.hasPendingBills ? (
                <>
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2.5">
                    <AlertCircle size={13} className="text-amber-500 shrink-0" />
                    <p className="text-amber-700" style={{ fontSize: '11px', fontWeight: 500 }}>
                      ครบกำหนดชำระ <span style={{ fontWeight: 700 }}>{r.bills[0]?.due || '5 มิ.ย. 2569'}</span>
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {r.bills.map((bill, i) => (
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
                        {i < r.bills.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 border-t border-gray-100">
                      <p className="text-gray-700" style={{ fontSize: '13px', fontWeight: 700 }}>รวมทั้งหมด</p>
                      <p style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af' }}>฿{baht(total)}</p>
                    </div>
                  </div>

                  <button
                    onClick={onPay}
                    className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-white"
                    style={{
                      background: 'linear-gradient(135deg,#1e40af,#4f46e5)',
                      boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                      fontSize: '15px', fontWeight: 800,
                    }}
                  >
                    <ShieldCheck size={18} />
                    ชำระเงิน ฿{baht(total)}
                    <ChevronRight size={16} />
                  </button>
                  <div className="flex items-center justify-center gap-1.5">
                    <Lock size={11} className="text-gray-400" />
                    <p className="text-gray-400" style={{ fontSize: '10px' }}>ปลอดภัย · เข้ารหัส 256-bit</p>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-8 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-900" style={{ fontSize: '15px', fontWeight: 700 }}>ไม่มีบิลค้างชำระ</p>
                    <p className="text-gray-500 mt-1" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                      เจ้าของหอยังไม่ได้ออกบิลสำหรับเดือนนี้
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Payment Status Tab Content ── */}
          {subTab === 'status' && (
            <div className="bg-[#F5F6FA] px-4 py-4">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-8 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center">
                  <Clock size={32} className="text-blue-500" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900" style={{ fontSize: '15px', fontWeight: 700 }}>ยังไม่มีประวัติการชำระ</p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                    ประวัติการชำระเงินจะแสดงที่นี่เมื่อคุณชำระบิลแล้ว
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Bills tab ────────────────────────────────────────────────────────────────

function BillsTab({ onPay }: { onPay: () => void }) {
  const total = BILLS.reduce((s, b) => s + b.amount, 0);
  return (
    <div className="px-4 space-y-4">
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2.5">
        <AlertCircle size={13} className="text-amber-500 shrink-0" />
        <p className="text-amber-700" style={{ fontSize: '11px', fontWeight: 500 }}>
          ครบกำหนดชำระ <span style={{ fontWeight: 700 }}>5 มิ.ย. 2569</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {BILLS.map((bill, i) => (
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
            {i < BILLS.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-700" style={{ fontSize: '13px', fontWeight: 700 }}>รวมทั้งหมด</p>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af' }}>฿{baht(total)}</p>
        </div>
      </div>

      <button
        onClick={onPay}
        className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-white"
        style={{
          background: 'linear-gradient(135deg,#1e40af,#4f46e5)',
          boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
          fontSize: '15px', fontWeight: 800,
        }}
      >
        <ShieldCheck size={18} />
        ชำระเงิน ฿{baht(total)}
        <ChevronRight size={16} />
      </button>
      <div className="flex items-center justify-center gap-1.5 pb-4">
        <Lock size={11} className="text-gray-400" />
        <p className="text-gray-400" style={{ fontSize: '10px' }}>ปลอดภัย · เข้ารหัส 256-bit</p>
      </div>
    </div>
  );
}

// ─── Rent Request Status tab ─────────────────────────────────────────────────

type RequestStatus = 'pending' | 'acknowledged' | 'vc_requested' | 'approved' | 'rejected' | 'cancelled';

interface VCField {
  id: string;
  labelTh: string;
  required: boolean;
}

interface RentRequest {
  id: string;
  dorm: string;
  room: string;
  type: string;
  price: number;
  submittedAt: string;
  status: RequestStatus;
  refNo: string;
  ownerName: string;
  ownerPhone: string;
  vcFields?: VCField[];
  downPayment?: number;
}

const MOCK_REQUESTS: RentRequest[] = [
  {
    id: 'req1',
    dorm: 'Happy Campus Dorm',
    room: 'A-502',
    type: 'Suite · 36 ตร.ม.',
    price: 6500,
    submittedAt: '17 พ.ค. 2569 · 14:32',
    status: 'vc_requested',
    refNo: 'REQ-2569-0847',
    ownerName: 'นายสมศักดิ์ เจ้าของหอ',
    ownerPhone: '081-234-5678',
    vcFields: [
      { id: 'name',          labelTh: 'ชื่อ-นามสกุล',    required: true  },
      { id: 'studentStatus', labelTh: 'สถานะนักศึกษา',   required: true  },
      { id: 'university',    labelTh: 'มหาวิทยาลัย',     required: true  },
      { id: 'faculty',       labelTh: 'คณะ',              required: false },
      { id: 'year',          labelTh: 'ชั้นปี',           required: false },
    ],
  },
  {
    id: 'req2',
    dorm: 'The Nest Residence',
    room: 'B-305',
    type: 'Standard Single · 22 ตร.ม.',
    price: 2800,
    submittedAt: '10 พ.ค. 2569 · 09:15',
    status: 'rejected',
    refNo: 'REQ-2569-0712',
    ownerName: 'นางสาวมาลี หอพัก',
    ownerPhone: '089-876-5432',
  },
  {
    id: 'req3',
    dorm: 'Urban Hub Living',
    room: 'C-304',
    type: 'Deluxe Single · 28 ตร.ม.',
    price: 4200,
    submittedAt: '5 พ.ค. 2569 · 10:00',
    status: 'approved',
    refNo: 'REQ-2569-0601',
    ownerName: 'นายธนา อาคารชุด',
    ownerPhone: '082-555-1234',
    downPayment: 8400,
  },
];

const STATUS_STEPS: { key: RequestStatus; label: string; labelTh: string }[] = [
  { key: 'pending',       label: 'Submitted',    labelTh: 'ส่งคำขอแล้ว' },
  { key: 'acknowledged',  label: 'Acknowledged', labelTh: 'เจ้าของรับทราบ' },
  { key: 'vc_requested',  label: 'Verify VC',    labelTh: 'ตรวจสอบ VC' },
  { key: 'approved',      label: 'Approved',     labelTh: 'อนุมัติแล้ว' },
];

const STATUS_ORDER: RequestStatus[] = ['pending', 'acknowledged', 'vc_requested', 'approved'];

function statusIndex(s: RequestStatus) {
  return STATUS_ORDER.indexOf(s);
}

function RequestCard({ req, onConsent, onPayNow }: { req: RentRequest; onConsent: (data: ConsentData) => void; onPayNow: () => void }) {
  const [expanded, setExpanded]         = useState(false);
  const [sharedOptional, setSharedOptional] = useState<Set<string>>(new Set());
  const [vcShared, setVcShared]         = useState(false);
  const [vcScanStep, setVcScanStep]     = useState<'scan' | 'confirm'>('scan');

  const isTerminal   = req.status === 'approved' || req.status === 'rejected' || req.status === 'cancelled';
  const isRejected   = req.status === 'rejected';
  const isApproved   = req.status === 'approved';
  const isVcReq      = req.status === 'vc_requested';
  const currentStep  = isTerminal
    ? (isApproved ? STATUS_ORDER.length - 1 : -1)
    : statusIndex(req.status);

  const statusColors: Record<RequestStatus, string> = {
    pending:      'bg-amber-50 text-amber-700 border-amber-200',
    acknowledged: 'bg-blue-50 text-blue-700 border-blue-200',
    vc_requested: 'bg-violet-50 text-violet-700 border-violet-200',
    approved:     'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected:     'bg-red-50 text-red-600 border-red-200',
    cancelled:    'bg-gray-50 text-gray-500 border-gray-200',
  };

  const statusLabel: Record<RequestStatus, string> = {
    pending:      'รอการตอบรับ',
    acknowledged: 'เจ้าของรับทราบแล้ว',
    vc_requested: 'ขอตรวจสอบ VC',
    approved:     'อนุมัติ ✓',
    rejected:     'ปฏิเสธคำขอ',
    cancelled:    'ยกเลิกแล้ว',
  };

  return (
    <div className={`bg-white rounded-3xl border shadow-sm overflow-hidden ${isRejected ? 'border-red-100' : isApproved ? 'border-emerald-100' : 'border-gray-100'}`}>
      {/* Card header */}
      <div
        className={`px-4 py-1.5 flex items-center gap-2 ${isRejected ? 'bg-red-500' : isApproved ? 'bg-emerald-500' : 'bg-indigo-600'}`}
      >
        <span className="text-white text-xs font-mono opacity-80">{req.refNo}</span>
        <div className="flex-1" />
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColors[req.status]}`}>
          {statusLabel[req.status]}
        </span>
      </div>

      {/* Main info */}
      <button
        className="w-full px-4 pt-3.5 pb-3 flex items-start gap-3 text-left active:bg-gray-50"
        onClick={() => setExpanded(v => !v)}
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isRejected ? 'bg-red-100' : isApproved ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
          {isRejected
            ? <CircleX size={20} className="text-red-500" />
            : isApproved
            ? <CircleCheck size={20} className="text-emerald-500" />
            : <Clock size={20} className="text-indigo-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 truncate" style={{ fontSize: 13, fontWeight: 700 }}>{req.dorm}</p>
          <p className="text-gray-500" style={{ fontSize: 11 }}>ห้อง {req.room} · {req.type}</p>
          <p className="text-gray-400 mt-0.5" style={{ fontSize: 10 }}>ส่งเมื่อ {req.submittedAt}</p>
        </div>
        <div className="shrink-0 text-right">
          <p style={{ fontSize: 15, fontWeight: 800, color: '#1e40af' }}>฿{req.price.toLocaleString()}</p>
          <p className="text-gray-400" style={{ fontSize: 10 }}>/เดือน</p>
        </div>
      </button>

      {/* Progress timeline — only for non-rejected */}
      {!isRejected && !isTerminal && (
        <div className="px-4 pb-4">
          <div className="flex items-start gap-0">
            {STATUS_STEPS.map((step, i) => {
              const done    = i <= currentStep;
              const current = i === currentStep;
              const last    = i === STATUS_STEPS.length - 1;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    {/* dot */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                      done
                        ? current
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-200 bg-white'
                    }`}>
                      {done && <CheckCircle2 size={13} className="text-white" />}
                    </div>
                    {/* connector line */}
                    {!last && (
                      <div className={`flex-1 h-0.5 transition-colors ${i < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <p className={`text-center mt-1.5 leading-tight ${done ? 'text-indigo-700' : 'text-gray-400'}`}
                    style={{ fontSize: 9, fontWeight: done ? 700 : 400, maxWidth: 52 }}>
                    {step.labelTh}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── VC request: STEP 1 — scan QR ── */}
          {isVcReq && !vcShared && vcScanStep === 'scan' && req.vcFields && (
            <div className="mt-3 space-y-2.5">
              <div className="bg-violet-50 border border-violet-200 rounded-2xl px-3 py-2.5 flex gap-2 items-start">
                <ScanLine size={13} className="text-violet-600 shrink-0 mt-0.5" />
                <p className="text-violet-700" style={{ fontSize: 11, lineHeight: 1.5 }}>
                  เจ้าของหอส่งคำขอ <span style={{ fontWeight: 700 }}>Verified Credential</span> — สแกน QR ด้านล่างด้วย Trust Wallet ก่อนยืนยันข้อมูล
                </p>
              </div>

              {/* QR from landlord */}
              <div className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center gap-3 py-4">
                <div className="p-2.5 rounded-xl border-2 border-violet-100">
                  <QRCodeSVG
                    value={JSON.stringify({ action: 'trust://vc-request', ref: req.refNo, fields: req.vcFields.map(f => f.id) })}
                    size={130}
                    bgColor="#fff"
                    fgColor="#0f172a"
                    level="M"
                  />
                </div>
                <div className="text-center px-4">
                  <p className="text-gray-700" style={{ fontSize: 12, fontWeight: 700 }}>สแกน QR จากเจ้าของหอ</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 10 }}>เปิด Trust Wallet → กดสแกน → ชี้กล้องที่ QR นี้</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                  <Lock size={10} className="text-gray-400" />
                  <p className="text-gray-500 font-mono" style={{ fontSize: 10 }}>{req.refNo}</p>
                </div>
              </div>

              {/* Simulate scan */}
              <button
                onClick={() => setVcScanStep('confirm')}
                className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', fontSize: 13, fontWeight: 800, boxShadow: '0 6px 16px rgba(79,70,229,0.3)' }}
              >
                <ScanLine size={15} />
                จำลอง: สแกน QR แล้ว
              </button>
            </div>
          )}

          {/* ── VC request: STEP 2 — review fields & confirm ── */}
          {isVcReq && !vcShared && vcScanStep === 'confirm' && req.vcFields && (
            <div className="mt-3 space-y-2.5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2.5 flex gap-2 items-start">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-emerald-700" style={{ fontSize: 11, lineHeight: 1.5 }}>
                  สแกนสำเร็จ! ตรวจสอบข้อมูลที่เจ้าของหอขอ แล้วเลือกว่าต้องการแชร์อะไรบ้าง
                </p>
              </div>

              {/* Fields list */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-gray-400" />
                  <p className="text-gray-500" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ข้อมูลที่ขอ · Selective Disclosure</p>
                </div>
                {req.vcFields.map((field, i) => {
                  const isChecked = field.required || sharedOptional.has(field.id);
                  return (
                    <div key={field.id}>
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {field.required
                            ? <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            : <div
                                onClick={() => setSharedOptional(prev => {
                                  const next = new Set(prev);
                                  next.has(field.id) ? next.delete(field.id) : next.add(field.id);
                                  return next;
                                })}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}
                              >
                                {isChecked && <CheckCircle2 size={10} className="text-white" />}
                              </div>
                          }
                          <p className="text-gray-800" style={{ fontSize: 12 }}>{field.labelTh}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {field.required
                            ? <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>จำเป็น</span>
                            : <>
                                <span className="bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>ไม่บังคับ</span>
                                <span className={`rounded-full px-1.5 py-0.5 border ${isChecked ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`} style={{ fontSize: 9, fontWeight: 700 }}>
                                  {isChecked ? 'แชร์ ✓' : 'ไม่แชร์'}
                                </span>
                              </>
                          }
                        </div>
                      </div>
                      {i < req.vcFields!.length - 1 && <div className="h-px bg-gray-50 mx-3" />}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setVcScanStep('scan')}
                  className="px-3 py-2.5 rounded-2xl bg-gray-100 text-gray-500 active:bg-gray-200"
                  style={{ fontSize: 12 }}
                >
                  ← กลับ
                </button>
                <button
                  onClick={() => {
                    const shared = req.vcFields!
                      .filter(f => f.required || sharedOptional.has(f.id))
                      .map(f => ({ labelTh: f.labelTh }));
                    const withheld = [
                      ...req.vcFields!
                        .filter(f => !f.required && !sharedOptional.has(f.id))
                        .map(f => ({ labelTh: f.labelTh })),
                      { labelTh: 'รหัสบัตรประชาชน (National ID)' },
                    ];
                    onConsent({ dormName: req.dorm, shared, withheld, onApprove: () => setVcShared(true) });
                  }}
                  className="flex-1 py-2.5 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', fontSize: 13, fontWeight: 800, boxShadow: '0 6px 16px rgba(79,70,229,0.3)' }}
                >
                  <ScanFace size={15} />
                  ยืนยันส่งข้อมูล
                </button>
              </div>
            </div>
          )}

          {isVcReq && vcShared && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2.5 flex gap-2 items-start">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-emerald-700" style={{ fontSize: 11, lineHeight: 1.5 }}>
                ส่งข้อมูลแล้ว! เจ้าของหอกำลังตรวจสอบ · รอการอนุมัติ
              </p>
            </div>
          )}

          {/* Current step info */}
          {req.status === 'acknowledged' && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2.5 flex gap-2 items-start">
              <Phone size={13} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-blue-700" style={{ fontSize: 11 }}>
                เจ้าของหอรับทราบแล้ว รอการส่งคำขอตรวจสอบข้อมูล (VC)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rejected reason */}
      {isRejected && (
        <div className="mx-4 mb-4 bg-red-50 border border-red-200 rounded-2xl px-3 py-2.5 flex gap-2">
          <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-600" style={{ fontSize: 11 }}>
            ห้องได้รับการจองแล้ว เจ้าของหอขอปฏิเสธคำขอ กรุณาเลือกห้องอื่น
          </p>
        </div>
      )}

      {/* Approved: down payment required */}
      {isApproved && (
        <div className="mx-4 mb-4 space-y-2.5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2.5 flex gap-2">
            <CircleCheck size={13} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-emerald-700" style={{ fontSize: 11 }}>
              อนุมัติแล้ว! กรุณาชำระเงินมัดจำก่อนทำสัญญา
            </p>
          </div>
          {req.downPayment && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-3 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <AlertCircle size={12} className="text-amber-500" />
                <p className="text-amber-700" style={{ fontSize: 11, fontWeight: 700 }}>ต้องชำระเงินมัดจำ</p>
              </div>
              <div className="px-3 py-3 space-y-1.5">
                {[
                  ['จำนวนเงินมัดจำ', `฿${req.downPayment.toLocaleString()} (2 เดือน)`],
                  ['ครบกำหนด',      '26 พ.ค. 2569'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <p className="text-gray-400" style={{ fontSize: 11 }}>{l}</p>
                    <p className="text-gray-900" style={{ fontSize: 11, fontWeight: 700 }}>{v}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={onPayNow}
                className="w-full py-3 flex items-center justify-center gap-2 text-white active:opacity-80 transition-all"
                style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: 13, fontWeight: 800 }}
              >
                <Lock size={14} />
                ชำระเงินมัดจำ ฿{req.downPayment.toLocaleString()}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expandable detail + actions */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 py-3 space-y-3">
          <div className="bg-gray-50 rounded-2xl px-3 py-3 space-y-1.5">
            {[
              ['เจ้าของหอ',  req.ownerName],
              ['เบอร์โทร',   req.ownerPhone],
              ['ค่าเช่า',    `฿${req.price.toLocaleString()} / เดือน`],
              ['เลขอ้างอิง', req.refNo],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <p className="text-gray-500" style={{ fontSize: 11 }}>{l}</p>
                <p className="text-gray-900 font-mono" style={{ fontSize: 11, fontWeight: 600 }}>{v}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <a
              href={`tel:${req.ownerPhone}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-2xl py-2.5 active:bg-indigo-100"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              <Phone size={14} /> โทรหาเจ้าของหอ
            </a>
            {!isTerminal && (
              <button
                className="flex items-center justify-center gap-1.5 border border-red-200 text-red-500 rounded-2xl px-3 py-2.5 active:bg-red-50"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                <CircleX size={14} /> ยกเลิก
              </button>
            )}
            {isRejected && (
              <button
                className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white rounded-2xl py-2.5 active:bg-indigo-700"
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                <RefreshCw size={14} /> หาห้องใหม่
              </button>
            )}
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-center gap-1 py-2 border-t border-gray-50 text-gray-400 active:bg-gray-50"
        style={{ fontSize: 11 }}
      >
        {expanded ? <><ChevronDown size={13} className="rotate-180" />ย่อลง</> : <><ChevronDown size={13} />รายละเอียด</>}
      </button>
    </div>
  );
}

function RentStatusTab({ onConsent, onPayNow }: { onConsent: (data: ConsentData) => void; onPayNow: () => void }) {
  return (
    <div className="px-4 space-y-4 pb-4">
      {/* Header summary */}
      <div className="flex gap-3">
        {[
          { label: 'คำขอทั้งหมด', value: MOCK_REQUESTS.length, color: 'text-gray-900' },
          { label: 'รอดำเนินการ', value: MOCK_REQUESTS.filter(r => !['approved','rejected','cancelled'].includes(r.status)).length, color: 'text-indigo-700' },
          { label: 'อนุมัติแล้ว', value: MOCK_REQUESTS.filter(r => r.status === 'approved').length, color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-2.5 text-center">
            <p className={s.color} style={{ fontSize: 18, fontWeight: 900 }}>{s.value}</p>
            <p className="text-gray-400" style={{ fontSize: 9, marginTop: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        คำขอเช่าของคุณ
      </p>

      {MOCK_REQUESTS.map(req => (
        <RequestCard key={req.id} req={req} onConsent={onConsent} onPayNow={onPayNow} />
      ))}

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 flex gap-2">
        <ClipboardList size={14} className="text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-indigo-700" style={{ fontSize: 11, lineHeight: 1.5 }}>
          คำขอจะถูกเก็บไว้ 30 วัน หากไม่มีการตอบรับระบบจะยกเลิกอัตโนมัติ
        </p>
      </div>
    </div>
  );
}

// ─── Review tab ───────────────────────────────────────────────────────────────

function ReviewTab() {
  const [overall, setOverall]     = useState(0);
  const [catRatings, setCatRatings] = useState<Record<string, number>>({});
  const [text, setText]           = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<Set<number>>(new Set());

  const catAvg = Object.values(catRatings).length
    ? Object.values(catRatings).reduce((s, v) => s + v, 0) / Object.values(catRatings).length
    : 0;

  const canSubmit = overall > 0 && text.trim().length >= 10;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setShowForm(false);
  };

  const toggleHelpful = (i: number) => {
    setHelpfulIds(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="px-4 space-y-4 pb-6">
      {/* Overall rating summary */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#1e40af', lineHeight: 1 }}>4.8</p>
            <div className="flex gap-0.5 justify-center mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-200 fill-yellow-200'} />
              ))}
            </div>
            <p className="text-gray-400 mt-1" style={{ fontSize: '10px' }}>จาก {EXISTING_REVIEWS.length + (submitted ? 1 : 0)} รีวิว</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[
              { stars: 5, pct: 75 }, { stars: 4, pct: 18 },
              { stars: 3, pct: 5 },  { stars: 2, pct: 1 }, { stars: 1, pct: 1 },
            ].map(r => (
              <div key={r.stars} className="flex items-center gap-2">
                <p className="text-gray-500 w-2 shrink-0" style={{ fontSize: '10px' }}>{r.stars}</p>
                <Star size={9} className="text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <p className="text-gray-400 w-5 text-right shrink-0" style={{ fontSize: '10px' }}>{r.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write review CTA */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3.5 active:bg-indigo-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <MessageSquare size={17} className="text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-indigo-800" style={{ fontSize: '13px', fontWeight: 700 }}>เขียนรีวิวหอพักนี้</p>
              <p className="text-indigo-500" style={{ fontSize: '10px' }}>แชร์ประสบการณ์ให้ผู้เช่าคนอื่น</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-indigo-400" />
        </button>
      )}

      {/* Review form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-4 py-5 space-y-4">
          <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 800 }}>รีวิวของคุณ</p>

          {/* Overall */}
          <div>
            <p className="text-gray-600 mb-2" style={{ fontSize: '11px', fontWeight: 600 }}>คะแนนรวม</p>
            <StarRow value={overall} onChange={setOverall} />
            {overall > 0 && (
              <p className="text-indigo-600 mt-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                {['','แย่มาก','พอใช้','ปานกลาง','ดีมาก','ยอดเยี่ยม!'][overall]}
              </p>
            )}
          </div>

          {/* Category ratings */}
          <div>
            <p className="text-gray-600 mb-2" style={{ fontSize: '11px', fontWeight: 600 }}>คะแนนรายด้าน</p>
            <div className="space-y-2">
              {REVIEW_CATEGORIES.map(cat => (
                <div key={cat.id} className="flex items-center justify-between">
                  <p className="text-gray-700" style={{ fontSize: '12px' }}>{cat.label}</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} onClick={() => setCatRatings(p => ({ ...p, [cat.id]: i }))}>
                        <Star size={16} className={`transition-colors ${i <= (catRatings[cat.id] || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-gray-600 mb-1.5" style={{ fontSize: '11px', fontWeight: 600 }}>ความคิดเห็น</p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="เล่าประสบการณ์การอยู่หอพักนี้ให้คนอื่นฟัง… (อย่างน้อย 10 ตัวอักษร)"
              rows={4}
              className="w-full border border-gray-200 rounded-2xl px-3 py-2.5 bg-gray-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors resize-none"
              style={{ fontSize: '12px', lineHeight: 1.6 }}
            />
            <p className="text-gray-400 text-right mt-1" style={{ fontSize: '10px' }}>{text.length} ตัวอักษร</p>
          </div>

          {/* Photo */}
          <button className="w-full flex items-center gap-3 border border-dashed border-gray-300 rounded-2xl px-4 py-3 active:bg-gray-50">
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <Camera size={16} className="text-gray-500" />
            </div>
            <div className="text-left">
              <p className="text-gray-600" style={{ fontSize: '12px', fontWeight: 600 }}>เพิ่มรูปภาพ (ไม่บังคับ)</p>
              <p className="text-gray-400" style={{ fontSize: '10px' }}>แนบรูปห้อง สิ่งอำนวยความสะดวก</p>
            </div>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 active:bg-gray-200"
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${canSubmit ? 'bg-indigo-600 text-white active:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              style={{ fontSize: '13px', fontWeight: 700 }}
            >
              <Send size={14} />
              ส่งรีวิว
            </button>
          </div>
        </div>
      )}

      {/* My review — after submit */}
      {submitted && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 flex items-start gap-2">
          <CheckCircle2 size={14} className="text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-indigo-800" style={{ fontSize: '12px', fontWeight: 700 }}>รีวิวของคุณถูกส่งแล้ว</p>
            <p className="text-indigo-500" style={{ fontSize: '10px' }}>ขอบคุณสำหรับความคิดเห็น · คะแนน {overall}/5</p>
          </div>
        </div>
      )}

      {/* Existing reviews */}
      <div>
        <p className="text-gray-400 mb-3" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          รีวิวทั้งหมด
        </p>
        <div className="space-y-3">
          {EXISTING_REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <p className="text-indigo-700" style={{ fontSize: '11px', fontWeight: 800 }}>
                      {r.name.charAt(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900" style={{ fontSize: '12px', fontWeight: 700 }}>{r.name}</p>
                    <p className="text-gray-400" style={{ fontSize: '10px' }}>{r.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(j => (
                    <Star key={j} size={11} className={j <= r.overall ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600" style={{ fontSize: '11px', lineHeight: 1.6 }}>{r.text}</p>
              <button
                onClick={() => toggleHelpful(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 ${helpfulIds.has(i) ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
              >
                <ThumbsUp size={11} />
                <p style={{ fontSize: '10px', fontWeight: 600 }}>
                  มีประโยชน์ ({r.helpful + (helpfulIds.has(i) ? 1 : 0)})
                </p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PIN auth view ────────────────────────────────────────────────────────────

function PinAuthView({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [pin, setPin]       = useState('');
  const [error, setError]   = useState(false);
  const [shake, setShake]   = useState(false);
  const storedPin = localStorage.getItem('trustwallet_pin') ?? '';

  const handleKey = (k: string) => {
    if (error) { setError(false); }
    if (k === 'del') { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= 6) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        if (next === storedPin) {
          onSuccess();
        } else {
          setShake(true);
          setError(true);
          setPin('');
          setTimeout(() => setShake(false), 600);
        }
      }, 120);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-6">
      <div className="flex items-center gap-2 self-start mb-2">
        <button onClick={onBack} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200">
          <ArrowLeft size={14} className="text-gray-600" />
        </button>
        <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>ยืนยันตัวตน</p>
      </div>

      <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
        <Lock size={30} className="text-indigo-600" />
      </div>

      <div className="text-center">
        <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 800 }}>ใส่รหัส PIN 6 หลัก</p>
        <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>เพื่อยืนยันการชำระเงิน</p>
      </div>

      {/* PIN dots */}
      <div
        className="flex gap-4"
        style={{
          animation: shake ? 'shake 0.5s ease' : 'none',
        }}
      >
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            15%      { transform: translateX(-8px); }
            30%      { transform: translateX(8px); }
            45%      { transform: translateX(-6px); }
            60%      { transform: translateX(6px); }
            75%      { transform: translateX(-3px); }
            90%      { transform: translateX(3px); }
          }
        `}</style>
        {[0,1,2,3,4,5].map(i => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
              i < pin.length
                ? error ? 'bg-red-500 border-red-500' : 'bg-indigo-600 border-indigo-600'
                : 'bg-transparent border-gray-300'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500" style={{ fontSize: 12, fontWeight: 600 }}>รหัส PIN ไม่ถูกต้อง ลองอีกครั้ง</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {['1','2','3','4','5','6','7','8','9','','0','del'].map((k) => (
          k === '' ? <div key="empty" /> :
          <button
            key={k}
            onClick={() => handleKey(k)}
            className={`h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
              k === 'del'
                ? 'bg-gray-100 text-gray-600 active:bg-gray-200'
                : 'bg-white border border-gray-200 text-gray-900 shadow-sm active:bg-indigo-50 active:border-indigo-200'
            }`}
            style={{ fontSize: k === 'del' ? 12 : 20, fontWeight: 700 }}
          >
            {k === 'del' ? '⌫' : k}
          </button>
        ))}
      </div>

      <p className="text-gray-400" style={{ fontSize: 10 }}>
        ใช้รหัส PIN ที่ตั้งไว้ใน Trust Wallet
      </p>
    </div>
  );
}

// ─── Consent bottom-sheet ────────────────────────────────────────────────────

interface ConsentData {
  dormName: string;
  shared: { labelTh: string }[];
  withheld: { labelTh: string }[];
  onApprove: () => void;
}

function ConsentSheet({ data, onClose }: { data: ConsentData | null; onClose: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');

  if (!data) return null;

  const handleApprove = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        data.onApprove();
        onClose();
      }, 600);
    }, 1400);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      {/* tap-away backdrop */}
      <div className="flex-1" onClick={phase === 'idle' ? onClose : undefined} />

      <div className="bg-white rounded-t-[28px] overflow-hidden" style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.25)' }}>

        {/* ── Drag handle ── */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* ── Header strip ── */}
        <div
          className="mx-4 mt-2 mb-4 rounded-2xl px-4 py-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#1e40af 100%)' }}
        >
          <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-blue-200" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Data Request</p>
            <p className="text-white truncate" style={{ fontSize: 15, fontWeight: 800 }}>{data.dormName}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
            <X size={14} className="text-white/70" />
          </button>
        </div>

        <div className="px-4 pb-6 space-y-3">

          {/* ── Shared fields ── */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100/60 border-b border-emerald-200">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <p className="text-emerald-800" style={{ fontSize: 11, fontWeight: 700 }}>ข้อมูลที่จะแชร์</p>
              <span className="ml-auto bg-emerald-600 text-white rounded-full px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
                {data.shared.length} รายการ
              </span>
            </div>
            {data.shared.map((f, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <p className="text-emerald-900" style={{ fontSize: 13, fontWeight: 600 }}>{f.labelTh}</p>
                </div>
                {i < data.shared.length - 1 && <div className="h-px bg-emerald-100 mx-4" />}
              </div>
            ))}
          </div>

          {/* ── Withheld fields ── */}
          {data.withheld.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100/60 border-b border-gray-200">
                <EyeOff size={13} className="text-gray-400" />
                <p className="text-gray-500" style={{ fontSize: 11, fontWeight: 700 }}>ข้อมูลที่ปกปิด (ไม่แชร์)</p>
                <span className="ml-auto bg-gray-400 text-white rounded-full px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
                  {data.withheld.length} รายการ
                </span>
              </div>
              {data.withheld.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center gap-3 px-4 py-2.5 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                      <EyeOff size={11} className="text-gray-500" />
                    </div>
                    <p className="text-gray-500 line-through" style={{ fontSize: 13 }}>{f.labelTh}</p>
                  </div>
                  {i < data.withheld.length - 1 && <div className="h-px bg-gray-100 mx-4" />}
                </div>
              ))}
            </div>
          )}

          {/* ── PDPA notice ── */}
          <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <ShieldCheck size={12} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-slate-500" style={{ fontSize: 10, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 800, color: '#334155' }}>PDPA COMPLIANT</span> · ข้อมูลถูกเข้ารหัสและแชร์แบบ Selective Disclosure ผ่าน Trust Wallet เท่านั้น ไม่มีการบันทึกในเซิร์ฟเวอร์
            </p>
          </div>

          {/* ── Approve button ── */}
          {phase === 'idle' && (
            <button
              onClick={handleApprove}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              style={{
                background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#1e40af 100%)',
                fontSize: 15, fontWeight: 800, color: '#fff',
                boxShadow: '0 8px 28px rgba(30,64,175,0.45)',
              }}
            >
              <ScanFace size={22} />
              Approve &amp; Share Securely
            </button>
          )}

          {phase === 'scanning' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping opacity-50" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                  <ScanFace size={30} className="text-white" />
                </div>
              </div>
              <p className="text-indigo-700" style={{ fontSize: 13, fontWeight: 700 }}>กำลังยืนยันตัวตน…</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="flex flex-col items-center gap-2 py-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle2 size={30} className="text-white" />
              </div>
              <p className="text-emerald-700" style={{ fontSize: 13, fontWeight: 700 }}>ยืนยันสำเร็จ!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Payment flow ─────────────────────────────────────────────────────────────

function PaymentOptions({ total, onSelect, onBack }: { total: number; onSelect: (m: PayView) => void; onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onBack} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200">
          <ArrowLeft size={14} className="text-gray-600" />
        </button>
        <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>เลือกวิธีชำระเงิน</p>
      </div>
      <div className="flex justify-center">
        <div className="bg-indigo-50 border border-indigo-200 rounded-full px-5 py-2 flex items-center gap-2">
          <p className="text-indigo-800" style={{ fontSize: '13px', fontWeight: 700 }}>ยอดชำระ</p>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af' }}>฿{baht(total)}</p>
        </div>
      </div>
      {[
        { id: 'promptpay' as PayView, emoji: '📲', title: 'พร้อมเพย์ (PromptPay)', sub: 'สแกน QR Code ผ่านแอปธนาคาร', recommended: true, grad: 'linear-gradient(135deg,#00568f,#008cdc)' },
        { id: 'transfer'  as PayView, emoji: '🏦', title: 'โอนเงินผ่านธนาคาร',     sub: 'KBank · กรุณาใส่ ref. ที่กำหนด',  recommended: false, grad: 'linear-gradient(135deg,#166534,#16a34a)' },
        { id: 'card'      as PayView, icon: <CreditCard size={22} className="text-white" />, title: 'บัตรเครดิต / เดบิต', sub: 'Visa · Mastercard · JCB', recommended: false, grad: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
      ].map(opt => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 active:bg-indigo-50 active:border-indigo-200 transition-all active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: opt.grad }}>
            {'emoji' in opt ? <span style={{ fontSize: '20px' }}>{opt.emoji}</span> : opt.icon}
          </div>
          <div className="flex-1 text-left">
            <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>{opt.title}</p>
            <p className="text-gray-500" style={{ fontSize: '11px' }}>{opt.sub}</p>
            {opt.recommended && (
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-emerald-600" style={{ fontSize: '10px', fontWeight: 600 }}>แนะนำ · รับเงินทันที</p>
              </div>
            )}
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      ))}
    </div>
  );
}

function PromptPayView({ total, onBack, onSuccess }: { total: number; onBack: () => void; onSuccess: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200"><ArrowLeft size={14} className="text-gray-600" /></button>
        <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>PromptPay QR</p>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-5 flex flex-col items-center gap-4">
        <p className="text-gray-800" style={{ fontSize: '13px', fontWeight: 700 }}>พร้อมเพย์</p>
        <div className="p-3 rounded-2xl border-2 border-indigo-100">
          <QRCodeSVG value={`promptpay://0812345678/${total}`} size={170} bgColor="#fff" fgColor="#0f172a" level="M" />
        </div>
        <div className="text-center">
          <p className="text-gray-400" style={{ fontSize: '11px' }}>ยอดชำระ</p>
          <p style={{ fontSize: '24px', fontWeight: 900, color: '#1e40af' }}>฿{baht(total)}</p>
        </div>
        <div className="self-stretch bg-gray-50 rounded-2xl px-4 py-3 space-y-1.5">
          {[['ผู้รับเงิน','นายสมศักดิ์ เจ้าของหอ'],['พร้อมเพย์ No.','081-234-5678'],['Ref.','A502-JUN69']].map(([l,v]) => (
            <div key={l} className="flex justify-between">
              <p className="text-gray-500" style={{ fontSize: '11px' }}>{l}</p>
              <p className="text-gray-900 font-mono" style={{ fontSize: '11px', fontWeight: 600 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onSuccess} className="w-full py-3.5 rounded-3xl text-white flex items-center justify-center gap-2 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: '14px', fontWeight: 700, boxShadow: '0 8px 20px rgba(79,70,229,0.3)' }}>
        <CheckCircle2 size={17} /> ชำระเงินเรียบร้อย (จำลอง)
      </button>
    </div>
  );
}

function TransferView({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200"><ArrowLeft size={14} className="text-gray-600" /></button>
        <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>โอนเงินผ่านธนาคาร</p>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg,#14532d,#16a34a)' }}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><span style={{ fontSize: '20px' }}>🏦</span></div>
          <div>
            <p className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>ธนาคารกสิกรไทย</p>
            <p className="text-green-200" style={{ fontSize: '11px' }}>KBank · ออมทรัพย์</p>
          </div>
        </div>
        <div className="px-5 py-4 space-y-4">
          {[['เลขที่บัญชี', BANK_INFO.account, true], ['ชื่อบัญชี', BANK_INFO.name, false], ['หมายเหตุ (Ref.)', BANK_INFO.ref, true]].map(([l, v, mono]) => (
            <div key={l as string} className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-500" style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l as string}</p>
                <p className={`text-gray-900 mt-0.5 ${mono ? 'font-mono' : ''}`} style={{ fontSize: '14px', fontWeight: 700 }}>{v as string}</p>
              </div>
              <CopyButton text={v as string} />
            </div>
          ))}
        </div>
        <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2.5 flex gap-2">
          <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-700" style={{ fontSize: '10px' }}>กรุณาใส่ <span style={{ fontWeight: 700 }}>A502-JUN69</span> ในช่องหมายเหตุทุกครั้ง</p>
        </div>
      </div>
      <button onClick={onSuccess} className="w-full py-3.5 rounded-3xl text-white flex items-center justify-center gap-2 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg,#14532d,#16a34a)', fontSize: '14px', fontWeight: 700, boxShadow: '0 8px 20px rgba(22,163,74,0.3)' }}>
        <CheckCircle2 size={17} /> แจ้งโอนเงินแล้ว
      </button>
    </div>
  );
}

function CardView({ total, onBack, onSuccess }: { total: number; onBack: () => void; onSuccess: () => void }) {
  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv]       = useState('');
  const [name, setName]     = useState('');
  const [loading, setLoading] = useState(false);

  const fmt = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };
  const ok = cardNo.replace(/\s/g,'').length === 16 && expiry.length === 5 && cvv.length >= 3 && name.trim().length > 2;

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200"><ArrowLeft size={14} className="text-gray-600" /></button>
        <p className="text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>บัตรเครดิต / เดบิต</p>
      </div>
      <div className="rounded-3xl px-5 py-4 shadow-lg" style={{ background: 'linear-gradient(135deg,#312e81,#4f46e5,#7c3aed)', minHeight: 120 }}>
        <div className="flex justify-between items-start mb-6">
          <p className="text-white/60" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Trust Wallet</p>
          <CreditCard size={22} className="text-white/70" />
        </div>
        <p className="text-white font-mono" style={{ fontSize: '16px', letterSpacing: '0.15em', fontWeight: 600 }}>{cardNo || '•••• •••• •••• ••••'}</p>
        <div className="flex justify-between mt-3">
          <div><p className="text-white/50" style={{ fontSize: '8px', textTransform: 'uppercase' }}>Card Holder</p><p className="text-white" style={{ fontSize: '11px', fontWeight: 600 }}>{name || 'YOUR NAME'}</p></div>
          <div className="text-right"><p className="text-white/50" style={{ fontSize: '8px', textTransform: 'uppercase' }}>Expires</p><p className="text-white" style={{ fontSize: '11px', fontWeight: 600 }}>{expiry || 'MM/YY'}</p></div>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-4 py-4 space-y-3">
        <div>
          <p className="text-gray-500 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>หมายเลขบัตร</p>
          <input type="text" inputMode="numeric" value={cardNo} onChange={e => setCardNo(fmt(e.target.value))} placeholder="0000 0000 0000 0000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-mono bg-gray-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors" style={{ fontSize: '14px', letterSpacing: '0.05em' }} />
        </div>
        <div className="flex gap-3">
          <div className="flex-1"><p className="text-gray-500 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>วันหมดอายุ</p><input type="text" inputMode="numeric" value={expiry} onChange={e => setExpiry(fmtExp(e.target.value))} placeholder="MM/YY" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-mono bg-gray-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors" style={{ fontSize: '14px' }} /></div>
          <div className="flex-1"><p className="text-gray-500 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>CVV</p><input type="password" inputMode="numeric" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="•••" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 font-mono bg-gray-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors" style={{ fontSize: '14px' }} /></div>
        </div>
        <div><p className="text-gray-500 mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>ชื่อบนบัตร</p><input type="text" value={name} onChange={e => setName(e.target.value.toUpperCase())} placeholder="FIRSTNAME LASTNAME" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 outline-none focus:border-indigo-400 focus:bg-white transition-colors uppercase" style={{ fontSize: '13px', letterSpacing: '0.04em' }} /></div>
      </div>
      <button onClick={() => { if (!ok) return; setLoading(true); setTimeout(onSuccess, 2000); }} disabled={!ok || loading}
        className={`w-full py-4 rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${ok && !loading ? 'text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        style={ok && !loading ? { background: 'linear-gradient(135deg,#312e81,#4f46e5)', fontSize: '15px', fontWeight: 800, boxShadow: '0 8px 24px rgba(79,70,229,0.35)' } : { fontSize: '15px', fontWeight: 800 }}>
        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />กำลังประมวลผล…</> : <><Lock size={16} />ชำระ ฿{baht(total)}</>}
      </button>
    </div>
  );
}

function SuccessView({ total, isDeposit, onDone, onNavigate }: {
  total: number;
  isDeposit: boolean;
  onDone: () => void;
  onNavigate: (screen: string) => void;
}) {
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [credentialSaved, setCredentialSaved] = useState(false);

  const handleViewDocuments = () => {
    onNavigate('01');
    localStorage.setItem('trustwallet_show_documents', 'true');
  };

  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-5">
        <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <div className="text-center">
          <p className="text-gray-900" style={{ fontSize: '20px', fontWeight: 800 }}>
            {isDeposit ? 'ทำสัญญาเช่าสำเร็จ!' : 'ชำระเงินสำเร็จ!'}
          </p>
          <p style={{ fontSize: '28px', fontWeight: 900, color: '#1e40af', marginTop: 8 }}>฿{baht(total)}</p>
        </div>
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm px-5 py-4 space-y-2.5">
          {(isDeposit
            ? [['ห้อง','A-502 · Happy Campus Dorm'],['ประเภท','ค่ามัดจำ (2 เดือน)'],['วันที่ชำระ','20 พ.ค. 2569'],['หมายเลขอ้างอิง','DEP-8472-A502'],['สถานะ','✓ สัญญาเช่าสำเร็จ']]
            : [['ห้อง','A-502 · Happy Campus Dorm'],['วันที่ชำระ','20 พ.ค. 2569'],['หมายเลขอ้างอิง','TXN-8472-A502'],['สถานะ','✓ ยืนยันแล้ว']]
          ).map(([l,v],i) => (
            <div key={l} className="flex justify-between">
              <p className="text-gray-500" style={{ fontSize: '11px' }}>{l}</p>
              <p className={i === (isDeposit ? 4 : 3) ? 'text-emerald-600' : 'text-gray-900'} style={{ fontSize: '11px', fontWeight: 600 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Credential section — only for deposit/contract completion */}
        {isDeposit && (
          <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-indigo-900 font-semibold text-sm">รับ Tenant Credential</p>
                <p className="text-indigo-700 text-xs">หอพักออก Verifiable Credential ให้คุณแล้ว</p>
              </div>
            </div>
            <p className="text-xs text-indigo-600">ใช้ยืนยันสถานะผู้เช่าและเข้าถึงบริการของหอพัก</p>
          </div>
        )}

        {isDeposit ? (
          !credentialSaved ? (
            <div className="w-full space-y-3">
              <button
                onClick={() => setShowCredentialModal(true)}
                className="w-full py-4 rounded-3xl text-white flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: '15px', fontWeight: 800, boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
              >
                <ShieldCheck size={18} />
                รับ Credential
              </button>
              <button
                onClick={onDone}
                className="w-full py-3 rounded-3xl text-gray-600 bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ fontSize: '14px', fontWeight: 700 }}
              >
                ข้ามไปก่อน
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <button
                onClick={handleViewDocuments}
                className="w-full py-4 rounded-3xl text-white flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: '15px', fontWeight: 800, boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
              >
                <ShieldCheck size={18} />
                ดู Credential ใน My Documents
              </button>
              <button
                onClick={onDone}
                className="w-full py-3 rounded-3xl text-indigo-600 bg-indigo-50 border border-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ fontSize: '14px', fontWeight: 700 }}
              >
                กลับสู่ My Dorm
              </button>
            </div>
          )
        ) : (
          <button
            onClick={onDone}
            className="w-full py-4 rounded-3xl text-white flex items-center justify-center gap-2 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: '15px', fontWeight: 800, boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
          >
            กลับสู่ My Dorm
          </button>
        )}
      </div>

      {showCredentialModal && (
        <ReceiveCredentialModal
          credentialData={{
            type: 'Tenant Credential',
            issuer: 'Happy Campus Dorm',
            issuedTo: 'สมชาย ใจดี',
            dormName: 'Happy Campus Dorm',
            buildingName: 'อาคาร A',
            roomNumber: '502',
            floor: '5',
            address: '123/45 ถ.พระราม 4 แขวงปทุมวัน เขตปทุมวัน กทม. 10330',
            rentalStatus: 'กำลังเช่าอยู่',
            validFrom: '1 มิ.ย. 2569',
            validUntil: '31 พ.ค. 2570',
          }}
          onSave={() => { setShowCredentialModal(false); setCredentialSaved(true); }}
          onCancel={() => setShowCredentialModal(false)}
        />
      )}
    </>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function DormPaymentPage({ onNavigate }: DormPaymentPageProps) {
  const [tab, setTab]               = useState<Tab>('bills');
  const [payView, setPayView]       = useState<PayView>('bills');
  const [payContext, setPayContext]  = useState<'bills' | 'deposit'>('bills');
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  const total = BILLS.reduce((s, b) => s + b.amount, 0);

  const startBillPayment = () => { setPayContext('bills'); setPayView('pin'); };
  const startDepositPayment = () => { setPayContext('deposit'); setPayView('pin'); };

  const inPayFlow = payView !== 'bills';

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] overflow-hidden relative">

      {/* ── Header ── */}
      <div className="shrink-0 bg-white px-4 pt-10 pb-0 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => inPayFlow ? setPayView('bills') : onNavigate('01')}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 shrink-0"
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div>
            <p className="text-gray-900" style={{ fontSize: '17px', fontWeight: 800 }}>My Dorm</p>
            <p className="text-gray-400" style={{ fontSize: '11px' }}>{RESIDENCES.length} ที่พักที่เช่าอยู่</p>
          </div>
        </div>

        {/* Tab bar — only show when not in pay flow */}
        {!inPayFlow && (
          <div className="flex border-b border-gray-100">
            {([['bills','บิล & ชำระ', <Receipt size={13} />], ['requests','คำขอเช่า', <ClipboardList size={13} />], ['review','รีวิวหอ', <Star size={13} />]] as const).map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => setTab(id as Tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-b-2 transition-all ${tab === id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-400'}`}
                style={{ fontSize: '12px', fontWeight: tab === id ? 700 : 500 }}
              >
                {icon}{label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto pt-4 pb-4">
        {/* Bills tab */}
        {!inPayFlow && tab === 'bills' && (
          <div className="space-y-2.5">
            <div className="space-y-2 pb-2">
              {RESIDENCES.map(r => <ResidenceCard key={r.id} r={r} onPay={startBillPayment} />)}
            </div>
          </div>
        )}

        {/* Rent request status tab */}
        {!inPayFlow && tab === 'requests' && (
          <div className="space-y-4 pt-2">
            <RentStatusTab onConsent={setConsentData} onPayNow={startDepositPayment} />
          </div>
        )}

        {/* Review tab */}
        {!inPayFlow && tab === 'review' && (
          <div className="space-y-4">
            <div className="space-y-2">
              {RESIDENCES.map(r => <ResidenceCard key={r.id} r={r} onPay={startBillPayment} />)}
            </div>
            <div className="pt-2">
              <ReviewTab />
            </div>
          </div>
        )}

        {/* Payment flow */}
        {payView === 'pin'       && <div className="flex flex-col h-full"><PinAuthView onSuccess={() => setPayView('options')} onBack={() => setPayView('bills')} /></div>}
        {payView === 'options'   && <div className="flex flex-col h-full"><PaymentOptions total={total} onSelect={setPayView} onBack={() => setPayView('pin')} /></div>}
        {payView === 'promptpay' && <div className="flex flex-col h-full"><PromptPayView  total={total} onBack={() => setPayView('options')} onSuccess={() => setPayView('success')} /></div>}
        {payView === 'transfer'  && <div className="flex flex-col h-full"><TransferView                 onBack={() => setPayView('options')} onSuccess={() => setPayView('success')} /></div>}
        {payView === 'card'      && <div className="flex flex-col h-full"><CardView       total={total} onBack={() => setPayView('options')} onSuccess={() => setPayView('success')} /></div>}
        {payView === 'success'   && <div className="flex flex-col h-full"><SuccessView    total={total} isDeposit={payContext === 'deposit'} onDone={() => { setPayView('bills'); setTab('bills'); }} onNavigate={onNavigate} /></div>}
      </div>

      {/* Consent bottom-sheet overlay */}
      <ConsentSheet data={consentData} onClose={() => setConsentData(null)} />
    </div>
  );
}
