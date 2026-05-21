import { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Fingerprint, 
  Database,
  ArrowRightLeft
} from 'lucide-react';

interface PortalLandingProps {
  onNavigate: (screen: string) => void;
}

export default function PortalLanding({ onNavigate }: PortalLandingProps) {
  const [hoveredCard, setHoveredCard] = useState<'tenant' | 'landlord' | null>(null);

  return (
    <div className="w-full min-h-screen flex flex-col justify-between py-12 px-4 md:px-8 text-slate-100 select-none">
      
      {/* Brand Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between mb-12 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Fingerprint className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
              TRUST RENTAL
            </h2>
            <p className="text-[10px] text-indigo-400 font-mono tracking-wider">SECURE DIGITAL IDENTITY</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300">ETDA & VCGA Demo v2.0</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto flex-1 flex flex-col justify-center">
        <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            แพลตฟอร์มเช่าหอพักด้วย{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              ความน่าเชื่อถือดิจิทัล
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            เชื่อมโยงผู้เช่าและผู้ประกอบการหอพักด้วย Verifiable Credentials (VC) 
            ปลอดภัย เป็นส่วนตัวตามมาตรฐาน PDPA มั่นใจได้ 100% ไม่ต้องส่งมอบเอกสารกระดาษ
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto mb-16">
          
          {/* Tenant / Student Card */}
          <div
            onClick={() => onNavigate('01')}
            onMouseEnter={() => setHoveredCard('tenant')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative cursor-pointer rounded-3xl p-8 bg-gradient-to-b from-slate-800/40 to-slate-900/60 border border-slate-700/40 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden animate-pulse-glow"
          >
            {/* Card Accent Gradient Blob */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none" />
            
            <div className="flex flex-col h-full justify-between gap-6 relative z-10">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  นักศึกษา / ผู้เช่า
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  เข้าสู่ระบบ **Student Digital Wallet** จัดการข้อมูลนักศึกษา ใบรับรองความประพฤติ 
                  และค้นหาหอพักเพื่อส่งคำขอเช่าพร้อมแชร์ข้อมูลที่ได้รับความยินยอมผ่านระบบดิจิทัล
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm group-hover:text-indigo-300">
                <span>เข้าสู่ระบบ Wallet ผู้เช่า</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Landlord / Owner Card */}
          <div
            onClick={() => onNavigate('06')}
            onMouseEnter={() => setHoveredCard('landlord')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative cursor-pointer rounded-3xl p-8 bg-gradient-to-b from-slate-800/40 to-slate-900/60 border border-slate-700/40 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-purple-500/10 hover:-translate-y-1 overflow-hidden"
          >
            {/* Card Accent Gradient Blob */}
            <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-500 pointer-events-none" />

            <div className="flex flex-col h-full justify-between gap-6 relative z-10">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  เจ้าของหอพัก / ผู้ให้เช่า
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  เข้าสู่ระบบ **Landlord Trust Console** เพื่อตรวจสอบใบอนุญาตหอพัก 
                  จัดการรายชื่อห้องพัก ตรวจรับคำขอเช่าผ่านการพิสูจน์สิทธิ์ใบรับรอง และทำสัญญาเช่าอิเล็กทรอนิกส์ (e-Contract)
                </p>
              </div>

              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm group-hover:text-purple-300">
                <span>เข้าสู่ระบบ Console เจ้าของหอ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>

        {/* Workflow Diagram Section */}
        <section className="max-w-4xl w-full mx-auto bg-slate-950/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md mb-12">
          <h4 className="text-center font-bold text-slate-200 mb-8 flex items-center justify-center gap-2 text-sm md:text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            กลไกการทำธุรกรรมด้วย Verifiable Credentials (VC)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative">
            
            {/* Step 1: Issuer */}
            <div className="flex flex-col items-center text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                <Database className="w-6 h-6 text-indigo-400" />
              </div>
              <h5 className="font-bold text-sm text-white mb-1">1. ผู้ออกเอกสาร (Issuer)</h5>
              <p className="text-xs text-slate-400">
                มหาวิทยาลัย / สำนักงานเขต ออกใบรับรองในรูปแบบ Verifiable Credentials ส่งมอบให้ผู้ถือสิทธิ์
              </p>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="hidden md:flex justify-center text-slate-600">
              <ArrowRightLeft className="w-6 h-6 animate-pulse text-indigo-500/50" />
            </div>

            {/* Step 2: Holder */}
            <div className="flex flex-col items-center text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <h5 className="font-bold text-sm text-white mb-1">2. ผู้ถือสิทธิ์ (Holder)</h5>
              <p className="text-xs text-slate-400">
                นักศึกษา / เจ้าของหอพัก เก็บรักษาเอกสารใน Wallet ของตนเอง และแชร์ข้อมูลแบบยินยอม (Consent)
              </p>
            </div>

            {/* Connecting Arrow 2 */}
            <div className="hidden md:flex justify-center text-slate-600">
              <ArrowRightLeft className="w-6 h-6 animate-pulse text-purple-500/50" />
            </div>

            {/* Step 3: Verifier */}
            <div className="flex flex-col items-center text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-purple-400" />
              </div>
              <h5 className="font-bold text-sm text-white mb-1">3. ผู้ตรวจสอบ (Verifier)</h5>
              <p className="text-xs text-slate-400">
                คู่สัญญาทำการตรวจสอบความถูกต้องของข้อมูลผ่านระบบลายมือชื่อดิจิทัลได้อย่างรวดเร็ว
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto mt-12 pt-6 border-t border-slate-800/80 text-center text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Trust Rental Platform. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition-colors">ETDA Guidelines</a>
        </div>
      </footer>

    </div>
  );
}
