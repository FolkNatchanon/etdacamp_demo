import Frame12Component from '../../imports/Frame12/Frame12';

interface NavigableFrame12Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame12({ onNavigate }: NavigableFrame12Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';

    // Sign with Face ID button
    if (text.includes('ลงนามด้วย Face ID') || text.includes('🆔')) {
      const button = target.closest('[data-name="Background+Border"]');
      if (button && button.textContent?.includes('Face ID')) {
        // After signing, go back to listing detail
        setTimeout(() => onNavigate('02'), 1000);
      }
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      <Frame12Component />
    </div>
  );
}
