import { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Check, 
  FileSignature, 
  ArrowRight,
  AlertCircle,
  FolderLock
} from 'lucide-react';

interface NavigableFrame6Props {
  onNavigate: (screen: string, tab?: any) => void;
}

export default function NavigableFrame6({ onNavigate }: NavigableFrame6Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleConsent = () => {
    // Save disclosed fields to localStorage to sync landlord dashboard view
    localStorage.setItem(
      'trustwallet_p1_disclosed_fields', 
      JSON.stringify(['name', 'status', 'university', 'faculty', 'year'])
    );
    setShowSuccessModal(true);
  };

  const handleSwitchToLandlord = () => {
    onNavigate('landlord');
  };

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] select-none text-slate-900 relative">
      
      {/* Header Bar */}
      <div className="shrink-0 bg-slate-900 px-4 pt-10 pb-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('04')}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20 mr-1"
            >
              <ArrowLeft size={14} />
            </button>
            <p className="text-white text-base font-extrabold tracking-wide">SD-JWT CONSENT</p>
          </div>
          <FolderLock className="text-indigo-400 animate-pulse" size={18} />
        </div>
        <p className="text-slate-400 text-xs mt-1">ยินยอมแชร์ข้อมูลแบบเปิดเผยเฉพาะบางส่วน (PDPA)</p>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Target Box */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5">
            <div className="flex gap-2">
              <span className="text-lg mt-0.5">🏢</span>
              <div>
                <h4 className="text-xs font-bold text-indigo-950">แชร์ข้อมูลแก่ผู้ขอตรวจสอบ (Verifier)</h4>
                <p className="text-xs font-extrabold text-indigo-900 mt-0.5">Happy Campus Dorm</p>
                <p className="text-[10px] text-indigo-500 font-mono mt-0.5">did:web:abcmansion.trust.in.th</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            
            {/* 1. Shared fields list */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  เปิดเผยข้อมูล (Disclosed Fields)
                </p>
                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  เปิดเผยเฉพาะกลุ่มนี้
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-emerald-100 divide-y divide-gray-50 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                {[
                  { field: 'ชื่อ-นามสกุล', val: 'นายสมชาย ใจดี' },
                  { field: 'สถานะนิสิต/นักศึกษา', val: 'กำลังศึกษาอยู่ (Active)' },
                  { field: 'สถาบันการศึกษา', val: 'มหาวิทยาลัยธรรมศาสตร์' },
                  { field: 'คณะ / สาขาวิชา', val: 'คณะวิศวกรรมศาสตร์' },
                  { field: 'ระดับชั้นปี', val: 'ชั้นปีที่ 2' },
                ].map((item, idx) => (
                  <div key={idx} className="px-3.5 py-2.5 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-[9px]">{item.field}</p>
                      <p className="text-gray-800 text-xs font-bold mt-0.5">{item.val}</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 rounded-full p-1 border border-emerald-100">
                      <Check size={10} className="stroke-[3px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Hidden fields list */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  ปกปิดข้อมูลส่วนตัว (Redacted Fields)
                </p>
                <span className="text-[9px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold font-mono">
                  SD-JWT Masked
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-gray-200/50 divide-y divide-gray-200/30 overflow-hidden opacity-85">
                {[
                  { field: 'เลขบัตรประจำตัวประชาชน', val: '1-1009-XXXXX-XX-X' },
                  { field: 'วันเดือนปีเกิด (DOB)', val: 'XX/XX/XXXX' },
                  { field: 'ที่อยู่ตามทะเบียนบ้าน', val: 'XX/XX ถ.พญาไท ปทุมวัน...' },
                  { field: 'ข้อมูลเกรดเฉลี่ยสะสม (GPAX)', val: 'X.XX' },
                ].map((item, idx) => (
                  <div key={idx} className="px-3.5 py-2.5 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-[9px]">{item.field}</p>
                      <p className="text-gray-400 text-xs font-mono mt-0.5 font-bold">{item.val}</p>
                    </div>
                    <div className="bg-gray-200/80 text-gray-400 rounded-full p-1">
                      <Lock size={10} className="stroke-[2px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex gap-2 items-start bg-slate-100 border border-slate-200 rounded-2xl p-3 mt-1 text-slate-500">
            <AlertCircle size={14} className="shrink-0 mt-0.5 text-indigo-500" />
            <p className="text-[10px] leading-relaxed">
              <strong>ความมั่นใจด้านความเป็นส่วนตัว:</strong> ข้อมูลที่ไม่ถูกเปิดเผยจะถูกเข้ารหัสลับและตัดออกจาก Verifiable Presentation (VP) 
              ตามโครงสร้าง SD-JWT ทำให้ผู้รับ (Happy Campus) ไม่สามารถเข้าถึงข้อมูลดิบส่วนอื่นบนบล็อกเชนได้
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 shrink-0">
          <button
            onClick={() => onNavigate('01', 'home')}
            className="flex-1 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 text-xs font-black active:scale-[0.98] transition-all"
          >
            ปฏิเสธ
          </button>
          <button
            onClick={handleConsent}
            className="flex-[2] py-3.5 rounded-2xl text-white flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              fontSize: '13px',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}
          >
            <FileSignature size={15} />
            ยินยอมและส่งข้อมูล (VP)
          </button>
        </div>

      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4"
          style={{ background: 'rgba(15,23,42,0.85)' }}
        >
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center gap-4 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center animate-pulse">
              <ShieldCheck size={28} className="text-emerald-500" />
            </div>
            
            <div>
              <p className="text-gray-900 text-lg font-black leading-snug">ยินยอมส่งเอกสารสำเร็จ!</p>
              <p className="text-gray-500 mt-2 text-xs leading-relaxed px-2">
                ระบบได้ส่งมอบใบรับรองสิทธิ์ (VP Presentation) ให้ทางหอพักเรียบร้อยแล้ว
                ข้อมูลของคุณปลอดภัยด้วยลายเซ็นเข้ารหัส
              </p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col gap-1 text-left">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">ชนิดโครงสร้าง:</span>
                <span className="text-indigo-600 font-mono font-bold">Selective Disclosure JWT</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">สถานะแชร์:</span>
                <span className="text-emerald-600 font-bold">ส่งแล้ว (Sent)</span>
              </div>
            </div>

            <button
              onClick={handleSwitchToLandlord}
              className="w-full py-3.5 rounded-2xl text-white flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg,#0284c7,#0369a1)',
                fontSize: '13px',
                fontWeight: 800,
                boxShadow: '0 6px 20px rgba(2,132,199,0.3)',
              }}
            >
              สลับเป็นเจ้าของหอพักเพื่อตรวจรับคำขอ
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
