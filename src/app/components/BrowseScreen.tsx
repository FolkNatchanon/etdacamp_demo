import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Wifi,
  Wind,
  Shield,
  Car,
  Zap,
  ChevronRight,
  Building2,
  BadgeCheck,
  BedDouble,
  Bell,
} from "lucide-react";

interface BrowseScreenProps {
  onNavigate: (screen: string) => void;
}

// ─── Data ────────────────────────────────────────────────────────────────────

type GenderPolicy = "male" | "female" | "mixed";
type Filter = "all" | "near" | "budget" | "verified" | "male" | "female";

interface Dorm {
  id: string;
  name: string;
  nameTh: string;
  address: string;
  distance: string;
  priceFrom: number;
  rating: number;
  reviews: number;
  available: number;
  verified: boolean;
  tags: string[];
  gradient: string;
  amenities: { icon: React.ReactNode; label: string }[];
  badge?: string;
  genderPolicy: GenderPolicy;
}

const GENDER_CONFIG: Record<GenderPolicy, { label: string; symbol: string; cardBg: string; heroBg: string; heroText: string }> = {
  male:   { label: "หอชาย",   symbol: "♂", cardBg: "bg-blue-500/75 border-blue-400/40 text-white",  heroBg: "bg-blue-500/25 border-blue-400/40", heroText: "text-blue-200" },
  female: { label: "หอหญิง",  symbol: "♀", cardBg: "bg-rose-500/75 border-rose-400/40 text-white",  heroBg: "bg-rose-500/25 border-rose-400/40", heroText: "text-rose-200" },
  mixed:  { label: "รับทุกเพศ", symbol: "⚥", cardBg: "bg-white/20 border-white/30 text-white",       heroBg: "bg-white/10 border-white/20",        heroText: "text-white/80" },
};

const DORMS: Dorm[] = [
  {
    id: "d1",
    name: "Happy Campus Dorm",
    nameTh: "แฮปปี้ แคมปัส",
    address: "ถ.พญาไท ปทุมวัน กทม.",
    distance: "350 ม.",
    priceFrom: 3500,
    rating: 4.8,
    reviews: 142,
    available: 5,
    verified: true,
    tags: ["ใกล้ BTS", "สระว่ายน้ำ"],
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #1e40af 100%)",
    amenities: [
      { icon: <Wifi size={12} />, label: "Fiber WiFi" },
      { icon: <Wind size={12} />, label: "Air Con" },
      { icon: <Shield size={12} />, label: "Security" },
      { icon: <Car size={12} />, label: "Parking" },
    ],
    badge: "แนะนำ",
    genderPolicy: "male",
  },
  {
    id: "d2",
    name: "The Nest Residence",
    nameTh: "เดอะ เนสท์",
    address: "ถ.บรรทัดทอง ปทุมวัน กทม.",
    distance: "620 ม.",
    priceFrom: 2800,
    rating: 4.5,
    reviews: 88,
    available: 12,
    verified: true,
    tags: ["ราคาประหยัด", "ซักอบรีดฟรี"],
    gradient: "linear-gradient(135deg, #4c0519 0%, #9f1239 55%, #e11d48 100%)",
    amenities: [
      { icon: <Wifi size={12} />, label: "WiFi" },
      { icon: <Wind size={12} />, label: "Air Con" },
      { icon: <Zap size={12} />, label: "ไฟ 5฿/หน่วย" },
    ],
    genderPolicy: "female",
  },
  {
    id: "d3",
    name: "Urban Hub Living",
    nameTh: "เออร์เบิน ฮับ",
    address: "ถ.อังรีดูนังต์ สาทร กทม.",
    distance: "1.2 กม.",
    priceFrom: 4200,
    rating: 4.7,
    reviews: 201,
    available: 3,
    verified: true,
    tags: ["Co-working", "ฟิตเนส"],
    gradient: "linear-gradient(135deg, #312e81 0%, #4338ca 55%, #6366f1 100%)",
    amenities: [
      { icon: <Wifi size={12} />, label: "Fiber 1G" },
      { icon: <Wind size={12} />, label: "Air Con" },
      { icon: <Shield size={12} />, label: "CCTV" },
    ],
    badge: "เหลือน้อย",
    genderPolicy: "mixed",
  },
  {
    id: "d4",
    name: "Green Court Hostel",
    nameTh: "กรีน คอร์ท",
    address: "ถ.สีลม บางรัก กทม.",
    distance: "1.8 กม.",
    priceFrom: 2200,
    rating: 4.3,
    reviews: 54,
    available: 20,
    verified: false,
    tags: ["ราคาถูก", "ใกล้ตลาด"],
    gradient: "linear-gradient(135deg, #14532d 0%, #15803d 55%, #16a34a 100%)",
    amenities: [
      { icon: <Wifi size={12} />, label: "WiFi" },
      { icon: <Car size={12} />, label: "Parking" },
    ],
    genderPolicy: "mixed",
  },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",      label: "ทั้งหมด" },
  { id: "near",     label: "ใกล้มหาลัย" },
  { id: "budget",   label: "ราคาประหยัด" },
  { id: "verified", label: "Verified" },
  { id: "male",     label: "♂ หอชาย" },
  { id: "female",   label: "♀ หอหญิง" },
];

// ─── Components ───────────────────────────────────────────────────────────────

function GenderBadge({ policy, variant = "card" }: { policy: GenderPolicy; variant?: "card" | "hero" }) {
  const cfg = GENDER_CONFIG[policy];
  if (variant === "hero") {
    return (
      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${cfg.heroBg}`}>
        <span className={cfg.heroText} style={{ fontSize: 13 }}>{cfg.symbol}</span>
        <p className={cfg.heroText} style={{ fontSize: 11, fontWeight: 700 }}>{cfg.label}</p>
      </div>
    );
  }
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 border backdrop-blur-sm ${cfg.cardBg}`}
      style={{ fontSize: 9, fontWeight: 700 }}
    >
      {cfg.symbol} {cfg.label}
    </span>
  );
}

