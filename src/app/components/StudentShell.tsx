import { useState, useEffect } from "react";
import BrowseScreen from "./BrowseScreen";
import DormPaymentPage from "./DormPaymentPage";
import MyDocumentsPage from "./MyDocumentsPage";
import SettingsPage from "./SettingsPage";
import QRScanner from "./QRScanner";
import CredentialRequestModal from "./CredentialRequestModal";
import PINVerificationModal from "./PINVerificationModal";
import { AlertCircle, X, QrCode } from "lucide-react";

export type ShellTab = "home" | "dorm" | "docs" | "settings";

interface StudentShellProps {
  onNavigate: (screen: string) => void;
  initialTab?: ShellTab;
}

// ─── Tab-bar icons (filled = active, outlined = inactive) ────────────────────

function IcHome({ active }: { active: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.182L12 3l9 7.182V21a1 1 0 01-1 1H5a1 1 0 01-1-1V10.182z"
        fill="#4f46e5"
      />
      <rect
        x="9"
        y="14"
        width="6"
        height="8"
        rx="1"
        fill="white"
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.182L12 3l9 7.182V21a1 1 0 01-1-1V10.182z" />
      <rect x="9" y="14" width="6" height="8" rx="1" />
    </svg>
  );
}

function IcDorm({ active }: { active: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="7"
        width="20"
        height="15"
        rx="1.5"
        fill="#4f46e5"
      />
      <path
        d="M7 7V5a5 5 0 0110 0v2"
        stroke="#4f46e5"
        strokeWidth="2"
      />
      <rect
        x="6"
        y="11"
        width="3"
        height="3"
        rx="0.5"
        fill="white"
      />
      <rect
        x="10.5"
        y="11"
        width="3"
        height="3"
        rx="0.5"
        fill="white"
      />
      <rect
        x="15"
        y="11"
        width="3"
        height="3"
        rx="0.5"
        fill="white"
      />
      <rect
        x="10"
        y="15"
        width="4"
        height="7"
        rx="0.5"
        fill="white"
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="15" rx="1.5" />
      <path d="M7 7V5a5 5 0 0110 0v2" />
      <rect
        x="6"
        y="11"
        width="3"
        height="3"
        rx="0.5"
        fill="#9ca3af"
        stroke="none"
      />
      <rect
        x="10.5"
        y="11"
        width="3"
        height="3"
        rx="0.5"
        fill="#9ca3af"
        stroke="none"
      />
      <rect
        x="15"
        y="11"
        width="3"
        height="3"
        rx="0.5"
        fill="#9ca3af"
        stroke="none"
      />
      <rect x="10" y="15" width="4" height="7" rx="0.5" />
    </svg>
  );
}

function IcDocs({ active }: { active: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        fill="#4f46e5"
      />
      <path
        d="M8 7.5h8M8 11.5h8M8 15.5h5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 7.5h8M8 11.5h8M8 15.5h5" />
    </svg>
  );
}

function IcSettings({ active }: { active: boolean }) {
  const c = active ? "#4f46e5" : "#9ca3af";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="3"
        fill={active ? "#4f46e5" : "none"}
        stroke={c}
        strokeWidth="1.75"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
        fill={active ? "#4f46e5" : "none"}
        stroke={c}
        strokeWidth="1.75"
      />
    </svg>
  );
}

const TABS: {
  id: ShellTab;
  label: string;
  Icon: React.FC<{ active: boolean }>;
}[] = [
  { id: "home", label: "Home", Icon: IcHome },
  { id: "dorm", label: "My Dorm", Icon: IcDorm },
  { id: "docs", label: "Documents", Icon: IcDocs },
  { id: "settings", label: "Settings", Icon: IcSettings },
];

