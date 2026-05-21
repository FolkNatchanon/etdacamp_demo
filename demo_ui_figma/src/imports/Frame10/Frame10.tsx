function Background1() {
  return (
    <div className="absolute bg-white content-stretch flex items-start left-[14px] px-[6px] py-px rounded-[2px] top-[10px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[10.7px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">08</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] opacity-80 right-[14px] top-[26px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10.5px] text-white tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">Console · Basic / Standard / Premium</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#333] h-[48px] relative shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Background1 />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[47.44px] not-italic text-[12px] text-white top-[17.5px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[normal]">VERIFICATION TIER</p>
        </div>
        <Container />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center px-[11px] py-[7px] relative rounded-[2px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[normal]">←</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">ระดับการตรวจสอบ</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder1 />
      <Container2 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
        <p className="leading-[normal]">เลือกข้อมูลที่ต้องการให้ผู้เช่าแชร์</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container3 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">Basic</p>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[9px] py-[6px] relative rounded-[100px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#666] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[10px] whitespace-nowrap">
        <p className="leading-[normal]">฿299/เดือน</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container6 />
        <BackgroundBorder3 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[3px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
          <p className="leading-[normal]">โฮสเทล · ระยะสั้น</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#333] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">PID VC</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <BackgroundBorder4 />
        <Container9 />
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[13px] relative size-full">
        <Container5 />
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">Standard ● เลือกอยู่</p>
      </div>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-[#333] content-stretch flex flex-col items-start px-[9px] py-[6px] relative rounded-[100px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[normal]">฿599/เดือน</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container11 />
        <BackgroundBorder6 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[3px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
          <p className="leading-[normal]">หอใกล้ ม.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder7() {
  return (
    <div className="bg-[#333] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">PID VC</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder7 />
      <Container15 />
    </div>
  );
}

function BackgroundBorder8() {
  return (
    <div className="bg-[#333] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[10.8px] whitespace-nowrap">
        <p className="leading-[normal]">Student VC</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder8 />
      <Container17 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container14 />
        <Container16 />
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#f5f5f5] relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-3 border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[15px] relative size-full">
        <Container10 />
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">Premium</p>
      </div>
    </div>
  );
}

function BackgroundBorder10() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[9px] py-[6px] relative rounded-[100px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#666] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[10px] whitespace-nowrap">
        <p className="leading-[normal]">฿999/เดือน</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container19 />
        <BackgroundBorder10 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[3px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
          <p className="leading-[normal]">หอพรีเมียม · ต้องการประวัติชำระ</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder11() {
  return (
    <div className="bg-[#333] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[10.5px] whitespace-nowrap">
        <p className="leading-[normal]">PID + Student + Payment History</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <BackgroundBorder11 />
        <Container22 />
      </div>
    </div>
  );
}

function BackgroundBorder9() {
  return (
    <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[13px] relative size-full">
        <Container18 />
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px overflow-auto relative w-full" data-name="Container">
      <BackgroundBorder2 />
      <BackgroundBorder5 />
      <BackgroundBorder9 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#fafafa] h-[640px] relative shrink-0 w-full" data-name="Background">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[16px] relative size-full">
          <Margin />
          <Margin1 />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="absolute bg-white inset-0 rounded-[4px]" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <Background />
        <Background2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#333] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[686px] left-0 top-0 w-[326px]">
      <BackgroundBorder />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="relative size-full">
      <Frame />
    </div>
  );
}