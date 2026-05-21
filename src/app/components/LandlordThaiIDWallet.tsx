import { useState, useEffect } from 'react';
import {
  ArrowLeft, ShieldCheck, Loader2, CheckCircle2,
  Lock, Building2, MapPin, X, Smartphone, Clock, CreditCard, Download,
  AlertCircle, FileCheck,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface LandlordThaiIDWalletProps {
  onNavigate: (screen: string) => void;
}

type WalletStep = 'consent' | 'qr' | 'linking' | 'pin-setup' | 'pin-entry' | 'main' | 'receive-credential';

const NUMPAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'] as const;

// ─── Consent Screen ───────────────────────────────────────────────────────────

function ConsentScreen({ onAllow, onDeny }: { onAllow: () => void; onDeny: () => void }) {
  return (
    <div className="size-full flex flex-col bg-white">
      <div className="shrink-0 px-4 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onDeny} className="w-8 h-8 rounded-full bg-gray-100 active:bg-gray-200 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 700 }}>เชื่อมต่อบัตรประชาชน</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <CreditCard size={40} className="text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              เชื่อมต่อบัตรประชาชนดิจิทัล
            </h2>
            <p className="text-sm text-gray-600">
              ยืนยันตัวตนสำหรับผู้ประกอบการหอพัก
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-blue-900 mb-3">
            ทำไมต้องเชื่อมต่อบัตรประชาชน?
          </p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span>ยืนยันตัวตนผู้ประกอบการอย่างปลอดภัย</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span>รับใบอนุญาตและใบรับรองจากหน่วยงานราชการ</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span>จัดการธุรกิจหอพักได้อย่างถูกต้องตามกฎหมาย</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <Lock size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">
                ข้อมูลของคุณปลอดภัย
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                ข้อมูลจะถูกเข้ารหัสและเก็บบนอุปกรณ์ของคุณเท่านั้น
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-6 pb-6 pt-4 bg-white border-t border-gray-100">
        <button
          onClick={onAllow}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-base active:scale-[0.98] transition-transform"
        >
          เชื่อมต่อบัตรประชาชน
        </button>
        <button
          onClick={onDeny}
          className="w-full text-gray-600 py-3 rounded-xl font-semibold text-sm mt-2"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}

// ─── QR Screen ────────────────────────────────────────────────────────────────

