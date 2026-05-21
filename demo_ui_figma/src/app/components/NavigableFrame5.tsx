import Frame5Component from '../../imports/Frame5/Frame5';

interface NavigableFrame5Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame5({ onNavigate }: NavigableFrame5Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';

    // Continue button (ดำเนินการต่อ →)
    if (text.includes('ดำเนินการต่อ') || (text.includes('→') && !text.includes('ไป screen'))) {
      const button = target.closest('[data-name="Background+Border"]');
      if (button && button.textContent?.includes('ดำเนินการต่อ')) {
        onNavigate('05');
      }
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      <Frame5Component />
    </div>
  );
}
