import { useState } from 'react';
import {
  User, CreditCard, Lock, Bell, Globe, Shield, FileText,
  ChevronRight, CheckCircle2, LogOut, Trash2, Moon, Info,
  KeyRound, Fingerprint, Copy,
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (screen: string) => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${value ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-5.5' : 'left-0.5'}`}
        style={{ left: value ? '22px' : '2px' }}
      />
    </button>
  );
}

function Row({
  icon, iconBg, label, sub, right, danger = false, onClick,
}: {
  icon: React.ReactNode; iconBg: string; label: string; sub?: string;
  right?: React.ReactNode; danger?: boolean; onClick?: () => void;
}) {
  const content = (
    <>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={danger ? 'text-red-500' : 'text-gray-900'} style={{ fontSize: '13px', fontWeight: 600 }}>{label}</p>
        {sub && <p className="text-gray-400 truncate" style={{ fontSize: '10px' }}>{sub}</p>}
      </div>
      <div className="shrink-0">{right ?? (onClick && <ChevronRight size={15} className="text-gray-300" />)}</div>
    </>
  );

  if (onClick && !right) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="w-full flex items-center gap-3 px-4 py-3.5">
      {content}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-50 mx-4" />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-4 mb-1 text-gray-400" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
        {title}
      </p>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [notif, setNotif]     = useState(true);
  const [darkMode, setDark]   = useState(false);
  const [biometric, setBio]   = useState(false);
  const [lang, setLang]       = useState<'th' | 'en'>('th');
  const [showSignOut, setShowSignOut] = useState(false);
  const [copiedDid, setCopiedDid] = useState(false);
  const studentDid = 'did:key:z6Mku8VdfU6551mJtLqyvH34RkW3Dk29fWpUv32n9h76L8jK';

  const handleCopyDid = () => {
    navigator.clipboard.writeText(studentDid);
    setCopiedDid(true);
    setTimeout(() => setCopiedDid(false), 2000);
  };

  const isRegistered = !!localStorage.getItem('trustwallet_pin');

  const handleSignOut = () => {
    localStorage.removeItem('trustwallet_pin');
    localStorage.removeItem('trustwallet_registered');
    setShowSignOut(false);
    onNavigate('00');
  };

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-white px-4 pt-10 pb-5 shadow-sm">
        <p className="text-gray-900" style={{ fontSize: '22px', fontWeight: 900 }}>Settings</p>
        <p className="text-gray-400" style={{ fontSize: '12px' }}>จัดการบัญชีและการตั้งค่า</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 pb-8">
        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#1e40af,#4f46e5)' }}
          >
            <p className="text-white" style={{ fontSize: '20px', fontWeight: 900 }}>ส</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900" style={{ fontSize: '15px', fontWeight: 800 }}>สมชาย ใจดี</p>
            <p className="text-gray-500" style={{ fontSize: '11px' }}>รหัสนักศึกษา 6640501234</p>
            <p className="text-gray-400" style={{ fontSize: '11px' }}>Chulalongkorn University</p>
            <div 
              onClick={handleCopyDid}
              className="flex items-center gap-1 mt-1.5 bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 rounded-lg px-2 py-0.5 w-fit cursor-pointer active:scale-95 transition-all duration-150"
              title="Copy Student DID"
            >
              <span className="text-[9px] font-mono text-slate-500 truncate max-w-[125px]">
                {studentDid}
              </span>
              {copiedDid ? (
                <span className="text-[9px] font-bold text-emerald-600 ml-0.5 scale-95 duration-200">Copied!</span>
              ) : (
                <Copy size={9} className="text-slate-400 ml-0.5 shrink-0" />
              )}
            </div>
          </div>
          <button className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:bg-gray-200">
            <User size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Account */}
        <Section title="บัญชีและตัวตน">
          <Row
            icon={<CreditCard size={16} className="text-blue-700" />}
            iconBg="bg-blue-100"
            label="บัตรประชาชน (Thai ID)"
            sub={isRegistered ? "เชื่อมต่อแล้ว · ยืนยันตัวตนสำเร็จ" : "ยังไม่ได้เชื่อมต่อ"}
            right={isRegistered
              ? <CheckCircle2 size={16} className="text-emerald-500" />
              : <span className="text-xs text-indigo-600 font-semibold">เชื่อมต่อ</span>
            }
          />
          <Divider />
          <Row
            icon={<Shield size={16} className="text-indigo-600" />}
            iconBg="bg-indigo-100"
            label="Trust Level"
            sub="ระดับ 2 · Verified Student"
            right={
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 700 }}>
                Lv. 2
              </span>
            }
          />
        </Section>

        {/* Security */}
        <Section title="ความปลอดภัย">
          <Row
            icon={<KeyRound size={16} className="text-emerald-600" />}
            iconBg="bg-emerald-100"
            label="เปลี่ยนรหัส PIN"
            sub="PIN 6 หลัก สำหรับเข้าใช้งาน"
            onClick={() => {}}
          />
          <Divider />
          <Row
            icon={<Fingerprint size={16} className="text-purple-600" />}
            iconBg="bg-purple-100"
            label="ยืนยันด้วย Biometric"
            sub="ใช้นิ้วมือหรือใบหน้าแทน PIN"
            right={<Toggle value={biometric} onChange={setBio} />}
          />
          <Divider />
          <Row
            icon={<Lock size={16} className="text-gray-600" />}
            iconBg="bg-gray-100"
            label="ล็อกแอปอัตโนมัติ"
            sub="หลังจากไม่ได้ใช้งาน 5 นาที"
            right={
              <span className="text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 600 }}>
                5 นาที
              </span>
            }
            onClick={() => {}}
          />
        </Section>

        {/* Preferences */}
        <Section title="การตั้งค่า">
          <Row
            icon={<Bell size={16} className="text-amber-600" />}
            iconBg="bg-amber-100"
            label="การแจ้งเตือน"
            sub="แจ้งบิล สัญญา และข่าวสาร"
            right={<Toggle value={notif} onChange={setNotif} />}
          />
          <Divider />
          <Row
            icon={<Moon size={16} className="text-slate-600" />}
            iconBg="bg-slate-100"
            label="ธีมมืด (Dark Mode)"
            sub="ปรับหน้าจอเป็นสีเข้ม"
            right={<Toggle value={darkMode} onChange={setDark} />}
          />
          <Divider />
          <Row
            icon={<Globe size={16} className="text-teal-600" />}
            iconBg="bg-teal-100"
            label="ภาษา / Language"
            sub={lang === 'th' ? 'ภาษาไทย' : 'English'}
            right={
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                {(['th', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 transition-colors ${lang === l ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'}`}
                    style={{ fontSize: '11px', fontWeight: 700 }}
                  >
                    {l === 'th' ? 'TH' : 'EN'}
                  </button>
                ))}
              </div>
            }
          />
        </Section>

        {/* Legal */}
        <Section title="ข้อมูลและกฎหมาย">
          <Row
            icon={<FileText size={16} className="text-gray-600" />}
            iconBg="bg-gray-100"
            label="เงื่อนไขการใช้งาน"
            onClick={() => {}}
          />
          <Divider />
          <Row
            icon={<Shield size={16} className="text-gray-600" />}
            iconBg="bg-gray-100"
            label="นโยบายความเป็นส่วนตัว"
            onClick={() => {}}
          />
          <Divider />
          <Row
            icon={<Info size={16} className="text-gray-600" />}
            iconBg="bg-gray-100"
            label="เกี่ยวกับแอป"
            sub="Trust Wallet v1.0.0 · Build 2569"
            right={<span />}
          />
        </Section>

        {/* Danger zone */}
        <Section title="บัญชี">
          <Row
            icon={<LogOut size={16} className="text-red-500" />}
            iconBg="bg-red-50"
            label="ออกจากระบบ"
            danger
            onClick={() => setShowSignOut(true)}
          />
          <Divider />
          <Row
            icon={<Trash2 size={16} className="text-red-400" />}
            iconBg="bg-red-50"
            label="ลบข้อมูลทั้งหมด"
            sub="ลบ PIN และข้อมูลในอุปกรณ์นี้"
            danger
            onClick={() => setShowSignOut(true)}
          />
        </Section>

        <p className="text-center text-gray-300 pb-2" style={{ fontSize: '10px' }}>
          Trust Rental Platform · © 2569 · All rights reserved
        </p>
      </div>

      {/* Sign-out confirm */}
      {showSignOut && (
        <div className="absolute inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowSignOut(false)}
        >
          <div className="w-full bg-white rounded-t-3xl px-5 py-6 space-y-3" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
            <p className="text-gray-900 text-center" style={{ fontSize: '16px', fontWeight: 800 }}>ออกจากระบบ?</p>
            <p className="text-gray-500 text-center" style={{ fontSize: '12px', lineHeight: 1.6 }}>
              การออกจากระบบจะลบ PIN ออกจากอุปกรณ์นี้ ต้องตั้งค่าใหม่ในครั้งถัดไป
            </p>
            <button
              onClick={handleSignOut}
              className="w-full py-3.5 rounded-2xl bg-red-500 text-white flex items-center justify-center gap-2 active:bg-red-600"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              <LogOut size={16} /> ออกจากระบบ
            </button>
            <button
              onClick={() => setShowSignOut(false)}
              className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 active:bg-gray-200"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
