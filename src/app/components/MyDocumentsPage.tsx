import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, ShieldCheck, Loader2, CheckCircle2,
  CreditCard, Lock, FileText, Award, ClipboardList, University,
  Download, ChevronRight, Plus, X, RefreshCw, Smartphone, Building2, Clock, AlertCircle, FileCode, Car,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import JSONInspectorModal from './JSONInspectorModal';

const studentIdVcJson = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schema.org"
  ],
  "id": "urn:uuid:6c3182b0-88cf-43ca-90e9-b2eb11d18969",
  "type": ["VerifiableCredential", "StudentCredential"],
  "issuer": "did:web:chula.ac.th",
  "issuanceDate": "2026-06-01T08:30:00Z",
  "expirationDate": "2027-05-31T23:59:59Z",
  "credentialSubject": {
    "id": "did:key:z6Mku8VdfU6551mJtLqyvH34RkW3Dk29fWpUv32n9h76L8jK",
    "nameTh": "สมชาย ใจดี",
    "nameEn": "Somchai Jaidee",
    "studentId": "6510412001",
    "universityTh": "จุฬาลงกรณ์มหาวิทยาลัย",
    "universityEn": "Chulalongkorn University",
    "facultyTh": "คณะวิศวกรรมศาสตร์",
    "facultyEn": "Faculty of Engineering",
    "programTh": "วิศวกรรมคอมพิวเตอร์",
    "programEn": "Computer Engineering",
    "year": "3",
    "status": "Active"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-06-01T08:31:12Z",
    "verificationMethod": "did:web:chula.ac.th#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSI...eyJzdWIiOiJkaWQ6a2V5...t8_4z9c_E"
  }
};

const getTenantVcJson = (cred: any) => ({
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schema.org"
  ],
  "id": `urn:uuid:${cred.id}`,
  "type": ["VerifiableCredential", "TenantCredential"],
  "issuer": "did:web:abcmansion.trust.in.th",
  "issuanceDate": new Date(cred.savedAt ? 1779349800000 : Date.now()).toISOString(),
  "expirationDate": new Date(cred.expiresAt ? 1810885800000 : Date.now() + 365*24*60*60*1000).toISOString(),
  "credentialSubject": {
    "id": "did:key:z6Mku8VdfU6551mJtLqyvH34RkW3Dk29fWpUv32n9h76L8jK",
    "tenantName": cred.issuedTo || "สมชาย ใจดี",
    "dormName": cred.dormName || "Happy Campus Dorm",
    "roomNumber": cred.roomNumber || "A-502",
    "building": cred.buildingName || "Building A",
    "floor": cred.floor || "5",
    "status": "Active"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": new Date().toISOString(),
    "verificationMethod": "did:web:abcmansion.trust.in.th#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJncnVwIjoiZXZlbnQ...eyJzdWIiOiJkaWQ6a2V5...k9_4z5d_F"
  }
});