export default function StudentShell({
  onNavigate,
  initialTab = "home",
}: StudentShellProps) {
  const [tab, setTab] = useState<ShellTab>(initialTab);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPINVerification, setShowPINVerification] = useState(false);
  const [pendingQRData, setPendingQRData] = useState<string | null>(null);
  const [credentialRequest, setCredentialRequest] = useState<{
    verifier: string;
    requestedCredentials: string[];
    purpose?: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Onboarding lock state ──────────────────────────────────────────────────
  const [isThaiIdRegistered, setIsThaiIdRegistered] = useState(
    () => !!localStorage.getItem("trustwallet_registered")
  );
  const [isStudentIdSaved, setIsStudentIdSaved] = useState(
    () => localStorage.getItem("trustwallet_student_id") === "saved"
  );

  // Poll localStorage to detect when IDs are saved
  useEffect(() => {
    const poll = () => {
      const thaiId = !!localStorage.getItem("trustwallet_registered");
      const studentId = localStorage.getItem("trustwallet_student_id") === "saved";
      setIsThaiIdRegistered(thaiId);
      setIsStudentIdSaved(studentId);
    };
    const id = setInterval(poll, 800);
    return () => clearInterval(id);
  }, []);

  // Enforce tab lock: step 2 (no Thai ID) and step 3 (no student ID) → force docs
  // step 4+ (both IDs saved, not contracted) → home is primary, allow home only via guide
  const forcedTab: ShellTab | null = !isThaiIdRegistered
    ? "docs"
    : !isStudentIdSaved
    ? "docs"
    : null;

  // Use forced tab if locked, else whatever was chosen
  const activeTab = forcedTab ?? tab;

  // Whenever the forced tab kicks in, sync local state too
  useEffect(() => {
    if (forcedTab && tab !== forcedTab) {
      setTab(forcedTab);
    }
  }, [forcedTab]);

  // Onboarding complete = both VCs saved
  const onboardingComplete = isThaiIdRegistered && isStudentIdSaved;

  // Check if should navigate to documents (from credential save)
  useEffect(() => {
    const shouldShowDocs = localStorage.getItem('trustwallet_show_documents');
    if (shouldShowDocs === 'true') {
      setTab('docs');
      localStorage.removeItem('trustwallet_show_documents');
    }
  }, []);

  const handleTabClick = (targetTab: ShellTab) => {
    // During onboarding, block all tab changes
    if (!onboardingComplete) return;
    setTab(targetTab);
  };

  const handleChildNav = (screen: string) => {
    const breakout = [
      "dorm-detail",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "00",
    ];
    if (breakout.includes(screen)) {
      onNavigate(screen);
      return;
    }
    if (screen === "01") {
      setTab("home");
    }
  };

  const handleQRScan = (data: string) => {
    setPendingQRData(data);
    setShowQRScanner(false);
    setShowPINVerification(true);
  };

  const handlePINVerified = (pin: string) => {
    setShowPINVerification(false);

    if (pendingQRData) {
      try {
        const qrData = JSON.parse(pendingQRData);
        setCredentialRequest({
          verifier: qrData.verifier || "ผู้ให้เช่าหอพัก",
          requestedCredentials: qrData.credentials || [
            "ชื่อ-นามสกุล",
            "เลขบัตรประชาชน",
            "สถานะการเป็นนักศึกษา",
          ],
          purpose: qrData.purpose || "ยืนยันตัวตนเพื่อเช่าหอพัก",
        });
      } catch (e) {
        setCredentialRequest({
          verifier: "ผู้ขอข้อมูล",
          requestedCredentials: [
            "ชื่อ-นามสกุล",
            "เลขบัตรประชาชน",
          ],
          purpose: "ตรวจสอบข้อมูลประจำตัว",
        });
      }
    }
    setPendingQRData(null);
  };

  const handlePINCancel = () => {
    setShowPINVerification(false);
    setPendingQRData(null);
  };

  const handleApproveCredential = () => {
    setCredentialRequest(null);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleDenyCredential = () => {
    setCredentialRequest(null);
  };

  const handleScanClick = () => {
    // Block QR scan during onboarding
    if (!onboardingComplete) return;
    setShowQRScanner(true);
  };

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] overflow-hidden relative">
      {/* ── Content panels ── */}
      <div className="flex-1 overflow-hidden relative">
        {TABS.map(({ id }) => (
          <div
            key={id}
            className="absolute inset-0 flex flex-col"
            style={{ display: activeTab === id ? "flex" : "none" }}
          >
            {id === "home" && (
              <BrowseScreen onNavigate={handleChildNav} />
            )}
            {id === "dorm" && (
              <DormPaymentPage onNavigate={handleChildNav} />
            )}{" "}
            {id === "docs" && (
              <MyDocumentsPage onNavigate={handleChildNav} />
            )}
            {id === "settings" && (
              <SettingsPage onNavigate={handleChildNav} />
            )}
          </div>
        ))}
      </div>

      {/* ── Tab bar with QR Scan Button ── */}
      <nav
        className="shrink-0 bg-white flex relative"
        style={{
          height: 56,
          borderTop: "1px solid #ebebeb",
          boxShadow: "0 -1px 0 rgba(0,0,0,0.04)",
        }}
      >
        {/* First two tabs */}
        {TABS.slice(0, 2).map(({ id, label, Icon }) => {
          const active = activeTab === id;
          // Lock: during onboarding, all tabs are locked except docs (or home after complete)
          const isLocked = !onboardingComplete && id !== forcedTab;
          const isHomePulse = onboardingComplete && id === "home" && activeTab === "docs";
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              disabled={isLocked}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                active
                  ? "text-[#4f46e5] font-semibold"
                  : isLocked
                  ? "text-gray-200 pointer-events-none"
                  : "text-gray-400"
              } ${isHomePulse ? "animate-pulse-glow rounded-xl" : ""}`}
            >
              <Icon active={active} />
              <span>{label}</span>
            </button>
          );
        })}

        {/* QR Scan Button (center floating) */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={handleScanClick}
            disabled={!onboardingComplete}
            className={`absolute -top-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              onboardingComplete
                ? "bg-gradient-to-br from-indigo-600 to-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95"
                : "bg-gray-200 pointer-events-none opacity-30"
            }`}
            style={{
              border: "4px solid white",
            }}
          >
            <QrCode size={28} className={onboardingComplete ? "text-white" : "text-gray-400"} />
          </button>
        </div>

        {/* Last two tabs */}
        {TABS.slice(2).map(({ id, label, Icon }) => {
          const active = activeTab === id;
          const isLocked = !onboardingComplete && id !== forcedTab;
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              disabled={isLocked}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                active
                  ? "text-[#4f46e5] font-semibold"
                  : isLocked
                  ? "text-gray-200 pointer-events-none"
                  : "text-gray-400"
              }`}
            >
              <Icon active={active} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── QR Scanner Modal ── */}
      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onScan={handleQRScan}
        />
      )}

      {/* ── PIN Verification Modal ── */}
      {showPINVerification && (
        <PINVerificationModal
          onVerify={handlePINVerified}
          onCancel={handlePINCancel}
        />
      )}

      {/* ── Credential Request Modal ── */}
      {credentialRequest && (
        <CredentialRequestModal
          request={credentialRequest}
          onApprove={handleApproveCredential}
          onDeny={handleDenyCredential}
        />
      )}

      {/* ── Success Message ── */}
      {showSuccess && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in flex items-center gap-2">
          <AlertCircle size={20} />
          <span className="font-medium">แชร์ข้อมูลสำเร็จ!</span>
        </div>
      )}
    </div>
  );
}