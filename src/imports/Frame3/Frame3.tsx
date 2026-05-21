function Background1() {
  return (
    <div className="absolute bg-white content-stretch flex items-start left-[14px] px-[6px] py-px rounded-[2px] top-[10px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[11px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">02</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] opacity-80 py-[3px] right-[14px] top-[26px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[11px] text-white tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">Wallet · ปุ่ม Verify Owner สำคัญ</p>
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
          <p className="leading-[normal]">LISTING DETAIL</p>
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

function Container1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder1 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container1 />
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="content-stretch flex h-[140px] items-center justify-center p-px relative rounded-[2px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(134.786deg, rgb(221, 221, 221) 0%, rgb(221, 221, 221) 3.3197%, rgb(204, 204, 204) 3.3197%, rgb(204, 204, 204) 3.6517%)" }} data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[6px] text-center whitespace-nowrap">
        <p className="leading-[normal]">[ รูปหอใหญ่ ]</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[152px] items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <BackgroundBorder2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[17.7px] w-full">
        <p className="leading-[normal]">ABC Mansion</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
        <p className="leading-[normal]">📍 ซอยจุฬา 22 · สามย่าน</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[3px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
          <p className="leading-[normal]">เจ้าของหอ</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center p-px relative rounded-[18px] shrink-0 size-[36px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[11px] text-center whitespace-nowrap">
        <p className="leading-[normal]">👤</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] w-full">
        <p className="leading-[normal]">คุณสมชาย</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
        <p className="leading-[normal]">⚠ ยังไม่ได้ตรวจสอบ</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-[12px] pt-[8px] relative size-full">
        <BackgroundBorder4 />
        <Container7 />
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#333] relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-col items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center px-[15px] py-[16px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Medium','Noto_Sans_Thai:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-center text-white whitespace-nowrap">
            <p className="leading-[normal]">🔒 ตรวจสอบเจ้าของหอ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[6px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Italic','Noto_Sans_Thai:Regular',sans-serif] font-normal italic justify-center leading-[0] relative shrink-0 text-[#999] text-[8.8px] w-full">
          <p className="leading-[normal]">→ ไป screen 03 (P5)</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="content-stretch flex flex-col items-start pb-[13px] pt-[25px] px-[13px] relative size-full">
        <Container5 />
        <Container6 />
        <BackgroundBorder5 />
        <Container10 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[3px] pt-[15px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
        <p className="leading-[normal]">ราคา</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] pt-[13px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold','Noto_Sans_Thai:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[18px] w-full">
        <p className="leading-[normal]">฿7,500/เดือน</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[3px] pt-[15px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
        <p className="leading-[normal]">รายละเอียด</p>
      </div>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="h-[88px] relative rounded-[2px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(131.75deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 3.0912%, rgb(238, 238, 238) 3.0912%, rgb(238, 238, 238) 3.4776%)" }} data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-dashed inset-0 pointer-events-none rounded-[2px]" />
      <div className="content-stretch flex flex-col items-start pb-[52px] pt-[24px] px-[13px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[6.5px] whitespace-nowrap">
          <p className="leading-[normal]">[ ข้อความบรรยายหอ ]</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-auto relative w-full" data-name="Container">
      <Container3 />
      <Container4 />
      <BackgroundBorder3 />
      <Container11 />
      <Container12 />
      <Container13 />
      <BackgroundBorder6 />
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
          <Container2 />
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