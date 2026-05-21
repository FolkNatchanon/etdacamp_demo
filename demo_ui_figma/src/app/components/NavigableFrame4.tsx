import { useEffect } from 'react';
import Frame4Component from '../../imports/Frame4/Frame4';

interface NavigableFrame4Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame4({ onNavigate }: NavigableFrame4Props) {
  // Auto-navigate to verified screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('04');
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="relative size-full">
      <Frame4Component />
    </div>
  );
}