function QRScreen({ onScanned, onBack }: { onScanned: () => void; onBack: () => void }) {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    // Auto-scan after 2 seconds
    const autoScan = setTimeout(() => {
      onScanned();
    }, 2000);

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(autoScan);
      clearInterval(interval);
    };
  }, [onScanned]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="size-full flex flex-col bg-[#F8F7FF]">
      <div className="shrink-0 px-4 pt-10 pb-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-gray-100 active:bg-gray-200 flex items-center justify-center">
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div>
            <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 700 }}>สแกน QR Code</p>
            <p className="text-gray-500" style={{ fontSize: '11px' }}>เชื่อมต่อบัตรประชาชนดิจิทัล</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-4 mb-4">
            <QRCodeSVG value="landlord-thai-id-connect-123456" size={200} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">สแกนด้วยแอพบัตรประชาชนดิจิทัล</p>
            <div className="flex items-center justify-center gap-1.5">
              <Clock size={14} className={timeLeft < 30 ? 'text-red-500' : 'text-gray-400'} />
              <p className={`text-xs font-mono ${timeLeft < 30 ? 'text-red-600' : 'text-gray-500'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 max-w-sm">
          <p className="text-xs text-blue-800 text-center">
            💡 กำลังเชื่อมต่ออัตโนมัติ...
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Linking Screen ───────────────────────────────────────────────────────────

function LinkingScreen() {
  const steps = [
    'เชื่อมต่อระบบบัตรประชาชนดิจิทัล',
    'ยืนยันข้อมูลผู้ประกอบการ',
    'เข้ารหัสและบันทึกข้อมูล',
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

// ─── PIN Setup ────────────────────────────────────────────────────────────────

function PinSetupScreen({ onSuccess }: { onSuccess: () => void }) {
  type Phase = 'create' | 'confirm' | 'success';
  const [phase, setPhase] = useState<Phase>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (phase === 'success') {
      setTimeout(onSuccess, 1500);
    }
  }, [phase, onSuccess]);

  const handleAutoFill = () => {
    if (phase === 'create') {
      setPin('123456');
      setPhase('confirm');
    } else if (phase === 'confirm') {
      setConfirmPin('123456');
      localStorage.setItem('landlord_thai_id_pin', '123456');
      setPhase('success');
    }
  };

  const handleKey = (key: string) => {
    if (phase === 'success') return;

    if (key === '⌫') {
      if (phase === 'create') setPin(p => p.slice(0, -1));
      else setConfirmPin(p => p.slice(0, -1));
      return;
    }

    const current = phase === 'create' ? pin : confirmPin;
    if (current.length >= 6) return;

    const newValue = current + key;

    if (phase === 'create') {
      setPin(newValue);
      if (newValue.length === 6) {
        setTimeout(() => {
          setPhase('confirm');
        }, 200);
      }
    } else {
      setConfirmPin(newValue);
      if (newValue.length === 6) {
        setTimeout(() => {
          // Accept any 6 digit PIN
          localStorage.setItem('landlord_thai_id_pin', newValue);
          setPhase('success');
        }, 200);
      }
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
        <p className="text-white text-center" style={{ fontSize: '18px', fontWeight: 800 }}>
          {phase === 'create' ? 'สร้างรหัส PIN' : phase === 'confirm' ? 'ยืนยันรหัส PIN' : 'สำเร็จ!'}
        </p>
        <p className="text-blue-200 text-center mt-1" style={{ fontSize: '11px' }}>
          {phase === 'create'
            ? 'กรอกรหัส PIN 6 หลัก เพื่อป้องกันข้อมูล'
            : phase === 'confirm'
            ? 'กรอกรหัส PIN อีกครั้งเพื่อยืนยัน'
            : 'พร้อมใช้งาน'
          }
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-8">
        <div className={shake ? '' : ''} style={shake ? { animation: 'shake 0.4s ease' } : {}}>
          <div className="flex items-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => {
              const current = phase === 'create' ? pin : confirmPin;
              return (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < current.length
                      ? 'bg-indigo-600 scale-110'
                      : 'bg-gray-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%      { transform: translateX(-12px); }
            40%      { transform: translateX(12px); }
            60%      { transform: translateX(-8px); }
            80%      { transform: translateX(6px); }
          }
        `}</style>

        {phase === 'confirm' && shake && (
          <p className="text-red-400 text-center" style={{ fontSize: '11px' }}>รหัส PIN ไม่ตรงกัน กรุณาลองอีกครั้ง</p>
        )}

        {phase === 'success' && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={44} className="text-emerald-500" />
            </div>
            <p className="text-gray-700" style={{ fontSize: '13px', fontWeight: 600 }}>เชื่อมต่อสำเร็จ</p>
            <Loader2 size={16} className="text-indigo-400 animate-spin" />
          </div>
        )}

        {phase !== 'success' && (
          <div className="grid grid-cols-3 gap-3 w-full mt-8">
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
        )}
      </div>
    </div>
  );
}

// ─── PIN Entry ────────────────────────────────────────────────────────────────

