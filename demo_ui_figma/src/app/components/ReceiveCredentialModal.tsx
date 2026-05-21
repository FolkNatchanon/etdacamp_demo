import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Loader2, Download, Building2, Key, Clock, X } from 'lucide-react';

interface CredentialData {
  type: string;
  issuer: string;
  issuedTo: string;
  dormName: string;
  buildingName: string;
  roomNumber: string;
  floor: string;
  address: string;
  rentalStatus: string;
  validFrom: string;
  validUntil: string;
}

interface ReceiveCredentialModalProps {
  credentialData: CredentialData;
  onSave: () => void;
  onCancel?: () => void;
}

export default function ReceiveCredentialModal({
  credentialData,
  onSave,
  onCancel,
}: ReceiveCredentialModalProps) {
  const [step, setStep] = useState<'receiving' | 'preview' | 'saving' | 'saved'>('receiving');

  const handleClose = () => {
    if (step === 'saving') return; // Don't allow closing during save
    if (onCancel) {
      onCancel();
    } else {
      onSave(); // Fallback to onSave if no onCancel provided
    }
  };

  useEffect(() => {
    // Simulate receiving credential
    const timer = setTimeout(() => {
      setStep('preview');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveToWallet = () => {
    setStep('saving');

    // Save credential to localStorage
    setTimeout(() => {
      const existingCredentials = JSON.parse(
        localStorage.getItem('trustwallet_credentials') || '[]'
      );

      // Calculate expiry date (1 year from now)
      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const newCredential = {
        id: `tenant-${Date.now()}`,
        type: credentialData.type,
        issuer: credentialData.issuer,
        issuedTo: credentialData.issuedTo,
        dormName: credentialData.dormName,
        buildingName: credentialData.buildingName,
        roomNumber: credentialData.roomNumber,
        floor: credentialData.floor,
        address: credentialData.address,
        rentalStatus: credentialData.rentalStatus,
        validFrom: credentialData.validFrom,
        validUntil: credentialData.validUntil,
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

      existingCredentials.push(newCredential);
      localStorage.setItem('trustwallet_credentials', JSON.stringify(existingCredentials));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('credentialSaved', {
        detail: newCredential
      }));

      setStep('saved');
      setTimeout(() => {
        onSave();
      }, 1500);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'saving' && step !== 'saved') {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl relative my-auto max-h-[90vh] flex flex-col">
        {/* Close button - only show when not saving */}
        {step !== 'saving' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-20"
          >
            <X size={18} className="text-gray-600" />
          </button>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6">

        {/* Receiving State */}
        {step === 'receiving' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center relative">
              <Shield size={40} className="text-indigo-600" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                กำลังรับ Credential
              </h3>
              <p className="text-sm text-gray-600">
                หอพักกำลังส่ง Verifiable Credential มาให้คุณ
              </p>
            </div>
          </div>
        )}

        {/* Preview State */}
        {step === 'preview' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  ได้รับ Credential แล้ว
                </h3>
                <p className="text-xs text-gray-500">
                  ตรวจสอบข้อมูลและบันทึกลง Wallet
                </p>
              </div>
            </div>

            {/* Credential Card */}
            <div className="rounded-2xl overflow-hidden border-2 border-indigo-200">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-white" />
                    <p className="text-white text-xs font-semibold">
                      Tenant Credential
                    </p>
                  </div>
                  <Shield size={18} className="text-white/80" />
                </div>
                <p className="text-white font-bold text-lg">
                  {credentialData.dormName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-indigo-200 text-sm">
                    {credentialData.buildingName}
                  </p>
                  <span className="text-indigo-300">•</span>
                  <p className="text-indigo-200 text-sm">
                    ห้อง {credentialData.roomNumber}
                  </p>
                  <span className="text-indigo-300">•</span>
                  <p className="text-indigo-200 text-sm">
                    ชั้น {credentialData.floor}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="bg-white p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">ชื่อผู้เช่า</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {credentialData.issuedTo}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">รายละเอียดห้องพัก</p>
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">
                        {credentialData.buildingName}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      ห้อง {credentialData.roomNumber} • ชั้น {credentialData.floor}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ที่อยู่</p>
                  <p className="text-sm text-gray-900">
                    {credentialData.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">เริ่มต้นสัญญา</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {credentialData.validFrom}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">สิ้นสุดสัญญา</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {credentialData.validUntil}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">สถานะการเช่า</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-700">
                      {credentialData.rentalStatus}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">ออกโดย</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {credentialData.issuer}
                  </p>
                </div>

                {/* Expiry info */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Credential หมดอายุ</p>
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

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Key size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-900 mb-1">
                    ข้อมูลใน Credential นี้
                  </p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• ชื่อตึก ห้อง และชั้นที่พัก</li>
                    <li>• สถานะผู้เช่าและระยะเวลาสัญญา</li>
                    <li>• ที่อยู่ห้องพักพร้อมบ้านเลขที่</li>
                    <li>• เวลาบันทึก Credential</li>
                    <li>• ใช้ยืนยันตัวตนและเข้าถึงบริการ</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Expiry warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-900 mb-1">
                    ⚠️ Credential มีอายุจำกัด
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Credential นี้จะถูกทำลายอัตโนมัติเมื่อหมดอายุ (1 ปี) เพื่อความปลอดภัย คุณจะต้องรับ Credential ใหม่หลังจากนั้น
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                ปิด
              </button>
              <button
                onClick={handleSaveToWallet}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                บันทึก
              </button>
            </div>
          </div>
        )}

        {/* Saving State */}
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
                กำลังเข้ารหัสและบันทึก Credential ลง Wallet
              </p>
            </div>
          </div>
        )}

        {/* Saved State */}
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
                คุณสามารถดู Credential ได้ที่ My Documents
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
