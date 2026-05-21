'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw, 
  Play, 
  Lock, 
  ChevronRight, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  FileSignature, 
  Eye, 
  Smartphone,
  Menu,
  X
} from 'lucide-react';

interface DemoTourGuideProps {
  currentScreen: string;
  shellTab: string;
  onNavigate: (screen: string, tab?: any) => void;
}

export default function DemoTourGuide({ currentScreen, shellTab, onNavigate }: DemoTourGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isThaiIdRegistered, setIsThaiIdRegistered] = useState(false);
  const [isContractSigned, setIsContractSigned] = useState(false);

  // Sync state with localStorage
  useEffect(() => {
    const checkState = () => {
      setIsThaiIdRegistered(!!localStorage.getItem('trustwallet_registered'));
      setIsContractSigned(!!localStorage.getItem('trustwallet_contract_signed'));
    };
    checkState();
    
    // Set up a small interval to keep localStorage synced
    const interval = setInterval(checkState, 1000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      num: 1,
      title: 'เลือกบทบาทผู้ใช้งาน',
      subtitle: 'Select Role Portal',
      desc: 'เริ่มต้นการสาธิตโดยการกดเลือกปุ่ม "นักศึกษา / ผู้เช่า" (Student) เพื่อเข้าไปจำลองในฝั่งผู้เช่าหอพัก',
      trustTech: 'ระบบจะแยกสิทธิ์และพื้นที่การทำธุรกรรม (Sandboxed Role Separation) ตามมาตรฐานความปลอดภัยสูงสุด',
      actionText: 'เริ่มที่นี่ (เลือกบทบาท)',
      isActive: currentScreen === '00',
      isCompleted: currentScreen !== '00',
      warp: () => {
        localStorage.removeItem('trustwallet_registered');
        localStorage.removeItem('trustwallet_pin');
        localStorage.removeItem('trustwallet_contract_signed');
        localStorage.removeItem('trustwallet_p1_disclosed_fields');
        setIsThaiIdRegistered(false);
        setIsContractSigned(false);
        onNavigate('00');
      }
    },
    {
      num: 2,
      title: 'ออกบัตรประชาชนดิจิทัล (Get ID VC)',
      subtitle: 'Issuer -> Holder (DOPA)',
      desc: 'เข้าแท็บ Documents กดปุ่ม "เริ่มต้นลงทะเบียน" เพื่อยืนยันตัวตนกับระบบ DOPA และรับบัตรประจำตัวดิจิทัล (VC)',
      trustTech: 'Issuing Verifiable Credentials: ผู้ออกเอกสาร (DOPA) ลงลายมือชื่อดิจิทัลด้วย DID ยืนยันข้อมูลส่งตรงเข้ากระเป๋าผู้ใช้',
      actionText: 'ลงทะเบียนรับ VC ประชาชน',
      isActive: currentScreen === '01' && shellTab === 'docs' && !isThaiIdRegistered,
      isCompleted: isThaiIdRegistered || ['03', '04', '05', '06', 'landlord', '07', '09'].includes(currentScreen),
      warp: () => {
        localStorage.removeItem('trustwallet_registered');
        localStorage.removeItem('trustwallet_pin');
        localStorage.removeItem('trustwallet_contract_signed');
        localStorage.removeItem('trustwallet_p1_disclosed_fields');
        setIsThaiIdRegistered(false);
        setIsContractSigned(false);
        onNavigate('01', 'docs');
      }
    },
    {
      num: 3,
      title: 'เลือกห้องและตรวจสอบผู้ให้เช่า (P5)',
      subtitle: 'Holder -> Verifier / Mutual Trust',
      desc: 'ไปที่แท็บ Home เลือกห้องพัก "Happy Campus Dorm" กด "ขอเช่าห้อง" จากนั้นกด "ส่งคำขอเช่า" เพื่อพิสูจน์ความน่าเชื่อถือของหอพัก',
      trustTech: 'ETDA P5 Standard: ตรวจสอบความถูกต้องของใบอนุญาตหอพัก ยืนยันคีย์เจ้าของหอพัก (Proof of Possession) แบบเรียลไทม์',
      actionText: 'เลือกหอพัก & ตรวจสอบ P5',
      isActive: (currentScreen === '01' && shellTab === 'home') || currentScreen === 'dorm-detail',
      isCompleted: ['03', '04', '05', '06', 'landlord', '07', '09'].includes(currentScreen),
      warp: () => {
        localStorage.setItem('trustwallet_registered', '1');
        localStorage.setItem('trustwallet_pin', '1234');
        setIsThaiIdRegistered(true);
        onNavigate('01', 'home');
      }
    },
    {
      num: 4,
      title: 'ให้ความยินยอมแชร์ข้อมูล (Consent & VP)',
      subtitle: 'Selective Disclosure (Consent)',
      desc: 'ตรวจสอบข้อมูลส่วนบุคคลที่จะแชร์ให้กับหอพัก จากนั้นกด "ยินยอมและส่งข้อมูล" โดยข้อมูลที่ไม่เกี่ยวข้องจะไม่ถูกส่งออก',
      trustTech: 'Verifiable Presentation (VP) & PDPA: ผู้ใช้เปิดเผยข้อมูลเฉพาะที่จำเป็น (Selective Disclosure) ป้องกันข้อมูลส่วนบุคคลรั่วไหล',
      actionText: 'ตรวจสอบ & ยินยอมแชร์ VP',
      isActive: ['03', '04', '05'].includes(currentScreen),
      isCompleted: ['06', 'landlord', '07', '09'].includes(currentScreen) || isContractSigned,
      warp: () => {
        localStorage.setItem('trustwallet_registered', '1');
        localStorage.setItem('trustwallet_pin', '1234');
        setIsThaiIdRegistered(true);
        // Warp directly to the consent screen (Frame 6)
        onNavigate('05');
      }
    },
    {
      num: 5,
      title: 'ผู้ให้เช่าตรวจสอบข้อมูลผู้สมัคร',
      subtitle: 'Verifier Verification Console',
      desc: 'สลับมาฝั่งเจ้าของหอพักเพื่อตรวจรับคำขอเช่า คลิกแท็บ "คำขอเช่า" กดดูข้อมูลผู้สมัครที่ระบบตรวจสอบความถูกต้องให้อัตโนมัติ',
      trustTech: 'Real-time VP Verification: ระบบฝั่งผู้รับ (Verifier) ตรวจเช็คลายเซ็นในบัตร VC ของผู้เช่าว่าออกโดยสถาบันจริงและไม่ถูกเพิกถอน',
      actionText: 'สลับไปแดชบอร์ดเจ้าของหอ',
      isActive: ['landlord', '07'].includes(currentScreen),
      isCompleted: currentScreen === '09' || isContractSigned,
      warp: () => {
        localStorage.setItem('trustwallet_registered', '1');
        localStorage.setItem('trustwallet_pin', '1234');
        setIsThaiIdRegistered(true);
        // Pre-disclose somchai fields to look realistic
        localStorage.setItem('trustwallet_p1_disclosed_fields', JSON.stringify(['name', 'status', 'university', 'faculty', 'year']));
        onNavigate('landlord');
      }
    },
    {
      num: 6,
      title: 'ลงนามสัญญาดิจิทัลร่วมกัน (e-Contract)',
      subtitle: 'Dual Cryptographic Signing (QES)',
      desc: 'ขั้นตอนสุดท้าย: สัญญาเช่าอิเล็กทรอนิกส์ถูกลงนามโดยเจ้าของหอพักแล้ว เหลือให้ผู้เช่าสแกน Face ID เพื่อลงนามแบบเข้ารหัสกุญแจคู่',
      trustTech: 'Dual Signature & Non-repudiation: อ้างอิง พ.ร.บ. ธุรกรรมฯ ม.26 และ ม.28 ลายมือชื่อดิจิทัลผูกพันทางกฎหมาย 100%',
      actionText: 'ลงนามสัญญาเช่า Face ID',
      isActive: currentScreen === '09',
      isCompleted: isContractSigned,
      warp: () => {
        localStorage.setItem('trustwallet_registered', '1');
        localStorage.setItem('trustwallet_pin', '1234');
        setIsThaiIdRegistered(true);
        onNavigate('09');
      }
    }
  ];

  const currentStep = steps.find(s => s.isActive) || steps[0];

  const handleReset = () => {
    localStorage.removeItem('trustwallet_registered');
    localStorage.removeItem('trustwallet_pin');
    localStorage.removeItem('trustwallet_contract_signed');
    localStorage.removeItem('trustwallet_p1_disclosed_fields');
    setIsThaiIdRegistered(false);
    setIsContractSigned(false);
    onNavigate('00');
  };

  return (
    <>
      {/* Mobile Sticky Top Guide Banner */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 h-[50px] bg-slate-950/95 border-b border-slate-800/80 z-[100] px-3 items-center justify-between backdrop-blur-md text-white select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 bg-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
            {currentStep.num}/6
          </div>
          <div className="text-[11.5px] font-bold truncate text-slate-200">
            {currentStep.num === 1 && "👉 เลือกบทบาท 'นักศึกษา / ผู้เช่า'"}
            {currentStep.num === 2 && "👉 ไปแท็บ Documents > ลงทะเบียนรับ DOPA ID VC"}
            {currentStep.num === 3 && "👉 ไปหน้าแรก > ขอเช่าห้อง Happy Campus > ส่งคำเช่า"}
            {currentStep.num === 4 && "👉 ตรวจสอบความน่าเชื่อถือ P5 > กด ยินยอมแชร์ข้อมูล"}
            {currentStep.num === 5 && "👉 ดูคำขอ สมชาย ใจดี > กดอนุมัติ (Approve Tenant)"}
            {currentStep.num === 6 && "👉 เลื่อนลงล่างสุด > ลงนามสัญญาด้วย Face ID"}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => currentStep.warp()}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-[10px] font-black rounded-lg transition-all border border-indigo-500 animate-pulse-glow"
          >
            Warp
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="รีเซ็ต Demo"
            className="w-7 h-7 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center rounded-lg active:scale-90 transition-all"
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {/* Main Panel Wrapper (Desktop Only) */}
      {isOpen && (
        <div className="hidden md:flex fixed z-[40] top-8 right-8 w-[380px] max-h-[90vh] flex-col animate-fade-in">
          {/* Main Card */}
          <div className="bg-slate-950/95 border border-slate-800/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col overflow-hidden text-slate-200 w-full">
            
            {/* Header */}
            <div className="shrink-0 px-5 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles size={14} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-wider text-slate-300">DEMO INSTRUCTION GUIDE</h3>
                  <p className="text-[10px] text-indigo-400 font-bold">คู่มือกรรมการทดลองใช้งานระบบ</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleReset}
                  title="เริ่ม Demo ใหม่ทั้งหมด (Reset)"
                  className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90 transition-all border border-slate-800"
                >
                  <RotateCcw size={12} />
                </button>
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center active:scale-90 transition-all border border-slate-800"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Body Content - Current Step Overview */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[420px]">
              {/* Active Step Highlight Box */}
              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-500 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Step {currentStep.num} / 6
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wide">
                    {currentStep.subtitle}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white flex items-center gap-1.5 mt-1">
                  {currentStep.title}
                </h4>
                
                <p className="text-[11.5px] text-slate-300 leading-relaxed font-medium">
                  {currentStep.desc}
                </p>

                {/* Digital Trust Spotlight */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 mt-3 space-y-1">
                  <p className="text-[8.5px] text-indigo-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                    <ShieldCheck size={11} className="text-indigo-400" />
                    กลไกความเชื่อมั่นดิจิทัล (Digital Trust System)
                  </p>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {currentStep.trustTech}
                  </p>
                </div>
              </div>

              {/* Checklist of all steps */}
              <div className="space-y-1.5">
                <p className="text-[9px] text-slate-500 font-bold font-mono tracking-wider uppercase px-1">Demo Milestones</p>
                <div className="space-y-1">
                  {steps.map((s) => {
                    return (
                      <div 
                        key={s.num} 
                        onClick={s.warp}
                        className={`group w-full flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                          s.isActive
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-white font-bold'
                            : s.isCompleted
                            ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-400'
                            : 'bg-slate-900/20 border-slate-900 text-slate-500 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Step circle marker */}
                          {s.isCompleted ? (
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                              s.isActive
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                            }`}>
                              {s.num}
                            </div>
                          )}
                          <span className="text-[11px] truncate">{s.title}</span>
                        </div>
                        
                        {/* Action trigger button */}
                        <button 
                          type="button"
                          className={`opacity-0 group-hover:opacity-100 flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold border transition-all ${
                            s.isActive
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-indigo-400 group-hover:text-indigo-300'
                          }`}
                        >
                          Warp <ChevronRight size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer controls */}
            <div className="shrink-0 bg-slate-900/60 border-t border-slate-800/80 px-5 py-4 flex items-center justify-between gap-3">
              <button 
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-bold transition-colors animate-pulse"
              >
                <RotateCcw size={11} />
                รีเซ็ต Demo
              </button>

              {/* Quick warp shortcut indicator */}
              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Interactive Demo Sandbox
              </div>
            </div>

          </div>
        </div>
      )}
      
      {/* Mini collapsed badge on desktop when closed */}
      {!isOpen && (
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed top-8 right-8 z-[50] hidden md:flex items-center gap-2 px-3.5 py-2 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-xl hover:shadow-indigo-500/10 text-slate-200 hover:text-white active:scale-95 transition-all"
        >
          <Sparkles size={13} className="text-indigo-400" />
          <span className="text-xs font-bold">เปิดคู่มือการเล่น (Demo Guide)</span>
          <ChevronRight size={11} className="text-indigo-400" />
        </button>
      )}
    </>
  );
}
