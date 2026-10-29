import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, ChevronDown, Check, Sparkles, AlertCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllFarmlandsQuery } from "@/features/super-admin/api/farmland.api";

export interface GlcExclusiveLand {
  id: string | number;
  farmlandId: string;
  assignedCode: string;
  location: string;
  state: string;
  region: string;
  wholeAreaAcres: string;
  wholeAreaSqFt: string;
  valuation?: string;
  isGlcExclusive: boolean;
  coverImageUrl?: string;
}

export const BASE_GLC_EXCLUSIVE_LANDS: GlcExclusiveLand[] = [
  {
    id: "glc-045",
    farmlandId: "GLCSOS - 045",
    assignedCode: "HYDERABAD – TG",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    region: "Rangareddy",
    wholeAreaAcres: "25.00",
    wholeAreaSqFt: "10,89,000",
    valuation: "1,00,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland1.png",
  },
  {
    id: "glc-043",
    farmlandId: "GLCSOS - 043",
    assignedCode: "WARANGAL – TG",
    location: "Warangal, Telangana",
    state: "Telangana",
    region: "Hanamkonda",
    wholeAreaAcres: "32.50",
    wholeAreaSqFt: "14,15,700",
    valuation: "1,20,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland2.png",
  },
  {
    id: "glc-042",
    farmlandId: "GLCSOS - 042",
    assignedCode: "VIJAYAWADA – AP",
    location: "Vijayawada, Andhra Pradesh",
    state: "Andhra Pradesh",
    region: "Krishna",
    wholeAreaAcres: "18.00",
    wholeAreaSqFt: "7,84,080",
    valuation: "85,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland3.png",
  },
  {
    id: "glc-001",
    farmlandId: "GLCSOS - 001",
    assignedCode: "GODAVARI – AP",
    location: "East Godavari, Andhra Pradesh",
    state: "Andhra Pradesh",
    region: "East Godavari",
    wholeAreaAcres: "45.00",
    wholeAreaSqFt: "19,60,200",
    valuation: "1,80,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland4.png",
  },
  {
    id: "glc-048",
    farmlandId: "GLCSOS - 048",
    assignedCode: "BENGALURU – KA",
    location: "Bengaluru, Karnataka",
    state: "Karnataka",
    region: "Bengaluru Rural",
    wholeAreaAcres: "15.00",
    wholeAreaSqFt: "6,53,400",
    valuation: "2,00,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland1.png",
  },
  {
    id: "glc-050",
    farmlandId: "GLCSOS - 050",
    assignedCode: "PUNE – MH",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    region: "Pune",
    wholeAreaAcres: "20.00",
    wholeAreaSqFt: "8,71,200",
    valuation: "1,50,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland2.png",
  },
  {
    id: "glc-0404",
    farmlandId: "FL26080404",
    assignedCode: "HYDERABAD – TG",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    region: "Rangareddy",
    wholeAreaAcres: "1000.00",
    wholeAreaSqFt: "4,35,60,000",
    valuation: "20,00,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland3.png",
  },
  {
    id: "glc-0408",
    farmlandId: "FL26080408",
    assignedCode: "MEDCHAL – TG",
    location: "Medchal, Telangana",
    state: "Telangana",
    region: "Medchal-Malkajgiri",
    wholeAreaAcres: "10000.00",
    wholeAreaSqFt: "43,56,00,000",
    valuation: "100,00,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland4.png",
  },
  {
    id: "glc-0403",
    farmlandId: "FL26080403",
    assignedCode: "SANGAREDDY – TG",
    location: "Sangareddy, Telangana",
    state: "Telangana",
    region: "Sangareddy",
    wholeAreaAcres: "100.00",
    wholeAreaSqFt: "43,56,000",
    valuation: "10,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland1.png",
  },
  {
    id: "glc-052",
    farmlandId: "GLCSOS - 052",
    assignedCode: "CHENNAI – TN",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    region: "Chengalpattu",
    wholeAreaAcres: "22.00",
    wholeAreaSqFt: "9,58,320",
    valuation: "1,75,00,000",
    isGlcExclusive: true,
    coverImageUrl: "/super-admin/images/farmland2.png",
  },
];

