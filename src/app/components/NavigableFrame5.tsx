import { ArrowRight, ShieldCheck, CheckCircle2, BadgeCheck, FileCheck, Landmark } from 'lucide-react';

interface NavigableFrame5Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame5({ onNavigate }: NavigableFrame5Props) {
  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] select-none text-slate-900">
      
      {/* Header Bar */}
      <div className="shrink-0 bg-slate-900 px-4 pt-10 pb-5 shadow-lg relative overflow-hidden">
        {/* Glow blur background */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              Trust Checked
            </span>
            <p className="text-white text-base font-extrabold tracking-wide">VERIFIED CREDENTIALS</p>
          </div>
          <ShieldCheck className="text-emerald-400" size={20} />
        </div>
        <p className="text-slate-400 text-xs mt-1">ผลการตรวจสอบสิทธิ์หอพักสำเร็จแล้ว</p>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Hero Success Checkmark */}
          <div className="flex flex-col items-center text-center space-y-3 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100/80 border-4 border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">หอพักผ่านการรับรองความปลอดภัย</h2>
              <p className="text-gray-500 text-xs mt-1 px-4 leading-relaxed">
                ผู้ประกอบการได้ยื่นแสดงใบอนุญาตประกอบกิจการหอพักที่ได้รับการลงชื่อรับรองดิจิทัลแบบเข้ารหัสลับถูกต้องเรียบร้อย
              </p>
            </div>
          </div>

          {/* Dorm Detail Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-indigo-50/50 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Landmark size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">หอพักเป้าหมาย</p>
                <h4 className="text-sm font-bold text-gray-900">Happy Campus Dorm (แฮปปี้ แคมปัส)</h4>
                <p className="text-[10px] text-indigo-600 font-mono mt-0.5">did:web:abcmansion.trust.in.th</p>
              </div>
            </div>
          </div>

          {/* Verification Audit Details */}
          <div className="space-y-2.5">
            <p className="text-gray-400 font-bold text-[10px] tracking-wider uppercase pl-1">
              ผลการพิสูจน์สิทธิ์ใบรับรอง (Cryptographic Audit)
            </p>
            
            {[
              {
                id: 'P5.1',
                title: 'ผู้ออกใบรับรองความเชื่อถือได้ (Trust Anchor)',
                value: 'สำนักงานเขตปทุมวัน (กรุงเทพมหานคร)',
                desc: 'ตรวจสอบในทะเบียน ETDA Trust Registry แล้ว พบว่ามีสิทธิ์ออกจริง',
              },
              {
                id: 'P5.2',
                title: 'สถานะใบรับรอง (Credential Revocation Status)',
                value: 'ใช้งานได้ตามปกติ (Active Status)',
                desc: 'ระบบตรวจเช็คบัญชีดำ (Status List 2021) ไม่พบการระงับใบรับรองนี้',
              },
              {
                id: 'P5.3',
                title: 'ความเกี่ยวข้องเป็นเจ้าของ (Proof of Possession)',
                value: 'คีย์คู่สัญญาตรงกันสำเร็จ (Key Possession Verified)',
                desc: 'ผู้รับการตรวจสอบได้ใช้ Private Key พิสูจน์ตนตอบกลับ Challenge ถูกต้อง',
              },
              {
                id: 'P5.4',
                title: 'ความถูกต้องของลายมือชื่อ (Signature Integrity)',
                value: 'ตรวจสอบระบบถอดรหัสผ่านเกณฑ์ (Ed25519 Valid)',
                desc: 'ลายเซ็นอิเล็กทรอนิกส์ในตัวข้อมูลไม่มีการดัดแปลงหรือแก้ไขใดๆ',
              },
            ].map((detail) => (
              <div key={detail.id} className="bg-white rounded-2xl border border-gray-100 p-3.5 flex items-start gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <div className="mt-0.5 shrink-0">
                  <BadgeCheck size={18} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-slate-100 text-slate-500 font-mono text-[8px] px-1 py-0.2 rounded border border-slate-200">
                      {detail.id}
                    </span>
                    <h5 className="text-[11px] font-bold text-gray-800">{detail.title}</h5>
                  </div>
                  <p className="text-emerald-600 font-semibold text-[10px] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {detail.value}
                  </p>
                  <p className="text-gray-400 text-[9px] mt-0.5 leading-relaxed">{detail.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-6 shrink-0">
          <button
            onClick={() => onNavigate('05')}
            className="w-full h-12 rounded-2xl text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              fontSize: '14px',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
            }}
          >
            <FileCheck size={16} />
            ดำเนินการต่อเพื่อส่งเอกสารยินยอม
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
