import { useState, useEffect } from 'react';
import {
  ShieldCheck, Building2, CheckCircle2, AlertCircle, Clock,
  ChevronRight, X, University, MapPin, FileCheck, Loader2, Award,
} from 'lucide-react';

interface DormCredential {
  id: string;
  type: 'district' | 'university';
  issuer: string;
  issuerTh: string;
  name: string;
  nameTh: string;
  description: string;
  status: 'missing' | 'requesting' | 'pending' | 'approved' | 'rejected';
  issuedAt?: string;
  expiresAt?: string;
  required: boolean;
}

interface DormCredentialsSectionProps {
  dormName: string;
  onNavigate?: (screen: string) => void;
}

const CREDENTIAL_TYPES: DormCredential[] = [
  {
    id: 'district_license',
    type: 'district',
    issuer: 'Pathumwan District Office',
    issuerTh: 'สำนักงานเขตปทุมวัน',
    name: 'Dormitory License',
    nameTh: 'ใบอนุญาตประกอบกิจการหอพัก',
    description: 'ใบอนุญาตจากสำนักงานเขตยืนยันว่าหอพักได้รับอนุญาตตามกฎหมาย',
    status: 'missing',
    required: true,
  },
  {
    id: 'district_safety',
    type: 'district',
    issuer: 'Pathumwan District Office',
    issuerTh: 'สำนักงานเขตปทุมวัน',
    name: 'Safety Certificate',
    nameTh: 'ใบรับรองความปลอดภัย',
    description: 'ใบรับรองมาตรฐานความปลอดภัยของอาคาร',
    status: 'missing',
    required: true,
  },
  {
    id: 'uni_recommend',
    type: 'university',
    issuer: 'Chulalongkorn University',
    issuerTh: 'จุฬาลงกรณ์มหาวิทยาลัย',
    name: 'Recommended Dormitory',
    nameTh: 'หอพักแนะนำโดยมหาวิทยาลัย',
    description: 'การรับรองจากมหาวิทยาลัยว่าเป็นหอพักที่แนะนำสำหรับนักศึกษา',
    status: 'missing',
    required: false,
  },
];

