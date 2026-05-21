function Background1() {
  return (
    <div className="absolute bg-white content-stretch flex items-start left-[14px] px-[6px] py-px rounded-[2px] top-[10px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[11px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">01</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] opacity-80 py-[3px] right-[14px] top-[26px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[6.9px] text-white tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[normal]">Wallet · ดูหอ ไม่ต้อง login</p>
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
          <p className="leading-[normal]">BROWSE LISTINGS</p>
        </div>
        <Container />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] w-full">
        <p className="leading-[normal]">สวัสดี</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] pt-[5px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold','Noto_Sans_Thai:SemiBold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[18px] w-full">
        <p className="leading-[normal]">ค้นหาหอที่ใช่</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container2 />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="h-[36px] relative rounded-[2px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(133.561deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 3.5136%, rgb(238, 238, 238) 3.5136%, rgb(238, 238, 238) 3.9528%)" }} data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-dashed inset-0 pointer-events-none rounded-[2px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[10.5px] pt-[11.5px] px-[13px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[7.7px] whitespace-nowrap">
            <p className="leading-[normal]">🔍 ค้นหา...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#333] content-stretch flex flex-col items-start px-[9px] py-[6px] relative rounded-[100px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#333] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[normal]">ทั้งหมด</p>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[9px] py-[6px] relative rounded-[100px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#666] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[10px] whitespace-nowrap">
        <p className="leading-[normal]">จุฬาฯ</p>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[9px] py-[6px] relative rounded-[100px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#666] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[10px] whitespace-nowrap">
        <p className="leading-[normal]">เกษตร</p>
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[9px] py-[6px] relative rounded-[100px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#666] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[10px] whitespace-nowrap">
        <p className="leading-[normal]">มหิดล</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-auto relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder2 />
      <BackgroundBorder3 />
      <BackgroundBorder4 />
      <BackgroundBorder5 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] pt-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container3 />
    </div>
  );
}

function BackgroundBorder7() {
  return (
    <div className="h-[110px] relative rounded-[2px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(134.674deg, rgb(221, 221, 221) 0%, rgb(221, 221, 221) 3.5894%, rgb(204, 204, 204) 3.5894%, rgb(204, 204, 204) 3.9483%)" }} data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[6.4px] text-center whitespace-nowrap">
          <p className="leading-[normal]">[ รูปหอ ]</p>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[12.6px] w-full">
        <p className="leading-[normal]">ABC Mansion</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[6.5px] w-full">
        <p className="leading-[normal]">📍 ใกล้จุฬาฯ 400 ม.</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">฿7,500/เดือน</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[2px] pt-px relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">★ 4.8</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[10px] relative size-full">
        <Container6 />
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-px relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <BackgroundBorder7 />
      <Container5 />
    </div>
  );
}

function BackgroundBorder9() {
  return (
    <div className="h-[110px] relative rounded-[2px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(134.674deg, rgb(221, 221, 221) 0%, rgb(221, 221, 221) 3.5894%, rgb(204, 204, 204) 3.5894%, rgb(204, 204, 204) 3.9483%)" }} data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[6.4px] text-center whitespace-nowrap">
          <p className="leading-[normal]">[ รูปหอ ]</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] w-full">
        <p className="leading-[normal]">บ้านสบาย</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[6.5px] w-full">
        <p className="leading-[normal]">📍 ใกล้จุฬาฯ 600 ม.</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular','Noto_Sans_Thai:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#222] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">฿8,900/เดือน</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[2px] pt-px relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[11px] whitespace-nowrap">
        <p className="leading-[normal]">★ 4.9</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[10px] relative size-full">
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function BackgroundBorder8() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-px relative rounded-[2px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#999] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <BackgroundBorder9 />
      <Container11 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px overflow-auto relative w-full" data-name="Container">
      <BackgroundBorder6 />
      <BackgroundBorder8 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#fafafa] h-[640px] relative shrink-0 w-full" data-name="Background">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[16px] relative size-full">
          <Container1 />
          <Margin />
          <BackgroundBorder1 />
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

export default function Frame() {
  return (
    <div className="relative size-full">
      <BackgroundBorder />
    </div>
  );
}