export const LOCATION_OPTIONS: string[] = Array.from(
  new Set(BASE_GLC_EXCLUSIVE_LANDS.map((item) => item.location))
);

export const LOCATION_FARMLAND_MAP: Record<
  string,
  {
    farmlandId: string;
    assignedCode: string;
    wholeAreaAcres: string;
    wholeAreaSqFt: string;
  }
> = BASE_GLC_EXCLUSIVE_LANDS.reduce((acc, item) => {
  acc[item.location] = {
    farmlandId: item.farmlandId,
    assignedCode: item.assignedCode,
    wholeAreaAcres: item.wholeAreaAcres,
    wholeAreaSqFt: item.wholeAreaSqFt,
  };
  return acc;
}, {} as Record<string, { farmlandId: string; assignedCode: string; wholeAreaAcres: string; wholeAreaSqFt: string }>);

// ── Custom Dropdown Selector Component ───────────────────────────────────────

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allLabel?: string;
  align?: "left" | "right";
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  options,
  onChange,
  allLabel = "All",
  align = "left",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number }>({ top: 0 });

  const updateCoords = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    if (align === "right") {
      setCoords({
        top: rect.bottom + 6,
        right: Math.max(12, window.innerWidth - rect.right),
      });
    } else {
      setCoords({
        top: rect.bottom + 6,
        left: Math.max(12, rect.left),
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    updateCoords();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updateCoords();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, align]);

  const displayLabel = value === "All" ? allLabel : value;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!isOpen) {
            updateCoords();
          }
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-full border text-xs font-medium transition-all cursor-pointer bg-white",
          isOpen
            ? "border-[#2D3319] ring-2 ring-[#2D3319]/15 text-[var(--text-primary)]"
            : "border-gray-200 text-[var(--text-primary)] hover:border-gray-300"
        )}
      >
        <span className="truncate max-w-[110px]">{displayLabel}</span>
        <ChevronDown
          size={14}
          className={cn(
            "text-gray-400 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-[#2D3319]"
          )}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              ...(coords.right !== undefined ? { right: `${coords.right}px` } : { left: `${coords.left}px` }),
              zIndex: 999999,
            }}
            className="min-w-[170px] max-h-[260px] overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.18)] p-1.5 flex flex-col gap-0.5 custom-scrollbar animate-in fade-in zoom-in-95 duration-150"
          >
            {options.map((opt) => {
              const isSelected = opt === value;
              const itemLabel = opt === "All" ? allLabel : opt;

              return (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-between transition-colors",
                    isSelected
                      ? "bg-[#F4F9EF] text-[#2D3319] font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[var(--text-primary)]"
                  )}
                >
                  <span className="truncate">{itemLabel}</span>
                  {isSelected && <Check size={13} strokeWidth={2.5} className="text-[#2D3319] shrink-0" />}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};

// ── SelectLocationModal Component ─────────────────────────────────────────────

interface SelectLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (location: string, selectedLand?: GlcExclusiveLand) => void;
  initialLocation?: string;
  initialFarmlandId?: string;
}

