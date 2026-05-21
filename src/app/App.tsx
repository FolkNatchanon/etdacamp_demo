'use client';

import { useState } from 'react';
import PortalLanding from './components/PortalLanding';
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
import DemoTourGuide from './components/DemoTourGuide';
import { 
  ArrowLeft, 
  Smartphone, 
  Monitor, 
  Home, 
  RefreshCw, 
  ShieldCheck, 
  Power 
} from 'lucide-react';

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
        return <PortalLanding onNavigate={s => navigate(s)} />;

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
        return <NavigableFrame12 onNavigate={(screen, tab) => navigate(screen, tab)} />;
      case 'dorm-detail':
        return <DormDetailPage   onNavigate={s => navigate(s)} />;

      default:
        return <PortalLanding onNavigate={s => navigate(s)} />;
    }
  };

  const screenTitles: Record<string, string> = {
    '00': 'Role Selection',
    '01': 'Student Wallet',
    '02': 'Listing Detail',
    '03': 'P5 Verification',
    '04': 'Verified Status',
    '05': 'Consent Screen',
    '06': 'Landlord Thai ID',
    'landlord-wallet': 'Landlord Wallet',
    'landlord': 'Landlord Console Dashboard',
    '07': 'Tenant Detail',
    '08': 'Verification Tier',
    '09': 'e-Contract Dual Sign',
    'dorm-detail': 'Dormitory Detail',
  };

  const isPortal = currentScreen === '00';
  
  // Mobile wallets flow (Student Wallet + Landlord Wallet flows)
  const isMobileWallet = [
    '01', '02', '03', '04', '05', '08', '09', 'dorm-detail', // Student Wallet flow
    '06', 'landlord-wallet' // Landlord Wallet flow
  ].includes(currentScreen);

  // Desktop consoles flow (Landlord Console main pages)
  const isDesktopConsole = [
    'landlord', '07'
  ].includes(currentScreen);

  // 1. Portal Page - Full-screen responsive PortalLanding
  const renderLayout = () => {
    if (isPortal) {
      return (
        <div className="w-full min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 relative overflow-hidden select-none animate-fade-in">
          {/* Decorative background gradients to keep Portal Landing premium */}
          <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col justify-between">
            {renderScreen()}
          </div>
        </div>
      );
    }

    // 2. Mobile Wallet Screen Wrapper - A clean responsive card container on desktop, full-screen on mobile
    if (isMobileWallet) {
      return (
        <div className="w-full h-[100dvh] md:min-h-screen flex items-center justify-center bg-[#F5F6FA] select-none relative">
          {/* Clean responsive container - Card layout on desktop, full screen on mobile */}
          <div className="w-full h-full md:h-[800px] md:max-h-[90vh] md:max-w-md bg-white md:rounded-[24px] md:shadow-[0_10px_40px_rgba(0,0,0,0.06)] md:border md:border-slate-200/80 overflow-hidden relative flex flex-col z-10 transition-all duration-350">
            <div className="flex-1 overflow-hidden relative bg-white flex flex-col">
              {renderScreen()}
            </div>
          </div>
        </div>
      );
    }

    // 3. Desktop Console Dashboard Screen Wrapper - Full-screen dashboard app
    if (isDesktopConsole) {
      return (
        <div className="w-full h-screen flex flex-col bg-[#F8F9FC] text-slate-950 overflow-hidden">
          {renderScreen()}
        </div>
      );
    }

    // Fallback
    return (
      <div className="w-full min-h-screen flex flex-col bg-[#F8F9FC] text-slate-950">
        {renderScreen()}
      </div>
    );
  };

  return (
    <>
      {renderLayout()}
      <DemoTourGuide
        currentScreen={currentScreen}
        shellTab={shellTab}
        onNavigate={(screen, tab) => navigate(screen, tab)}
      />
    </>
  );
}
