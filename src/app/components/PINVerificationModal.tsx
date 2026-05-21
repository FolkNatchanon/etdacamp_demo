import { useState } from 'react';
import { Shield, X } from 'lucide-react';

interface PINVerificationModalProps {
  onVerify: (pin: string) => void;
  onCancel: () => void;
}

export default function PINVerificationModal({
  onVerify,
  onCancel,
}: PINVerificationModalProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(false);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto verify when all 6 digits are entered
    if (index === 5 && value) {
      const fullPin = newPin.join('');
      verifyPin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyPin = (fullPin: string) => {
    // Mock verification - accept any 6-digit PIN
    if (fullPin.length === 6) {
      onVerify(fullPin);
    } else {
      setError(true);
      setPin(['', '', '', '', '', '']);
      const firstInput = document.getElementById('pin-0');
      firstInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-indigo-600">
            <Shield size={24} />
            <h3 className="font-bold text-lg text-gray-900">
              ยืนยันตัวตนด้วย PIN
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600">
          กรุณาใส่รหัส PIN 6 หลักเพื่อยืนยันการแชร์ข้อมูล
        </p>

        {/* PIN Input */}
        <div className="flex justify-center gap-2">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-red-500 bg-red-50'
                  : digit
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-200'
              }`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 text-center animate-shake">
            รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
          </p>
        )}

        {/* Auto-fill Button */}
        <button
          type="button"
          onClick={() => verifyPin("123456")}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-bold transition-all text-sm animate-pulse-glow flex items-center justify-center gap-2"
        >
          ⚡ ยืนยันอัตโนมัติ (123456)
        </button>

        {/* Help text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 <span className="font-semibold">สำหรับการทดสอบ:</span> ใส่รหัส PIN 6 หลักใดก็ได้ หรือกดปุ่มยืนยันอัตโนมัติ
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
