import Frame3Component from '../../imports/Frame3/Frame3';

interface NavigableFrame3Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame3({ onNavigate }: NavigableFrame3Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';

    // Back button
    if (text.includes('←')) {
      onNavigate('01');
      return;
    }

    // "ดูรายละเอียด" or any listing card tap → go to dorm detail
    const card = target.closest('[data-name="Background+Border"]');
    if (card) {
      onNavigate('dorm-detail');
      return;
    }

    // Verify Owner button
    if (text.includes('ตรวจสอบเจ้าของหอ') || text.includes('🔒')) {
      onNavigate('03');
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      <Frame3Component />
    </div>
  );
}
