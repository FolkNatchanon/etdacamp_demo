import { useState } from 'react';
import NavigableFrame1 from './components/NavigableFrame1';
import StudentShell from './components/StudentShell';
import NavigableFrame3 from './components/NavigableFrame3';
import NavigableFrame4 from './components/NavigableFrame4';
import NavigableFrame5 from './components/NavigableFrame5';
import NavigableFrame6 from './components/NavigableFrame6';
import LandlordDashboard from './components/LandlordDashboard';
import LandlordThaiIDWallet from './components/LandlordThaiIDWallet';
import LandlordWallet from './components/LandlordWallet';
import TenantDetailPage from './components/TenantDetailPage';
import NavigableFrame10 from './components/NavigableFrame10';
import NavigableFrame12 from './components/NavigableFrame12';
import DormDetailPage from './components/DormDetailPage';
import type { ShellTab } from './components/StudentShell';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('00');
  const [shellTab, setShellTab] = useState<ShellTab>('home');

  const navigate = (screen: string, tab?: ShellTab) => {
    if (tab) setShellTab(tab);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case '00':
        return <NavigableFrame1 onNavigate={s => navigate(s)} />;

      // '01' is now the student shell (browse + dorm + docs + settings)
      case '01':
        return <StudentShell onNavigate={s => navigate(s)} initialTab={shellTab} />;

      // Full-screen flows that break out of the shell
      case '02':
        return <NavigableFrame3  onNavigate={s => navigate(s)} />;
      case '03':
        return <NavigableFrame4  onNavigate={s => navigate(s)} />;
      case '04':
        return <NavigableFrame5  onNavigate={s => navigate(s)} />;
      case '05':
        return <NavigableFrame6  onNavigate={s => navigate(s)} />;
      case '06':
        return <LandlordThaiIDWallet onNavigate={s => navigate(s)} />;
      case 'landlord-wallet':
        return <LandlordWallet onNavigate={s => navigate(s)} />;
      case 'landlord':
        return <LandlordDashboard onNavigate={s => navigate(s)} />;
      case '07':
        return <TenantDetailPage onNavigate={s => navigate(s)} />;
      case '08':
        return <NavigableFrame10 onNavigate={s => navigate(s)} />;
      case '09':
        return <NavigableFrame12 onNavigate={s => navigate(s)} />;
      case 'dorm-detail':
        return <DormDetailPage   onNavigate={s => navigate(s)} />;

      default:
        return <NavigableFrame1 onNavigate={s => navigate(s)} />;
    }
  };

  const screenTitles: Record<string, string> = {
    '00': 'Role Selection',
    '01': 'Student Wallet',
    '02': 'Listing Detail',
    '03': 'P5 Verification',
    '04': 'Verified',
    '05': 'Consent',
    '06': 'Landlord Thai ID',
    'landlord-wallet': 'Landlord Wallet',
    'landlord': 'Landlord Dashboard',
    '07': 'Tenant Detail',
    '08': 'Verification Tier',
    '09': 'e-Contract Dual Sign',
    'dorm-detail': 'Dormitory Detail',
  };

  return (
    <div className="size-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Trust Rental Platform</h1>
        <p className="text-sm text-gray-600">
          Screen {currentScreen}: {screenTitles[currentScreen] ?? currentScreen}
        </p>
      </div>
      <div className="w-[326px] h-[696px] shadow-2xl rounded-lg overflow-hidden relative">
        {renderScreen()}
      </div>
      <button
        onClick={() => navigate('00')}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        ← Reset to Start
      </button>
    </div>
  );
}