function DormCard({
  dorm,
  onTap,
  featured = false,
}: {
  dorm: Dorm;
  onTap: () => void;
  featured?: boolean;
}) {
  return (
    <button
      onClick={onTap}
      className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left active:scale-[0.98] transition-transform"
    >
      {/* Coloured header strip */}
      <div
        className="relative px-4 py-4"
        style={{ background: dorm.gradient, minHeight: featured ? 100 : 80 }}
      >
        {/* Badges top-right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {dorm.badge && (
            <span
              className="bg-white/20 border border-white/30 text-white rounded-full px-2 py-0.5 backdrop-blur-sm"
              style={{ fontSize: 9, fontWeight: 700 }}
            >
              {dorm.badge}
            </span>
          )}
          {dorm.verified && (
            <span
              className="flex items-center gap-1 bg-emerald-500/80 border border-emerald-400/50 text-white rounded-full px-2 py-0.5 backdrop-blur-sm"
              style={{ fontSize: 9, fontWeight: 700 }}
            >
              <BadgeCheck size={9} />
              Trust Verified
            </span>
          )}
          <GenderBadge policy={dorm.genderPolicy} />
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <p className="text-white truncate" style={{ fontSize: 15, fontWeight: 800 }}>
              {dorm.name}
            </p>
            <p className="text-white/70" style={{ fontSize: 10 }}>{dorm.nameTh}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {dorm.tags.map((t) => (
            <span
              key={t}
              className="bg-white/15 text-white border border-white/20 rounded-full px-2 py-0.5"
              style={{ fontSize: 9, fontWeight: 600 }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 pt-3 pb-3.5">
        {/* Location & distance */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={11} className="text-gray-400 shrink-0" />
          <p className="text-gray-500 flex-1 truncate" style={{ fontSize: 11 }}>
            {dorm.address}
          </p>
          <span
            className="text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 shrink-0"
            style={{ fontSize: 10, fontWeight: 600 }}
          >
            {dorm.distance}
          </span>
        </div>

        {/* Amenity pills */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {dorm.amenities.map((a, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 text-gray-600"
              style={{ fontSize: 10 }}
            >
              {a.icon}
              {a.label}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#1e40af", lineHeight: 1 }}>
              ฿{dorm.priceFrom.toLocaleString()}
            </p>
            <p className="text-gray-400" style={{ fontSize: 10 }}>ต่อเดือน</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <p className="text-gray-800" style={{ fontSize: 12, fontWeight: 700 }}>
                  {dorm.rating}
                </p>
              </div>
              <p className="text-gray-400" style={{ fontSize: 10 }}>{dorm.reviews} รีวิว</p>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-2.5 py-1.5">
              <BedDouble size={12} className="text-emerald-600" />
              <p className="text-emerald-700" style={{ fontSize: 11, fontWeight: 700 }}>
                ว่าง {dorm.available}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View detail hint */}
      <div className="border-t border-gray-50 px-4 py-2.5 flex items-center justify-between">
        <p className="text-indigo-600" style={{ fontSize: 11, fontWeight: 600 }}>ดูรายละเอียด</p>
        <ChevronRight size={14} className="text-indigo-400" />
      </div>
    </button>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function BrowseScreen({ onNavigate }: BrowseScreenProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = DORMS.filter((d) => {
    const matchesQuery =
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.nameTh.includes(query);
    const matchesFilter =
      filter === "all"      ? true
      : filter === "near"   ? parseFloat(d.distance) < 1
      : filter === "budget" ? d.priceFrom < 3000
      : filter === "verified" ? d.verified
      : filter === "male"   ? d.genderPolicy === "male"
      : filter === "female" ? d.genderPolicy === "female"
      : true;
    return matchesQuery && matchesFilter;
  });

  const handleDormTap = (dorm: Dorm) => {
    localStorage.setItem("selected_dorm_gender", dorm.genderPolicy);
    localStorage.setItem("selected_dorm_name", dorm.name);
    onNavigate("dorm-detail");
  };

  return (
    <div className="size-full flex flex-col bg-[#F5F6FA] overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 bg-white px-4 pt-10 pb-4" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-500" style={{ fontSize: 12 }}>สวัสดี, สมชาย 👋</p>
            <p className="text-gray-900" style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>
              ค้นหาหอพัก
            </p>
          </div>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center relative active:bg-gray-200">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2.5">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อหอ, ทำเล..."
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
              style={{ fontSize: 13 }}
            />
          </div>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${showFilter ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full border transition-all ${
                filter === f.id
                  ? f.id === "female"
                    ? "bg-rose-600 border-rose-600 text-white"
                    : f.id === "male"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-white border-gray-200 text-gray-600"
              }`}
              style={{ fontSize: 11, fontWeight: filter === f.id ? 700 : 500 }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Listing scroll ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-gray-500" style={{ fontSize: 12 }}>
            พบ{" "}
            <span className="text-gray-900" style={{ fontWeight: 700 }}>
              {filtered.length}
            </span>{" "}
            หอพัก
          </p>
          <button className="text-indigo-600" style={{ fontSize: 11, fontWeight: 600 }}>
            เรียงตาม: แนะนำ
          </button>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Search size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-400" style={{ fontSize: 13 }}>ไม่พบหอพักที่ตรงกัน</p>
          </div>
        )}

        {filtered.map((dorm, i) => (
          <DormCard
            key={dorm.id}
            dorm={dorm}
            featured={i === 0}
            onTap={() => handleDormTap(dorm)}
          />
        ))}

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
