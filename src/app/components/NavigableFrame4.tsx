import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ShieldAlert, FileCode, Check, AlertCircle, Sparkles } from 'lucide-react';
import JSONInspectorModal from './JSONInspectorModal';

interface NavigableFrame4Props {
  onNavigate: (screen: string) => void;
}

interface VerificationStep {
  id: string;
  p5Id: string;
  title: string;
  desc: string;
  status: 'pending' | 'checking' | 'success';
}

const mockVerificationJson = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "type": "VerifiablePresentationVerificationResult",
  "verified": true,
  "timestamp": "2026-05-21T06:50:00Z",
  "verificationDetails": {
    "p5_1_trustAnchor": {
      "status": "VALID",
      "registry": "https://trustregistry.etda.or.th",
      "issuerDid": "did:web:bma.go.th",
      "registeredName": "Bangkok Metropolitan Administration (BMA)",
      "assuranceLevel": "IAL3 / AAL3"
    },
    "p5_2_status": {
      "status": "ACTIVE",
      "revocationType": "StatusList2021Credential",
      "revocationIndex": 4209,
      "validUntil": "2027-05-21T07:45:00Z"
    },
    "p5_3_proofOfPossession": {
      "status": "VALID",
      "holderDid": "did:key:z6Mku8VdfU6551mJtLqyvH34RkW3Dk29fWpUv32n9h76L8jK",
      "challenge": "d2b4a530-581f-4952-b2eb-11d18969",
      "domain": "abcmansion.trust.in.th"
    },
    "p5_4_signature": {
      "status": "VALID",
      "signatureType": "Ed25519Signature2020",
      "jws": "eyJhbGciOiJFZERTQSI...eyJzdWIiOiJkaWQ6a2V5...t8_4z9c_E",
      "crlCheck": "PASSED"
    }
  }
};

