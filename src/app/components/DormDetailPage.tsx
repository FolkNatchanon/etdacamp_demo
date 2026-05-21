import { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, MapPin, Wifi, Wind, Shield, Car, Dumbbell,
  Waves, Utensils, Package, Camera, ChevronRight, CheckCircle2,
  Clock, FileText, Banknote, BedDouble, Building2, Users,
  ChevronDown, ChevronUp, AlertCircle, Phone, Send,
  ShieldCheck, Fingerprint, XCircle, Loader2,
} from 'lucide-react';

interface DormDetailPageProps {
  onNavigate: (screen: string) => void;
}

type GenderPolicy = 'male' | 'female' | 'mixed';

// ─── Data ────────────────────────────────────────────────────────────────────

const PERKS = [
  { icon: <Wifi size={18} />,      label: 'Fiber WiFi',      sub: '1 Gbps',         color: 'bg-blue-100 text-blue-600' },
  { icon: <Wind size={18} />,      label: 'Air Con',         sub: 'ทุกห้อง',         color: 'bg-cyan-100 text-cyan-600' },
  { icon: <Shield size={18} />,    label: 'Security 24 ชม.', sub: 'นิรภัย',          color: 'bg-green-100 text-green-600' },
  { icon: <Camera size={18} />,    label: 'CCTV',            sub: 'ทุกพื้นที่',       color: 'bg-slate-100 text-slate-600' },
  { icon: <Car size={18} />,       label: 'ที่จอดรถ',         sub: 'มอเตอร์ไซค์',     color: 'bg-orange-100 text-orange-600' },
  { icon: <Waves size={18} />,     label: 'ซักอบรีด',         sub: 'ทุกชั้น',         color: 'bg-indigo-100 text-indigo-600' },
  { icon: <Utensils size={18} />,  label: 'ครัวส่วนกลาง',    sub: 'ชั้น 1',          color: 'bg-rose-100 text-rose-600' },
  { icon: <Dumbbell size={18} />,  label: 'ฟิตเนส',           sub: 'ชั้น 2',          color: 'bg-purple-100 text-purple-600' },
  { icon: <Package size={18} />,   label: 'Locker',          sub: 'รับพัสดุ 24 ชม.', color: 'bg-amber-100 text-amber-600' },
  { icon: <Users size={18} />,     label: 'Co-working',      sub: 'ห้องอ่านหนังสือ', color: 'bg-teal-100 text-teal-600' },
];

type RoomStatus = 'available' | 'reserved' | 'occupied';

interface Room {
  id: string;
  number: string;
  floor: number;
  type: string;
  size: string;
  price: number;
  status: RoomStatus;
  direction: string;
}

const ROOMS: Room[] = [
  { id: 'r1', number: 'A-201', floor: 2, type: 'Standard Single', size: '22 ตร.ม.', price: 3500, status: 'available',  direction: 'ทิศตะวันออก' },
  { id: 'r2', number: 'A-205', floor: 2, type: 'Deluxe Single',   size: '26 ตร.ม.', price: 4000, status: 'available',  direction: 'ทิศเหนือ' },
  { id: 'r3', number: 'A-301', floor: 3, type: 'Standard Single', size: '22 ตร.ม.', price: 3500, status: 'reserved',   direction: 'ทิศตะวันออก' },
  { id: 'r4', number: 'A-401', floor: 4, type: 'Deluxe Single',   size: '26 ตร.ม.', price: 4000, status: 'available',  direction: 'ทิศใต้' },
  { id: 'r5', number: 'A-402', floor: 4, type: 'Standard Twin',   size: '30 ตร.ม.', price: 4800, status: 'available',  direction: 'ทิศตะวันตก' },
  { id: 'r6', number: 'A-501', floor: 5, type: 'Suite',           size: '36 ตร.ม.', price: 6500, status: 'occupied',   direction: 'วิวสระน้ำ' },
  { id: 'r7', number: 'A-502', floor: 5, type: 'Suite',           size: '36 ตร.ม.', price: 6500, status: 'available',  direction: 'วิวสระน้ำ' },
  { id: 'r8', number: 'A-601', floor: 6, type: 'Penthouse',       size: '48 ตร.ม.', price: 9000, status: 'available',  direction: 'วิว 360°' },
];

