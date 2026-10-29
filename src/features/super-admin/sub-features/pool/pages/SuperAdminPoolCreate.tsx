import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import createPoolMap from "@/assets/create-pool-map.jpg";
import {
  LOCATION_OPTIONS,
  LOCATION_FARMLAND_MAP,
} from "../components/SelectLocationModal";

// ── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const UndoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 7a5 5 0 1 1 .9 2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 3.5V7H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const RedoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13 7a5 5 0 1 0-.9 2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 3.5V7H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MapViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 3l4.5 1.5L10 3l5 1.5v9L10 12l-4.5 1.5L1 12V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5.5 4.5v9M10 3v9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const SatelliteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3.5 8h9M8 3.5v9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4.5 4.5c1.9 1.9 5.1 1.9 7 0M4.5 11.5c1.9-1.9 5.1-1.9 7 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);
const TargetCrosshairIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "map" | "satellite";
type Point = { x: number; y: number };
type Polygon = { id: string; points: Point[]; closed: boolean };

// ── Utility ──────────────────────────────────────────────────────────────────

function pointsToPath(points: Point[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function SuperAdminPoolCreate() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const stateData = routeLocation.state as {
    location?: string;
    farmlandId?: string;
    wholeAreaAcres?: string;
    wholeAreaSqFt?: string;
    assignedCode?: string;
  } | null;

  const initialLoc = stateData?.location || "Hyderabad, Telangana";
  const initialFarmDetails = LOCATION_FARMLAND_MAP[initialLoc] || LOCATION_FARMLAND_MAP["Hyderabad, Telangana"];

  const [viewMode, setViewMode] = useState<ViewMode>("satellite");
  const [location, setLocation] = useState(initialLoc);
  const [farmlandId, setFarmlandId] = useState(stateData?.farmlandId || initialFarmDetails.farmlandId);
  const [wholeAreaAcres, setWholeAreaAcres] = useState(stateData?.wholeAreaAcres || initialFarmDetails.wholeAreaAcres);
  const [wholeAreaSqFt, setWholeAreaSqFt] = useState(stateData?.wholeAreaSqFt || initialFarmDetails.wholeAreaSqFt);
  const [assignedCode, setAssignedCode] = useState(stateData?.assignedCode || initialFarmDetails.assignedCode);

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc);
    const details = LOCATION_FARMLAND_MAP[newLoc];
    if (details) {
      setFarmlandId(details.farmlandId);
      setAssignedCode(details.assignedCode);
      setWholeAreaAcres(details.wholeAreaAcres);
      setWholeAreaSqFt(details.wholeAreaSqFt);
    }
  };

  // ── polygon state ──
  const [createdPools, setCreatedPools] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("createdPools") || "[]");
    } catch {
      return [];
    }
  });

  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [history, setHistory] = useState<Polygon[][]>([[]]);
  const [redoStack, setRedoStack] = useState<Polygon[][]>([]);

  // zoom / pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ mouse: Point; pan: Point } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  const undo = () => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const prev = h[h.length - 2];
      setRedoStack((r) => [...r, polygons]);
      setPolygons(prev);
      return h.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const next = r[r.length - 1];
      setHistory((h) => [...h, next]);
      setPolygons(next);
      return r.slice(0, -1);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    panStart.current = { mouse: { x: e.clientX, y: e.clientY }, pan: { ...pan } };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStart.current) {
      const dx = e.clientX - panStart.current.mouse.x;
      const dy = e.clientY - panStart.current.mouse.y;
      setPan({ x: panStart.current.pan.x + dx, y: panStart.current.pan.y + dy });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    panStart.current = null;
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.25, 4));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.25, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const poolId = `POOL-${Date.now()}`;
    const newPool = {
      id: poolId,
      name: `Pool ${String.fromCharCode(65 + (createdPools.length % 26))}`,
      area: `${wholeAreaAcres} Acres`,
      wholeFarmlandArea: `${wholeAreaAcres} Acres`,
      location: location,
      farmlandId: farmlandId,
      assignedCode: assignedCode,
      active: true,
      createdAt: new Date().toISOString(),
    };
    const updatedPools = [...createdPools, newPool];
    setCreatedPools(updatedPools);
    localStorage.setItem("createdPools", JSON.stringify(updatedPools));
    navigate("/super-admin/pool-buying/created", {
      state: { farmlandId, location, wholeAreaAcres },
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans">
      <div className="px-8 py-7 pb-10 max-w-[1320px] mx-auto">
        {/* Top Header Row with Go back and User Avatar */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-white border border-[#e0e0e0] rounded-[22px] px-4 py-[7px] text-[13px] font-medium text-[#222] cursor-pointer hover:bg-gray-50 transition-colors shadow-xs"
            onClick={() => navigate("/super-admin/pool-buying")}
          >
            <ArrowLeftIcon />
            Go back
          </button>

          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-black flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Page Title */}
        <h1 className="text-[28px] font-bold text-[#111] m-0 mb-5 tracking-tight">Create Pool</h1>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ── MAP CONTAINER ── */}
          <div className="flex-1 min-w-0 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.12)] w-full">
            <div
              className="relative w-full h-[680px] overflow-hidden select-none bg-[#1c2e1c]"
              style={{
                cursor: isPanning ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Map Layer (Satellite image or Map View grid) */}
              <div
                className="absolute inset-0 w-full h-full origin-center pointer-events-none"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: isPanning ? "none" : "transform 0.1s ease-out",
                }}
              >
                {viewMode === "satellite" ? (
                  <img
                    src={createPoolMap}
                    alt="Farmland Satellite View"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-[#dcedc8] relative">
                    <svg className="w-full h-full">
                      {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                        <line
                          key={`v${x}`}
                          x1={x}
                          y1={0}
                          x2={x}
                          y2={800}
                          stroke="#cbd5e1"
                          strokeWidth={0.8}
                        />
                      ))}
                      {[80, 160, 240, 320, 400, 480, 560, 640].map((y) => (
                        <line
                          key={`h${y}`}
                          x1={0}
                          y1={y}
                          x2={900}
                          y2={y}
                          stroke="#cbd5e1"
                          strokeWidth={0.8}
                        />
                      ))}
                    </svg>
                  </div>
                )}
              </div>

              {/* SVG drawing and highlight layer */}
              <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
                <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
                  {/* Render any additional drawn polygons */}
                  {polygons.map((poly) => (
                    <g key={poly.id}>
                      {poly.closed && (
                        <path
                          d={pointsToPath(poly.points)}
                          fill="rgba(215, 68, 40, 0.45)"
                          stroke="#c84020"
                          strokeWidth={2 / zoom}
                        />
                      )}
                    </g>
                  ))}
                </g>
              </svg>

              {/* View Switcher Top-Left (Map View / Satellite) */}
              <div className="absolute top-4 left-4 bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.12)] z-10 min-w-[140px]">
                <div className="text-[10px] font-bold text-[#888] tracking-[0.8px] uppercase mb-2 px-1">
                  VIEW
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer border-none text-left ${
                      viewMode === "map"
                        ? "bg-[#ededed] text-[#111]"
                        : "bg-transparent text-[#555] hover:bg-gray-50"
                    }`}
                    onClick={() => setViewMode("map")}
                  >
                    <MapViewIcon />
                    <span>Map View</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer border-none text-left ${
                      viewMode === "satellite"
                        ? "bg-[#ededed] text-[#111]"
                        : "bg-transparent text-[#555] hover:bg-gray-50"
                    }`}
                    onClick={() => setViewMode("satellite")}
                  >
                    <SatelliteIcon />
                    <span>Satellite</span>
                  </button>
                </div>
              </div>

              {/* Location Badge Top-Right */}
              <div className="absolute top-4 right-4 bg-white rounded-2xl px-[22px] py-3.5 shadow-[0_2px_14px_rgba(0,0,0,0.12)] z-10 pointer-events-none text-left min-w-[180px]">
                <div className="text-[18px] font-black text-[#111] tracking-[-0.3px]">
                  {assignedCode}
                </div>
                <div className="text-[10px] font-bold text-[#888] tracking-[0.8px] mt-1.5 uppercase">
                  ASSIGNED ID
                </div>
                <div className="text-[14px] font-bold text-[#111] mt-0.5">
                  {farmlandId}
                </div>
              </div>

              {/* Center Bottom: Undo / Redo pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-white rounded-full px-5 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.18)] z-10 gap-3 border border-gray-100">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 bg-transparent border-none text-[13px] font-semibold text-[#222] cursor-pointer transition-opacity ${
                    history.length <= 1 ? "opacity-35 cursor-not-allowed" : "opacity-100 hover:text-black"
                  }`}
                  onClick={undo}
                  disabled={history.length <= 1}
                >
                  <UndoIcon /> Undo
                </button>
                <div className="w-[1px] h-4 bg-gray-200" />
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 bg-transparent border-none text-[13px] font-semibold text-[#222] cursor-pointer transition-opacity ${
                    redoStack.length === 0 ? "opacity-35 cursor-not-allowed" : "opacity-100 hover:text-black"
                  }`}
                  onClick={redo}
                  disabled={redoStack.length === 0}
                >
                  Redo <RedoIcon />
                </button>
              </div>

              {/* Zoom Controls Bottom-Right */}
              <div className="absolute bottom-[66px] right-4 flex flex-col bg-white rounded-xl overflow-hidden shadow-md z-10 border border-gray-100">
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center bg-transparent border-none cursor-pointer p-0 text-black hover:bg-gray-100 transition-colors"
                  onClick={handleZoomIn}
                  title="Zoom in"
                >
                  <PlusIcon />
                </button>
                <div className="h-[1px] bg-gray-200" />
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center bg-transparent border-none cursor-pointer p-0 text-black hover:bg-gray-100 transition-colors"
                  onClick={handleZoomOut}
                  title="Zoom out"
                >
                  <MinusIcon />
                </button>
              </div>

              {/* Center / Reset View Button Bottom-Right */}
              <button
                type="button"
                className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl shadow-md cursor-pointer text-black z-10 hover:bg-gray-100 transition-colors"
                onClick={handleResetView}
                title="Reset view"
              >
                <TargetCrosshairIcon />
              </button>
            </div>
          </div>

          {/* ── SIDEBAR: POOL DETAILS ── */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_6px_rgba(0,0,0,0.07)]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[16px] font-bold text-[#111]">Pool Details</span>
                <button
                  type="button"
                  className="bg-transparent border-none cursor-pointer text-[#666] p-0.5 flex items-center hover:text-black transition-colors"
                  onClick={() => navigate("/super-admin/pool-buying")}
                  title="Close"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Location */}
              <Field label="Location">
                <SelectField
                  value={location}
                  onChange={handleLocationChange}
                  options={LOCATION_OPTIONS}
                />
              </Field>

              {/* Farmland ID */}
              <Field label="Farmland ID">
                <input
                  className="w-full border-[1.5px] border-[#e8e8e8] rounded-lg py-[9px] px-3 text-[13px] font-medium text-[#222] outline-none box-border bg-gray-50 text-gray-700 cursor-not-allowed"
                  value={farmlandId}
                  readOnly
                />
              </Field>

              {/* Whole Area in Acres of Selected Farmland */}
              <Field label="Area (Auto Calculated)">
                <div className="border-[1.5px] border-[#e8e8e8] rounded-lg py-[9px] px-3 flex items-center justify-between bg-gray-50">
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold text-[#111] leading-tight">
                      {wholeAreaAcres} Acres
                    </div>
                    <div className="text-[11px] text-[#888] mt-px">
                      {wholeAreaSqFt} Sq.ft
                    </div>
                  </div>
                  <span className="text-[#888] flex items-center">
                    <LockIcon />
                  </span>
                </div>
              </Field>

              {/* Primary CTA: Continue and Secondary CTA: Cancel */}
              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  className="w-full bg-[#2a2f1e] text-white border-none rounded-lg py-[13px] text-[14px] font-semibold cursor-pointer tracking-[0.1px] hover:bg-black transition-colors shadow-sm"
                  onClick={handleContinue}
                >
                  Continue
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/super-admin/pool-buying")}
                  className="w-full bg-transparent text-[#333] border-none rounded-lg py-2 text-[14px] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small Form Helpers ────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 text-left">
      <label className="block text-[11.5px] font-medium text-[#666] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        className="w-full border-[1.5px] border-[#e8e8e8] rounded-lg py-[9px] pl-3 pr-9 text-[13px] font-medium text-[#222] outline-none appearance-none bg-white cursor-pointer box-border focus:border-[#738258] transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">
        <ChevronDownIcon />
      </span>
    </div>
  );
}