interface MyDocumentsPageProps {
  onNavigate: (screen: string) => void;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type AppStep = 'consent' | 'qr' | 'linking' | 'pin-setup' | 'pin-entry' | 'main';
type DocStatus = 'idle' | 'requesting' | 'pending' | 'ready' | 'saved';

interface CVType {
  id: string;
  label: string;
  labelTh: string;
  description: string;
  icon: React.ReactNode;
  issuedBy: string;
  validityDays?: number;
}

// ─── CV catalogue ─────────────────────────────────────────────────────────────

const CV_TYPES: CVType[] = [
  {
    id: 'transcript',
    label: 'Academic Transcript',
    labelTh: 'ใบแสดงผลการเรียน',
    description: 'Official record of all courses and grades',
    icon: <ClipboardList size={18} />,
    issuedBy: 'Registrar Office',
    validityDays: 90, // 3 months
  },
  {
    id: 'degree',
    label: 'Degree Certificate',
    labelTh: 'ปริญญาบัตร',
    description: 'Official degree completion certificate',
    icon: <Award size={18} />,
    issuedBy: 'Academic Affairs',
    validityDays: 365, // 1 year
  },
  {
    id: 'enrollment',
    label: 'Enrollment Verification',
    labelTh: 'หนังสือรับรองนักศึกษา',
    description: 'Proof of current student enrollment',
    icon: <FileText size={18} />,
    issuedBy: 'Registrar Office',
    validityDays: 30, // 1 month
  },
  {
    id: 'resume',
    label: 'Student Resume (CV)',
    labelTh: 'ประวัติย่อนักศึกษา',
    description: 'University-verified resume with academic achievements',
    icon: <University size={18} />,
    issuedBy: 'Career Center',
    validityDays: 180, // 6 months
  },
];

// ─── Sub-screens ──────────────────────────────────────────────────────────────

function ConsentScreen({ onAllow, onDeny }: { onAllow: () => void; onDeny: () => void }) {
  return (
    <div className="size-full flex flex-col bg-[#F8F7FF] overflow-hidden">
      {/* Top decorative area */}
      <div className="shrink-0 flex flex-col items-center pt-12 pb-6 px-6"
        style={{ background: 'linear-gradient(160deg, #1a237e 0%, #283593 60%, #1565c0 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
          <CreditCard size={32} className="text-white" />
        </div>
        <p className="text-white text-center" style={{ fontSize: '18px', fontWeight: 800 }}>บัตรประชาชนดิจิทัล</p>
        <p className="text-blue-200 text-center mt-1" style={{ fontSize: '12px' }}>Thai National ID · Digital Link</p>
      </div>

      {/* Consent card */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <p className="text-gray-900 text-center mb-1" style={{ fontSize: '14px', fontWeight: 700 }}>
            Trust Wallet ขอเข้าถึงข้อมูล
          </p>
          <p className="text-gray-500 text-center mb-4" style={{ fontSize: '11px' }}>
            จากบัตรประจำตัวประชาชนของท่าน
          </p>

          <div className="space-y-3">
            {[
              { icon: <CreditCard size={15} />, label: 'ชื่อ-นามสกุล และหมายเลขบัตร' },
              { icon: <ShieldCheck size={15} />, label: 'วันเกิดและสถานะบัตร' },
              { icon: <Lock size={15} />, label: 'ที่อยู่ตามทะเบียนบ้าน' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-indigo-50 rounded-xl px-3 py-2.5 border border-indigo-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  {item.icon}
                </div>
                <p className="text-indigo-800" style={{ fontSize: '12px', fontWeight: 500 }}>{item.label}</p>
                <CheckCircle2 size={13} className="text-indigo-400 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex gap-2">
          <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-700" style={{ fontSize: '11px' }}>
            ข้อมูลถูกเข้ารหัส end-to-end เก็บเฉพาะในอุปกรณ์นี้ ไม่มีการส่งต่อบุคคลที่สาม
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-600 shrink-0" />
          <p className="text-gray-600" style={{ fontSize: '11px' }}>
            ตรวจสอบโดยกรมการปกครอง กระทรวงมหาดไทย
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 px-4 pb-8 pt-3 bg-white border-t border-gray-100 space-y-2">
        <button
          onClick={onAllow}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white flex items-center justify-center gap-2 active:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 animate-pulse-glow"
          style={{ fontSize: '14px', fontWeight: 700 }}
        >
          <ShieldCheck size={16} />
          อนุญาต (Allow)
        </button>
        {/* Deny button disabled during guided demo */}
        <button
          disabled
          className="w-full py-2 text-gray-200 cursor-not-allowed opacity-30"
          style={{ fontSize: '13px' }}
        >
          ไม่อนุญาต (Deny)
        </button>
      </div>
    </div>
  );
}

function QRScreen({ onScanned, onBack }: { onScanned: () => void; onBack: () => void }) {
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [scanned, setScanned] = useState(false);

  // Unique session token for this QR
  const sessionToken = useMemo(() => {
    const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
    return `thaiid://trust-wallet/auth?session=${rand}&app=trust-rental&v=1`;
  }, []);

  // Countdown timer
  useEffect(() => {
    if (expired || scanned) return;
    if (timeLeft <= 0) { setExpired(true); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, expired, scanned]);

  // Simulate auto-scan after 6 s for demo purposes
  useEffect(() => {
    const t = setTimeout(() => {
      setScanned(true);
      setTimeout(onScanned, 1000);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const refresh = () => {
    setExpired(false);
    setTimeLeft(120);
  };

  return (
    <div className="size-full flex flex-col bg-[#F8F7FF] overflow-hidden">
      {/* Header — back button disabled during guided demo */}
      <div className="shrink-0 bg-white px-4 pt-10 pb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            disabled
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 opacity-30 cursor-not-allowed"
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div>
            <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 700 }}>สแกน QR Code</p>
            <p className="text-gray-500" style={{ fontSize: '11px' }}>เชื่อมต่อกับ Thai ID App</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-5 gap-4">
        {/* Step indicator */}
        <div className="flex items-center gap-2 w-full">
          {['อนุญาต', 'สแกน QR', 'เชื่อมต่อ'].map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                {i === 0
                  ? <CheckCircle2 size={12} className="text-white" />
                  : <span className="text-white" style={{ fontSize: '9px', fontWeight: 700 }}>{i + 1}</span>
                }
              </div>
              <span className={i === 1 ? 'text-indigo-700' : 'text-gray-400'} style={{ fontSize: '10px', fontWeight: i === 1 ? 700 : 400 }}>{label}</span>
              {i < 2 && <div className={`flex-1 h-px ${i === 0 ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* QR code card */}
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-md p-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 self-stretch justify-center">
            <div className="w-6 h-6 rounded-md bg-blue-900 flex items-center justify-center">
              <CreditCard size={13} className="text-white" />
            </div>
            <p className="text-gray-800" style={{ fontSize: '13px', fontWeight: 700 }}>Thai ID App</p>
          </div>

          {/* QR area */}
          <div className="relative">
            <div className={`p-3 bg-white rounded-2xl border-2 transition-all ${scanned ? 'border-emerald-400' : expired ? 'border-red-200' : 'border-gray-100'}`}>
              <QRCodeSVG
                value={sessionToken}
                size={180}
                bgColor="#ffffff"
                fgColor={expired ? '#d1d5db' : '#1a237e'}
                level="M"
                imageSettings={{
                  src: '',
                  x: undefined,
                  y: undefined,
                  height: 0,
                  width: 0,
                  opacity: 0,
                  excavate: false,
                }}
              />
            </div>

            {/* Overlay states */}
            {expired && !scanned && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/90">
                <p className="text-red-400" style={{ fontSize: '12px', fontWeight: 700 }}>QR หมดอายุ</p>
                <button
                  onClick={refresh}
                  className="mt-2 flex items-center gap-1.5 bg-indigo-600 text-white rounded-full px-3 py-1.5 active:bg-indigo-700"
                  style={{ fontSize: '11px', fontWeight: 700 }}
                >
                  <RefreshCw size={11} /> สร้างใหม่
                </button>
              </div>
            )}

            {scanned && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-emerald-50/95">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <p className="text-emerald-700 mt-2" style={{ fontSize: '12px', fontWeight: 700 }}>สแกนสำเร็จ!</p>
              </div>
            )}
          </div>

          {/* Timer */}
          {!expired && !scanned && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-gray-500" style={{ fontSize: '11px' }}>
                QR หมดอายุใน <span className="text-indigo-600 font-mono" style={{ fontWeight: 700 }}>{minutes}:{seconds}</span>
              </p>
            </div>
          )}

          {scanned && (
            <p className="text-emerald-600" style={{ fontSize: '11px', fontWeight: 600 }}>กำลังเชื่อมต่อ…</p>
          )}
        </div>

        {/* Instructions */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 px-4 py-3 space-y-3">
          <p className="text-gray-700" style={{ fontSize: '12px', fontWeight: 700 }}>วิธีสแกน</p>
          {[
            { step: '1', text: 'เปิดแอปพลิเคชัน Thai ID บนมือถือ' },
            { step: '2', text: 'กดปุ่ม "สแกน QR" ในหน้าหลัก' },
            { step: '3', text: 'สแกน QR Code ด้านบน' },
            { step: '4', text: 'ยืนยันการเชื่อมต่อใน Thai ID App' },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-indigo-600" style={{ fontSize: '9px', fontWeight: 800 }}>{item.step}</span>
              </div>
              <p className="text-gray-600" style={{ fontSize: '11px' }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Security note */}
        <div className="w-full flex items-start gap-2 bg-blue-50 rounded-2xl border border-blue-100 px-3 py-2.5">
          <ShieldCheck size={14} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-blue-700" style={{ fontSize: '10px' }}>
            QR นี้ใช้ได้ครั้งเดียวและจะหมดอายุใน 2 นาที เพื่อความปลอดภัยของท่าน
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 px-4 pb-6 pt-3 bg-white border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Smartphone size={13} />
          <p style={{ fontSize: '11px' }}>รอสแกนจาก Thai ID App…</p>
          <Loader2 size={12} className="animate-spin" />
        </div>
      </div>
    </div>
  );
}

function LinkingScreen() {
  const steps = [
    'เชื่อมต่อระบบบัตรประชาชนดิจิทัล',
    'ตรวจสอบข้อมูลกับกรมการปกครอง',
    'เข้ารหัสและบันทึกลง Trust Wallet',
  ];
  const [done, setDone] = useState(0);

  useEffect(() => {
    const intervals = steps.map((_, i) =>
      setTimeout(() => setDone(i + 1), 700 + i * 900)
    );
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="size-full flex flex-col items-center justify-center bg-[#F8F7FF] gap-6 px-8">
      <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-indigo-100 flex items-center justify-center">
        {done === steps.length
          ? <CheckCircle2 size={36} className="text-emerald-500" />
          : <Loader2 size={36} className="text-indigo-500 animate-spin" />
        }
      </div>
      <div className="text-center">
        <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 700 }}>
          {done === steps.length ? 'เชื่อมต่อสำเร็จ!' : 'กำลังเชื่อมต่อ…'}
        </p>
        <p className="text-gray-500 mt-1" style={{ fontSize: '12px' }}>Thai National ID</p>
      </div>
      <div className="w-full bg-white rounded-2xl border border-gray-100 px-4 py-3 space-y-3">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 shrink-0 flex items-center justify-center">
              {i < done
                ? <CheckCircle2 size={16} className="text-emerald-500" />
                : i === done
                ? <Loader2 size={14} className="text-indigo-400 animate-spin" />
                : <div className="w-3 h-3 rounded-full border-2 border-gray-200" />
              }
            </div>
            <p className={i < done ? 'text-gray-800' : 'text-gray-400'} style={{ fontSize: '12px', fontWeight: i < done ? 600 : 400 }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Student ID Credential ────────────────────────────────────────────────────

type StudentIdStatus = 'idle' | 'requesting' | 'ready' | 'saved';

const STUDENT_ID_DATA = {
  name:      'สมชาย ใจดี',
  nameEn:    'Somchai Jaidee',
  studentId: '6510412001',
  faculty:   'คณะวิศวกรรมศาสตร์',
  facultyEn: 'Faculty of Engineering',
  program:   'วิศวกรรมคอมพิวเตอร์',
  year:      '3',
  university:'จุฬาลงกรณ์มหาวิทยาลัย',
  universityEn: 'Chulalongkorn University',
  validUntil:'31 พ.ค. 2570',
  issueDate: '1 มิ.ย. 2569',
};

function StudentIDCard() {
  return (
    <div className="rounded-3xl overflow-hidden shadow-lg border border-indigo-200" style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1e3a5f 45%,#1e40af 100%)' }}>
      {/* University header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shrink-0 shadow-md">
          <span className="text-amber-900" style={{ fontSize: 13, fontWeight: 900 }}>จฬ</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white leading-tight" style={{ fontSize: 11, fontWeight: 800 }}>{STUDENT_ID_DATA.university}</p>
          <p className="text-blue-300 leading-tight" style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{STUDENT_ID_DATA.universityEn}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-blue-300" style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Student ID</p>
          <p className="text-white font-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>{STUDENT_ID_DATA.studentId}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-3 flex gap-3 items-start">
        {/* Photo placeholder */}
        <div className="w-16 shrink-0 flex flex-col items-center gap-1">
          <div className="w-16 h-20 rounded-xl border-2 border-white/20 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)' }}
          >
            <span className="text-white" style={{ fontSize: 28, fontWeight: 900 }}>ส</span>
          </div>
          <div className="w-full bg-white/10 rounded-lg px-1.5 py-1 text-center border border-white/15">
            <p className="text-blue-200" style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.04em' }}>ชั้นปีที่ {STUDENT_ID_DATA.year}</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div>
            <p className="text-white" style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.2 }}>{STUDENT_ID_DATA.name}</p>
            <p className="text-blue-300" style={{ fontSize: 9.5 }}>{STUDENT_ID_DATA.nameEn}</p>
          </div>
          <div className="space-y-1">
            {[
              { label: 'คณะ',      value: STUDENT_ID_DATA.faculty },
              { label: 'สาขา',     value: STUDENT_ID_DATA.program },
              { label: 'หมดอายุ',  value: STUDENT_ID_DATA.validUntil },
            ].map(row => (
              <div key={row.label} className="flex gap-1.5 items-baseline">
                <p className="text-blue-400 shrink-0" style={{ fontSize: 8.5, fontWeight: 600, minWidth: 34 }}>{row.label}</p>
                <p className="text-white truncate" style={{ fontSize: 9.5, fontWeight: 600 }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR / bottom bar */}
      <div className="px-4 pb-3 pt-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white p-1.5 shrink-0">
          <QRCodeSVG value={`student://${STUDENT_ID_DATA.studentId}`} size={28} bgColor="#fff" fgColor="#0f172a" level="M" />
        </div>
        <div className="flex-1">
          <p className="text-blue-300" style={{ fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>สแกนเพื่อยืนยัน · Scan to Verify</p>
          <p className="text-blue-400" style={{ fontSize: 8 }}>Trust Wallet · Verifiable Credential</p>
        </div>
        <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
      </div>

      {/* Status bar */}
      <div className="bg-emerald-500 flex items-center justify-center gap-2 py-1.5">
        <CheckCircle2 size={11} className="text-white" />
        <p className="text-white" style={{ fontSize: 10, fontWeight: 700 }}>Active · ออกโดย {STUDENT_ID_DATA.university}</p>
        <Lock size={9} className="text-white/80" />
      </div>
    </div>
  );
}

function StudentIDSection() {
  const [status, setStatus] = useState<StudentIdStatus>(() => {
    return localStorage.getItem('trustwallet_student_id') === 'saved' ? 'saved' : 'idle';
  });
  const [inspectorData, setInspectorData] = useState<any>(null);

  const handleRequest = () => {
    setStatus('requesting');
    setTimeout(() => {
      setStatus('ready');
    }, 2200);
  };

  const handleSave = () => {
    localStorage.setItem('trustwallet_student_id', 'saved');
    setStatus('saved');
  };

  return (
    <div>
      <p className="text-gray-500 mb-2" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        บัตรนักศึกษา
      </p>

      {/* Idle: request button — pulse to guide user */}
      {status === 'idle' && (
        <button
          onClick={handleRequest}
          className="w-full border-2 border-dashed border-indigo-300 rounded-3xl py-5 flex flex-col items-center gap-2 active:bg-indigo-50 bg-white animate-pulse-glow"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center">
            <CreditCard size={20} className="text-indigo-600" />
          </div>
          <p className="text-indigo-700" style={{ fontSize: 13, fontWeight: 700 }}>ขอบัตรนักศึกษาดิจิทัล</p>
          <p className="text-gray-400" style={{ fontSize: 10 }}>ออกโดย {STUDENT_ID_DATA.university}</p>
        </button>
      )}

      {/* Requesting: loading */}
      {status === 'requesting' && (
        <div className="w-full bg-white border-2 border-indigo-100 rounded-3xl py-6 flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-indigo-500 animate-spin" />
          <div className="text-center">
            <p className="text-gray-800" style={{ fontSize: 13, fontWeight: 700 }}>กำลังออกบัตรนักศึกษา…</p>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: 10 }}>ยืนยันกับระบบมหาวิทยาลัย</p>
          </div>
          <div className="space-y-1.5 w-full px-6">
            {['ตรวจสอบสถานะนักศึกษา', 'ดึงข้อมูลจากทะเบียนนักศึกษา', 'ออก Verifiable Credential'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <Loader2 size={10} className="text-indigo-300 animate-spin shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                <p className="text-gray-400" style={{ fontSize: 10 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready: show card + save button */}
      {status === 'ready' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <p className="text-emerald-700" style={{ fontSize: 11, fontWeight: 700 }}>บัตรนักศึกษาพร้อมแล้ว · กดบันทึกลง Wallet</p>
          </div>
          <StudentIDCard />
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98] animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)', fontSize: 13, fontWeight: 800, boxShadow: '0 6px 18px rgba(79,70,229,0.3)' }}
          >
            <Download size={15} />
            บันทึกลง Trust Wallet
          </button>
        </div>
      )}

      {/* Saved: show card */}
      {status === 'saved' && (
        <div className="space-y-2">
          <StudentIDCard />
          <button
            onClick={() => setInspectorData(studentIdVcJson)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
            style={{ fontSize: 11, fontWeight: 700 }}
          >
            <FileCode size={14} className="text-indigo-500" />
            ดูโครงสร้างข้อมูล (W3C VC JSON)
          </button>
        </div>
      )}

      {inspectorData && (
        <JSONInspectorModal
          title="Student ID Verifiable Credential"
          jsonData={inspectorData}
          onClose={() => setInspectorData(null)}
        />
      )}
    </div>
  );
}

// ─── Tenant Credentials Section ──────────────────────────────────────────────

const getExpiryStatus = (expiresAt: string) => {
  if (!expiresAt) return null;

  const now = new Date();
  const expiry = new Date(expiresAt);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry <= 0) {
    return { type: 'expired', label: 'หมดอายุแล้ว', color: 'text-red-600 bg-red-50 border-red-200' };
  } else if (daysUntilExpiry <= 30) {
    return { type: 'expiring', label: `เหลือ ${daysUntilExpiry} วัน`, color: 'text-amber-600 bg-amber-50 border-amber-200' };
  } else if (daysUntilExpiry <= 90) {
    return { type: 'warning', label: `เหลือ ${daysUntilExpiry} วัน`, color: 'text-blue-600 bg-blue-50 border-blue-200' };
  }
  return null;
};

function TenantCredentialsSection() {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [inspectorData, setInspectorData] = useState<any>(null);

  const loadCredentials = () => {
    const stored = localStorage.getItem('trustwallet_credentials');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const now = new Date();

        // Filter out expired credentials and update localStorage
        const validCredentials = parsed.filter((c: any) => {
          if (c.expiresAt) {
            const expiryDate = new Date(c.expiresAt);
            return expiryDate > now && c.status === 'active';
          }
          return c.status === 'active';
        });

        // Update localStorage if any credentials were removed
        if (validCredentials.length !== parsed.length) {
          localStorage.setItem('trustwallet_credentials', JSON.stringify(validCredentials));
        }

        setCredentials(validCredentials);
      } catch (e) {
        setCredentials([]);
      }
    }
  };

  useEffect(() => {
    // Load credentials on mount
    loadCredentials();

    // Listen for credential saved event
    const handleCredentialSaved = () => {
      loadCredentials();
    };

    window.addEventListener('credentialSaved', handleCredentialSaved);

    // Also reload when window regains focus (for when coming back from payment)
    const handleFocus = () => {
      loadCredentials();
    };

    window.addEventListener('focus', handleFocus);

    // Check for storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'trustwallet_credentials') {
        loadCredentials();
      }
    };

    window.addEventListener('storage', handleStorage);

    // Also check periodically in case we're on the same tab (every 500ms)
    const interval = setInterval(loadCredentials, 500);

    return () => {
      window.removeEventListener('credentialSaved', handleCredentialSaved);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (credentials.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-gray-500 mb-2" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        ข้อมูลผู้เช่าหอพัก
      </p>
      <div className="space-y-2">
        {credentials.map((cred) => {
          const expiryStatus = getExpiryStatus(cred.expiresAt);

          return (
            <div key={cred.id} className="rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-md">
              {/* Credential Card Header */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-white" />
                    <p className="text-white text-xs font-semibold">
                      Tenant Credential
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {expiryStatus && (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        expiryStatus.type === 'expiring'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        <Clock size={10} />
                        {expiryStatus.label}
                      </span>
                    )}
                    <ShieldCheck size={16} className="text-white/80" />
                  </div>
                </div>
                <p className="text-white font-bold text-base">
                  {cred.dormName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {cred.buildingName && (
                    <>
                      <p className="text-indigo-200 text-sm">
                        {cred.buildingName}
                      </p>
                      <span className="text-indigo-300">•</span>
                    </>
                  )}
                  <p className="text-indigo-200 text-sm">
                    ห้อง {cred.roomNumber}
                  </p>
                  {cred.floor && (
                    <>
                      <span className="text-indigo-300">•</span>
                      <p className="text-indigo-200 text-sm">
                        ชั้น {cred.floor}
                      </p>
                    </>
                  )}
                </div>
              </div>

            {/* Credential Details */}
            <div className="bg-white px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold text-emerald-700">
                  {cred.rentalStatus || 'กำลังเช่าอยู่'}
                </p>
              </div>
              {cred.buildingName && (
                <p className="text-xs text-gray-600 mb-1">
                  {cred.buildingName} • ห้อง {cred.roomNumber}
                  {cred.floor && ` • ชั้น ${cred.floor}`}
                </p>
              )}
              <p className="text-xs text-gray-500 mb-3">
                {cred.address || 'ไม่ระบุที่อยู่'}
              </p>
              {cred.savedAt && (
                <p className="text-xs text-gray-400 mb-2">
                  บันทึกเมื่อ: {cred.savedAt}
                </p>
              )}
              <button
                onClick={() => setExpanded(expanded === cred.id ? null : cred.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <p className="text-sm font-semibold text-indigo-600">
                  ดูรายละเอียดเพิ่มเติม
                </p>
                <ChevronRight
                  size={16}
                  className="text-indigo-400"
                />
              </button>
            </div>

            {/* Status Bar */}
            <div className="bg-emerald-500 flex items-center justify-center gap-2 py-1.5">
              <CheckCircle2 size={12} className="text-white" />
              <p className="text-white" style={{ fontSize: '10px', fontWeight: 700 }}>
                Active · ใช้งานได้
              </p>
              <Lock size={10} className="text-white/80" />
            </div>
          </div>
          );
        })}
      </div>

      {/* Usage info */}
      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <ShieldCheck size={14} className="text-blue-600" />
          <p className="text-xs font-semibold text-blue-900">
            วิธีใช้งาน Tenant Credential
          </p>
        </div>
        <ul className="text-xs text-blue-700 space-y-1.5">
          <li>• สแกน QR จากหอพักเพื่อแชร์สถานะผู้เช่า</li>
          <li>• ใช้เข้าถึงบริการต่างๆ (ลิฟต์, ฟิตเนส, สระว่ายน้ำ)</li>
          <li>• ยืนยันที่อยู่อาศัยกับหน่วยงานราชการ</li>
          <li>• แชร์ให้สถาบันการเงินเพื่อยื่นสินเชื่อ</li>
        </ul>
      </div>

      {/* Detail Modal */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setExpanded(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {credentials.filter(c => c.id === expanded).map((cred) => {
              const expiryStatus = getExpiryStatus(cred.expiresAt);

              return (
                <div key={cred.id}>
                  {/* Header */}
                  <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-indigo-700 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} className="text-white" />
                      <h3 className="text-white font-bold">รายละเอียด Credential</h3>
                    </div>
                    <button
                      onClick={() => setExpanded(null)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">หอพัก</p>
                      <p className="text-base font-bold text-gray-900">{cred.dormName}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">ชื่อผู้เช่า</p>
                      <p className="text-sm font-semibold text-gray-900">{cred.issuedTo}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">รายละเอียดห้องพัก</p>
                      <div className="space-y-1 mt-1">
                        {cred.buildingName && (
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-gray-400" />
                            <p className="text-sm text-gray-900">{cred.buildingName}</p>
                          </div>
                        )}
                        <p className="text-sm text-gray-900">
                          ห้อง {cred.roomNumber}
                          {cred.floor && ` • ชั้น ${cred.floor}`}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">ที่อยู่</p>
                      <p className="text-sm text-gray-900">{cred.address || 'ไม่ระบุ'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">เริ่มต้นสัญญา</p>
                        <p className="text-sm font-semibold text-gray-900">{cred.validFrom}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">สิ้นสุดสัญญา</p>
                        <p className="text-sm font-semibold text-gray-900">{cred.validUntil}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">สถานะการเช่า</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <p className="text-sm font-semibold text-emerald-700">
                          {cred.rentalStatus || 'กำลังเช่าอยู่'}
                        </p>
                      </div>
                    </div>

                    {expiryStatus && (
                      <div className={`rounded-xl border p-3 ${expiryStatus.color}`}>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <div>
                            <p className="text-xs font-semibold">
                              {expiryStatus.type === 'expiring' ? '⚠️ กำลังจะหมดอายุ' : 'ℹ️ วันหมดอายุ'}
                            </p>
                            <p className="text-xs mt-0.5">
                              Credential หมดอายุ: {cred.expiresAtDisplay}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">ออกโดย</p>
                      <p className="text-sm font-semibold text-gray-900">{cred.issuer}</p>
                    </div>

                    {cred.savedAt && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">บันทึกเมื่อ</p>
                        <p className="text-sm text-gray-700 mt-0.5">{cred.savedAt}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setInspectorData(getTenantVcJson(cred))}
                      className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold transition-colors mt-2 flex items-center justify-center gap-1.5"
                    >
                      <FileCode size={14} className="text-indigo-500" />
                      ดูโครงสร้างข้อมูล (W3C VC JSON)
                    </button>

                    <button
                      onClick={() => setExpanded(null)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors mt-4"
                    >
                      ปิด
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inspectorData && (
        <JSONInspectorModal
          title="Tenant Verifiable Credential"
          jsonData={inspectorData}
          onClose={() => setInspectorData(null)}
        />
      )}
    </div>
  );
}

// ─── Dorm Access Card Section ─────────────────────────────────────────────────

function DormAccessCardSection({ onNavigate }: { onNavigate: (screen: string, tab?: any) => void }) {
  const [cred, setCred] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [hasViewedDetails, setHasViewedDetails] = useState(false);

  useEffect(() => {
    const poll = () => {
      try {
        const raw = localStorage.getItem('trustwallet_dorm_credential');
        setCred(raw ? JSON.parse(raw) : null);
      } catch { setCred(null); }
    };
    poll();
    const id = setInterval(poll, 800);
    return () => clearInterval(id);
  }, []);

  if (!cred) return null;

  const dormAddress = "123/45 อาคาร A ถนนพญาไท แขวงวังใหม่ เขตปทุมวัน กรุงเทพมหานคร 10330";
  const leaseStartDate = "1 มิถุนายน 2569";
  const leaseEndDate = "31 พฤษภาคม 2570";
  const subjectDid = "did:key:z6Mku8VdfU6551mJtLqyvH34RkW3Dk29fWpUv32n9h76L8jK";

  const dormVcJson = {
    "@context": [
      "https://www.w3.org/2018/credentials/v2",
      "https://schema.org"
    ],
    "id": "urn:uuid:dorm-access-happy-campus-a502",
    "type": ["VerifiableCredential", "DormAccessCredential"],
    "issuer": cred.issuer || "did:web:abcmansion.trust.in.th",
    "issuanceDate": cred.issuedAt || new Date().toISOString(),
    "expirationDate": cred.validUntil || new Date(Date.now() + 365*24*60*60*1000).toISOString(),
    "credentialSubject": {
      "id": subjectDid,
      "tenantName": "นายสมชาย ใจดี",
      "dormName": cred.dormName || "Happy Campus Dorm",
      "dormAddress": dormAddress,
      "roomNumber": cred.room || "A-502",
      "building": cred.building || "A",
      "floor": cred.floor || "5",
      "leaseStartDate": "2026-06-01",
      "leaseEndDate": "2027-05-31",
      "parkingPermission": "parking_building_A",
      "status": "Active"
    },
    "proof": {
      "type": "JsonWebSignature2020",
      "created": "2026-05-21T07:05:00Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:web:abcmansion.trust.in.th#key-1",
      "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abcmansion-sig-dorm-9274921"
    }
  };

  const handleCardClick = () => {
    setShowDetails(true);
    setHasViewedDetails(true);
  };

  return (
    <div className="space-y-2">
      <p className="text-gray-500 mb-2" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        บัตรสิทธิ์หอพัก
      </p>

      {/* Dorm Access Card - Clickable to open VC details */}
      <div 
        onClick={handleCardClick}
        className={`rounded-2xl overflow-hidden border-2 shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all hover:shadow-indigo-100 hover:shadow-md ${
          !hasViewedDetails 
            ? 'animate-pulse-glow border-indigo-600 shadow-indigo-200 shadow-lg' 
            : 'border-indigo-200'
        }`}
        title="คลิกเพื่อดูรายละเอียดบัตรผ่าน (VC)"
      >
        <div className="px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5,#6d28d9)' }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/60 font-bold" style={{ fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Dorm Access Card · Verifiable Credential</p>
            <ShieldCheck size={13} className="text-white/60" />
          </div>
          <p className="text-white font-black" style={{ fontSize: 15 }}>{cred.dormName}</p>
          <p className="text-indigo-200" style={{ fontSize: 11 }}>นายสมชาย ใจดี · ห้อง {cred.room} · อาคาร {cred.building}</p>
        </div>
        <div className="bg-white px-4 py-2.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-gray-400" style={{ fontSize: 9 }}>สิทธิ์ที่ได้รับ (คลิกเพื่อดูรายละเอียด VC)</p>
            <p className="text-gray-800 font-bold" style={{ fontSize: 11 }}>จอดรถอาคาร {cred.building} · WiFi · ห้องซักผ้า · Gym</p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-emerald-600 font-bold" style={{ fontSize: 9 }}>Active</p>
          </div>
        </div>
      </div>

      {/* VC Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col text-slate-800 animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-400" />
                <h4 className="text-sm font-bold">Verifiable Credential (VC)</h4>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[75vh]">
              
              {/* VC Badge Card */}
              <div className="rounded-2xl overflow-hidden border border-indigo-150 shadow-md">
                <div className="px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5,#6d28d9)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white/60 font-bold" style={{ fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Dorm Access Card</p>
                    <ShieldCheck size={13} className="text-emerald-400" />
                  </div>
                  <p className="text-white font-black" style={{ fontSize: 16 }}>{cred.dormName}</p>
                  <p className="text-indigo-200" style={{ fontSize: 11 }}>นายสมชาย ใจดี</p>
                </div>
                <div className="bg-slate-50 px-4 py-2 border-t border-indigo-50/50 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-mono text-[8px]">ID: {dormVcJson.id}</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">ข้อมูลภายในบัตร (Credential Subject)</p>
                
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3.5 space-y-2.5 text-xs">
                  <div className="grid grid-cols-3 gap-1 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-400 font-semibold">ผู้ถือบัตร:</span>
                    <span className="col-span-2 text-slate-800 font-bold">นายสมชาย ใจดี</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-400 font-semibold">ที่ตั้งหอพัก:</span>
                    <span className="col-span-2 text-slate-700 leading-normal font-medium">{dormAddress}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-400 font-semibold">เลขห้องพัก:</span>
                    <span className="col-span-2 text-slate-800 font-bold">{cred.room}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-400 font-semibold">อาคารพัก:</span>
                    <span className="col-span-2 text-slate-800 font-bold">อาคาร {cred.building}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-400 font-semibold">ชั้นพักอาศัย:</span>
                    <span className="col-span-2 text-slate-800 font-bold">ชั้น {cred.floor}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-400 font-semibold">ระยะเวลาสัญญา:</span>
                    <span className="col-span-2 text-slate-700 font-medium">{leaseStartDate} ถึง {leaseEndDate}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400 font-semibold">สถานะการเช่า:</span>
                    <span className="col-span-2 text-emerald-600 font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active (ใช้งานได้ตามปกติ)
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic signatures details */}
              <div className="bg-slate-900 rounded-2xl p-3.5 text-white space-y-2 text-[10px]">
                <div className="flex justify-between items-center text-indigo-400 font-bold tracking-wider uppercase">
                  <span>W3C VC Cryptography Proof</span>
                  <ShieldCheck size={12} />
                </div>
                <div className="space-y-1 font-mono text-[9px] text-slate-400 leading-normal">
                  <div className="flex justify-between">
                    <span>Issuer DID:</span>
                    <span className="text-slate-300">did:web:abcmansion.trust.in.th</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject DID:</span>
                    <span className="text-slate-300">did:key:z6Mku...76L8jK</span>
                  </div>
                  <div className="h-px bg-slate-800 my-1" />
                  <p className="break-all text-[8px] text-slate-500">
                    Proof Sign (JWS): {dormVcJson.proof.jws}
                  </p>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="shrink-0 bg-slate-50 border-t border-slate-100 p-4 flex gap-2.5">
              <button
                onClick={() => setShowJsonInspector(true)}
                className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:scale-98 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <FileCode size={14} className="text-indigo-600" />
                ดูโครงสร้าง W3C VC (JSON)
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100"
              >
                ปิดหน้าจอ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* JSON Inspector Modal */}
      {showJsonInspector && (
        <JSONInspectorModal
          title="Dorm Access Verifiable Credential (VC)"
          jsonData={dormVcJson}
          onClose={() => setShowJsonInspector(false)}
        />
      )}
    </div>
  );
}

// ─── Main documents hub ───────────────────────────────────────────────────────

function MainDocs({ onBack }: { onBack: () => void }) {
  // Detect whether student ID is saved to decide which actions to allow
  const [isStudentIdSaved, setIsStudentIdSaved] = useState(
    () => localStorage.getItem('trustwallet_student_id') === 'saved'
  );

  useEffect(() => {
    const poll = () => setIsStudentIdSaved(localStorage.getItem('trustwallet_student_id') === 'saved');
    const id = setInterval(poll, 800);
    return () => clearInterval(id);
  }, []);

  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>({});
  const [requesting, setRequesting] = useState(false);
  const [showRequestSheet, setShowRequestSheet] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [academicDocs, setAcademicDocs] = useState<any[]>([]);
  const [expiredCount, setExpiredCount] = useState(0);

  // Load and clean up expired academic documents
  useEffect(() => {
    const loadAcademicDocs = () => {
      const stored = localStorage.getItem('trustwallet_academic_docs');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const now = new Date();

          // Filter out expired documents
          const validDocs = parsed.filter((doc: any) => {
            if (doc.expiresAt) {
              const expiryDate = new Date(doc.expiresAt);
              return expiryDate > now;
            }
            return true;
          });

          // Count expired documents
          const expired = parsed.length - validDocs.length;
          if (expired > 0) {
            setExpiredCount(expired);
            // Clear the count after showing
            setTimeout(() => setExpiredCount(0), 10000);
          }

          // Update localStorage if any docs were removed
          if (validDocs.length !== parsed.length) {
            localStorage.setItem('trustwallet_academic_docs', JSON.stringify(validDocs));
          }

          setAcademicDocs(validDocs);
        } catch (e) {
          setAcademicDocs([]);
        }
      }
    };

    loadAcademicDocs();
    const interval = setInterval(loadAcademicDocs, 5000);
    return () => clearInterval(interval);
  }, []);

  const savedDocs = CV_TYPES.filter(c => docStatuses[c.id] === 'saved');
  const activeDocs = CV_TYPES.filter(c => docStatuses[c.id] && docStatuses[c.id] !== 'idle');

  const toggle = (id: string) => {
    if (docStatuses[id] === 'saved' || docStatuses[id] === 'ready') return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRequest = () => {
    if (selectedIds.size === 0 || requesting) return;
    setRequesting(true);
    const ids = Array.from(selectedIds);
    setSelectedIds(new Set());
    setShowRequestSheet(false);

    ids.forEach(id => setDocStatuses(prev => ({ ...prev, [id]: 'requesting' })));

    ids.forEach((id, i) => {
      setTimeout(() => {
        setDocStatuses(prev => ({ ...prev, [id]: 'pending' }));
        setTimeout(() => {
          setDocStatuses(prev => ({ ...prev, [id]: 'ready' }));
          if (i === ids.length - 1) setRequesting(false);
        }, 1200 + i * 400);
      }, 600 + i * 400);
    });
  };

  const saveToWallet = (id: string) => {
    const cvType = CV_TYPES.find(cv => cv.id === id);
    if (!cvType) return;

    // Calculate expiry date based on document type
    const now = new Date();
    const expiryDate = new Date(now);
    if (cvType.validityDays) {
      expiryDate.setDate(expiryDate.getDate() + cvType.validityDays);
    }

    // Save to localStorage with expiry info
    const savedDocs = JSON.parse(localStorage.getItem('trustwallet_academic_docs') || '[]');
    savedDocs.push({
      id: `${id}-${Date.now()}`,
      type: id,
      label: cvType.labelTh,
      issuedBy: cvType.issuedBy,
      issuedAt: now.toISOString(),
      expiresAt: cvType.validityDays ? expiryDate.toISOString() : null,
      expiresAtDisplay: cvType.validityDays ? expiryDate.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) : null,
      validityDays: cvType.validityDays,
    });
    localStorage.setItem('trustwallet_academic_docs', JSON.stringify(savedDocs));

    setDocStatuses(prev => ({ ...prev, [id]: 'saved' }));
  };

  const statusBadge = (status: DocStatus) => {
    if (status === 'requesting') return (
      <span className="flex items-center gap-1 text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 600 }}>
        <Loader2 size={9} className="animate-spin" /> กำลังส่งคำขอ
      </span>
    );
    if (status === 'pending') return (
      <span className="text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 600 }}>กำลังดำเนินการ</span>
    );
    if (status === 'ready') return (
      <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 600 }}>พร้อมดาวน์โหลด</span>
    );
    if (status === 'saved') return (
      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 600 }}>
        <CheckCircle2 size={9} /> บันทึกแล้ว
      </span>
    );
    return null;
  };

  return (
    <div className="size-full flex flex-col bg-[#F8F7FF] overflow-hidden">
      {/* Header — lock actions until student ID is saved */}
      <div className="shrink-0 bg-white px-4 pt-10 pb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={isStudentIdSaved ? onBack : undefined}
            disabled={!isStudentIdSaved}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${isStudentIdSaved ? 'bg-gray-100 active:bg-gray-200' : 'bg-gray-50 opacity-30 cursor-not-allowed'}`}
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 700 }}>My Documents</p>
            <p className="text-gray-500" style={{ fontSize: '11px' }}>Trust Wallet</p>
          </div>
          {/* Hide 'Request Doc' button until student ID is saved */}
          {isStudentIdSaved && (
            <button
              onClick={() => setShowRequestSheet(true)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white rounded-full px-3 py-1.5 active:bg-indigo-700"
              style={{ fontSize: '11px', fontWeight: 700 }}
            >
              <Plus size={12} /> ขอเอกสาร
            </button>
          )}
          <button
            onClick={isStudentIdSaved ? onBack : undefined}
            disabled={!isStudentIdSaved}
            className={`w-8 h-8 flex items-center justify-center rounded-full ml-1 ${isStudentIdSaved ? 'bg-gray-100 active:bg-gray-200' : 'bg-gray-50 opacity-30 cursor-not-allowed'}`}
          >
            <X size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6 space-y-4">
        {/* Expired documents notification */}
        {expiredCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2 animate-fade-in">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">
                🗑️ ทำลายเอกสารที่หมดอายุแล้ว
              </p>
              <p className="text-xs text-red-700 leading-relaxed">
                ระบบได้ทำลาย {expiredCount} เอกสารที่หมดอายุเพื่อความปลอดภัย กรุณาขอเอกสารใหม่หากต้องการใช้งาน
              </p>
            </div>
          </div>
        )}

        {/* Thai ID Card — always linked */}
        <div>
          <p className="text-gray-500 mb-2" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            บัตรประจำตัวประชาชน
          </p>
          <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 55%, #1565c0 100%)' }}>
            <div className="px-4 py-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-blue-200" style={{ fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Kingdom of Thailand</p>
                  <p className="text-white" style={{ fontSize: '12px', fontWeight: 700 }}>บัตรประจำตัวประชาชน</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <ShieldCheck size={15} className="text-blue-200" />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-15 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0" style={{ height: 60 }}>
                  <CreditCard size={20} className="text-white/50" />
                </div>
                <div>
                  <p className="text-blue-300" style={{ fontSize: '9px' }}>ชื่อ-นามสกุล</p>
                  <p className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>สมชาย ใจดี</p>
                  <p className="text-blue-300 mt-1" style={{ fontSize: '9px' }}>หมายเลขบัตร</p>
                  <p className="text-white font-mono" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>1-1001-12345-67-8</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-500 flex items-center justify-center gap-2 py-1.5">
              <CheckCircle2 size={12} className="text-white" />
              <p className="text-white" style={{ fontSize: '10px', fontWeight: 700 }}>เชื่อมต่อแล้ว · Trust Wallet</p>
              <Lock size={10} className="text-white/80" />
            </div>
          </div>
        </div>

        {/* Student ID Credential — shown always; other sections only after student ID is saved */}
        <StudentIDSection />

        {/* Dorm Access Credential — shown after contract is signed and credential is received */}
        <DormAccessCardSection onNavigate={onBack} />

        {/* Tenant Credentials Section — hidden during onboarding */}
        {!isStudentIdSaved ? null : /* Tenant section below */true && <>
        <TenantCredentialsSection />

        {/* Documents section */}
        <div>
          <p className="text-gray-500 mb-2" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            เอกสารการศึกษา
          </p>

          {/* Saved academic documents */}
          {academicDocs.length > 0 && (
            <div className="space-y-2 mb-3">
              {academicDocs.map(doc => {
                const expiryStatus = getExpiryStatus(doc.expiresAt);

                return (
                  <div key={doc.id} className={`bg-white rounded-2xl border p-3 ${
                    expiryStatus?.type === 'expiring' ? 'border-amber-200' : 'border-emerald-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                        <CheckCircle2 size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate" style={{ fontSize: '12px', fontWeight: 600 }}>
                          {doc.label}
                        </p>
                        <p className="text-gray-400" style={{ fontSize: '10px' }}>{doc.issuedBy}</p>
                      </div>
                      <div className="shrink-0">
                        {expiryStatus ? (
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            expiryStatus.type === 'expiring'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            <Clock size={9} />
                            {expiryStatus.label}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 600 }}>
                            <CheckCircle2 size={9} /> บันทึกแล้ว
                          </span>
                        )}
                      </div>
                    </div>
                    {doc.expiresAtDisplay && (
                      <p className="text-xs text-gray-500 mt-2">
                        หมดอายุ: {doc.expiresAtDisplay}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeDocs.length === 0 && academicDocs.length === 0 && (
            <button
              onClick={() => setShowRequestSheet(true)}
              className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-8 flex flex-col items-center gap-2 active:bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus size={18} className="text-gray-400" />
              </div>
              <p className="text-gray-500" style={{ fontSize: '12px', fontWeight: 600 }}>ขอเอกสารจากมหาวิทยาลัย</p>
              <p className="text-gray-400" style={{ fontSize: '10px' }}>แตะเพื่อเลือกประเภทเอกสาร</p>
            </button>
          )}

          <div className="space-y-2">
            {activeDocs.map(cv => {
              const status = docStatuses[cv.id];
              const validityText = cv.validityDays
                ? cv.validityDays >= 365
                  ? `อายุ ${Math.floor(cv.validityDays / 365)} ปี`
                  : cv.validityDays >= 30
                  ? `อายุ ${Math.floor(cv.validityDays / 30)} เดือน`
                  : `อายุ ${cv.validityDays} วัน`
                : 'ไม่มีวันหมดอายุ';

              return (
                <div key={cv.id} className={`bg-white rounded-2xl border p-3 ${status === 'saved' ? 'border-emerald-200' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${status === 'saved' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {status === 'saved' ? <CheckCircle2 size={17} /> : cv.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate" style={{ fontSize: '12px', fontWeight: 600 }}>{cv.labelTh}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-gray-400" style={{ fontSize: '10px' }}>{cv.issuedBy}</p>
                        {cv.validityDays && (
                          <>
                            <span className="text-gray-300">•</span>
                            <p className="text-gray-400 flex items-center gap-1" style={{ fontSize: '10px' }}>
                              <Clock size={9} />
                              {validityText}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">{statusBadge(status)}</div>
                  </div>

                  {status === 'ready' && (
                    <button
                      onClick={() => saveToWallet(cv.id)}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-indigo-600 text-white rounded-xl py-2 active:bg-indigo-700"
                      style={{ fontSize: '11px', fontWeight: 700 }}
                    >
                      <Download size={12} /> บันทึกลง Trust Wallet
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {(activeDocs.length > 0 || academicDocs.length > 0) && (
            <button
              onClick={() => setShowRequestSheet(true)}
              className="mt-2 w-full flex items-center justify-center gap-1.5 border border-indigo-200 text-indigo-600 rounded-2xl py-2.5 active:bg-indigo-50"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              <Plus size={13} /> ขอเอกสารเพิ่มเติม
            </button>
          )}

          {/* Expiry warning */}
          {academicDocs.some(doc => {
            const status = getExpiryStatus(doc.expiresAt);
            return status?.type === 'expiring';
          }) && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    มีเอกสารกำลังหมดอายุ
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    กรุณาขอเอกสารใหม่ก่อนวันหมดอายุ เพื่อใช้งานได้อย่างต่อเนื่อง
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </> /* end isStudentIdSaved guard */}
      </div>

      {/* Request sheet overlay — only available after student ID saved */}
      {showRequestSheet && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowRequestSheet(false)}
        >
          <div
            className="bg-white rounded-t-3xl px-4 pt-4 pb-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-900" style={{ fontSize: '15px', fontWeight: 700 }}>เลือกประเภทเอกสาร</p>
              <button onClick={() => setShowRequestSheet(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200">
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Issuer badge */}
            <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-2 mb-3 border border-indigo-100">
              <University size={14} className="text-indigo-600" />
              <p className="text-indigo-700 flex-1" style={{ fontSize: '11px', fontWeight: 600 }}>Chulalongkorn University · Verified Issuer</p>
              <ShieldCheck size={13} className="text-indigo-400" />
            </div>

            <div className="space-y-2 mb-4">
              {CV_TYPES.map(cv => {
                const status = docStatuses[cv.id];
                const isAlreadySaved = status === 'saved';
                const isActive = status && status !== 'idle';
                const isSelected = selectedIds.has(cv.id);
                const validityText = cv.validityDays
                  ? cv.validityDays >= 365
                    ? `${Math.floor(cv.validityDays / 365)} ปี`
                    : cv.validityDays >= 30
                    ? `${Math.floor(cv.validityDays / 30)} เดือน`
                    : `${cv.validityDays} วัน`
                  : null;

                return (
                  <div
                    key={cv.id}
                    onClick={() => !isAlreadySaved && !isActive && toggle(cv.id)}
                    className={`
                      flex items-center gap-3 rounded-2xl px-3 py-2.5 border transition-all
                      ${isAlreadySaved ? 'bg-emerald-50 border-emerald-200 opacity-60' : isActive ? 'bg-gray-50 border-gray-200 opacity-70' : isSelected ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200 active:bg-gray-50'}
                      ${isAlreadySaved || isActive ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isAlreadySaved ? 'bg-emerald-100 text-emerald-600' : isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                      {isAlreadySaved ? <CheckCircle2 size={16} /> : cv.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900" style={{ fontSize: '12px', fontWeight: 600 }}>{cv.labelTh}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-gray-400" style={{ fontSize: '10px' }}>{cv.label}</p>
                        {validityText && (
                          <>
                            <span className="text-gray-300">•</span>
                            <p className="text-gray-400 flex items-center gap-1" style={{ fontSize: '10px' }}>
                              <Clock size={9} />
                              อายุ {validityText}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {isAlreadySaved
                        ? <CheckCircle2 size={15} className="text-emerald-500" />
                        : isActive
                        ? <span className="text-gray-400" style={{ fontSize: '10px' }}>อยู่ระหว่างดำเนินการ</span>
                        : (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        )
                      }
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleRequest}
              disabled={selectedIds.size === 0}
              className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${selectedIds.size > 0 ? 'bg-indigo-600 text-white active:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              <ChevronRight size={16} />
              ส่งคำขอ {selectedIds.size > 0 ? `${selectedIds.size} เอกสาร` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PIN Setup ────────────────────────────────────────────────────────────────

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'] as const;

function PinSetupScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'create' | 'confirm' | 'success'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [shake, setShake] = useState(false);

  const current = phase === 'confirm' ? confirmPin : pin;
  const setter  = phase === 'confirm' ? setConfirmPin : setPin;

  const handleAutoFill = () => {
    if (phase === 'create') {
      setPin('123456');
      setPhase('confirm');
    } else if (phase === 'confirm') {
      setConfirmPin('123456');
      localStorage.setItem('trustwallet_pin', '123456');
      localStorage.setItem('trustwallet_registered', '1');
      setPhase('success');
      setTimeout(onDone, 1400);
    }
  };

  const handleKey = (key: string) => {
    if (phase === 'success') return;
    if (key === '⌫') {
      setter(p => p.slice(0, -1));
      return;
    }
    if (current.length >= 6) return;
    const next = current + key;
    setter(next);

    if (next.length === 6) {
      if (phase === 'create') {
        // Short delay so user sees 6th dot fill before advancing
        setTimeout(() => setPhase('confirm'), 300);
      } else {
        // Confirm phase — accept any 6-digit PIN
        setTimeout(() => {
          localStorage.setItem('trustwallet_pin', next);
          localStorage.setItem('trustwallet_registered', '1');
          setPhase('success');
          setTimeout(onDone, 1400);
        }, 300);
      }
    }
  };

  const title    = phase === 'create'  ? 'ตั้งรหัส PIN' : phase === 'confirm' ? 'ยืนยันรหัส PIN' : 'ตั้งรหัสสำเร็จ!';
  const subtitle = phase === 'create'  ? 'กรุณาตั้งรหัส 6 หลัก สำหรับเข้าใช้งาน Trust Wallet'
                 : phase === 'confirm' ? 'กรอกรหัส PIN อีกครั้งเพื่อยืนยัน'
                 : 'Trust Wallet พร้อมใช้งาน';

  return (
    <div className="size-full flex flex-col bg-[#F8F7FF] overflow-hidden">
      {/* Top gradient area */}
      <div className="shrink-0 flex flex-col items-center pt-12 pb-8 px-6"
        style={{ background: 'linear-gradient(160deg, #1a237e 0%, #3949ab 60%, #1565c0 100%)' }}
      >
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${phase === 'success' ? 'bg-emerald-400 border-2 border-emerald-300' : 'bg-white/10 border border-white/20'}`}>
          {phase === 'success'
            ? <CheckCircle2 size={34} className="text-white" />
            : <Lock size={30} className="text-white" />
          }
        </div>
        <p className="text-white text-center" style={{ fontSize: '18px', fontWeight: 800 }}>{title}</p>
        <p className="text-blue-200 text-center mt-1" style={{ fontSize: '11px' }}>{subtitle}</p>

        {/* Step dots (create / confirm) */}
        {phase !== 'success' && (
          <div className="flex items-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full transition-colors ${phase === 'create' ? 'bg-white' : 'bg-emerald-400'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${phase === 'confirm' ? 'bg-white' : 'bg-white/30'}`} />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-8">
        {/* PIN dots */}
        {phase !== 'success' && (
          <div className={`flex items-center gap-4 ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}
            style={shake ? { animation: 'shake 0.4s ease' } : {}}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const filled = i < current.length;
              return (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                    filled
                      ? 'bg-indigo-600 border-indigo-600 scale-110'
                      : 'bg-transparent border-gray-300'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Shake keyframe style */}
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-8px); }
            40%      { transform: translateX(8px); }
            60%      { transform: translateX(-6px); }
            80%      { transform: translateX(6px); }
          }
        `}</style>

        {/* Mismatch hint */}
        {phase === 'confirm' && shake && (
          <p className="text-red-400 text-center" style={{ fontSize: '11px' }}>รหัส PIN ไม่ตรงกัน กรุณาลองอีกครั้ง</p>
        )}

        {/* Success pulse */}
        {phase === 'success' && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={44} className="text-emerald-500" />
            </div>
            <p className="text-gray-700" style={{ fontSize: '13px', fontWeight: 600 }}>กำลังเข้าสู่ My Documents…</p>
            <Loader2 size={16} className="text-indigo-400 animate-spin" />
          </div>
        )}

        {/* Auto-fill Button */}
        {phase !== 'success' && (
          <button
            type="button"
            onClick={handleAutoFill}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-bold transition-all text-xs mb-2 animate-pulse-glow"
          >
            ⚡ ตั้งรหัสผ่านอัตโนมัติ (123456)
          </button>
        )}
        {/* Numpad grayed out — use auto-fill button above instead */}

        {/* Numpad — disabled during guided demo; use auto-fill button */}
        {phase !== 'success' && (
          <div className="grid grid-cols-3 gap-3 w-full mt-2 opacity-20 pointer-events-none">
            {NUMPAD.map((key, idx) => {
              if (key === '') return <div key={idx} />;
              const isDelete = key === '⌫';
              return (
                <button
                  key={idx}
                  disabled
                  className={`
                    h-14 rounded-2xl flex items-center justify-center
                    ${isDelete
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-white border border-gray-100 shadow-sm text-gray-900'
                    }
                  `}
                  style={{ fontSize: isDelete ? '18px' : '22px', fontWeight: 600 }}
                >
                  {key}
                </button>
              );
            })}
          </div>
        )}

        {/* Security note */}
        {phase === 'create' && (
          <div className="flex items-center gap-2 mt-4">
            <Lock size={12} className="text-gray-400" />
            <p className="text-gray-400" style={{ fontSize: '10px' }}>PIN ถูกเก็บเข้ารหัสในอุปกรณ์นี้เท่านั้น</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PIN Entry (returning user) ───────────────────────────────────────────────

function PinEntryScreen({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleAutoFill = () => {
    setPin('123456');
    setTimeout(() => {
      onSuccess();
    }, 200);
  };

  const handleKey = (key: string) => {
    if (key === '⌫') { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= 6) return;
    const next = pin + key;
    setPin(next);

    if (next.length === 6) {
      setTimeout(() => {
        // Accept ANY 6 digit PIN directly, no need to match stored!
        onSuccess();
      }, 200);
    }
  };

  return (
    <div className="size-full flex flex-col bg-[#F8F7FF] overflow-hidden">
      <div className="shrink-0 flex flex-col items-center pt-12 pb-8 px-6"
        style={{ background: 'linear-gradient(160deg, #1a237e 0%, #3949ab 60%, #1565c0 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
          <Lock size={30} className="text-white" />
        </div>
        <p className="text-white text-center" style={{ fontSize: '18px', fontWeight: 800 }}>ยืนยันตัวตน</p>
        <p className="text-blue-200 text-center mt-1" style={{ fontSize: '11px' }}>กรอกรหัส PIN 6 หลัก เพื่อเข้า My Documents</p>

        {/* Thai ID linked badge */}
        <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
          <CreditCard size={12} className="text-blue-200" />
          <p className="text-blue-100" style={{ fontSize: '10px', fontWeight: 600 }}>Thai ID เชื่อมต่อแล้ว</p>
          <CheckCircle2 size={11} className="text-emerald-400" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-8">
        {/* PIN dots */}
        <div className={shake ? '' : ''} style={shake ? { animation: 'shake 0.4s ease' } : {}}>
          <div className="flex items-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  i < pin.length
                    ? 'bg-indigo-600 border-indigo-600 scale-110'
                    : 'bg-transparent border-indigo-200'
                }`}
              />
            ))}
          </div>
        </div>

        {attempts > 0 && (
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <X size={13} className="text-red-400 shrink-0" />
            <p className="text-red-500" style={{ fontSize: '11px' }}>
              รหัสไม่ถูกต้อง {attempts > 1 ? `(${attempts} ครั้ง)` : ''} กรุณาลองอีกครั้ง
            </p>
          </div>
        )}

        {/* Auto-fill Button */}
        <button
          type="button"
          onClick={handleAutoFill}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-bold transition-all text-xs mt-2 animate-pulse-glow"
        >
          ⚡ เข้าสู่ระบบอัตโนมัติ (123456)
        </button>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full mt-2">
          {NUMPAD.map((key, idx) => {
            if (key === '') return <div key={idx} />;
            const isDelete = key === '⌫';
            return (
              <button
                key={idx}
                onClick={() => handleKey(key)}
                className={`
                  h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95
                  ${isDelete
                    ? 'bg-gray-200 text-gray-600 active:bg-gray-300'
                    : 'bg-white border border-gray-100 shadow-sm text-gray-900 active:bg-indigo-50 active:border-indigo-200'
                  }
                `}
                style={{ fontSize: isDelete ? '18px' : '22px', fontWeight: 600 }}
              >
                {key}
              </button>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-400 active:text-gray-600 mt-2"
          style={{ fontSize: '12px' }}
        >
          <ArrowLeft size={12} /> กลับ
        </button>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function MyDocumentsPage({ onNavigate }: MyDocumentsPageProps) {
  const isRegistered = !!localStorage.getItem('trustwallet_pin');
  const [step, setStep] = useState<AppStep>(isRegistered ? 'pin-entry' : 'consent');

  useEffect(() => {
    if (step === 'linking') {
      const t = setTimeout(() => setStep('pin-setup'), 3200);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (step === 'pin-entry') {
    return (
      <PinEntryScreen
        onSuccess={() => setStep('main')}
        onBack={() => onNavigate('01')}
      />
    );
  }

  if (step === 'consent') {
    return (
      <ConsentScreen
        onAllow={() => setStep('qr')}
        onDeny={() => onNavigate('01')}
      />
    );
  }

  if (step === 'qr') {
    return (
      <QRScreen
        onScanned={() => setStep('linking')}
        onBack={() => setStep('consent')}
      />
    );
  }

  if (step === 'linking') {
    return <LinkingScreen />;
  }

  if (step === 'pin-setup') {
    return <PinSetupScreen onDone={() => setStep('main')} />;
  }

  return <MainDocs onBack={() => onNavigate('01')} />;
}