const FLOORS = [...new Set(ROOMS.map(r => r.floor))].sort();

const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; dot: string }> = {
  available: { label: 'ว่าง',      color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  reserved:  { label: 'จองแล้ว',   color: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-400' },
  occupied:  { label: 'มีผู้เช่า', color: 'bg-red-50 text-red-600 border-red-200',             dot: 'bg-red-400' },
};

// Mock logged-in student gender — สมชาย = male
const STUDENT_GENDER: 'male' | 'female' = 'male';

const GENDER_LABEL: Record<GenderPolicy, string> = {
  male: 'หอชาย (เฉพาะผู้ชาย)',
  female: 'หอหญิง (เฉพาะผู้หญิง)',
  mixed: 'รับทุกเพศ',
};

// ─── Gender Verification Gate ─────────────────────────────────────────────────

type GenderVerifyStep = 'idle' | 'verifying' | 'pass' | 'fail';

function GenderVerifyGate({
  genderPolicy,
  onPass,
}: {
  genderPolicy: GenderPolicy;
  onPass: () => void;
}) {
  const [step, setStep] = useState<GenderVerifyStep>('idle');

  const handleVerify = () => {
    setStep('verifying');
    setTimeout(() => {
      const matches =
        (genderPolicy === 'male'   && STUDENT_GENDER === 'male') ||
        (genderPolicy === 'female' && STUDENT_GENDER === 'female');
      setStep(matches ? 'pass' : 'fail');
      if (matches) setTimeout(onPass, 900);
    }, 1600);
  };

  const isMale = genderPolicy === 'male';
  const accentBg   = isMale ? 'bg-blue-50 border-blue-200'   : 'bg-rose-50 border-rose-200';
  const accentText = isMale ? 'text-blue-800'                 : 'text-rose-800';
  const accentSub  = isMale ? 'text-blue-600'                 : 'text-rose-600';
  const btnStyle   = isMale
    ? { background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }
    : { background: 'linear-gradient(135deg,#be123c,#e11d48)' };

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${accentBg}`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isMale ? 'bg-blue-100' : 'bg-rose-100'}`}>
          <span style={{ fontSize: 20 }}>{isMale ? '♂' : '♀'}</span>
        </div>
        <div className="flex-1">
          <p className={`font-bold text-sm ${accentText}`}>{GENDER_LABEL[genderPolicy]}</p>
          <p className={`text-xs mt-0.5 leading-relaxed ${accentSub}`}>
            หอพักนี้กำหนดให้{isMale ? 'ผู้ชาย' : 'ผู้หญิง'}เท่านั้น · ต้องยืนยันเพศจาก Thai ID Credential ก่อนส่งคำขอ
          </p>
        </div>
      </div>

      {/* Verify button / states */}
      {step === 'idle' && (
        <button
          onClick={handleVerify}
          className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all animate-pulse-glow"
          style={{ ...btnStyle, fontSize: 13, fontWeight: 800, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
        >
          <Fingerprint size={16} />
          ยืนยันเพศจาก Thai ID
        </button>
      )}

      {step === 'verifying' && (
        <div className="flex items-center justify-center gap-2 py-3">
          <Loader2 size={16} className={`animate-spin ${isMale ? 'text-blue-500' : 'text-rose-500'}`} />
          <p className={`text-sm font-semibold ${accentText}`}>กำลังตรวจสอบ Credential…</p>
        </div>
      )}

      {step === 'pass' && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <div>
            <p className="text-emerald-800 font-bold text-sm">ยืนยันสำเร็จ ✓</p>
            <p className="text-emerald-600 text-xs">เพศตรงกับเงื่อนไขหอพัก · กำลังส่งคำขอ…</p>
          </div>
        </div>
      )}

      {step === 'fail' && (
        <div className="space-y-2">
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-bold text-sm">ไม่ผ่านเงื่อนไข</p>
              <p className="text-red-600 text-xs leading-relaxed">
                หอพักนี้รับเฉพาะ{isMale ? 'ผู้ชาย' : 'ผู้หญิง'} · Credential ของท่านระบุเพศไม่ตรง
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/70 border border-gray-200 rounded-xl px-3 py-2">
            <ShieldCheck size={12} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-gray-500 text-xs leading-relaxed">
              ข้อมูลเพศตรวจสอบผ่าน Thai ID Credential · ตาม PDPA ระบบไม่เก็บข้อมูล
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Rent Request Sheet ───────────────────────────────────────────────────────

function RentRequestSheet({
  room,
  genderPolicy,
  onClose,
  onSubmit,
}: {
  room: Room;
  genderPolicy: GenderPolicy;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [genderPassed, setGenderPassed] = useState(genderPolicy === 'mixed');
  const deposit = room.price * 2;
  const canSubmit = agreed && genderPassed;

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl px-5 pt-5 pb-8 space-y-4"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '88%', overflowY: 'auto' }}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 800 }}>ขอเช่าห้อง {room.number}</p>
            <p className="text-gray-500" style={{ fontSize: '11px' }}>{room.type} · {room.size} · {room.direction}</p>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af' }}>
            ฿{room.price.toLocaleString()}<span className="text-gray-400" style={{ fontSize: '11px', fontWeight: 400 }}>/ด.</span>
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'ค่าเช่า/เดือน',   value: `฿${room.price.toLocaleString()}` },
            { label: 'เงินประกัน',       value: `฿${deposit.toLocaleString()}` },
            { label: 'สัญญาขั้นต่ำ',     value: '6 เดือน' },
            { label: 'แจ้งออกล่วงหน้า', value: '30 วัน' },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-2xl px-3 py-2.5 border border-gray-100">
              <p className="text-gray-500" style={{ fontSize: '10px' }}>{item.label}</p>
              <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 700 }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Total upfront */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3">
          <p className="text-indigo-600" style={{ fontSize: '11px', fontWeight: 600 }}>ยอดชำระเมื่อเข้าอยู่</p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-indigo-500" style={{ fontSize: '11px' }}>เงินประกัน + ค่าเช่าเดือนแรก</p>
            <p style={{ fontSize: '18px', fontWeight: 900, color: '#1e40af' }}>
              ฿{(deposit + room.price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Gender verification gate (only for restricted dorms) */}
        {genderPolicy !== 'mixed' && !genderPassed && (
          <GenderVerifyGate genderPolicy={genderPolicy} onPass={() => setGenderPassed(true)} />
        )}

        {/* Gender passed banner */}
        {genderPolicy !== 'mixed' && genderPassed && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2.5">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <p className="text-emerald-700 text-xs font-semibold">ยืนยันเพศสำเร็จ · ผ่านเงื่อนไข{genderPolicy === 'male' ? 'หอชาย' : 'หอหญิง'}</p>
            <ShieldCheck size={12} className="text-emerald-400 ml-auto shrink-0" />
          </div>
        )}

        {/* Agree checkbox */}
        <button
          onClick={() => setAgreed(v => !v)}
          className="flex items-start gap-3 w-full text-left"
        >
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
            {agreed && <CheckCircle2 size={13} className="text-white" />}
          </div>
          <p className="text-gray-600" style={{ fontSize: '11px', lineHeight: 1.5 }}>
            ข้าพเจ้ารับทราบเงื่อนไขสัญญาเช่า อัตราค่าปรับ และกฎระเบียบของหอพักแล้ว
          </p>
        </button>

        <button
          onClick={canSubmit ? onSubmit : undefined}
          className={`w-full py-4 rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${canSubmit ? 'text-white animate-pulse-glow' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          style={canSubmit ? {
            background: 'linear-gradient(135deg,#1e40af,#4f46e5)',
            fontSize: '15px', fontWeight: 800,
            boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
          } : { fontSize: '15px', fontWeight: 800 }}
        >
          <Send size={16} />
          ส่งคำขอเช่า
        </button>
      </div>
    </div>
  );
}

// ─── Rent Success Sheet ───────────────────────────────────────────────────────

function RentSuccessOverlay({ room, onClose }: { room: Room; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6"
      style={{ background: 'rgba(15,23,42,0.85)' }}
    >
      <div className="bg-white rounded-3xl px-6 py-7 w-full shadow-2xl flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-emerald-500" />
        </div>
        <div className="text-center">
          <p className="text-gray-900" style={{ fontSize: '18px', fontWeight: 800 }}>ส่งคำขอแล้ว!</p>
          <p className="text-gray-500 mt-1" style={{ fontSize: '12px', lineHeight: 1.6 }}>
            คำขอเช่าห้อง <span style={{ fontWeight: 700, color: '#1e40af' }}>{room.number}</span> ถูกส่งถึงเจ้าของหอแล้ว
            รอการยืนยันภายใน 24 ชั่วโมง
          </p>
        </div>
        <div className="w-full bg-gray-50 rounded-2xl px-4 py-3 space-y-2">
          {[
            { label: 'ห้อง',        value: `${room.number} · ${room.type}` },
            { label: 'ค่าเช่า',     value: `฿${room.price.toLocaleString()}/เดือน` },
            { label: 'หมายเลขคำขอ', value: 'REQ-2569-0847' },
          ].map(r => (
            <div key={r.label} className="flex justify-between">
              <p className="text-gray-500" style={{ fontSize: '11px' }}>{r.label}</p>
              <p className="text-gray-900" style={{ fontSize: '11px', fontWeight: 600 }}>{r.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2.5 w-full">
          <Phone size={13} className="text-amber-600 shrink-0" />
          <p className="text-amber-700" style={{ fontSize: '10px' }}>เจ้าของหอจะติดต่อกลับเพื่อนัดดูห้องและทำสัญญา</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: '14px', fontWeight: 700 }}
        >
          กลับสู่รายการ
        </button>
      </div>
    </div>
  );
}

// ─── Hero gender badge ────────────────────────────────────────────────────────

function HeroGenderBadge({ policy }: { policy: GenderPolicy }) {
  if (policy === 'mixed') return null;
  const isMale = policy === 'male';
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${isMale ? 'bg-blue-500/25 border-blue-400/40' : 'bg-rose-500/25 border-rose-400/40'}`}>
      <span className={isMale ? 'text-blue-200' : 'text-rose-200'} style={{ fontSize: 14 }}>{isMale ? '♂' : '♀'}</span>
      <p className={`${isMale ? 'text-blue-200' : 'text-rose-200'}`} style={{ fontSize: 11, fontWeight: 700 }}>
        {isMale ? 'หอชาย' : 'หอหญิง'}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DormDetailPage({ onNavigate }: DormDetailPageProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [showTerms, setShowTerms] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmedRoom, setConfirmedRoom] = useState<Room | null>(null);
  const [genderPolicy, setGenderPolicy] = useState<GenderPolicy>('mixed');
  const [dormName, setDormName] = useState('Happy Campus Dorm');

  useEffect(() => {
    const policy = localStorage.getItem('selected_dorm_gender') as GenderPolicy | null;
    const name   = localStorage.getItem('selected_dorm_name');
    if (policy) setGenderPolicy(policy);
    if (name)   setDormName(name);
  }, []);

  // Disable back navigation until contract is signed
  const [isContractSigned, setIsContractSigned] = useState(
    () => !!localStorage.getItem('trustwallet_contract_signed')
  );

  useEffect(() => {
    const poll = () => setIsContractSigned(!!localStorage.getItem('trustwallet_contract_signed'));
    const id = setInterval(poll, 800);
    return () => clearInterval(id);
  }, []);

  const filteredRooms = selectedFloor === 'all'
    ? ROOMS
    : ROOMS.filter(r => r.floor === selectedFloor);

  const availableCount = ROOMS.filter(r => r.status === 'available').length;

  // Gradient shifts slightly for female dorm
  const heroGradient = genderPolicy === 'female'
    ? 'linear-gradient(160deg,#1a0a0f 0%,#4c0519 50%,#9f1239 100%)'
    : 'linear-gradient(160deg,#0f172a 0%,#1e3a5f 50%,#1e40af 100%)';

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] overflow-hidden relative">

      {/* ── Hero ── */}
      <div className="shrink-0 relative" style={{ background: heroGradient, paddingBottom: 20 }}>
        <div className="flex items-center gap-3 px-4 pt-10 pb-3">
          <button
            onClick={isContractSigned ? () => onNavigate('01') : undefined}
            disabled={!isContractSigned}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              isContractSigned
                ? 'bg-white/15 border-white/20 active:bg-white/25'
                : 'bg-white/5 border-white/10 opacity-30 cursor-not-allowed'
            }`}
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <p className="text-white/70" style={{ fontSize: '12px' }}>รายการหอพัก</p>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-blue-300" style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>หอพักนักศึกษา</p>
              <p className="text-white" style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1.2 }}>{dormName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-blue-300" />
                <p className="text-blue-200" style={{ fontSize: '11px' }}>ถ.พญาไท แขวงวังใหม่ ปทุมวัน กทม.</p>
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl px-3 py-2 text-center shrink-0">
              <p className="text-yellow-400" style={{ fontSize: '16px', fontWeight: 800 }}>4.8</p>
              <div className="flex gap-0.5 justify-center">
                {[1,2,3,4,5].map(i => <Star key={i} size={8} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400/40'} />)}
              </div>
              <p className="text-white/60" style={{ fontSize: '9px' }}>142 รีวิว</p>
            </div>
          </div>

          {/* Stats row with gender badge */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-white/15">
              <Building2 size={12} className="text-blue-200" />
              <p className="text-white" style={{ fontSize: '11px', fontWeight: 600 }}>8 ชั้น</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/20 rounded-full px-3 py-1.5 border border-emerald-400/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-emerald-300" style={{ fontSize: '11px', fontWeight: 600 }}>ว่าง {availableCount} ห้อง</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-white/15">
              <p className="text-white" style={{ fontSize: '11px', fontWeight: 600 }}>฿3,500+/ด.</p>
            </div>
            <HeroGenderBadge policy={genderPolicy} />
          </div>
        </div>

        <div className="flex absolute bottom-0 left-0 right-0" style={{ height: 3 }}>
          <div className="flex-1 bg-indigo-500" /><div className="flex-1 bg-blue-400" />
          <div className="flex-1 bg-cyan-400" /><div className="flex-1 bg-emerald-400" />
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* Gender restriction notice */}
        {genderPolicy !== 'mixed' && (
          <div className={`mx-4 mt-4 flex items-start gap-3 rounded-2xl px-4 py-3 border ${genderPolicy === 'male' ? 'bg-blue-50 border-blue-200' : 'bg-rose-50 border-rose-200'}`}>
            <span style={{ fontSize: 20 }}>{genderPolicy === 'male' ? '♂' : '♀'}</span>
            <div>
              <p className={`font-bold text-sm ${genderPolicy === 'male' ? 'text-blue-800' : 'text-rose-800'}`}>
                {GENDER_LABEL[genderPolicy]}
              </p>
              <p className={`text-xs mt-0.5 leading-relaxed ${genderPolicy === 'male' ? 'text-blue-600' : 'text-rose-600'}`}>
                หอพักนี้กำหนดให้{genderPolicy === 'male' ? 'ผู้ชาย' : 'ผู้หญิง'}เท่านั้น · ระบบจะตรวจสอบเพศจาก Thai ID Credential ก่อนส่งคำขอเช่า
              </p>
            </div>
          </div>
        )}

        {/* ── Perks ── */}
        <div className="px-4 pt-5 pb-1">
          <p className="text-gray-400 mb-3" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            สิ่งอำนวยความสะดวก
          </p>
          <div className="grid grid-cols-5 gap-2">
            {PERKS.map(perk => (
              <div key={perk.label} className="flex flex-col items-center gap-1.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${perk.color}`}>
                  {perk.icon}
                </div>
                <p className="text-gray-600 text-center leading-tight" style={{ fontSize: '9px', fontWeight: 600 }}>{perk.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Available Rooms ── */}
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
              ห้องว่าง
            </p>
            <div className="flex items-center gap-2">
              {(['available','reserved','occupied'] as RoomStatus[]).map(s => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
                  <p className="text-gray-400" style={{ fontSize: '9px' }}>{STATUS_CONFIG[s].label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floor filter tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {(['all', ...FLOORS] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f as any)}
                className={`shrink-0 px-3 py-1.5 rounded-full border transition-all ${selectedFloor === f ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}
                style={{ fontSize: '11px', fontWeight: 600 }}
              >
                {f === 'all' ? 'ทั้งหมด' : `ชั้น ${f}`}
              </button>
            ))}
          </div>

          {/* Room cards */}
          <div className="space-y-2">
            {filteredRooms.map(room => {
              const s = STATUS_CONFIG[room.status];
              return (
                <div
                  key={room.id}
                  onClick={() => room.status === 'available' && setSelectedRoom(room)}
                  className={`bg-white rounded-2xl border p-3.5 flex items-center gap-3 transition-all ${room.status === 'available' ? 'border-gray-100 shadow-sm active:border-indigo-300 active:bg-indigo-50 cursor-pointer' : 'border-gray-100 opacity-70'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${room.status === 'available' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                    <BedDouble size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 700 }}>ห้อง {room.number}</p>
                      <span className={`px-2 py-0.5 rounded-full border text-center ${s.color}`} style={{ fontSize: '9px', fontWeight: 700 }}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-gray-500" style={{ fontSize: '11px' }}>{room.type} · {room.size} · {room.direction}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#1e40af' }}>฿{room.price.toLocaleString()}</p>
                    <p className="text-gray-400" style={{ fontSize: '10px' }}>/เดือน</p>
                  </div>
                  {room.status === 'available' && (
                    <ChevronRight size={15} className="text-gray-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Pricing breakdown ── */}
        <div className="px-4 pt-5">
          <p className="text-gray-400 mb-3" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            อัตราค่าใช้จ่าย
          </p>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { label: 'ค่าเช่า (Standard Single)',  value: '฿3,500', sub: 'ต่อเดือน', accent: false },
              { label: 'ค่าเช่า (Deluxe Single)',    value: '฿4,000', sub: 'ต่อเดือน', accent: false },
              { label: 'ค่าเช่า (Suite)',             value: '฿6,500', sub: 'ต่อเดือน', accent: false },
              { label: 'ค่าไฟฟ้า',                    value: '฿5',     sub: 'ต่อหน่วย', accent: false },
              { label: 'ค่าน้ำ',                      value: '฿10',    sub: 'ต่อหน่วย', accent: false },
              { label: 'Internet (รวมในค่าเช่า)',     value: 'ฟรี',    sub: '',          accent: true },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-gray-800" style={{ fontSize: '12px', fontWeight: 500 }}>{row.label}</p>
                  <div className="text-right">
                    <p className={row.accent ? 'text-emerald-600' : 'text-gray-900'} style={{ fontSize: '13px', fontWeight: 700 }}>{row.value}</p>
                    {row.sub && <p className="text-gray-400" style={{ fontSize: '10px' }}>{row.sub}</p>}
                  </div>
                </div>
                {i < arr.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Contract Terms ── */}
        <div className="px-4 pt-5">
          <button
            onClick={() => setShowTerms(v => !v)}
            className="w-full flex items-center justify-between text-left"
          >
            <p className="text-gray-400" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
              เงื่อนไขสัญญา
            </p>
            {showTerms ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
          </button>
          <div className="mt-3 space-y-2">
            {[
              { icon: <Clock size={15} />,       color: 'bg-indigo-100 text-indigo-600',  label: 'ระยะสัญญาขั้นต่ำ',      value: '6 เดือน', desc: 'ต้องอยู่อย่างน้อย 6 เดือนก่อนออก' },
              { icon: <AlertCircle size={15} />, color: 'bg-amber-100 text-amber-600',    label: 'แจ้งออกล่วงหน้า',       value: '30 วัน',  desc: 'แจ้งก่อนวันครบสัญญาอย่างน้อย 30 วัน' },
              { icon: <Banknote size={15} />,    color: 'bg-emerald-100 text-emerald-600', label: 'เงินมัดจำ/ประกัน',      value: '2 เดือน', desc: 'เท่ากับค่าเช่า 2 เดือน คืนเมื่อออก (หลังหักค่าเสียหาย)' },
              { icon: <FileText size={15} />,    color: 'bg-rose-100 text-rose-600',      label: 'ค่าปรับออกก่อนกำหนด',   value: '1 เดือน', desc: 'หากออกก่อนครบ 6 เดือน ปรับเท่ากับค่าเช่า 1 เดือน' },
            ].map((term, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${term.color}`}>
                    {term.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800" style={{ fontSize: '12px', fontWeight: 600 }}>{term.label}</p>
                    {showTerms && <p className="text-gray-500 mt-0.5" style={{ fontSize: '10px', lineHeight: 1.5 }}>{term.desc}</p>}
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-1 shrink-0" style={{ fontSize: '11px', fontWeight: 700 }}>
                    {term.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Down Payment ── */}
        <div className="px-4 pt-5 pb-2">
          <p className="text-gray-400 mb-3" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            ยอดชำระแรกเข้า
          </p>
          <div className="rounded-3xl overflow-hidden shadow-md" style={{ background: heroGradient }}>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'ค่าเช่าเดือนแรก',      value: 'ตามห้องที่เลือก' },
                { label: 'เงินประกัน (2 เดือน)', value: 'ตามห้องที่เลือก' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <p className="text-blue-200" style={{ fontSize: '12px' }}>{r.label}</p>
                  <p className="text-white" style={{ fontSize: '12px', fontWeight: 600 }}>{r.value}</p>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <p className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>ตัวอย่าง (Standard)</p>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#93c5fd' }}>฿10,500</p>
                </div>
                <p className="text-blue-300 mt-0.5" style={{ fontSize: '10px' }}>฿3,500 ค่าเช่า + ฿7,000 ประกัน</p>
              </div>
            </div>
            <div className="bg-indigo-500/30 border-t border-white/10 px-5 py-2.5 flex items-center gap-2">
              <Shield size={12} className="text-blue-200" />
              <p className="text-blue-200" style={{ fontSize: '10px' }}>เงินประกันคืนเต็มจำนวนหากห้องไม่เสียหาย</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 flex gap-3">
        <button
          onClick={isContractSigned ? () => onNavigate('01') : undefined}
          disabled={!isContractSigned}
          className={`w-10 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isContractSigned ? 'bg-gray-100 active:bg-gray-200' : 'bg-gray-50 opacity-30 cursor-not-allowed'
          }`}
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <button
          onClick={() => {
            const first = ROOMS.find(r => r.status === 'available');
            if (first) setSelectedRoom(first);
          }}
          className="flex-1 h-12 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all animate-pulse-glow"
          style={{
            background: genderPolicy === 'female'
              ? 'linear-gradient(135deg,#be123c,#e11d48)'
              : 'linear-gradient(135deg,#1e40af,#4f46e5)',
            fontSize: '14px', fontWeight: 800,
            boxShadow: '0 8px 20px rgba(79,70,229,0.35)',
          }}
        >
          <Send size={16} />
          ขอเช่าห้อง
        </button>
      </div>

      {/* ── Rent Request Sheet ── */}
      {selectedRoom && !showSuccess && (
        <RentRequestSheet
          room={selectedRoom}
          genderPolicy={genderPolicy}
          onClose={() => setSelectedRoom(null)}
          onSubmit={() => {
            setConfirmedRoom(selectedRoom);
            setSelectedRoom(null);
            setShowSuccess(true);
          }}
        />
      )}

      {/* ── Success Overlay ── */}
      {showSuccess && confirmedRoom && (
        <RentSuccessOverlay
          room={confirmedRoom}
          onClose={() => { setShowSuccess(false); onNavigate('03'); }}
        />
      )}
    </div>
  );
}
