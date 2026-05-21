'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  X,
} from 'lucide-react';

interface DemoTourGuideProps {
  currentScreen: string;
  shellTab: string;
  onNavigate: (screen: string, tab?: any) => void;
}

export default function DemoTourGuide({ currentScreen, shellTab, onNavigate }: DemoTourGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isThaiIdRegistered, setIsThaiIdRegistered] = useState(false);
  const [isStudentIdSaved, setIsStudentIdSaved] = useState(false);
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [isDormCredReceived, setIsDormCredReceived] = useState(false);
  const [isConsentSent, setIsConsentSent] = useState(false);
  const [isParkingCompleted, setIsParkingCompleted] = useState(false);

  // Sync state with localStorage every 800ms
  useEffect(() => {
    const checkState = () => {
      setIsThaiIdRegistered(!!localStorage.getItem('trustwallet_registered'));
      setIsStudentIdSaved(localStorage.getItem('trustwallet_student_id') === 'saved');
      setIsContractSigned(!!localStorage.getItem('trustwallet_contract_signed'));
      setIsDormCredReceived(!!localStorage.getItem('trustwallet_dorm_credential'));
      setIsConsentSent(!!localStorage.getItem('trustwallet_p1_disclosed_fields'));
      setIsParkingCompleted(localStorage.getItem('trustwallet_parking_completed') === 'true');
    };
    checkState();
    const interval = setInterval(checkState, 800);
    return () => clearInterval(interval);
  }, []);

  const isAllCompleted = isDormCredReceived && isParkingCompleted && currentScreen === '01' && shellTab === 'dorm';

  const steps = [
    {
      num: 1,
      title: 'เลือกบทบาทผู้ใช้งาน',
      trustTech: 'Sandboxed Role Separation: ระบบแยกสิทธิ์การเข้าถึงตามบทบาทผู้ใช้งาน',
      isActive: currentScreen === '00',
      isCompleted: currentScreen !== '00',
    },
    {
      num: 2,
      title: 'ยืนยัน Wallet ด้วยบัตรประชาชนดิจิทัล (DOPA VC)',
      trustTech: 'Verifiable Credential Issuance: DOPA ลงลายมือชื่อดิจิทัลด้วย DID ส่ง VC ตรงสู่ Wallet ผู้ใช้',
      isActive: !isThaiIdRegistered && ['01'].includes(currentScreen),
      isCompleted: isThaiIdRegistered,
    },
    {
      num: 3,
      title: 'รับบัตรนักศึกษาดิจิทัล (Student ID VC)',
      trustTech: 'Multi-Issuer Wallet: มหาวิทยาลัยเป็น Issuer ออก Student VC ตรวจสอบสถานะจากทะเบียนนักศึกษา',
      isActive: isThaiIdRegistered && !isStudentIdSaved && ['01'].includes(currentScreen),
      isCompleted: isStudentIdSaved,
    },
    {
      num: 4,
      title: 'เลือกหอพักและตรวจสอบผู้ให้เช่า (P5)',
      trustTech: 'ETDA P5 Standard: ตรวจสอบใบอนุญาตหอพัก ยืนยัน Proof of Possession แบบเรียลไทม์',
      isActive: isStudentIdSaved && !isContractSigned && ['01', 'dorm-detail', '03', '04'].includes(currentScreen) && !['05', 'landlord', '07', '09'].includes(currentScreen),
      isCompleted: ['05', '06', 'landlord', '07', '09'].includes(currentScreen) || isContractSigned,
    },
    {
      num: 5,
      title: 'ให้ความยินยอมแชร์ข้อมูล (Consent & VP)',
      trustTech: 'Verifiable Presentation (VP) & PDPA: Selective Disclosure ผู้ใช้ควบคุมข้อมูลที่เปิดเผย',
      isActive: currentScreen === '05' && !isConsentSent,
      isCompleted: ['06', 'landlord', '07', '09'].includes(currentScreen) || isContractSigned,
    },
    {
      num: 6,
      title: 'ผู้ให้เช่าตรวจสอบและอนุมัติ',
      trustTech: 'Real-time VP Verification: ฝั่ง Verifier ตรวจลายเซ็น VC ว่าออกโดยสถาบันจริงและไม่ถูกเพิกถอน',
      isActive: ['landlord', '07'].includes(currentScreen) || (currentScreen === '05' && isConsentSent),
      isCompleted: currentScreen === '09' || isContractSigned,
    },
    {
      num: 7,
      title: 'ลงนามสัญญาดิจิทัลร่วมกัน (e-Contract)',
      trustTech: 'Dual Signature & Non-repudiation: อ้างอิง พ.ร.บ. ธุรกรรมฯ ม.26 และ ม.28 ผูกพันทางกฎหมาย 100%',
      isActive: currentScreen === '09' && !isContractSigned,
      isCompleted: isContractSigned && isDormCredReceived,
    },
    {
      num: 8,
      title: 'รับ Dorm Access Credential จากเจ้าของหอ',
      trustTech: 'Post-Contract VC Issuance: เจ้าของหอออก VC สิทธิ์ใช้งานหอพักโดยตรง ผูกพันกับสัญญาเช่าที่ลงนามแล้ว',
      isActive: currentScreen === '09' && isContractSigned && !isDormCredReceived,
      isCompleted: isDormCredReceived,
    },
    {
      num: 9,
      title: 'ทดลองใช้ที่จอดรถอัจฉริยะ (Verified Parking)',
      trustTech: 'VC-Based Access Control: Zero-Knowledge เปิดแค่สิทธิ์ประตูบานตาม Credential โดยไม่เปิดเผยข้อมูลส่วนตัว',
      isActive: currentScreen === 'parking' || (isDormCredReceived && currentScreen === '01' && !isParkingCompleted),
      isCompleted: isParkingCompleted,
    }
  ];

  const currentStep = isAllCompleted 
    ? {
        num: 9,
        title: 'การทดสอบเสร็จสมบูรณ์! ✓',
        trustTech: 'End-to-End Digital Trust: เชื่อมโยงระบบตั้งแต่การพิสูจน์ตัวตน, ออก VC, ลงนาม e-Contract, นำ VP ไปจอดรถ และจ่ายบิลค่าเช่า',
        isActive: false,
        isCompleted: true,
      }
    : (steps.find(s => s.isActive) || steps[0]);
  const totalSteps = steps.length;

  // Dynamic instruction text generator for desktop/timeline view
  const getStepDesc = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return 'กดเลือกปุ่ม "นักศึกษา / ผู้เช่า" บนหน้าหลักเพื่อเริ่มต้นเข้าสู่กระบวนการเปิดกระเป๋าเงินดิจิทัล';
      case 2:
        return 'หน้าแอปพลิเคชันจะเปิดระบบจำลองการขอข้อมูลบัตรประชาชนดิจิทัล (DOPA VC) ให้กดปุ่ม "อนุญาต" เพื่อสแกน QR Code และทำการ "ตั้งรหัสผ่านอัตโนมัติ" (123456) ให้เสร็จสิ้น';
      case 3:
        return 'หลังจากเชื่อมต่อบัตรประชาชนสำเร็จ ให้กดปุ่ม "ขอบัตรนักศึกษาดิจิทัล" รอระบบประมวลผลการตรวจสอบสิทธิ์ จากนั้นกดปุ่ม "บันทึกลง Trust Wallet"';
      case 4:
        if (currentScreen === '01' && shellTab === 'docs') {
          return 'ข้อมูลบัตรของคุณครบถ้วนแล้ว! ให้กดสลับไปที่แท็บ "Home" (หน้าแรก) ด้านล่างสุด เพื่อเข้าสู่ระบบเลือกหอพัก';
        }
        if (currentScreen === '01' && shellTab === 'home') {
          return 'ที่หน้า Home ให้เลือกหอพัก "Happy Campus Dorm" (ปุ่มจะเรืองแสงสีม่วง)';
        }
        if (currentScreen === 'dorm-detail') {
          return 'ที่หน้าข้อมูลหอพัก ให้เลือกห้อง (เช่น A-502) แล้วกดปุ่ม "ขอเช่าห้องพัก" -> ทำการติ๊กยอมรับข้อตกลง -> กด "ส่งคำขอเช่า"';
        }
        return 'กดสลับไปที่แท็บ Home จากนั้นเลือกหอพัก "Happy Campus Dorm" เพื่อส่งคำขอขอเช่าห้องพัก';
      case 5:
        return 'ระบบจำลองหน้าต่างขอความยินยอมเปิดเผยข้อมูล (Consent Screen) ให้กดปุ่ม "ยินยอมและส่งข้อมูล (VP)" เพื่อเปิดเผยข้อมูลสิทธิ์นักศึกษาตามมาตรฐานความปลอดภัยข้อมูลส่วนบุคคล';
      case 6:
        if (currentScreen === '05') {
          return 'คุณได้ส่งมอบสิทธิ์ข้อมูลเรียบร้อยแล้ว! ให้กดปุ่มสีฟ้า "สลับเป็นเจ้าของหอพักเพื่อตรวจรับคำขอ" ในป๊อปอัปแจ้งเตือนเพื่อไปยังแดชบอร์ดฝั่งเจ้าของหอ';
        }
        return 'เมื่อเข้าสู่ระบบของเจ้าของหอพัก ให้กดเลือกคำขอของ "สมชาย ใจดี" ในแท็บ Pending เพื่อตรวจสอบข้อมูลนักศึกษา จากนั้นกด "Approve Tenant" (เพื่อลงชื่อฝั่งเจ้าของหอ)';
      case 7:
        if (currentScreen === 'landlord' || currentScreen === '07') {
          return 'ผู้ให้เช่าได้เซ็นสัญญาฝั่งตนเองเสร็จสิ้นแล้ว! ให้กดปุ่มสีม่วง "สลับบทบาทเป็นผู้เช่าเพื่อลงนามร่วมกัน" เพื่อกลับมาหน้าสัญญาเช่าฝั่งนิสิต';
        }
        return 'เมื่อกลับมาที่สัญญาเช่าฝั่งผู้เช่า ให้เลื่อนหน้าจอลงไปล่างสุด แล้วกดปุ่ม "ลงนามด้วย Face ID" เพื่อทำสัญญาอิเล็กทรอนิกส์ร่วมกันสมบูรณ์';
      case 8:
        return 'หลังการยืนยันตัวตนสำเร็จ จะมีหน้าต่างเด้งแสดงบัตรเข้าหอพัก ให้กดปุ่มสีม่วง "รับ Credential ลง Trust Wallet" เพื่อบันทึกสิทธิ์บัตรเข้าใช้งานหอพักของคุณลงเครื่อง';
      case 9:
        if (isAllCompleted) {
          return 'ยินดีด้วย! คุณได้ทดสอบระบบเสร็จสิ้นแล้ว ตั้งแต่เปิดกระเป๋าเงินดิจิทัล, รับบัตรนักศึกษา VC, ทำสัญญาเช่า e-Contract, รับบัตรสิทธิ์พักอาศัย VC, ใช้ VP เพื่อเข้าจอดรถ และสุดท้ายเข้าสู่หน้า "My Dorm" เพื่อตรวจดูบิลเรียกเก็บค่าบริการ/ค่าเช่ารายเดือนที่เชื่อมโยงกับสิทธิ์ห้องพักของคุณตามมาตรฐาน ETDA Digital Trust';
        }
        if (currentScreen === '01' && shellTab === 'docs') {
          return 'ระบบนำคุณกลับมาที่หน้าเอกสารแล้ว! ให้กดคลิกเปิดบัตร "Dorm Access Card" เพื่อตรวจสอบรายละเอียดสิทธิ์ จากนั้นกดปุ่ม "สแกน QR Code" (ปุ่มสีม่วงตรงกลางแถบด้านล่างสุด) เพื่อแชร์ข้อมูลสิทธิ์จอดรถของคุณ';
        }
        if (currentScreen === '01') {
          return 'ให้กดสลับไปที่แท็บ "Documents" (เอกสาร) เพื่อตรวจสอบบัตรสิทธิ์เข้าหอพักก่อน จากนั้นจึงสแกนเพื่อใช้บริการที่จอดรถ';
        }
        return 'ที่ระบบควบคุมที่จอดรถอัจฉริยะ คุณได้จำลองการส่งมอบข้อมูลสิทธิ์เข้าที่จอดรถโดยปกปิดข้อมูลส่วนตัวอื่นๆ แล้ว (สแกน/ตรวจสอบ/อนุญาตเข้าจอดสำเร็จ!)';
      default:
        return '';
    }
  };

  // Dynamic instruction text generator for mobile banner
  const getMobileStepDesc = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return "👉 เลือกบทบาท 'นักศึกษา / ผู้เช่า'";
      case 2:
        return "👉 กด 'อนุญาต' รอสแกน → ตั้งรหัสผ่าน (123456)";
      case 3:
        return "👉 กด 'ขอบัตรนักศึกษาดิจิทัล' → 'บันทึกลง Wallet'";
      case 4:
        if (currentScreen === '01' && shellTab === 'docs') {
          return "👉 กดสลับไปที่แท็บ Home (หน้าแรก) ด้านล่างสุด";
        }
        if (currentScreen === '01' && shellTab === 'home') {
          return "👉 กดเลือกหอพัก 'Happy Campus Dorm'";
        }
        if (currentScreen === 'dorm-detail') {
          return "👉 เลือกห้อง → ติ๊กยอมรับ → กด 'ส่งคำขอเช่า'";
        }
        return "👉 ไปหน้า Home → Happy Campus → ขอเช่าห้อง";
      case 5:
        return "👉 ตรวจสอบข้อมูล → กด 'ยินยอมและส่งข้อมูล (VP)'";
      case 6:
        if (currentScreen === '05') {
          return "👉 กดปุ่ม 'สลับเป็นเจ้าของหอพัก...' ในป๊อปอัป";
        }
        return "👉 กดดูคำขอของ 'สมชาย ใจดี' → กด Approve Tenant";
      case 7:
        if (currentScreen === 'landlord' || currentScreen === '07') {
          return "👉 กดปุ่ม 'สลับบทบาทเป็นผู้เช่า...' ในป๊อปอัป";
        }
        return "👉 สลับกลับมาฝั่งผู้เช่า เลื่อนล่างสุด → ลงนาม Face ID";
      case 8:
        return "👉 กด 'รับ Credential ลง Trust Wallet' ในป๊อปอัป";
      case 9:
        if (isAllCompleted) {
          return '🎉 การทดสอบเสร็จสมบูรณ์เรียบร้อยแล้ว!';
        }
        if (currentScreen === '01' && shellTab === 'docs') {
          return "👉 คลิกเปิดดูรายละเอียดบัตร → สแกน QR ปุ่มล่างสุดเพื่อจอดรถ";
        }
        if (currentScreen === '01') {
          return "👉 กดสลับไปแท็บ Documents เพื่อตรวจสอบบัตรสิทธิ์";
        }
        return "👉 จำลองการแสดงสิทธิ์เพื่อเข้าจอดและอนุมัติสำเร็จ! ✓";
      default:
        return "";
    }
  };

  const handleReset = () => {
    localStorage.removeItem('trustwallet_registered');
    localStorage.removeItem('trustwallet_pin');
    localStorage.removeItem('trustwallet_contract_signed');
    localStorage.removeItem('trustwallet_p1_disclosed_fields');
    localStorage.removeItem('trustwallet_student_id');
    localStorage.removeItem('trustwallet_dorm_credential');
    localStorage.removeItem('trustwallet_parking_completed');
    setIsThaiIdRegistered(false);
    setIsStudentIdSaved(false);
    setIsContractSigned(false);
    setIsDormCredReceived(false);
    setIsConsentSent(false);
    setIsParkingCompleted(false);
    onNavigate('00');
  };

  return (
    <>
      {/* Mobile Sticky Top Guide Banner */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 h-[52px] bg-slate-950/95 border-b border-slate-800/80 z-[100] px-4 items-center justify-between backdrop-blur-md text-white select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <div className="shrink-0 bg-indigo-600/90 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
            {currentStep.num}/{totalSteps}
          </div>
          <div className="text-[11.5px] font-medium truncate text-slate-200">
            {getMobileStepDesc(currentStep.num)}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            title="รีเซ็ต Demo"
            className="h-8 px-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 rounded-lg active:scale-95 transition-all text-xs font-semibold"
          >
            <RotateCcw size={12} />
            <span>รีเซ็ต</span>
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
                  <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-wider text-slate-300">DEMO INSTRUCTION GUIDE</h3>
                  <p className="text-[10px] text-indigo-400 font-bold">คู่มือแสดงสถานะขั้นตอนการทดสอบ</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleReset}
                  title="เริ่ม Demo ใหม่ทั้งหมด (Reset)"
                  className="px-2.5 py-1 text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center gap-1 active:scale-90 transition-all border border-slate-800"
                >
                  <RotateCcw size={11} />
                  <span>รีเซ็ต Demo</span>
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

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[460px] scrollbar-thin">
              {/* Active Step Highlight Box */}
              <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900/50 border border-indigo-500/30 rounded-2xl p-4 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-600 text-white font-mono text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    กำลังดำเนินการ: Step {currentStep.num} / {totalSteps}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold font-mono">
                    Active State
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1">
                  {currentStep.title}
                </h4>
                
                <p className="text-[12px] text-indigo-200 leading-relaxed font-normal bg-indigo-950/30 border border-indigo-500/10 p-2.5 rounded-xl">
                  {getStepDesc(currentStep.num)}
                </p>

                {/* Digital Trust Spotlight */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 mt-2 space-y-1">
                  <p className="text-[8.5px] text-indigo-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                    <ShieldCheck size={11} className="text-indigo-400" />
                    กลไกความเชื่อมั่นดิจิทัล (Digital Trust System)
                  </p>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {currentStep.trustTech}
                  </p>
                </div>
              </div>

              {/* Checklist Timeline */}
              <div className="space-y-2">
                <p className="text-[9px] text-slate-500 font-bold font-mono tracking-wider uppercase px-1">
                  ลำดับการทดสอบ (Demo Steps Timeline)
                </p>
                <div className="relative pl-4 space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                  {steps.map((s) => {
                    const isStepActive = s.isActive;
                    const isStepCompleted = s.isCompleted;

                    return (
                      <div 
                        key={s.num} 
                        className={`relative flex items-start gap-3 transition-colors duration-200`}
                      >
                        {/* Bullet Marker */}
                        <div className="absolute -left-[13px] mt-1 z-10 flex items-center justify-center">
                          {isStepCompleted ? (
                            <CheckCircle2 size={13} className="text-emerald-500 bg-slate-950 rounded-full" />
                          ) : isStepActive ? (
                            <span className="relative flex h-3.5 w-3.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500 border border-indigo-400"></span>
                            </span>
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10.5px] font-mono ${
                              isStepActive ? 'text-indigo-400 font-bold' : 'text-slate-500'
                            }`}>
                              {s.num}.
                            </span>
                            <span className={`text-[11.5px] ${
                              isStepActive 
                                ? 'text-white font-bold' 
                                : isStepCompleted 
                                ? 'text-slate-400' 
                                : 'text-slate-600'
                            }`}>
                              {s.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer controls */}
            <div className="shrink-0 bg-slate-900/60 border-t border-slate-800/80 px-5 py-3 flex items-center justify-between gap-3 text-[10px] text-slate-500 select-none">
              <span>คู่มืออ่านค่าอัตโนมัติ (Read-Only)</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Active Tracker
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
          <Sparkles size={13} className="text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold">เปิดคู่มือการเล่น (Demo Guide)</span>
        </button>
      )}
    </>
  );
}
