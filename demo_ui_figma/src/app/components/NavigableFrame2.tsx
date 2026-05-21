import Frame2Component from '../../imports/Frame2/Frame2';

interface NavigableFrame2Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame2({ onNavigate }: NavigableFrame2Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const listingCard = target.closest('[data-name="Background+Border"]');
    if (listingCard && listingCard.textContent?.includes('ABC Mansion')) {
      onNavigate('dorm-detail');
    }
  };

  return (
    <div className="size-full cursor-pointer" onClick={handleClick}>
      <Frame2Component />
    </div>
  );
}
