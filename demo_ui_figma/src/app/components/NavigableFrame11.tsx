import Frame11Component from '../../imports/Frame11/Frame11';

interface NavigableFrame11Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame11({ onNavigate }: NavigableFrame11Props) {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const text = target.textContent || '';

    // Back button
    if (text.includes('←')) {
      onNavigate('06');
      return;
    }

    // Payment buttons at the bottom
    if (text.includes('บันทึกชำระ') || text.includes('flag ค้าง')) {
      // Stay on same screen for now
      return;
    }
  };

  return (
    <div className="relative size-full cursor-pointer" onClick={handleClick}>
      <Frame11Component />
    </div>
  );
}
