import Frame10Component from '../../imports/Frame10/Frame10';

interface NavigableFrame10Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame10({ onNavigate }: NavigableFrame10Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';

    // Back button
    if (text.includes('←')) {
      onNavigate('06');
      return;
    }

    // Tier selection cards
    if (text.includes('Basic') || text.includes('Standard') || text.includes('Premium')) {
      const card = target.closest('[data-name="Background+Border"]');
      if (card) {
        // Navigate back to dashboard after selection
        setTimeout(() => onNavigate('06'), 500);
      }
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      <Frame10Component />
    </div>
  );
}
