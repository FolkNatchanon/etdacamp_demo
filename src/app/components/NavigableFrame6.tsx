import Frame6Component from '../../imports/Frame6/Frame6';

interface NavigableFrame6Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame6({ onNavigate }: NavigableFrame6Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';

    // Back button
    if (text.includes('←')) {
      onNavigate('04');
      return;
    }

    // Consent button (ยินยอม)
    if (text.includes('ยินยอม')) {
      const button = target.closest('[data-name="Background+Border"]');
      if (button && button.textContent?.includes('ยินยอม')) {
        onNavigate('09');
      }
    }

    // Reject button (ปฏิเสธ)
    if (text.includes('ปฏิเสธ')) {
      const button = target.closest('[data-name="Background+Border"]');
      if (button && button.textContent?.includes('ปฏิเสธ')) {
        onNavigate('02');
      }
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      <Frame6Component />
    </div>
  );
}
