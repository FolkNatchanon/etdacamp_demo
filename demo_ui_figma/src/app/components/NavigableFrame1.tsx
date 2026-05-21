import Frame1Component from '../../imports/Frame1/Frame1';

interface NavigableFrame1Props {
  onNavigate: (screen: string) => void;
}

export default function NavigableFrame1({ onNavigate }: NavigableFrame1Props) {
  return (
    <div className="relative size-full" onClick={(e) => {
      const target = e.target as HTMLElement;
      const text = target.textContent || '';

      // Student/Tenant button (→ Trust Wallet screen 01)
      if (text.includes('นักศึกษา') || text.includes('ผู้เช่า') || text.includes('หา / เช่าหอ')) {
        const button = target.closest('[data-name="Background+Border"]');
        if (button && button.textContent?.includes('นักศึกษา')) {
          onNavigate('01');
        }
      }

      // Owner button (→ Trust Console screen 06)
      if (text.includes('เจ้าของหอ') || text.includes('จัดการห้องเช่า')) {
        const button = target.closest('[data-name="Background+Border"]');
        if (button && button.textContent?.includes('เจ้าของหอ')) {
          onNavigate('06');
        }
      }
    }}>
      <Frame1Component />
    </div>
  );
}
