import Frame7Component from '../../imports/Frame7/Frame7';

interface NavigableFrame7Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame7({ onNavigate }: NavigableFrame7Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';

    // Click on tenant card to view details
    if (text.includes('นาย ก.') || text.includes('น.ส. ม.') || text.includes('นาย ส.')) {
      const card = target.closest('[data-name="Background+Border"]');
      if (card && (card.textContent?.includes('ห้อง 304') || card.textContent?.includes('ห้อง 207') || card.textContent?.includes('ห้อง 412'))) {
        onNavigate('07');
      }
    }

    // Navigation tabs
    if (text.includes('ตั้งค่า')) {
      onNavigate('08');
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      <Frame7Component />
    </div>
  );
}
