import { useState } from 'react';
import { X, ScanLine } from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

export default function QRScanner({ onClose, onScan }: QRScannerProps) {
  const [scanning, setScanning] = useState(true);

  const handleMockScan = () => {
    // Simulate scanning animation
    setScanning(false);

    // Mock QR data from verifier
    setTimeout(() => {
      const mockQRData = JSON.stringify({
        verifier: "ผู้ให้เช่าหอพัก ABC",
        credentials: ["ชื่อ-นามสกุล", "เลขบัตรประชาชน", "สถานะการเป็นนักศึกษา"],
        purpose: "ยืนยันตัวตนเพื่อเช่าหอพัก"
      });
      onScan(mockQRData);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 p-4 flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">สแกน QR เพื่อแชร์ข้อมูล</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 p-2"
        >
          <X size={24} />
        </button>
      </div>

      {/* Mock Scanner area */}
      <div className="mt-20 mb-8 flex flex-col items-center gap-8">
        {/* Scanner viewfinder */}
        <div className="relative w-64 h-64 border-4 border-white/30 rounded-2xl overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />

          {/* Scanning line animation */}
          {scanning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan-line" />
          )}

          {/* Mock QR code icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ScanLine size={64} className="text-white/40" />
          </div>
        </div>

        {/* Scan button */}
        {scanning && (
          <button
            onClick={handleMockScan}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            กดเพื่อจำลองการสแกน
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-white px-6 max-w-sm">
        {scanning ? (
          <>
            <p className="text-sm mb-2">วาง QR Code ภายในกรอบ</p>
            <p className="text-xs text-gray-400">
              ผู้ขอข้อมูล (Verifier) จะได้รับข้อมูลที่คุณยินยอมแชร์เท่านั้น
            </p>
          </>
        ) : (
          <p className="text-sm text-green-400">กำลังอ่าน QR Code...</p>
        )}
      </div>

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
