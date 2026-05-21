import { useState } from 'react';
import { Shield, X, CheckCircle2, Building2 } from 'lucide-react';

interface CredentialRequest {
  verifier: string;
  requestedCredentials: string[];
  purpose?: string;
}

interface CredentialRequestModalProps {
  request: CredentialRequest;
  onApprove: () => void;
  onDeny: () => void;
}

export default function CredentialRequestModal({
  request,
  onApprove,
  onDeny,
}: CredentialRequestModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      onApprove();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-indigo-600">
            <Shield size={24} />
            <h3 className="font-bold text-lg text-gray-900">
              คำขอแชร์ข้อมูล
            </h3>
          </div>
          <button
            onClick={onDeny}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        {/* Verifier info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Building2 size={24} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ผู้ขอข้อมูล</p>
              <p className="font-semibold text-gray-900">{request.verifier}</p>
            </div>
          </div>
          {request.purpose && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">วัตถุประสงค์</p>
              <p className="text-sm text-gray-700 mt-1">{request.purpose}</p>
            </div>
          )}
        </div>

        {/* Requested credentials */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            ข้อมูลที่ขอแชร์:
          </p>
          <div className="space-y-2">
            {request.requestedCredentials.map((credential, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded-lg"
              >
                <CheckCircle2 size={16} className="text-green-600" />
                <span>{credential}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">🔒 ความเป็นส่วนตัว:</span>{' '}
            เฉพาะข้อมูลที่แสดงด้านบนเท่านั้นจะถูกแชร์
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onDeny}
            disabled={isProcessing}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            ปฏิเสธ
          </button>
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                กำลังแชร์...
              </>
            ) : (
              'อนุมัติและแชร์'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