export default function NavigableFrame4({ onNavigate }: NavigableFrame4Props) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [showJson, setShowJson] = useState(false);
  const [steps, setSteps] = useState<VerificationStep[]>([
    { id: '1', p5Id: 'P5.1', title: 'Trust Anchor', desc: 'ตรวจสอบสถานะผู้ออกใบรับรองกับ ETDA Registry', status: 'pending' },
    { id: '2', p5Id: 'P5.2', title: 'Status', desc: 'ตรวจสอบการเพิกถอนสิทธิ์การใช้งานของ VC', status: 'pending' },
    { id: '3', p5Id: 'P5.3', title: 'Proof of Possession', desc: 'ยืนยันความเป็นเจ้าของคีย์ส่วนตัวของผู้ถือ (Holder)', status: 'pending' },
    { id: '4', p5Id: 'P5.4', title: 'Signature', desc: 'ตรวจสอบลายเซ็นดิจิทัลของผู้ออก (Signature Check)', status: 'pending' },
  ]);

  useEffect(() => {
    // Stage-based animation sequence
    if (currentStepIdx < steps.length) {
      // Set current step to checking
      setSteps(prev => prev.map((s, i) => i === currentStepIdx ? { ...s, status: 'checking' } : s));

      const timer = setTimeout(() => {
        // Resolve current step to success
        setSteps(prev => prev.map((s, i) => i === currentStepIdx ? { ...s, status: 'success' } : s));
        setCurrentStepIdx(prev => prev + 1);
      }, 800); // 0.8s per check step

      return () => clearTimeout(timer);
    } else {
      // All completed successfully, wait 1.2s then auto navigate
      const finalTimer = setTimeout(() => {
        onNavigate('04');
      }, 1200);

      return () => clearTimeout(finalTimer);
    }
  }, [currentStepIdx, onNavigate, steps.length]);

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] select-none text-slate-900">
      {/* Header Bar */}
      <div className="shrink-0 bg-slate-900 px-4 pt-10 pb-5 shadow-lg relative overflow-hidden">
        {/* Glowing badge */}
        <div className="absolute top-[10%] right-[-10%] w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider">
              ETDA P5
            </span>
            <p className="text-white text-base font-extrabold tracking-wide">MUTUAL VERIFICATION</p>
          </div>
          <span className="text-indigo-400 animate-pulse">
            <Sparkles size={16} />
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-1">กระบวนการตรวจสอบเจ้าของหอพัก</p>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Status Title Banner */}
          <div className="text-center py-2">
            {currentStepIdx < steps.length ? (
              <>
                <h2 className="text-gray-900 text-lg font-black tracking-tight flex items-center justify-center gap-2">
                  <Loader2 size={18} className="text-indigo-600 animate-spin shrink-0" />
                  กำลังดำเนินการตรวจสอบ...
                </h2>
                <p className="text-gray-500 text-xs mt-1">ตรวจ 4 ขั้นตอนตามข้อเสนอแนะมาตรฐาน ETDA</p>
              </>
            ) : (
              <>
                <h2 className="text-emerald-600 text-lg font-black tracking-tight flex items-center justify-center gap-2 animate-bounce">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                  ตรวจสอบเสร็จสิ้น!
                </h2>
                <p className="text-emerald-700 font-bold text-xs mt-0.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 w-fit mx-auto">
                  ผ่านเกณฑ์ความน่าเชื่อถือระดับสากล
                </p>
              </>
            )}
          </div>

          {/* Target Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/80">
                <span className="text-xl">🏢</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">Happy Campus Dorm</h4>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                  did:web:abcmansion.trust.in.th
                </p>
              </div>
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-2 py-0.5 text-[9px] font-bold">
                Owner VC
              </span>
            </div>
          </div>

          {/* Checklist Boxes */}
          <div className="space-y-2.5">
            {steps.map((step) => {
              const isPending = step.status === 'pending';
              const isChecking = step.status === 'checking';
              const isSuccess = step.status === 'success';

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border p-3 flex items-center gap-3 transition-all duration-300 ${
                    isChecking
                      ? 'bg-indigo-50/50 border-indigo-200 shadow-sm'
                      : isSuccess
                      ? 'bg-emerald-50/20 border-emerald-200/80'
                      : 'bg-white border-slate-200 opacity-60'
                  }`}
                >
                  {/* Left Icon Status */}
                  <div className="shrink-0">
                    {isPending && (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center bg-slate-50">
                        <span className="text-[10px] text-slate-400 font-mono">○</span>
                      </div>
                    )}
                    {isChecking && (
                      <div className="w-6 h-6 rounded-full border-2 border-indigo-600 flex items-center justify-center bg-indigo-50">
                        <Loader2 size={12} className="text-indigo-600 animate-spin" />
                      </div>
                    )}
                    {isSuccess && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 animate-scale-in">
                        <Check size={12} className="text-white stroke-[3px]" />
                      </div>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono text-[8px] px-1 py-0.5 font-bold">
                        {step.p5Id}
                      </span>
                      <p className={`text-xs font-bold ${isSuccess ? 'text-slate-800' : isChecking ? 'text-indigo-900' : 'text-slate-500'}`}>
                        {step.title}
                      </p>
                    </div>
                    <p className={`text-[10px] mt-0.5 ${isSuccess ? 'text-emerald-700/80' : isChecking ? 'text-indigo-600/80' : 'text-slate-400'}`}>
                      {isChecking ? 'กำลังตรวจสอบสัญญากุญแจและระบบ...' : isSuccess ? 'ตรวจสอบเรียบร้อยแล้ว' : step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="space-y-2 pt-4 shrink-0">
          <button
            onClick={() => setShowJson(true)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <FileCode size={14} className="text-indigo-500" />
            ดูหลักฐานการตรวจสอบ (Verification Proof JSON)
          </button>
        </div>
      </div>

      {showJson && (
        <JSONInspectorModal
          title="Cryptographic Verification Proof"
          jsonData={mockVerificationJson}
          onClose={() => setShowJson(false)}
        />
      )}
    </div>
  );
}
