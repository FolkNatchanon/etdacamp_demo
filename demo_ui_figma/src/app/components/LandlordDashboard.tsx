import { useState, useEffect } from 'react';
import {
  Building2, BedDouble, Users, TrendingUp, Bell, ChevronRight,
  ShieldCheck, BadgeCheck, Clock, CheckCircle2, AlertCircle,
  Fingerprint, Eye, FileSearch, MoreHorizontal, ArrowRight,
  Banknote, Wifi, Star, Circle, LogOut, ScanLine, XCircle, X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import DormCredentialsSection from './DormCredentialsSection';

interface LandlordDashboardProps {
  onNavigate: (screen: string) => void;
}

// ─── Data ────────────────────────────────────────────────────────────────────

interface PendingTenant {
  id: string;
  name: string;
  nameTh: string;
  university: string;
  faculty: string;
  year: number;
  roomRequested: string;
  roomType: string;
  price: number;
  appliedAt: string;
  trustScore: number;
  verificationStatus: 'unverified' | 'requested' | 'verified';
  avatar: string;
}

const PENDING: PendingTenant[] = [
  {
    id: 'p1',
    name: 'Somchai Jaidee',
    nameTh: 'สมชาย ใจดี',
    university: 'Chulalongkorn University',
    faculty: 'Faculty of Engineering',
    year: 3,
    roomRequested: 'A-502',
    roomType: 'Suite · 36 ตร.ม.',
    price: 6500,
    appliedAt: '17 พ.ค. 2569',
    trustScore: 0,
    verificationStatus: 'unverified',
    avatar: 'ส',
  },
  {
    id: 'p2',
    name: 'Malee Srisuk',
    nameTh: 'มาลี ศรีสุข',
    university: 'Thammasat University',
    faculty: 'Faculty of Economics',
    year: 2,
    roomRequested: 'B-301',
    roomType: 'Deluxe Single · 26 ตร.ม.',
    price: 4000,
    appliedAt: '16 พ.ค. 2569',
    trustScore: 92,
    verificationStatus: 'verified',
    avatar: 'ม',
  },
  {
    id: 'p3',
    name: 'Wichai Panich',
    nameTh: 'วิชาญ พานิช',
    university: 'KMITL',
    faculty: 'Faculty of Science',
    year: 4,
    roomRequested: 'C-201',
    roomType: 'Standard Single · 22 ตร.ม.',
    price: 3500,
    appliedAt: '15 พ.ค. 2569',
    trustScore: 0,
    verificationStatus: 'requested',
    avatar: 'ว',
  },
];

const VC_FIELDS = [
  { id: 'name',       labelTh: 'ชื่อ-นามสกุล',    alwaysRequired: true },
  { id: 'status',     labelTh: 'สถานะนักศึกษา',   alwaysRequired: true },
  { id: 'university', labelTh: 'มหาวิทยาลัย',     alwaysRequired: false },
  { id: 'faculty',    labelTh: 'คณะ',              alwaysRequired: false },
  { id: 'year',       labelTh: 'ชั้นปี',           alwaysRequired: false },
  { id: 'gpa',        labelTh: 'เกรดเฉลี่ย (GPA)', alwaysRequired: false },
  { id: 'studentId',  labelTh: 'รหัสนักศึกษา',    alwaysRequired: false },
  { id: 'enroll',     labelTh: 'ระยะเวลาการศึกษา', alwaysRequired: false },
];

const AVATAR_COLORS: Record<string, string> = {
  'ส': 'linear-gradient(135deg,#1e40af,#4f46e5)',
  'ม': 'linear-gradient(135deg,#0f766e,#0d9488)',
  'ว': 'linear-gradient(135deg,#7c3aed,#a855f7)',
};

const VC_MOCK_VALUES: Record<string, Record<string, string>> = {
  p2: {
    name: 'มาลี ศรีสุข',
    status: 'นักศึกษาระดับปริญญาตรี • ยังศึกษาอยู่',
    university: 'มหาวิทยาลัยธรรมศาสตร์',
    faculty: 'คณะเศรษฐศาสตร์',
    year: 'ชั้นปีที่ 2',
    gpa: '3.67',
    studentId: '6510234789',
    enroll: 'ส.ค. 2565 – ปัจจุบัน',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, color, bg }: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-3 flex flex-col gap-2">
      <div className={`w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{value}</p>
        <p className="text-gray-400" style={{ fontSize: 10, marginTop: 2 }}>{sub}</p>
        <p className="text-gray-500" style={{ fontSize: 10, fontWeight: 600, marginTop: 1 }}>{label}</p>
      </div>
    </div>
  );
}

function PDPABadge() {
  return (
    <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 mt-2">
      <ShieldCheck size={14} className="text-slate-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-slate-600" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}>
          PDPA COMPLIANT
        </p>
        <p className="text-slate-500 leading-relaxed" style={{ fontSize: 10, marginTop: 1 }}>
          Requests only <span style={{ fontWeight: 700 }}>Name</span> and{' '}
          <span style={{ fontWeight: 700 }}>Student Status</span> via Selective Disclosure.{' '}
          <span style={{ color: '#334155', fontWeight: 600 }}>No National ID required.</span>
        </p>
      </div>
    </div>
  );
}

function VerificationBadge({ status }: { status: PendingTenant['verificationStatus'] }) {
  if (status === 'verified') return (
    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
      <BadgeCheck size={10} />Trust Verified
    </span>
  );
  if (status === 'requested') return (
    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
      <Clock size={10} />Pending Verification
    </span>
  );
  return (
    <span className="flex items-center gap-1 bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
      <Circle size={8} />Unverified
    </span>
  );
}

type VCStep = 'idle' | 'selecting' | 'qr' | 'done' | 'approved';

function PendingTenantCard({ tenant, onVerify, onView, onViewVC, onPaymentComplete, hasRequiredCredentials }: {
  tenant: PendingTenant;
  onVerify: () => void;
  onView: () => void;
  onViewVC: () => void;
  onPaymentComplete: () => void;
  hasRequiredCredentials: boolean;
}) {
  const initStep: VCStep =
    tenant.verificationStatus === 'verified'  ? 'done' :
    tenant.verificationStatus === 'requested' ? 'qr'   : 'idle';

  const [vcStep, setVcStep]             = useState<VCStep>(initStep);
  const [requiredFields, setRequiredFields] = useState<Set<string>>(new Set());

  const toggleRequired = (id: string) => {
    setRequiredFields(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedRequired = VC_FIELDS.filter(f => f.alwaysRequired || requiredFields.has(f.id));
  const selectedOptional = VC_FIELDS.filter(f => !f.alwaysRequired && !requiredFields.has(f.id));

  const vcPayload = JSON.stringify({
    action: 'trust://vc-request',
    ref: `VC-${tenant.roomRequested.replace('-','')}`,
    required: selectedRequired.map(f => f.id),
    optional: selectedOptional.map(f => f.id),
  });

  const badgeStatus: PendingTenant['verificationStatus'] =
    vcStep === 'done' ? 'verified' : vcStep === 'qr' ? 'requested' : 'unverified';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#4f46e5,#0ea5e9,#10b981)' }} />

      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* Profile row */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: AVATAR_COLORS[tenant.avatar] }}
          >
            <span className="text-white" style={{ fontSize: 18, fontWeight: 900 }}>{tenant.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 800 }}>{tenant.nameTh}</p>
              <VerificationBadge status={badgeStatus} />
            </div>
            <p className="text-gray-500 truncate" style={{ fontSize: 10.5 }}>{tenant.name}</p>
            <p className="text-gray-400 truncate" style={{ fontSize: 10 }}>{tenant.faculty}</p>
            <p className="text-indigo-600 truncate" style={{ fontSize: 10, fontWeight: 600 }}>{tenant.university}</p>
          </div>
          <button onClick={onView} className="w-7 h-7 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center active:bg-gray-100 shrink-0">
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'ชั้นปี',    value: `ปี ${tenant.year}` },
            { label: 'ห้องที่ขอ', value: tenant.roomRequested },
            { label: 'ค่าเช่า',   value: `฿${tenant.price.toLocaleString()}` },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-xl px-2.5 py-2 border border-gray-100">
              <p className="text-gray-400" style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</p>
              <p className="text-gray-900" style={{ fontSize: 12, fontWeight: 700, marginTop: 1 }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* ── IDLE: initial CTA ── */}
        {vcStep === 'idle' && (
          <>
            <button
              onClick={() => setVcStep('selecting')}
              className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: 13, fontWeight: 800, boxShadow: '0 6px 20px rgba(79,70,229,0.35)' }}
            >
              <FileSearch size={15} />
              Request Verified VC
            </button>
            <PDPABadge />
          </>
        )}

        {/* ── SELECTING: field selector ── */}
        {vcStep === 'selecting' && (
          <div className="space-y-2.5">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-3 py-2.5">
              <p className="text-indigo-800" style={{ fontSize: 11, fontWeight: 700 }}>เลือกข้อมูลที่ต้องการ</p>
              <p className="text-indigo-500" style={{ fontSize: 10, marginTop: 2 }}>
                ทำเครื่องหมาย <span style={{ fontWeight: 700 }}>Required</span> = บังคับ · ที่เหลือ = ไม่บังคับ (นักศึกษาเลือกเองได้)
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {VC_FIELDS.map((field, i) => {
                const isForced   = field.alwaysRequired;
                const isRequired = isForced || requiredFields.has(field.id);
                return (
                  <div key={field.id}>
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <p className="text-gray-800" style={{ fontSize: 12 }}>{field.labelTh}</p>
                      <div className="flex items-center gap-2">
                        {isForced ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
                            Always Required
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleRequired(field.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-all active:scale-95 ${
                              isRequired
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                            }`}
                            style={{ fontSize: 10, fontWeight: 700 }}
                          >
                            {isRequired ? <><CheckCircle2 size={10} />Required</> : 'Optional'}
                          </button>
                        )}
                      </div>
                    </div>
                    {i < VC_FIELDS.length - 1 && <div className="h-px bg-gray-50 mx-3" />}
                  </div>
                );
              })}
            </div>

            <PDPABadge />

            <div className="flex gap-2">
              <button
                onClick={() => setVcStep('idle')}
                className="px-4 py-2.5 rounded-2xl bg-gray-100 text-gray-600 active:bg-gray-200"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                ยกเลิก
              </button>
              <button
                onClick={() => setVcStep('qr')}
                className="flex-1 py-2.5 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: 13, fontWeight: 800, boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}
              >
                <ScanLine size={15} />
                Generate VC Request QR
              </button>
            </div>
          </div>
        )}

        {/* ── QR: waiting for student to scan ── */}
        {vcStep === 'qr' && (
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 self-stretch">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                <p className="text-slate-700" style={{ fontSize: 11, fontWeight: 700 }}>รอนักศึกษาสแกน QR ใน Trust Wallet</p>
              </div>
              <div className="p-2.5 rounded-xl border-2 border-slate-200 bg-white">
                <QRCodeSVG value={vcPayload} size={130} bgColor="#fff" fgColor="#0f172a" level="M" />
              </div>

              {/* Summary of what was selected */}
              <div className="self-stretch space-y-1.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye size={10} className="text-slate-400" />
                  <p className="text-slate-500" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Fields Requested</p>
                </div>
                {VC_FIELDS.map(f => {
                  const isReq = f.alwaysRequired || requiredFields.has(f.id);
                  return (
                    <div key={f.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        {isReq
                          ? <CheckCircle2 size={10} className="text-emerald-500" />
                          : <ShieldCheck size={10} className="text-slate-300" />}
                        <p className="text-slate-600" style={{ fontSize: 10 }}>{f.labelTh}</p>
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                        ...(isReq
                          ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' }
                          : { background: '#f8fafc', border: '1px solid #e2e8f0', color: '#94a3b8' }),
                      }}>
                        {isReq ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setVcStep('done')}
                className="flex-1 py-2.5 rounded-2xl text-white flex items-center justify-center gap-1.5 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg,#059669,#10b981)', fontSize: 12, fontWeight: 700 }}
              >
                <CheckCircle2 size={14} />
                Simulate: Student Responded
              </button>
              <button
                onClick={() => setVcStep('selecting')}
                className="px-3 py-2.5 rounded-2xl bg-gray-100 text-gray-500 active:bg-gray-200"
                style={{ fontSize: 12 }}
              >
                แก้ไข
              </button>
            </div>
          </div>
        )}

        {/* ── DONE: disclosed data + approve ── */}
        {vcStep === 'done' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2">
              <Fingerprint size={14} className="text-emerald-600 shrink-0" />
              <div className="flex-1">
                <p className="text-emerald-800" style={{ fontSize: 10, fontWeight: 700 }}>Trust Score</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${tenant.trustScore || 88}%` }} />
                  </div>
                  <p className="text-emerald-700" style={{ fontSize: 11, fontWeight: 800 }}>{tenant.trustScore || 88}</p>
                </div>
              </div>
              <BadgeCheck size={18} className="text-emerald-500 shrink-0" />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 space-y-1.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Eye size={11} className="text-slate-400" />
                <p className="text-slate-500" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Disclosed Data</p>
              </div>
              {VC_FIELDS.map(f => {
                const wasRequired = f.alwaysRequired || requiredFields.has(f.id);
                return (
                  <div key={f.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {wasRequired
                        ? <CheckCircle2 size={10} className="text-emerald-500" />
                        : <ShieldCheck size={10} className="text-slate-300" />}
                      <p className="text-slate-500" style={{ fontSize: 10 }}>{f.labelTh}</p>
                    </div>
                    <p className="text-slate-700" style={{ fontSize: 10, fontWeight: 600 }}>
                      {wasRequired ? 'Disclosed ✓' : 'Not Requested'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* View disclosed data button */}
            <button
              onClick={onViewVC}
              className="w-full py-2.5 rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-indigo-700 flex items-center justify-center gap-2 active:bg-indigo-100 active:scale-[0.98] transition-all"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              <Eye size={14} />
              ดูข้อมูลที่ผู้เช่าส่งมา
              <ChevronRight size={13} />
            </button>

            {!hasRequiredCredentials && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-900 font-semibold text-xs mb-1">
                    ต้องมี Credentials ก่อนอนุมัติ
                  </p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    กรุณาขอ Credentials จากสำนักงานเขตก่อนอนุมัติผู้เช่า
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => hasRequiredCredentials && setVcStep('approved')}
                disabled={!hasRequiredCredentials}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-2.5 ${
                  hasRequiredCredentials
                    ? 'bg-emerald-600 text-white active:bg-emerald-700 shadow-md shadow-emerald-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                <CheckCircle2 size={14} /> Approve Tenant
              </button>
              <button
                className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 rounded-2xl px-3 active:bg-gray-50"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* ── APPROVED: down payment request sent ── */}
        {vcStep === 'approved' && (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-3 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-800" style={{ fontSize: 12, fontWeight: 800 }}>Approved ✓</p>
                <p className="text-emerald-600" style={{ fontSize: 11, marginTop: 2 }}>
                  ส่งคำขอชำระเงินมัดจำให้ผู้เช่าแล้ว · รอการชำระเงิน
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl px-3 py-3 space-y-2">
              <p className="text-gray-500" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Down Payment Request</p>
              {[
                ['ผู้เช่า',      tenant.nameTh],
                ['ห้อง',         `${tenant.roomRequested} · ${tenant.roomType}`],
                ['ค่ามัดจำ',     `฿${(tenant.price * 2).toLocaleString()} (2 เดือน)`],
                ['สถานะ',        'รอชำระเงิน…'],
              ].map(([l, v], i) => (
                <div key={l} className="flex justify-between items-center">
                  <p className="text-gray-400" style={{ fontSize: 10 }}>{l}</p>
                  <p className={i === 3 ? 'text-amber-600' : 'text-gray-800'} style={{ fontSize: 11, fontWeight: 600 }}>{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-amber-600" style={{ fontSize: 10, fontWeight: 600 }}>Waiting for tenant to pay down payment</p>
            </div>

            <button
              onClick={onPaymentComplete}
              className="w-full py-2.5 rounded-2xl text-white flex items-center justify-center gap-1.5 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#059669,#10b981)', fontSize: 12, fontWeight: 700 }}
            >
              <CheckCircle2 size={14} />
              Simulate: Tenant Paid Down Payment
            </button>
          </div>
        )}

        <p className="text-gray-400 text-right" style={{ fontSize: 10 }}>Applied {tenant.appliedAt}</p>
      </div>
    </div>
  );
}

// ─── VC Data Sheet ────────────────────────────────────────────────────────────

function VCDataSheet({ tenant, onClose }: { tenant: PendingTenant; onClose: () => void }) {
  const values = VC_MOCK_VALUES[tenant.id] ?? {};
  const disclosedFields = VC_FIELDS.filter(f => values[f.id]);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl px-4 pt-4 pb-10 overflow-y-auto"
        style={{ maxHeight: '82%' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: AVATAR_COLORS[tenant.avatar] }}
            >
              <span className="text-white" style={{ fontSize: 18, fontWeight: 900 }}>{tenant.avatar}</span>
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 800 }}>{tenant.nameTh}</p>
              <p className="text-gray-500" style={{ fontSize: 10.5 }}>{tenant.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <BadgeCheck size={11} className="text-emerald-500" />
                <p className="text-emerald-600" style={{ fontSize: 10, fontWeight: 700 }}>Trust Verified</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Trust Score bar */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
          <Fingerprint size={20} className="text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p className="text-emerald-800" style={{ fontSize: 11, fontWeight: 700 }}>Trust Score</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${tenant.trustScore || 92}%` }} />
              </div>
              <p className="text-emerald-700" style={{ fontSize: 14, fontWeight: 900 }}>{tenant.trustScore || 92}</p>
            </div>
          </div>
          <BadgeCheck size={20} className="text-emerald-400 shrink-0" />
        </div>

        {/* Disclosed fields */}
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={12} className="text-slate-400" />
            <p className="text-slate-500" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>ข้อมูลที่ผู้เช่าเปิดเผย (Selective Disclosure)</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
            {disclosedFields.map((field, i) => (
              <div key={field.id}>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                    <p className="text-slate-500" style={{ fontSize: 11 }}>{field.labelTh}</p>
                  </div>
                  <p className="text-slate-800 text-right" style={{ fontSize: 12, fontWeight: 700, maxWidth: '55%' }}>{values[field.id]}</p>
                </div>
                {i < disclosedFields.length - 1 && <div className="h-px bg-slate-100 mx-4" />}
              </div>
            ))}
            {disclosedFields.length === 0 && (
              <div className="px-4 py-6 flex flex-col items-center gap-2">
                <AlertCircle size={20} className="text-gray-300" />
                <p className="text-gray-400" style={{ fontSize: 12 }}>ยังไม่มีข้อมูลที่เปิดเผย</p>
              </div>
            )}
          </div>
        </div>

        {/* Fields not requested */}
        {VC_FIELDS.filter(f => !values[f.id]).length > 0 && (
          <div className="mt-3 mb-4">
            <p className="text-gray-400 mb-2" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>ไม่ได้ขอ / ไม่เปิดเผย</p>
            <div className="flex flex-wrap gap-1.5">
              {VC_FIELDS.filter(f => !values[f.id]).map(f => (
                <span key={f.id} className="flex items-center gap-1 bg-gray-100 text-gray-400 rounded-full px-2.5 py-1" style={{ fontSize: 10 }}>
                  <ShieldCheck size={9} />{f.labelTh}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* PDPA notice */}
        <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5">
          <ShieldCheck size={12} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-slate-500 leading-relaxed" style={{ fontSize: 10 }}>
            ข้อมูลนี้เปิดเผยผ่านระบบ <span style={{ fontWeight: 700 }}>Selective Disclosure</span> ตาม PDPA ·{' '}
            <span style={{ color: '#334155', fontWeight: 600 }}>ไม่มีการเก็บเลขบัตรประชาชน</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Quick action row ─────────────────────────────────────────────────────────

function QuickActions({ onNavigate }: { onNavigate: (s: string) => void }) {
  const actions = [
    { label: 'Rooms',     icon: <BedDouble size={18} />,  color: 'bg-indigo-50 text-indigo-600', screen: '08' },
    { label: 'Revenue',   icon: <Banknote size={18} />,   color: 'bg-emerald-50 text-emerald-600', screen: 'landlord' },
    { label: 'Amenities', icon: <Wifi size={18} />,       color: 'bg-sky-50 text-sky-600', screen: 'landlord' },
    { label: 'Reviews',   icon: <Star size={18} />,       color: 'bg-amber-50 text-amber-600', screen: 'landlord' },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map(a => (
        <button
          key={a.label}
          onClick={() => onNavigate(a.screen)}
          className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-gray-100 bg-white active:opacity-70 shadow-sm`}
        >
          <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center`}>{a.icon}</div>
          <p className="text-gray-600" style={{ fontSize: 9.5, fontWeight: 600 }}>{a.label}</p>
        </button>
      ))}
    </div>
  );
}

// ─── Active tenant interface ─────────────────────────────────────────────────

interface ActiveTenant {
  id: string;
  name: string;
  initial: string;
  status: 'paid' | 'unpaid';
  room: string;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function LandlordDashboard({ onNavigate }: LandlordDashboardProps) {
  const [activeSection, setActiveSection] = useState<'credentials' | 'pending' | 'all'>('credentials');
  const [pendingTenants, setPendingTenants] = useState(PENDING);
  const [vcSheetTenant, setVcSheetTenant] = useState<PendingTenant | null>(null);
  const [activeTenants, setActiveTenants] = useState<ActiveTenant[]>([
    { id: 'at1', name: 'นาย ก. · ห้อง 304', initial: 'ก', status: 'unpaid', room: '304' },
    { id: 'at2', name: 'น.ส. ม. · ห้อง 207', initial: 'ม', status: 'paid', room: '207' },
    { id: 'at3', name: 'นาย ส. · ห้อง 412', initial: 'ส', status: 'paid', room: '412' },
  ]);

  // Check if required credentials are approved
  const [hasRequiredCredentials, setHasRequiredCredentials] = useState(false);
  const [hasBusinessAgreement, setHasBusinessAgreement] = useState(false);

  // Check for business agreement on mount - required to access console
  useEffect(() => {
    const checkBusinessAgreement = () => {
      const walletCreds = localStorage.getItem('landlord_wallet_credentials');
      if (walletCreds) {
        try {
          const parsed = JSON.parse(walletCreds);
          const hasAgreement = parsed.some((c: any) => c.id.includes('district_license'));
          if (!hasAgreement) {
            // Redirect back to Thai ID page if no business agreement
            onNavigate('06');
            return false;
          }
          setHasBusinessAgreement(true);
          return true;
        } catch (e) {
          onNavigate('06');
          return false;
        }
      } else {
        onNavigate('06');
        return false;
      }
    };

    checkBusinessAgreement();
  }, [onNavigate]);

  useEffect(() => {
    // Check credentials status
    const checkCredentials = () => {
      const walletCreds = localStorage.getItem('landlord_wallet_credentials');
      if (walletCreds) {
        try {
          const parsed = JSON.parse(walletCreds);
          const districtCreds = parsed.filter((c: any) => c.type === 'district');
          setHasRequiredCredentials(districtCreds.length >= 2); // Need both district licenses
        } catch (e) {
          setHasRequiredCredentials(false);
        }
      } else {
        setHasRequiredCredentials(false);
      }
    };

    checkCredentials();
    // Check periodically in case credentials are approved
    const interval = setInterval(checkCredentials, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handlePaymentComplete = (tenantId: string) => {
    const tenant = pendingTenants.find(t => t.id === tenantId);
    if (!tenant) return;

    // Move to active tenants
    const newActiveTenant: ActiveTenant = {
      id: tenant.id,
      name: `${tenant.nameTh} · ห้อง ${tenant.roomRequested}`,
      initial: tenant.avatar,
      status: 'paid',
      room: tenant.roomRequested,
    };

    setActiveTenants(prev => [newActiveTenant, ...prev]);
    setPendingTenants(prev => prev.filter(t => t.id !== tenantId));

    // Switch to all tenants view to show the new tenant
    setTimeout(() => setActiveSection('all'), 500);
  };

  return (
    <div className="size-full flex flex-col bg-[#F8F9FC] overflow-hidden relative">

      {/* ── Header ── */}
      <div className="shrink-0 bg-white px-4 pt-10 pb-4" style={{ borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 0 #f0f0f0' }}>
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Landlord Console</p>
            <p className="text-gray-900" style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.2 }}>Happy Campus Dorm</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-gray-500" style={{ fontSize: 10.5 }}>ถ.พญาไท ปทุมวัน กทม.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center active:bg-gray-100 relative">
              <Bell size={17} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <button
              onClick={() => onNavigate('00')}
              className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center active:bg-gray-100"
            >
              <LogOut size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4">

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Occupied',  value: activeTenants.length.toString(),    sub: '/ 32 ห้อง', icon: <BedDouble size={16} />,  color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending',   value: pendingTenants.length.toString(),     sub: 'คำขอ',       icon: <Clock size={16} />,      color: 'text-amber-600',  bg: 'bg-amber-50' },
            { label: 'Revenue',   value: '฿92K', sub: 'เดือนนี้',   icon: <TrendingUp size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Occupancy', value: `${Math.round((activeTenants.length / 32) * 100)}%`,   sub: 'อัตรา',      icon: <Users size={16} />,      color: 'text-blue-600',   bg: 'bg-blue-50' },
          ].map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Credentials warning banner */}
        {!hasRequiredCredentials && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-3 flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-amber-900 font-bold text-sm mb-1">
                ต้องมี Credentials ก่อนรับผู้เช่า
              </p>
              <p className="text-amber-700 text-xs leading-relaxed mb-2">
                หอพักต้องได้รับใบอนุญาตจากสำนักงานเขตและการรับรองจากมหาวิทยาลัยก่อนรับผู้เช่า
              </p>
              <button
                onClick={() => setActiveSection('credentials')}
                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <ShieldCheck size={14} />
                ขอ Credentials เลย
              </button>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <QuickActions onNavigate={onNavigate} />

        {/* Section toggle */}
        <div className="flex gap-2 items-center overflow-x-auto pb-1">
          {[
            { id: 'credentials', label: 'Credentials', icon: <ShieldCheck size={12} /> },
            { id: 'pending', label: `Pending (${pendingTenants.length})`, icon: <Clock size={12} /> },
            { id: 'all',     label: 'All Tenants', icon: <Users size={12} /> },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${activeSection === s.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-500'}`}
              style={{ fontSize: 11, fontWeight: activeSection === s.id ? 700 : 500 }}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
          {activeSection === 'pending' && pendingTenants.length > 0 && (
            <div className="ml-auto flex items-center gap-1">
              <AlertCircle size={12} className="text-amber-500" />
              <p className="text-amber-600" style={{ fontSize: 10, fontWeight: 600 }}>Action needed</p>
            </div>
          )}
        </div>

        {/* Credentials section */}
        {activeSection === 'credentials' && (
          <DormCredentialsSection dormName="Happy Campus Dorm" onNavigate={onNavigate} />
        )}

        {/* Pending tenant cards */}
        {activeSection === 'pending' && (
          <div className="space-y-3">
            {pendingTenants.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-12 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>ไม่มีคำขอรอดำเนินการ</p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: 12 }}>
                    คำขอเช่าใหม่จะแสดงที่นี่
                  </p>
                </div>
              </div>
            ) : (
              pendingTenants.map(t => (
                <PendingTenantCard
                  key={t.id}
                  tenant={t}
                  onVerify={() => {}}
                  onView={() => onNavigate('07')}
                  onViewVC={() => setVcSheetTenant(t)}
                  onPaymentComplete={() => handlePaymentComplete(t.id)}
                  hasRequiredCredentials={hasRequiredCredentials}
                />
              ))
            )}
          </div>
        )}

        {/* All tenants list */}
        {activeSection === 'all' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {activeTenants.map((tenant, i) => (
              <div key={tenant.id}>
                <button
                  onClick={() => onNavigate('07')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-indigo-700" style={{ fontSize: 13, fontWeight: 800 }}>
                      {tenant.initial}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-900" style={{ fontSize: 12, fontWeight: 700 }}>{tenant.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-gray-400" style={{ fontSize: 10 }}>Active tenant</p>
                      {tenant.status === 'paid' ? (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
                          <CheckCircle2 size={9} />ชำระแล้ว
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700 }}>
                          <XCircle size={9} />ค้างชำระ
                        </span>
                      )}
                    </div>
                  </div>
                  <BadgeCheck size={15} className="text-emerald-500 shrink-0" />
                  <ChevronRight size={14} className="text-gray-300 shrink-0" />
                </button>
                {i < activeTenants.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VC Data Sheet overlay */}
      {vcSheetTenant && (
        <VCDataSheet tenant={vcSheetTenant} onClose={() => setVcSheetTenant(null)} />
      )}
    </div>
  );
}