function PinEntryScreen({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const handleAutoFill = () => {
    setPin('123456');
    setTimeout(() => {
      onSuccess();
    }, 200);
  };

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setPin(p => p.slice(0, -1));
      return;
    }

    if (pin.length >= 6) return;
    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === 6) {
      setTimeout(() => {
        // Accept any 6 digit PIN
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
        <p className="text-blue-200 text-center mt-1" style={{ fontSize: '11px' }}>กรอกรหัส PIN 6 หลัก</p>

        <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
          <CreditCard size={12} className="text-blue-200" />
          <p className="text-blue-100" style={{ fontSize: '10px', fontWeight: 600 }}>Thai ID เชื่อมต่อแล้ว</p>
          <CheckCircle2 size={11} className="text-emerald-400" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-8">
        <div className={shake ? '' : ''} style={shake ? { animation: 'shake 0.4s ease' } : {}}>
          <div className="flex items-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < pin.length ? 'bg-indigo-600 scale-110' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%      { transform: translateX(-12px); }
            40%      { transform: translateX(12px); }
            60%      { transform: translateX(-8px); }
            80%      { transform: translateX(6px); }
          }
        `}</style>

        {shake && (
          <p className="text-red-400 text-center" style={{ fontSize: '11px' }}>รหัส PIN ไม่ถูกต้อง กรุณาลองอีกครั้ง</p>
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

// ─── Receive Credential Modal ─────────────────────────────────────────────────

function ReceiveCredentialModal({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<'receiving' | 'preview' | 'saving' | 'saved'>('receiving');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('preview');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setStep('saving');

    setTimeout(() => {
      const existingCreds = JSON.parse(
        localStorage.getItem('landlord_wallet_credentials') || '[]'
      );

      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const newCredential = {
        id: `district_license-${Date.now()}`,
        type: 'district',
        issuer: 'Pathumwan District Office',
        issuerTh: 'สำนักงานเขตปทุมวัน',
        name: 'Dormitory Business Agreement',
        nameTh: 'ใบอนุญาตประกอบกิจการหอพัก',
        description: 'ใบอนุญาตจากสำนักงานเขตยืนยันว่าหอพักได้รับอนุญาตตามกฎหมาย',
        issuedAt: now.toISOString(),
        savedAt: now.toLocaleString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        expiresAt: expiryDate.toISOString(),
        expiresAtDisplay: expiryDate.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: 'active',
      };

      existingCreds.push(newCredential);
      localStorage.setItem('landlord_wallet_credentials', JSON.stringify(existingCreds));

      window.dispatchEvent(new CustomEvent('landlordCredentialSaved', {
        detail: newCredential
      }));

      setStep('saved');
      setTimeout(() => {
        onSave();
      }, 1500);
    }, 1500);
  };

  const handleClose = () => {
    if (step === 'saving') return;
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'saving') {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl relative my-auto max-h-[90vh] flex flex-col">
        {step !== 'saving' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-20"
          >
            <X size={18} className="text-gray-600" />
          </button>
        )}

        <div className="overflow-y-auto p-6">
          {step === 'receiving' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center relative">
                <ShieldCheck size={40} className="text-indigo-600" />
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  กำลังรับใบอนุญาต
                </h3>
                <p className="text-sm text-gray-600">
                  สำนักงานเขตกำลังส่งใบอนุญาตมาให้คุณ
                </p>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    ได้รับใบอนุญาตแล้ว
                  </h3>
                  <p className="text-xs text-gray-500">
                    ตรวจสอบข้อมูลและบันทึก
                  </p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border-2 border-indigo-200">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-white" />
                      <p className="text-white text-xs font-semibold">
                        District License
                      </p>
                    </div>
                    <ShieldCheck size={18} className="text-white/80" />
                  </div>
                  <p className="text-white font-bold text-lg">
                    ใบอนุญาตประกอบกิจการหอพัก
                  </p>
                  <p className="text-purple-200 text-sm mt-1">
                    Dormitory Business Agreement
                  </p>
                </div>

                <div className="bg-white p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">ออกโดย</p>
                    <p className="text-sm font-semibold text-gray-900">
                      สำนักงานเขตปทุมวัน
                    </p>
                    <p className="text-xs text-gray-500">Pathumwan District Office</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">รายละเอียด</p>
                    <p className="text-sm text-gray-900">
                      ใบอนุญาตจากสำนักงานเขตยืนยันว่าหอพักได้รับอนุญาตตามกฎหมาย
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">ใบอนุญาตหมดอายุ</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })} (1 ปี)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  ปิด
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  บันทึก
                </button>
              </div>
            </div>
          )}

          {step === 'saving' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <Loader2 size={40} className="text-indigo-600 animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  กำลังบันทึก...
                </h3>
                <p className="text-sm text-gray-600">
                  กำลังเข้ารหัสและบันทึกใบอนุญาต
                </p>
              </div>
            </div>
          )}

          {step === 'saved' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-emerald-600" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  บันทึกสำเร็จ!
                </h3>
                <p className="text-sm text-gray-600">
                  คุณสามารถเข้าใช้งาน Landlord Console ได้แล้ว
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors mt-2"
              >
                เสร็จสิ้น
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Credentials View ───────────────────────────────────────────────────

function MainCredentialsView({ onBack, onNavigate }: { onBack: () => void; onNavigate: (screen: string) => void }) {
  const [hasBusinessAgreement, setHasBusinessAgreement] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'requesting' | 'pending' | 'approved'>('idle');
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  useEffect(() => {
    const checkCredentials = () => {
      const creds = localStorage.getItem('landlord_wallet_credentials');
      if (creds) {
        try {
          const parsed = JSON.parse(creds);
          const hasAgreement = parsed.some((c: any) => c.id.includes('district_license'));
          setHasBusinessAgreement(hasAgreement);
          if (hasAgreement) {
            setRequestStatus('approved');
          }
        } catch (e) {
          setHasBusinessAgreement(false);
        }
      }
    };

    checkCredentials();

    const handleCredentialSaved = () => {
      checkCredentials();
    };

    window.addEventListener('landlordCredentialSaved', handleCredentialSaved);
    const interval = setInterval(checkCredentials, 500);

    return () => {
      window.removeEventListener('landlordCredentialSaved', handleCredentialSaved);
      clearInterval(interval);
    };
  }, []);

  const handleRequestBusinessAgreement = () => {
    setRequestStatus('requesting');

    // Simulate request process
    setTimeout(() => {
      setRequestStatus('pending');

      // Simulate approval after some time
      setTimeout(() => {
        setRequestStatus('approved');
        setShowReceiveModal(true);
      }, 3000);
    }, 2000);
  };

  const handleCredentialSaved = () => {
    setShowReceiveModal(false);
    setHasBusinessAgreement(true);
  };

  const handleAccessConsole = () => {
    onNavigate('landlord');
  };

  return (
    <div className="size-full flex flex-col bg-[#F8F7FF]">
      <div className="shrink-0 bg-white px-4 pt-10 pb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 700 }}>Landlord Portal</p>
            <p className="text-gray-500" style={{ fontSize: '11px' }}>ผู้ประกอบการหอพัก</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Thai ID Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-4 text-white">
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
              <p className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>นายสมชาย ประกอบการ</p>
              <p className="text-blue-300 mt-1" style={{ fontSize: '9px' }}>หมายเลขบัตร</p>
              <p className="text-white font-mono" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>1-1001-54321-89-0</p>
            </div>
          </div>
        </div>

        {/* Business Agreement Section */}
        <div>
          <p className="text-gray-500 mb-2" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            เอกสารที่จำเป็น
          </p>

          {hasBusinessAgreement ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FileCheck size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    ใบอนุญาตประกอบกิจการหอพัก
                  </p>
                  <p className="text-xs text-gray-500">Dormitory Business Agreement</p>
                </div>
                <div className="shrink-0">
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    <CheckCircle2 size={10} />
                    ได้รับแล้ว
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                ออกโดย: สำนักงานเขตปทุมวัน
              </p>
              <button
                onClick={handleAccessConsole}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
              >
                เข้าสู่ Landlord Console
              </button>
            </div>
          ) : (
            <div className={`border-2 rounded-2xl p-4 ${
              requestStatus === 'requesting' ? 'bg-blue-50 border-blue-200' :
              requestStatus === 'pending' ? 'bg-amber-50 border-amber-200' :
              'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {requestStatus === 'requesting' ? (
                  <Loader2 size={20} className="text-blue-600 shrink-0 mt-0.5 animate-spin" />
                ) : requestStatus === 'pending' ? (
                  <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    {requestStatus === 'requesting' ? 'กำลังส่งคำขอ...' :
                     requestStatus === 'pending' ? 'รอการอนุมัติ' :
                     'ต้องได้รับใบอนุญาตก่อนใช้งาน'}
                  </p>
                  <p className="text-xs text-gray-800 leading-relaxed">
                    {requestStatus === 'requesting' ? 'กำลังส่งคำขอไปยังสำนักงานเขตปทุมวัน' :
                     requestStatus === 'pending' ? 'สำนักงานเขตกำลังพิจารณาคำขอของคุณ' :
                     'คุณต้องได้รับ ใบอนุญาตประกอบกิจการหอพัก จากสำนักงานเขตก่อนเข้าใช้งาน Landlord Console'}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 mb-3">
                <p className="text-xs font-semibold text-gray-900 mb-2">ต้องการเอกสาร:</p>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      ใบอนุญาตประกอบกิจการหอพัก
                    </p>
                    <p className="text-xs text-gray-600">
                      Dormitory Business Agreement
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      จากสำนักงานเขตปทุมวัน
                    </p>
                  </div>
                  {requestStatus === 'pending' && (
                    <div className="shrink-0">
                      <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <Clock size={10} />
                        รออนุมัติ
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleRequestBusinessAgreement}
                disabled={requestStatus !== 'idle'}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestStatus === 'requesting' || requestStatus === 'pending' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {requestStatus === 'requesting' ? 'กำลังส่งคำขอ...' : 'รอการอนุมัติ...'}
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    ขอใบอนุญาตจากสำนักงานเขต
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">💡 หมายเหตุ:</span> ใบอนุญาตประกอบกิจการหอพักเป็นเอกสารที่จำเป็นตามกฎหมาย คุณจะสามารถเข้าใช้งาน Landlord Console ได้หลังจากได้รับใบอนุญาตนี้แล้วเท่านั้น
          </p>
        </div>
      </div>

      {/* Receive Credential Modal */}
      {showReceiveModal && (
        <ReceiveCredentialModal
          onSave={handleCredentialSaved}
          onCancel={() => setShowReceiveModal(false)}
        />
      )}
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function LandlordThaiIDWallet({ onNavigate }: LandlordThaiIDWalletProps) {
  const hasThaiID = !!localStorage.getItem('landlord_thai_id_pin');
  const [step, setStep] = useState<WalletStep>(hasThaiID ? 'pin-entry' : 'consent');

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
        onBack={() => onNavigate('00')}
      />
    );
  }

  if (step === 'consent') {
    return (
      <ConsentScreen
        onAllow={() => setStep('qr')}
        onDeny={() => onNavigate('00')}
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
    return <PinSetupScreen onSuccess={() => setStep('main')} />;
  }

  if (step === 'main') {
    return (
      <MainCredentialsView
        onBack={() => onNavigate('00')}
        onNavigate={onNavigate}
      />
    );
  }

  return null;
}
