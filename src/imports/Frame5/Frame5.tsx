function Background1() {
  return (
    <div className="absolute bg-white content-stretch flex items-start left-[14px] px-[6px] py-px rounded-[2px] top-[10px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[10.5px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">04</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] opacity-80 py-[3px] right-[14px] top-[26px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[6.2px] text-white tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">Wallet · ตรวจสำเร็จ · หน้าสำคัญ #2</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#333] h-[54px] relative shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Background1 />
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[47.44px] not-italic text-[12px] text-white top-[17.5px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[normal]">VERIFIED ✓ ⭐</p>
        </div>
        <Container />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[18.5px] pt-[17.5px] px-[3px] relative rounded-[36px] shrink-0 size-[72px]" data-name="Border">
      <div aria-hidden="true" className="absolute border-3 border-[#333] border-solid inset-0 pointer-events-none rounded-[36px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[32px] text-center whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[4px] pt-[13px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_Thai:SemiBold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ตรวจสอบสำเร็จ</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-center py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[normal]">หอนี้เชื่อถือได้</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center pb-[16px] relative shrink-0 w-full" data-name="Container">
      <Border />
      <Container2 />
      <Container3 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[3px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
          <p className="leading-[normal]">หลักฐานที่ตรวจสอบแล้ว</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#333] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px py-[3px] relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] w-full">
        <p className="leading-[normal]">ออกใบอนุญาตโดย BMA</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <BackgroundBorder2 />
        <Container6 />
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#333] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px py-[3px] relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] w-full">
        <p className="leading-[normal]">ใบอนุญาตยังใช้ได้</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <BackgroundBorder3 />
        <Container8 />
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

function Container10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px py-[3px] relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] w-full">
        <p className="leading-[normal]">เจ้าของยืนยันตัวตน</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <BackgroundBorder4 />
        <Container10 />
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#333] content-stretch flex items-center justify-center p-px relative rounded-[2px] shrink-0 size-[14px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">✓</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px py-[3px] relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] w-full">
        <p className="leading-[normal]">ลายเซ็นถูกต้อง</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <BackgroundBorder5 />
        <Container12 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[13px] relative size-full">
        <Container4 />
        <Container5 />
        <Container7 />
        <Container9 />
        <Container11 />
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <BackgroundBorder1 />
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-[#333] relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[15px] py-[16px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Medium','Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-center text-white whitespace-nowrap">
            <p className="leading-[normal]">ดำเนินการต่อ →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="flex-[1_0_0] min-h-[47px] relative w-full" data-name="Margin">
      <div className="flex flex-col justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-end min-h-[inherit] pt-[183px] relative size-full">
          <BackgroundBorder6 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-center py-[6px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Italic','Noto_Sans_Thai:Regular',sans-serif] font-normal italic justify-center leading-[0] relative shrink-0 text-[#999] text-[8.9px] text-center whitespace-nowrap">
        <p className="leading-[normal]">→ ไป screen 05 (consent)</p>
      </div>
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
          <Margin2 />
          <Container13 />
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

export default function Frame() {
  return (
    <div className="relative size-full">
      <BackgroundBorder />
    </div>
  );
}