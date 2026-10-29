import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, ChevronDown, Landmark, Target, MapPin, Check } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface CreatedPool {
  id: string;
  name: string;
  area: string;
  location: string;
  farmlandId: string;
  targetAmount: string;
  minInvestment: string;
  lockInPeriod: string;
  active: boolean;
  createdAt: string;
}

// ── Dummy seed pools ─────────────────────────────────────────────────────────
const DUMMY_POOLS: CreatedPool[] = [
  { id: "POOL-SEED-001", name: "Pool A", area: "1.00 Acres", location: "Hyderabad, Telangana", farmlandId: "GLCSOS - 045", targetAmount: "1,00,00,000", minInvestment: "50,000", lockInPeriod: "36 Months", active: true, createdAt: "2026-06-10T09:00:00.000Z" },
  { id: "POOL-SEED-002", name: "Pool B", area: "1.50 Acres", location: "Hyderabad, Telangana", farmlandId: "GLCSOS - 045", targetAmount: "1,00,00,000", minInvestment: "50,000", lockInPeriod: "36 Months", active: true, createdAt: "2026-06-11T14:30:00.000Z" },
  { id: "POOL-SEED-003", name: "Pool C", area: "0.25 Acres", location: "Hyderabad, Telangana", farmlandId: "GLCSOS - 045", targetAmount: "1,00,00,000", minInvestment: "50,000", lockInPeriod: "36 Months", active: true, createdAt: "2026-06-09T11:15:00.000Z" },
  { id: "POOL-SEED-004", name: "Pool D", area: "1.25 Acres", location: "Hyderabad, Telangana", farmlandId: "GLCSOS - 045", targetAmount: "1,00,00,000", minInvestment: "50,000", lockInPeriod: "36 Months", active: true, createdAt: "2026-06-08T08:45:00.000Z" },
  { id: "POOL-SEED-005", name: "Pool E", area: "0.75 Acres", location: "Hyderabad, Telangana", farmlandId: "GLCSOS - 045", targetAmount: "1,00,00,000", minInvestment: "50,000", lockInPeriod: "36 Months", active: true, createdAt: "2026-06-07T10:00:00.000Z" },
];

// ── Inline icons ─────────────────────────────────────────────────────────────
const PlusMapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 4v10M4 9h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
);
const MinusMapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
);
const TargetMapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.4"/><circle cx="9" cy="9" r="2" fill="white"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>
);

// ── Component ────────────────────────────────────────────────────────────────