function CredentialCard({
  credential,
  onRequest,
}: {
  credential: DormCredential;
  onRequest: (id: string) => void;
}) {
  const statusConfig = {
    missing: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-600',
      badge: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'ยังไม่ได้ขอ' },
    },
    requesting: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badge: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'กำลังส่งคำขอ' },
    },
    pending: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'รอการอนุมัติ' },
    },
    approved: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'อนุมัติแล้ว' },
    },
    rejected: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      badge: { bg: 'bg-red-100', text: 'text-red-700', label: 'ปฏิเสธ' },
    },
  };

  const config = statusConfig[credential.status];
  const icon = credential.type === 'district' ? <MapPin size={18} /> : <University size={18} />;

  return (
    <div className={`rounded-2xl border-2 ${config.border} ${config.bg} p-4`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${credential.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-white/80 text-gray-600'} flex items-center justify-center shrink-0`}>
          {credential.status === 'approved' ? <CheckCircle2 size={20} /> : icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className={`font-bold text-sm ${config.text}`}>
              {credential.nameTh}
            </p>
            {credential.required && (
              <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                จำเป็น
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-1">{credential.name}</p>
          <div className="flex items-center gap-1.5">
            <Building2 size={11} className="text-gray-400" />
            <p className="text-xs text-gray-500">{credential.issuerTh}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed mb-3">
        {credential.description}
      </p>

      {/* Status badge */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1.5 ${config.badge.bg} ${config.badge.text} px-2.5 py-1 rounded-full`}>
          {credential.status === 'requesting' && <Loader2 size={12} className="animate-spin" />}
          {credential.status === 'pending' && <Clock size={12} />}
          {credential.status === 'approved' && <CheckCircle2 size={12} />}
          {credential.status === 'rejected' && <X size={12} />}
          <span className="text-xs font-semibold">{config.badge.label}</span>
        </div>

        {credential.status === 'missing' && (
          <button
            onClick={() => onRequest(credential.id)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            ขอ Credential
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Expiry date for approved credentials */}
      {credential.status === 'approved' && credential.expiresAt && (
        <div className="mt-2 pt-2 border-t border-emerald-200">
          <p className="text-xs text-emerald-700">
            หมดอายุ: {credential.expiresAt}
          </p>
        </div>
      )}
    </div>
  );
}

export default function DormCredentialsSection({ dormName, onNavigate }: DormCredentialsSectionProps) {
  const [credentials, setCredentials] = useState<DormCredential[]>(CREDENTIAL_TYPES);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestingCredential, setRequestingCredential] = useState<DormCredential | null>(null);

  // Load saved credentials from wallet
  useEffect(() => {
    const checkWalletCredentials = () => {
      const walletCreds = localStorage.getItem('landlord_wallet_credentials');
      if (walletCreds) {
        try {
          const parsed = JSON.parse(walletCreds);

          // Update credential status based on wallet
          const updatedCreds = CREDENTIAL_TYPES.map(credType => {
            const found = parsed.find((wc: any) => wc.id.startsWith(credType.id));
            if (found) {
              return {
                ...credType,
                status: 'approved' as const,
                issuedAt: new Date(found.issuedAt).toLocaleDateString('th-TH'),
                expiresAt: found.expiresAtDisplay,
              };
            }
            return credType;
          });

          setCredentials(updatedCreds);
        } catch (e) {
          // Use default
        }
      }
    };

    checkWalletCredentials();

    const handleCredentialSaved = () => {
      checkWalletCredentials();
    };

    window.addEventListener('landlordCredentialSaved', handleCredentialSaved);
    const interval = setInterval(checkWalletCredentials, 500);

    return () => {
      window.removeEventListener('landlordCredentialSaved', handleCredentialSaved);
      clearInterval(interval);
    };
  }, []);

  const handleRequest = (id: string) => {
    const credential = credentials.find(c => c.id === id);
    if (credential) {
      // Store credential to be received in localStorage
      localStorage.setItem('landlord_pending_credential', JSON.stringify(credential));
      // Navigate to wallet
      if (onNavigate) {
        onNavigate('landlord-wallet');
      }
    }
  };

  const handleConfirmRequest = () => {
    if (!requestingCredential) return;

    // Update status to requesting
    const updated = credentials.map(c =>
      c.id === requestingCredential.id
        ? { ...c, status: 'requesting' as const }
        : c
    );
    setCredentials(updated);
    setShowRequestModal(false);

    // Simulate request process
    setTimeout(() => {
      const updated2 = credentials.map(c =>
        c.id === requestingCredential.id
          ? { ...c, status: 'pending' as const }
          : c
      );
      setCredentials(updated2);

      // Simulate approval after some time
      setTimeout(() => {
        const now = new Date();
        const expiry = new Date(now);
        expiry.setFullYear(expiry.getFullYear() + 1);

        const updated3 = credentials.map(c =>
          c.id === requestingCredential.id
            ? {
                ...c,
                status: 'approved' as const,
                issuedAt: now.toLocaleDateString('th-TH'),
                expiresAt: expiry.toLocaleDateString('th-TH'),
              }
            : c
        );
        setCredentials(updated3);
        localStorage.setItem('dorm_credentials', JSON.stringify(updated3));
      }, 3000);
    }, 2000);

    setRequestingCredential(null);
  };

  const requiredCredentials = credentials.filter(c => c.required);
  const optionalCredentials = credentials.filter(c => !c.required);
  const approvedCount = credentials.filter(c => c.status === 'approved').length;
  const requiredApprovedCount = requiredCredentials.filter(c => c.status === 'approved').length;
  const allRequiredApproved = requiredApprovedCount === requiredCredentials.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Dorm Credentials</h3>
            <p className="text-sm text-white/80">ยืนยันสถานะหอพักของคุณ</p>
          </div>
        </div>

        {/* Status summary */}
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70 mb-1">สถานะการยืนยัน</p>
            <p className="font-bold text-lg">
              {approvedCount} / {credentials.length} Credentials
            </p>
          </div>
          {allRequiredApproved ? (
            <div className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1.5 rounded-full">
              <CheckCircle2 size={16} />
              <span className="text-xs font-semibold">ผ่านการตรวจสอบ</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-500 text-white px-3 py-1.5 rounded-full">
              <AlertCircle size={16} />
              <span className="text-xs font-semibold">ต้องมี Credentials</span>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-blue-600" />
          <p className="text-sm font-semibold text-blue-900">
            ทำไมต้องมี Credentials?
          </p>
        </div>
        <ul className="text-xs text-blue-800 space-y-1.5 leading-relaxed">
          <li>• ยืนยันว่าหอพักได้รับอนุญาตตามกฎหมาย</li>
          <li>• สร้างความมั่นใจให้กับผู้เช่าและผู้ปกครอง</li>
          <li>• เพิ่มความน่าเชื่อถือในแพลตฟอร์ม Trust Rental</li>
          <li>• ได้รับการแนะนำจากมหาวิทยาลัย (เพิ่มผู้เช่า 3x)</li>
        </ul>
      </div>

      {/* Warning if required credentials missing */}
      {!allRequiredApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">
              ต้องมี Credentials ก่อนรับผู้เช่า
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              ระบบจะไม่อนุญาตให้รับผู้เช่าจนกว่าจะได้รับใบอนุญาตจากสำนักงานเขต
            </p>
          </div>
        </div>
      )}

      {/* Required credentials */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Credentials ที่จำเป็น
        </h4>
        <div className="space-y-3">
          {requiredCredentials.map(credential => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              onRequest={handleRequest}
            />
          ))}
        </div>
      </div>

      {/* Optional credentials */}
      {optionalCredentials.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Credentials เสริม (เพิ่มความน่าเชื่อถือ)
          </h4>
          <div className="space-y-3">
            {optionalCredentials.map(credential => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                onRequest={handleRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* Request confirmation modal */}
      {showRequestModal && requestingCredential && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <FileCheck size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  ขอ Credential
                </h3>
                <p className="text-sm text-gray-600">
                  {requestingCredential.issuerTh}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {requestingCredential.nameTh}
              </p>
              <p className="text-xs text-gray-600">
                {requestingCredential.description}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-blue-900 font-semibold mb-1">
                ข้อมูลที่ต้องส่ง:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• ชื่อหอพัก: {dormName}</li>
                <li>• เลขทะเบียนพาณิชย์</li>
                <li>• ใบอนุญาตก่อสร้าง</li>
                <li>• รายละเอียดห้องพัก</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestingCredential(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmRequest}
                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
              >
                ส่งคำขอ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
