'use client';

import { useState, useEffect } from 'react';
import {
  Scan, CheckCircle2, XCircle, Building2, Car, QrCode,
  ShieldCheck, Loader2, ArrowLeft, Wifi, Lock, Sparkles, MapPin,
} from 'lucide-react';

interface ParkingScreenProps {
  onNavigate: (screen: string, tab?: any) => void;
}

const PARKING_ZONES = [
  { id: 'A', label: 'อาคาร A (ชั้น B1–B2)', allowed: true,  color: '#4f46e5' },
  { id: 'B', label: 'อาคาร B (ชั้น B1)',    allowed: false, color: '#9ca3af' },
  { id: 'C', label: 'อาคาร C (ชั้น B1–B3)', allowed: false, color: '#9ca3af' },
];

type ScanState = 'idle' | 'scanning' | 'verifying' | 'granted' | 'denied';

export default function ParkingScreen({ onNavigate }: ParkingScreenProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [countdown, setCountdown] = useState(3);

  // Auto-start parking gate simulation if redirected from approval
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const autostart = localStorage.getItem('trustwallet_parking_autostart');
      if (autostart === 'true') {
        localStorage.removeItem('trustwallet_parking_autostart');
        setScanState('scanning');
        setTimeout(() => {
          setScanState('verifying');
          setTimeout(() => {
            setScanState('granted');
          }, 1800);
        }, 1500);
      }
    }
  }, []);

  // Check credential from localStorage
  const credential = (() => {
    try {
      const raw = localStorage.getItem('trustwallet_dorm_credential');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const dormName  = credential?.dormName  ?? 'Happy Campus Dorm';
  const building  = credential?.building  ?? 'A';
  const room      = credential?.room      ?? 'A-502';

  const handleScan = () => {
    if (scanState !== 'idle') return;
    setScanState('scanning');
    setTimeout(() => {
      setScanState('verifying');
      setTimeout(() => {
        setScanState('granted');
      }, 1800);
    }, 1500);
  };

  // Countdown after granted to auto-reset and switch to My Dorm screen
  useEffect(() => {
    if (scanState !== 'granted') return;
    localStorage.setItem('trustwallet_parking_completed', 'true');
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onNavigate('01', 'dorm');
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [scanState, onNavigate]);

  return (
    <div className="size-full flex flex-col bg-[#0F172A] text-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={() => onNavigate('01', 'docs')}
          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center active:bg-white/20"
        >
          <ArrowLeft size={16} className="text-white" />
        </button>
        <div className="flex-1">
          <p className="text-white font-bold" style={{ fontSize: 15 }}>ระบบจอดรถอัจฉริยะ</p>
          <p className="text-slate-400" style={{ fontSize: 10 }}>Verified Parking — Trust Wallet</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
          <Wifi size={10} className="text-emerald-400" />
          <span className="text-emerald-400 font-bold" style={{ fontSize: 9 }}>CONNECTED</span>
        </div>
      </div>

      {/* Zone Map */}
      <div className="shrink-0 mx-4 mb-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
        <p className="text-slate-400 font-bold mb-2" style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          สิทธิ์การจอดรถตาม Credential
        </p>
        <div className="space-y-1.5">
          {PARKING_ZONES.map(zone => {
            const isMyZone = zone.id === building;
            return (
              <div
                key={zone.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                  isMyZone
                    ? 'bg-indigo-500/10 border-indigo-500/30'
                    : 'bg-slate-800/40 border-slate-700/40 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: isMyZone ? '#4f46e5' : '#374151' }}
                  >
                    <Car size={12} className="text-white" />
                  </div>
                  <p className="text-slate-300" style={{ fontSize: 11, fontWeight: isMyZone ? 700 : 400 }}>
                    {zone.label}
                  </p>
                </div>
                {isMyZone ? (
                  <span className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20" style={{ fontSize: 9, fontWeight: 700 }}>
                    <CheckCircle2 size={9} /> อนุญาต
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-slate-700/30 text-slate-500 px-2 py-0.5 rounded-full border border-slate-700/30" style={{ fontSize: 9, fontWeight: 600 }}>
                    <Lock size={9} /> ล็อก
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Credential Badge */}
      <div className="shrink-0 mx-4 mb-4 bg-gradient-to-r from-indigo-900/50 to-slate-800/50 border border-indigo-500/20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <ShieldCheck size={18} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-indigo-300 font-bold truncate" style={{ fontSize: 12 }}>Dorm Access Credential</p>
          <p className="text-slate-400 truncate" style={{ fontSize: 10 }}>
            {dormName} · ห้อง {room} · อาคาร {building}
          </p>
        </div>
        <span className="shrink-0 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full" style={{ fontSize: 9, fontWeight: 700 }}>VALID</span>
      </div>

      {/* Main Scan Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">

        {scanState === 'idle' && (
          <>
            <div
              className="w-52 h-52 rounded-3xl border-2 border-dashed border-indigo-500/40 flex flex-col items-center justify-center gap-4 cursor-pointer active:scale-95 transition-all bg-indigo-950/20 animate-pulse-glow"
              onClick={handleScan}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <QrCode size={36} className="text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold" style={{ fontSize: 13 }}>แตะเพื่อสแกน QR</p>
                <p className="text-slate-400 mt-0.5" style={{ fontSize: 10 }}>ที่ตู้ Parking Gate</p>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl px-4 py-3 text-center max-w-xs">
              <p className="text-slate-300" style={{ fontSize: 11, lineHeight: 1.6 }}>
                📱 แสดง QR จากตู้จอดรถ อาคาร <span className="text-indigo-400 font-bold">{building}</span> ที่กล้องโทรศัพท์ของคุณ ระบบจะตรวจสอบ Credential อัตโนมัติ
              </p>
            </div>
          </>
        )}

        {scanState === 'scanning' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-52 h-52 rounded-3xl border-2 border-indigo-500/60 bg-indigo-950/30 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
              {/* Scanning line animation */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="w-full h-0.5 bg-indigo-400/60 animate-bounce" style={{ animationDuration: '0.8s', marginTop: '50%' }} />
              </div>
              <Scan size={48} className="text-indigo-400 animate-pulse" />
              <p className="text-indigo-300 font-bold" style={{ fontSize: 12 }}>กำลังสแกน...</p>
            </div>
          </div>
        )}

        {scanState === 'verifying' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-52 h-52 rounded-3xl border-2 border-amber-500/40 bg-amber-950/20 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                  <ShieldCheck size={36} className="text-amber-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500/80 flex items-center justify-center">
                  <Loader2 size={12} className="text-white animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-amber-300 font-bold" style={{ fontSize: 13 }}>กำลังตรวจสอบ VC</p>
                <p className="text-slate-500" style={{ fontSize: 10 }}>ยืนยันลายเซ็นดิจิทัล...</p>
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              {[
                'ตรวจสอบ DID Signature ✓',
                'ยืนยัน Issuer (Happy Campus Dorm) ✓',
                'ตรวจสอบ Building Access Permission...',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i < 2
                    ? <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    : <Loader2 size={12} className="text-amber-400 animate-spin shrink-0" />
                  }
                  <p className={i < 2 ? 'text-emerald-400' : 'text-amber-300'} style={{ fontSize: 10, fontWeight: 600 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {scanState === 'granted' && (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="w-52 h-52 rounded-3xl border-2 border-emerald-500/50 bg-emerald-950/20 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-emerald-300 font-black" style={{ fontSize: 18 }}>เข้าได้!</p>
                <p className="text-slate-400 mt-0.5" style={{ fontSize: 10 }}>Access Granted</p>
              </div>
            </div>

            <div className="w-full bg-emerald-950/40 border border-emerald-500/20 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/10">
                <Sparkles size={13} className="text-emerald-400" />
                <p className="text-emerald-300 font-bold" style={{ fontSize: 12 }}>ผลการตรวจสอบ</p>
              </div>
              {[
                ['ผู้ใช้', 'นายสมชาย ใจดี'],
                ['Credential', 'Dorm Access Card'],
                ['อาคารที่อนุญาต', `อาคาร ${building}`],
                ['ห้อง', room],
                ['ออกโดย', dormName],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <p className="text-slate-500" style={{ fontSize: 10 }}>{label}</p>
                  <p className="text-emerald-300 font-bold" style={{ fontSize: 10 }}>{value}</p>
                </div>
              ))}
            </div>

            <p className="text-slate-400 font-bold" style={{ fontSize: 10 }}>กำลังพาไปหน้าบิลค่าเช่าหอพักใน {countdown} วินาที...</p>
          </div>
        )}
      </div>
    </div>
  );
}