export const SelectLocationModal: React.FC<SelectLocationModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  initialLocation,
  initialFarmlandId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  // Optional: pull real farmlands from API if available
  const { data: farmlandsApiData } = useGetAllFarmlandsQuery(
    { country_id: 1, limit: 50 },
    { skip: !isOpen }
  );

  // Combine base lands with any backend exclusive lands
  const allExclusiveLands: GlcExclusiveLand[] = useMemo(() => {
    const list = [...BASE_GLC_EXCLUSIVE_LANDS];
    if (farmlandsApiData?.data && Array.isArray(farmlandsApiData.data)) {
      farmlandsApiData.data
        .filter((f) => f.is_glc_exclusive === 1)
        .forEach((f, idx) => {
          if (!list.some((existing) => existing.farmlandId === f.farm_code)) {
            const acres = f.total_acres ? Number(f.total_acres).toFixed(2) : "25.00";
            const sqft = f.total_acres
              ? (Number(f.total_acres) * 43560).toLocaleString("en-IN")
              : "10,89,000";
            list.push({
              id: f.id,
              farmlandId: f.farm_code,
              assignedCode: f.farm_code,
              location: f.village_name || "Telangana",
              state: "Telangana",
              region: f.village_name || "Rangareddy",
              wholeAreaAcres: acres,
              wholeAreaSqFt: sqft,
              valuation: f.valuation ? Number(f.valuation).toLocaleString("en-IN") : undefined,
              isGlcExclusive: true,
              coverImageUrl: f.cover_image_url || `/super-admin/images/farmland${(idx % 4) + 1}.png`,
            });
          }
        });
    }
    return list;
  }, [farmlandsApiData]);

  // Selected land state
  const [selectedLandId, setSelectedLandId] = useState<string | number>(() => {
    if (initialFarmlandId) {
      const match = BASE_GLC_EXCLUSIVE_LANDS.find((l) => l.farmlandId === initialFarmlandId);
      if (match) return match.id;
    }
    if (initialLocation) {
      const match = BASE_GLC_EXCLUSIVE_LANDS.find((l) => l.location === initialLocation);
      if (match) return match.id;
    }
    return BASE_GLC_EXCLUSIVE_LANDS[0].id;
  });

  // Extract unique States
  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(allExclusiveLands.map((item) => item.state))).filter(Boolean);
    return ["All", ...states];
  }, [allExclusiveLands]);

  // Extract unique Regions (filtered by selectedState if any)
  const regionOptions = useMemo(() => {
    const relevantLands =
      selectedState === "All"
        ? allExclusiveLands
        : allExclusiveLands.filter((item) => item.state === selectedState);
    const regions = Array.from(new Set(relevantLands.map((item) => item.region))).filter(Boolean);
    return ["All", ...regions];
  }, [allExclusiveLands, selectedState]);

  // Filtered Lands
  const filteredLands = useMemo(() => {
    return allExclusiveLands.filter((land) => {
      // State filter
      if (selectedState !== "All" && land.state !== selectedState) {
        return false;
      }
      // Region filter
      if (selectedRegion !== "All" && land.region !== selectedRegion) {
        return false;
      }
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesId = land.farmlandId.toLowerCase().includes(query);
        const matchesLoc = land.location.toLowerCase().includes(query);
        const matchesRegion = land.region.toLowerCase().includes(query);
        const matchesCode = land.assignedCode.toLowerCase().includes(query);
        if (!matchesId && !matchesLoc && !matchesRegion && !matchesCode) {
          return false;
        }
      }
      return true;
    });
  }, [allExclusiveLands, selectedState, selectedRegion, searchTerm]);

  if (!isOpen) return null;

  const currentSelectedLand = allExclusiveLands.find((item) => item.id === selectedLandId);

  const handleContinueClick = () => {
    if (currentSelectedLand) {
      onContinue(currentSelectedLand.location, currentSelectedLand);
    } else if (filteredLands.length > 0) {
      onContinue(filteredLands[0].location, filteredLands[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col font-sans z-10 border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFAFA]/70 shrink-0 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-['Plus_Jakarta_Sans'] m-0">
                Select Farmland
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6EEAD] text-[#2A3125] border border-[#D5DF96]">
                <Sparkles size={11} />
                GLC Exclusive Lands
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-inter">
              Choose a farmland and location to create an investment pool
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:px-6 border-b border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Farmland ID, location, or region..."
              className="w-full bg-[#F6F7F6] border border-gray-200 rounded-full py-2 pl-9 pr-9 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-gray-400 outline-none focus:border-[#2D3319] focus:bg-white transition-all font-inter"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Custom Styled State & Region Filter Dropdowns */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Custom State Dropdown */}
            <FilterDropdown
              label="State"
              value={selectedState}
              options={stateOptions}
              allLabel="All States"
              align="left"
              onChange={(val) => {
                setSelectedState(val);
                setSelectedRegion("All");
              }}
              className="min-w-[130px]"
            />

            {/* Custom Region Dropdown */}
            <FilterDropdown
              label="Region"
              value={selectedRegion}
              options={regionOptions}
              allLabel="All Regions"
              align="right"
              onChange={(val) => setSelectedRegion(val)}
              className="min-w-[130px]"
            />
          </div>
        </div>

        {/* Farmlands Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[460px] flex-1 bg-[#F9FAF9]/50">
          {filteredLands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 font-['Plus_Jakarta_Sans']">
                No matching farmlands found
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4 font-inter">
                No farmlands match your search or filter criteria. Try clearing the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedState("All");
                  setSelectedRegion("All");
                }}
                className="px-4 py-1.5 rounded-full border border-gray-300 bg-white text-xs font-medium text-[var(--text-primary)] hover:bg-gray-50 cursor-pointer shadow-xs transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLands.map((land, idx) => {
                const isSelected = land.id === selectedLandId;
                const landImg = land.coverImageUrl || `/super-admin/images/farmland${(idx % 4) + 1}.png`;

                return (
                  <div
                    key={land.id}
                    onClick={() => setSelectedLandId(land.id)}
                    className={cn(
                      "rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between overflow-hidden bg-white group",
                      isSelected
                        ? "border-[#8E9F6A] bg-[#F9FAF5] shadow-xs"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
                    )}
                  >
                    {/* Land Image Banner */}
                    <div className="relative w-full h-32 sm:h-36 overflow-hidden bg-gray-100">
                      <img
                        src={landImg}
                        alt={land.farmlandId}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to farmland1 if image fails to load
                          (e.target as HTMLImageElement).src = "/super-admin/images/farmland1.png";
                        }}
                      />
                      
                      {/* Top-left: Glass Region Pill */}
                      <div className="absolute top-2.5 left-2.5 bg-white/50 backdrop-blur-md border border-white/60 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#191B1C] tracking-wide shadow-xs flex items-center font-inter">
                        <span>{land.region}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-3">
                      {/* Location Title & Farmland ID */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm sm:text-[15px] text-[var(--text-primary)] font-['Plus_Jakarta_Sans'] leading-snug flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#2D3319] shrink-0" />
                            {land.location}
                          </h4>

                          {/* Checkbox indicator beside location */}
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all",
                              isSelected
                                ? "bg-[#2D3319] text-white shadow-xs"
                                : "border border-gray-300 bg-white"
                            )}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>

                        <p className="text-xs text-[var(--text-muted)] font-normal mt-1 font-inter">
                          Farmland ID:{" "}
                          <span className="font-medium text-[var(--text-primary)]">
                            {land.farmlandId}
                          </span>
                        </p>
                      </div>

                      {/* Bottom Area: Only Whole Area in Acres (Square feet removed) */}
                      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-normal text-[var(--text-muted)] uppercase tracking-wider font-inter">
                          Whole Area
                        </span>
                        <span className="font-medium text-xs sm:text-sm text-[var(--text-primary)] font-['Plus_Jakarta_Sans']">
                          {land.wholeAreaAcres} Acres
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-3 rounded-b-2xl">
          <div className="text-xs text-[var(--text-muted)] truncate max-w-[50%] font-inter">
            {currentSelectedLand ? (
              <span>
                Selected:{" "}
                <strong className="text-[var(--text-primary)] font-semibold">
                  {currentSelectedLand.farmlandId}
                </strong>{" "}
                ({currentSelectedLand.location})
              </span>
            ) : (
              <span>Please select a farmland</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!currentSelectedLand}
              onClick={handleContinueClick}
              className="px-6 py-2 rounded-full bg-[#2D3319] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
