import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Fingerprint, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Copy, 
  Check, 
  Sparkles,
  Smartphone,
  Eye
} from 'lucide-react';
import JSONInspectorModal from './JSONInspectorModal';

interface NavigableFrame12Props {
  onNavigate: (screen: string, tab?: any) => void;
}

export default function NavigableFrame12({ onNavigate }: NavigableFrame12Props) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedStudentDid, setCopiedStudentDid] = useState(false);
  const [copiedLandlordDid, setCopiedLandlordDid] = useState(false);
  
  const [signingStatus, setSigningStatus] = useState<'unsigned' | 'scanning' | 'success' | 'signed'>('unsigned');
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const contractHash = 'd2b4a530581f4952b2eb11d18969f623eb0c44298fc1c149afbf4c8996fb924';
  const studentDid = 'did:key:z6Mku8VdfU6551mJtLqyvH34RkW3Dk29fWpUv32n9h76L8jK';
  const landlordDid = 'did:web:abcmansion.trust.in.th';

  const contractData = {
    title: 'หนังสือสัญญาเช่าอาคารเพื่ออยู่อาศัย (หอพักนักศึกษา)',
    dormName: 'Happy Campus Dorm',
    room: 'A-502',
    rent: 6500,
    deposit: 13000,
    term: '12 เดือน (1 มิถุนายน 2569 – 31 พฤษภาคม 2570)',
    studentName: 'นายสมชาย ใจดี',
    landlordName: 'นายสมศักดิ์ รักสงบ'
  };

  const handleCopyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const startSigning = () => {
    if (signingStatus !== 'unsigned') return;
    setSigningStatus('scanning');
    
    // Simulate biometric scan
    setTimeout(() => {
      setSigningStatus('success');
      // Save signature state to localStorage
      localStorage.setItem('trustwallet_contract_signed', 'true');
    }, 2000);
  };

  const handleFinishSigning = () => {
    setSigningStatus('signed');
    onNavigate('01', 'dorm');
  };

  const contractVP = {
    "@context": [
      "https://www.w3.org/2018/credentials/v2",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "type": ["VerifiablePresentation", "LeaseContractPresentation"],
    "verifiableCredential": [
      {
        "@context": [
          "https://www.w3.org/2018/credentials/v2",
          "https://schema.org"
        ],
        "id": "urn:uuid:lease-contract-happy-campus-a502",
        "type": ["VerifiableCredential", "LeaseAgreementCredential"],
        "issuer": landlordDid,
        "issuanceDate": "2026-05-21T06:50:00Z",
        "credentialSubject": {
          "id": studentDid,
          "dormName": contractData.dormName,
          "roomNumber": contractData.room,
          "monthlyRent": `${contractData.rent} THB`,
          "securityDeposit": `${contractData.deposit} THB`,
          "leaseTerm": contractData.term,
          "studentName": contractData.studentName,
          "landlordName": contractData.landlordName,
          "documentHash": contractHash
        },
        "proof": {
          "type": "JsonWebSignature2020",
          "created": "2026-05-21T06:50:10Z",
          "proofPurpose": "assertionMethod",
          "verificationMethod": `${landlordDid}#key-1`,
          "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abcmansion-sig-hash-9182312"
        }
      }
    ],
    "proof": {
      "type": "JsonWebSignature2020",
      "created": "2026-05-21T13:49:00Z",
      "proofPurpose": "authentication",
      "verificationMethod": `${studentDid}#key-1`,
      "jws": signingStatus === 'signed' || signingStatus === 'success' 
        ? "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..somchai-secure-enclave-sig-194829472"
        : null
    }
  };

  return (
    <div className="size-full flex flex-col bg-[#F8F9FC] select-none text-slate-900 overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 px-4 pt-10 pb-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider">
              e-CONTRACT
            </span>
            <p className="text-white text-base font-extrabold tracking-wide">DUAL CRYPTO-SIGN</p>
          </div>
          <span className="bg-indigo-900/60 border border-indigo-700/50 rounded-full px-2 py-0.5 text-[9px] text-indigo-300 font-bold font-mono">
            IAL3 / QES
          </span>
        </div>
        <p className="text-slate-400 text-xs mt-1">ลงนามสัญญาเช่าดิจิทัลร่วมกันทั้งสองฝ่าย</p>
      </div>

      {/* Main Content scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-6">
        
        {/* Contract Preview Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
            <FileText className="text-indigo-600 shrink-0" size={18} />
            <h3 className="font-extrabold text-sm text-slate-800">{contractData.title}</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">สถานที่เช่า:</span>
              <span className="col-span-2 text-slate-800 font-bold">{contractData.dormName} ห้องพักเลขที่ {contractData.room}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">ผู้ให้เช่า:</span>
              <span className="col-span-2 text-slate-800 font-semibold">{contractData.landlordName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">ผู้เช่า:</span>
              <span className="col-span-2 text-slate-800 font-semibold">{contractData.studentName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">อัตราค่าเช่า:</span>
              <span className="col-span-2 text-slate-800 font-bold text-indigo-700">฿{contractData.rent.toLocaleString()} บาท/เดือน</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">เงินมัดจำ:</span>
              <span className="col-span-2 text-slate-800 font-bold">฿{contractData.deposit.toLocaleString()} บาท (มัดจำ 2 เดือน)</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400 font-medium">ระยะสัญญา:</span>
              <span className="col-span-2 text-slate-700 font-medium">{contractData.term}</span>
            </div>
          </div>
        </div>

        {/* Cryptographic metadata verification */}
        <div className="bg-slate-900 rounded-3xl border border-slate-850 shadow-md p-4 text-white space-y-3.5">
          <div>
            <p className="text-[10px] text-indigo-400 font-extrabold tracking-wider uppercase">Contract File Integrity (SHA-256 Hash)</p>
            <div className="flex items-center justify-between gap-2 mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-950/80 active:scale-98 transition-all"
              onClick={() => handleCopyText(contractHash, setCopiedHash)}>
              <span className="font-mono text-[9.5px] text-slate-300 truncate max-w-[210px]">{contractHash}</span>
              {copiedHash ? (
                <span className="text-[9px] text-emerald-400 font-bold shrink-0">Copied!</span>
              ) : (
                <Copy size={11} className="text-slate-500 shrink-0" />
              )}
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Landlord signature status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-indigo-400 font-extrabold tracking-wider uppercase">Signature 1: Landlord (ผู้ให้เช่า)</p>
              <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full px-2 py-0.5 text-[8.5px] font-bold">
                ✓ SIGNED
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-1.5 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 cursor-pointer hover:bg-slate-950/80"
              onClick={() => handleCopyText(landlordDid, setCopiedLandlordDid)}>
              <span className="font-mono text-[9px] text-slate-400 truncate max-w-[200px]">{landlordDid}</span>
              {copiedLandlordDid ? (
                <span className="text-[9px] text-emerald-400 font-bold shrink-0">Copied!</span>
              ) : (
                <Copy size={10} className="text-slate-500 shrink-0" />
              )}
            </div>
            <p className="font-mono text-[8px] text-slate-500 leading-tight truncate px-1">
              JWS: eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..abcmansion-sig-hash-9182312
            </p>
          </div>

          {/* Student signature status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-indigo-400 font-extrabold tracking-wider uppercase">Signature 2: Student (ผู้เช่า/ตัวคุณ)</p>
              {signingStatus === 'signed' || signingStatus === 'success' ? (
                <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full px-2 py-0.5 text-[8.5px] font-bold animate-pulse">
                  ✓ SIGNED
                </span>
              ) : (
                <span className="bg-rose-950 border border-rose-800 text-rose-400 rounded-full px-2 py-0.5 text-[8.5px] font-bold animate-pulse">
                  ● UNSIGNED
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1.5 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 cursor-pointer hover:bg-slate-950/80"
              onClick={() => handleCopyText(studentDid, setCopiedStudentDid)}>
              <span className="font-mono text-[9px] text-slate-400 truncate max-w-[200px]">{studentDid}</span>
              {copiedStudentDid ? (
                <span className="text-[9px] text-emerald-400 font-bold shrink-0">Copied!</span>
              ) : (
                <Copy size={10} className="text-slate-500 shrink-0" />
              )}
            </div>
            <p className="font-mono text-[8px] text-slate-500 leading-tight truncate px-1">
              JWS: {signingStatus === 'signed' || signingStatus === 'success' 
                ? "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..somchai-secure-enclave-sig-194829472" 
                : "รอการลงลายมือชื่อดิจิทัล..."}
            </p>
          </div>
        </div>

        {/* Legal ETDA compliance banner */}
        <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-3 flex gap-2.5 items-start">
          <ShieldCheck size={18} className="text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-[11px] font-bold text-indigo-900">ธุรกรรมอิเล็กทรอนิกส์ตามกฎหมายไทย</h5>
            <p className="text-[9.5px] text-indigo-700 leading-normal">
              การลงนามนี้มีผลผูกพันทางกฎหมายตาม พ.ร.บ. ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 มาตรา 26 (ลายมือชื่อดิจิทัลที่เชื่อถือได้) และมาตรา 28 (การรับรองคีย์ Secure Enclave) ปลอดภัยและตรวจสอบย้อนกลับได้สมบูรณ์
            </p>
          </div>
        </div>

      </div>

      {/* Footer sign button */}
      <div className="shrink-0 bg-white border-t border-slate-200/80 px-4 py-4 space-y-2.5">
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowJsonInspector(true)}
            className="flex items-center justify-center gap-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-3.5 rounded-2xl text-xs font-bold active:scale-95 transition-all shadow-sm shrink-0"
            title="Inspect Lease Contract JSON"
          >
            <Eye size={14} className="text-indigo-600" />
            ตรวจโครงสร้าง
          </button>
          
          <button
            onClick={startSigning}
            disabled={signingStatus !== 'unsigned'}
            className={`flex-1 py-3.5 rounded-2xl text-white flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all ${
              signingStatus === 'unsigned'
                ? 'bg-gradient-to-r from-slate-900 to-indigo-950 active:scale-[0.98] shadow-slate-900/10 animate-pulse-glow'
                : 'bg-emerald-600/90 text-emerald-100 cursor-default'
            }`}
          >
            <Fingerprint size={16} />
            {signingStatus === 'unsigned' && 'ลงนามด้วย Face ID'}
            {signingStatus === 'scanning' && 'กำลังลงลายมือชื่อ...'}
            {(signingStatus === 'success' || signingStatus === 'signed') && 'ลงนามเสร็จสิ้น! ✓'}
          </button>
        </div>
      </div>

      {/* iOS Face ID simulation overlay */}
      {signingStatus === 'scanning' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-[260px] w-full text-center flex flex-col items-center gap-4 shadow-2xl animate-scale-in">
            
            {/* iOS Face ID Ring animation */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Outer spin ring */}
              <div className="absolute inset-0 rounded-full border-[3px] border-indigo-600/20 border-t-indigo-500 animate-spin" />
              {/* Inner face scanner icon */}
              <Smartphone size={32} className="text-indigo-400 animate-pulse" />
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-slate-100">Face ID Verification</h4>
              <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                สแกนใบหน้าและถอดรหัส Private Key บน Secure Enclave
              </p>
            </div>
            
            <span className="text-[9.5px] text-slate-500 font-mono">
              KeyID: z6Mku...76L8jK
            </span>
          </div>
        </div>
      )}

      {/* iOS Face ID signature success state */}
      {signingStatus === 'success' && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-[1000] flex items-center justify-center p-5">
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 max-w-sm w-full text-center flex flex-col items-center gap-5 shadow-2xl animate-scale-in text-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 size={34} className="text-emerald-600" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-black text-lg text-slate-900">สัญญาเช่าเสร็จสมบูรณ์!</h4>
              <p className="text-xs text-slate-500 leading-normal px-2">
                เอกสารสัญญาเช่าดิจิทัล (e-Contract) ได้รับการลงลายมือชื่อดิจิทัลที่เชื่อถือได้ตามข้อเสนอแนะมาตรฐาน ETDA เรียบร้อยแล้ว
              </p>
            </div>

            {/* Contract Summary Box */}
            <div className="w-full bg-slate-50 border border-slate-150 rounded-2xl p-3.5 text-left space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">หอพัก:</span>
                <span className="font-bold text-slate-700">{contractData.dormName} (ห้อง {contractData.room})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ผู้ลงนามร่วม:</span>
                <span className="font-semibold text-slate-700">{contractData.landlordName} (เจ้าของหอ)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">เอกสารแฮช:</span>
                <span className="font-mono text-[9px] text-indigo-600">{contractHash.slice(0, 8)}...{contractHash.slice(-8)}</span>
              </div>
              <div className="h-px bg-slate-200/80 my-1" />
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold justify-center pt-0.5">
                <ShieldCheck size={13} />
                <span>สถานะ: เข้ารหัสแบบสองฝ่าย (Dual-Signed)</span>
              </div>
            </div>

            <button
              onClick={handleFinishSigning}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] text-white rounded-2xl font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/20 transition-all animate-pulse-glow flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              ตรวจสอบสัญญาดิจิทัลใน Wallet
            </button>
          </div>
        </div>
      )}

      {/* JSON Inspector Modal */}
      {showJsonInspector && (
        <JSONInspectorModal
          title="Verifiable Lease Presentation (VP)"
          jsonData={contractVP}
          onClose={() => setShowJsonInspector(false)}
        />
      )}
    </div>
  );
}