export default function SuperAdminPoolCreated() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const [allPools, setAllPools] = useState<CreatedPool[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lockInPeriodMap, setLockInPeriodMap] = useState<Record<string, string>>({});
  const [amountMap, setAmountMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let stored: CreatedPool[] = [];
    try { stored = JSON.parse(localStorage.getItem("createdPools") || "[]"); } catch { /* */ }
    const merged = [...DUMMY_POOLS, ...stored];
    setAllPools(merged);
  }, []);

  const selected = allPools[selectedIdx] || allPools[0];
  const farmlandId = selected?.farmlandId || state?.farmlandId || "GLCSOS - 045";
  const currentAmount = (selected && amountMap[selected.id] !== undefined)
    ? amountMap[selected.id]
    : (selected?.targetAmount || "1,00,00,000");

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans box-border p-4">
      <div className="bg-white rounded-[20px] pt-6 px-7 pb-9 min-h-[calc(100vh-32px)] box-border flex flex-col">
        {/* Go back */}
        <button 
          className="inline-flex items-center gap-1.5 bg-white border border-[#e5e7eb] rounded-[22px] py-[7px] px-4 text-[13px] font-medium text-[#1f2937] cursor-pointer mb-[18px] w-fit hover:bg-gray-50 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          Go back
        </button>

        {/* Page title */}
        <h1 className="text-[24px] font-bold text-[#111] m-0 mb-[18px] tracking-tight">Preview – {farmlandId.replace(/\s+/g, "")}</h1>

        {/* ── Aerial image banner ── */}
        <div className="relative w-full h-[360px] rounded-2xl overflow-hidden mb-5 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"
            alt="Farm aerial view"
            className="w-full h-full object-cover block"
          />
          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 400" preserveAspectRatio="none">
            {/* Green plot areas */}
            <rect x="60" y="60" width="180" height="140" rx="4" fill="rgba(140,190,50,0.45)" stroke="rgba(100,150,30,0.5)" strokeWidth="1.5"/>
            <rect x="260" y="60" width="160" height="140" rx="4" fill="rgba(140,190,50,0.55)" stroke="rgba(100,150,30,0.5)" strokeWidth="1.5"/>
            <rect x="440" y="60" width="200" height="140" rx="4" fill="rgba(160,210,60,0.4)" stroke="rgba(100,150,30,0.5)" strokeWidth="1.5"/>
            <rect x="660" y="60" width="180" height="140" rx="4" fill="rgba(140,190,50,0.35)" stroke="rgba(100,150,30,0.5)" strokeWidth="1.5"/>
            <rect x="60" y="220" width="260" height="130" rx="4" fill="rgba(140,190,50,0.45)" stroke="rgba(100,150,30,0.5)" strokeWidth="1.5"/>
            <rect x="340" y="220" width="200" height="130" rx="4" fill="rgba(170,220,70,0.55)" stroke="rgba(100,150,30,0.5)" strokeWidth="1.5"/>
            <rect x="560" y="220" width="280" height="130" rx="4" fill="rgba(140,190,50,0.35)" stroke="rgba(100,150,30,0.5)" strokeWidth="1.5"/>
          </svg>
          {/* Plus markers */}
          {[
            {x:"20%",y:"25%"},{x:"38%",y:"18%"},{x:"52%",y:"22%"},{x:"68%",y:"15%"},{x:"82%",y:"25%"},
            {x:"15%",y:"50%"},{x:"35%",y:"55%"},{x:"58%",y:"48%"},{x:"75%",y:"52%"},
            {x:"25%",y:"78%"},{x:"48%",y:"75%"},{x:"65%",y:"82%"},{x:"85%",y:"75%"},
          ].map((pos, i) => (
            <span key={i} className="absolute text-white text-[20px] font-light pointer-events-none drop-shadow-md -translate-x-1/2 -translate-y-1/2" style={{ left:pos.x, top:pos.y }}>+</span>
          ))}
          {/* 1-acre label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <span className="bg-white/70 backdrop-blur-sm rounded-md py-1.5 px-4 text-[13px] font-semibold text-[#333]">1-acre</span>
          </div>
          {/* Zoom controls */}
          <div className="absolute right-3.5 bottom-3.5 flex flex-col rounded-[10px] overflow-hidden shadow-lg z-10">
            <button className="w-[38px] h-[38px] flex items-center justify-center bg-black/85 border-none cursor-pointer p-0 hover:bg-black transition-colors"><PlusMapIcon /></button>
            <button className="w-[38px] h-[38px] flex items-center justify-center bg-black/85 border-none border-t border-white/15 cursor-pointer p-0 hover:bg-black transition-colors"><MinusMapIcon /></button>
            <button className="w-[38px] h-[38px] flex items-center justify-center bg-black/85 border-none border-t border-white/15 cursor-pointer p-0 hover:bg-black transition-colors"><TargetMapIcon /></button>
          </div>
        </div>

        {/* ── Main grid: sidebar + details ── */}
        <div className="grid grid-cols-[350px_1fr] gap-5 items-start flex-1">
          {/* Left sidebar: Created Pools */}
          <div className="bg-white border border-[#eef0f2] rounded-2xl p-4">
            <div className="text-[14px] font-bold text-[#111] mb-3">Created Pools ({allPools.length})</div>
            <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
              {allPools.map((pool, idx) => {
                const isActive = selectedIdx === idx;
                return (
                  <div
                    key={pool.id}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${isActive ? "bg-[#f5faeb] border-[#8fbc2a]" : "bg-[#f9fafa] border-[#eef0f2] hover:bg-gray-50"}`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${isActive ? "bg-[#8fbc2a]" : "bg-[#d1d5db]"}`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13.5px] font-semibold truncate ${isActive ? "text-[#111]" : "text-[#333]"}`}>{pool.name}</div>
                      <div className={`text-[12px] truncate ${isActive ? "text-[#555]" : "text-[#777]"}`}>{pool.area}</div>
                    </div>
                    <ChevronRight size={16} color={isActive ? "#8fbc2a" : "#9ca3af"} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Pool Details */}
          <div className="flex flex-col gap-5 h-full">
            {selected && (
              <>
                <div className="bg-white border border-[#eef0f2] rounded-2xl p-6">
                  <h2 className="text-[18px] font-bold text-[#111] m-0 mb-5">Pool Details</h2>

                  {/* Pool Information */}
                  <div className="text-[14px] font-bold text-[#111] mb-3 pb-2 border-b border-[#f0f0f0]">Pool Information</div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <ReadonlyField label="Pool Name" value={selected.name} />
                    <ReadonlyField label="Area (Auto Calculated)" value={selected.area} />
                    <ReadonlySelect label="Location" value={selected.location} />
                  </div>
                  <div className="grid grid-cols-1 mb-5">
                    <ReadonlyField label="Assigned ID" value={selected.farmlandId} />
                  </div>

                  <div className="h-px bg-[#eef0f2] my-5" />

                  {/* Investment Information */}
                  <div className="text-[14px] font-bold text-[#111] mb-3 pb-2 border-b border-[#f0f0f0]">Investment Information</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <EditableField
                      label="Amount"
                      value={currentAmount}
                      onChange={(val) => {
                        if (selected) {
                          setAmountMap((prev) => ({ ...prev, [selected.id]: val }));
                        }
                      }}
                      placeholder="e.g. 1,00,00,000"
                    />
                    <SelectDropdown
                      label="Lock-in Period"
                      value={lockInPeriodMap[selected.id] || selected.lockInPeriod || "36 Months"}
                      onChange={(val) => {
                        if (selected) {
                          setLockInPeriodMap((prev) => ({ ...prev, [selected.id]: val }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Pool Summary strip */}
                <div className="bg-white border border-[#eef0f2] rounded-2xl p-5">
                  <div className="text-[14px] font-bold text-[#111] mb-3">Pool Summary</div>
                  <div className="grid grid-cols-3 gap-3">
                    <SummaryItem icon={<Landmark size={16} color="#6b7c45" />} label="Area" value={selected.area} />
                    <SummaryItem
                      icon={<Target size={16} color="#6b7c45" />}
                      label="Amount"
                      value={
                        currentAmount === "1,00,00,000"
                          ? "₹1 Cr"
                          : currentAmount.startsWith("₹")
                          ? currentAmount
                          : `₹${currentAmount}`
                      }
                    />
                    <SummaryItem icon={<MapPin size={16} color="#6b7c45" />} label="Location" value={selected.location} />
                  </div>
                </div>

                {/* Publish button */}
                <button
                  className="bg-[#2a2f1e] text-white border-none rounded-full py-3.5 px-0 text-[14px] font-semibold cursor-pointer tracking-wide w-[30%] mt-1 shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] transition-colors hover:bg-black self-end"
                  onClick={() => navigate("/super-admin/pool-buying/published")}
                >
                  Publish Pools  
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-[#555] uppercase tracking-wider">{label}</label>
      <div className="bg-[#f9fafa] border border-[#eef0f2] rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium text-[#222] min-h-[42px] flex items-center">{value}</div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  placeholder = "Enter amount",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-[#555] uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#f9fafa] border border-[#eef0f2] rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium text-[#222] min-h-[42px] outline-none hover:border-gray-300 focus:bg-white focus:border-[#738258] focus:ring-2 focus:ring-[#738258]/15 transition-all"
      />
    </div>
  );
}

function SelectDropdown({
  label,
  value,
  onChange,
  options = ["12 Months", "24 Months", "36 Months", "48 Months", "60 Months"],
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
      <label className="text-[11px] font-bold text-[#555] uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-[#f9fafa] border rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium text-[#222] min-h-[42px] flex items-center justify-between cursor-pointer transition-all ${
          isOpen
            ? "border-[#738258] bg-white ring-2 ring-[#738258]/15"
            : "border-[#eef0f2] hover:border-gray-300"
        }`}
      >
        <span>{value}</span>
        <ChevronDown
          size={14}
          color="#666"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Custom styled Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-[#eef0f2] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-between text-left border-none ${
                  isSelected
                    ? "bg-[#f5faeb] text-[#3e5614] font-semibold"
                    : "bg-transparent text-[#333] hover:bg-gray-50"
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check size={14} className="text-[#6b7c45]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReadonlySelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-[#555] uppercase tracking-wider">{label}</label>
      <div className="bg-[#f9fafa] border border-[#eef0f2] rounded-lg px-3.5 py-2.5 text-[13.5px] font-medium text-[#222] min-h-[20px] flex items-center justify-between cursor-default">
        <span className="flex-1">{value}</span>
        <ChevronDown size={14} color="#888" />
      </div>
    </div>
  );
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-[#f9fafa] border border-[#eef0f2] rounded-xl py-2.5 px-3">
      <div className="w-8 h-8 rounded-full bg-[#f0f4e3] flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex flex-col overflow-hidden">
        <div className="text-[11px] text-[#777] font-medium uppercase tracking-wider whitespace-nowrap">{label}</div>
        <div className="text-[13.5px] font-bold text-[#222] truncate">{value}</div>
      </div>
    </div>
  );
}
