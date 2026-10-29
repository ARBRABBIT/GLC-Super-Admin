import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import UploadGoBack from '@/features/super-admin/sub-features/upload-docs/components/UploadGoBack';
import { ChevronDown } from "lucide-react";
import maplibregl from "maplibre-gl";
import { useGetAllGeoMasterDataQuery, useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useSubmitNewFarmLandMutation } from '@/features/super-admin/api/farmland.api';
import { useSubmitFarmlandMutation } from '@/features/super-admin/api/farmlandAction.api';
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/store/authSlice";

export const CHILD_COLORS_LIST = [
  { name: "green", hex: "#22C55E", stroke: "#15803D", labelBg: "#15803D" },
  { name: "blue", hex: "#3B82F6", stroke: "#1D4ED8", labelBg: "#1D4ED8" },
  { name: "yellow", hex: "#EAB308", stroke: "#CA8A04", labelBg: "#CA8A04" },
  { name: "red", hex: "#EF4444", stroke: "#B91C1C", labelBg: "#B91C1C" },
  { name: "purple", hex: "#A855F7", stroke: "#7E22CE", labelBg: "#7E22CE" },
  { name: "cyan", hex: "#06B6D4", stroke: "#0E7490", labelBg: "#0E7490" },
];

export const calculateArea = (coordinates: { lat: number; lng: number }[]) => {
  if (!coordinates || coordinates.length < 3) return "0.00";
  let area = 0;
  const numCoords = coordinates.length;
  const latMid = coordinates[0].lat * (Math.PI / 180);
  const mPerLat = 111132.92;
  const mPerLng = 111132.92 * Math.cos(latMid);
  const points = coordinates.map((c) => ({
    x: c.lng * mPerLng,
    y: c.lat * mPerLat,
  }));
  for (let i = 0; i < numCoords; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % numCoords];
    area += p1.x * p2.y - p2.x * p1.y;
  }
  const areaSqMeters = Math.abs(area) / 2;
  const areaAcres = areaSqMeters / 4046.85642;
  return areaAcres.toFixed(2);
};

export interface ChildQuadrant {
  childId: number;
  parentId: number;
  position: "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT";
  label: string;
  coordinates: number[][];
}

export const lerpCoord = (
  pA: { lat: number; lng: number },
  pB: { lat: number; lng: number },
  t: number
): { lat: number; lng: number } => {
  return {
    lng: pA.lng + (pB.lng - pA.lng) * t,
    lat: pA.lat + (pB.lat - pA.lat) * t,
  };
};

export const bilinearInterpolate = (
  v0: { lat: number; lng: number },
  v1: { lat: number; lng: number },
  v2: { lat: number; lng: number },
  v3: { lat: number; lng: number },
  u: number,
  v: number
): { lat: number; lng: number } => {
  const top = lerpCoord(v0, v1, u);
  const bottom = lerpCoord(v3, v2, u);
  return lerpCoord(top, bottom, v);
};

export const divideParentLand = (
  pins: { lat: number; lng: number }[],
  config: { count?: number; splitStyle?: "grid" | "vertical" | "horizontal"; startPinIndex?: number } = {}
) => {
  if (pins.length < 3) return [];

  const count = Math.max(1, config.count || 4);
  const splitStyle =
    config.splitStyle ||
    (count === 4 || count === 6 || count === 8 || count === 9 ? "grid" : "vertical");
  const startIdx = (config.startPinIndex ?? 0) % pins.length;

  const orderedPins = [...pins.slice(startIdx), ...pins.slice(0, startIdx)];

  if (orderedPins.length === 4) {
    const [v0, v1, v2, v3] = orderedPins;
    const lands: any[] = [];

    if (splitStyle === "grid") {
      let rows = 2;
      let cols = 2;
      if (count === 1) { rows = 1; cols = 1; }
      else if (count === 2) { rows = 1; cols = 2; }
      else if (count === 3) { rows = 1; cols = 3; }
      else if (count === 4) { rows = 2; cols = 2; }
      else if (count === 6) { rows = 2; cols = 3; }
      else if (count === 8) { rows = 2; cols = 4; }
      else if (count === 9) { rows = 3; cols = 3; }
      else {
        cols = Math.ceil(Math.sqrt(count));
        rows = Math.ceil(count / cols);
      }

      let childIdx = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (childIdx > count) break;
          const u0 = c / cols;
          const u1 = (c + 1) / cols;
          const v0_val = r / rows;
          const v1_val = (r + 1) / rows;

          const pTopLeft = bilinearInterpolate(v0, v1, v2, v3, u0, v0_val);
          const pTopRight = bilinearInterpolate(v0, v1, v2, v3, u1, v0_val);
          const pBottomRight = bilinearInterpolate(v0, v1, v2, v3, u1, v1_val);
          const pBottomLeft = bilinearInterpolate(v0, v1, v2, v3, u0, v1_val);

          const colorObj = CHILD_COLORS_LIST[(childIdx - 1) % CHILD_COLORS_LIST.length];
          lands.push({
            id: childIdx,
            label: `Child Land ${childIdx}`,
            color: colorObj.name,
            pins: [pTopLeft, pTopRight, pBottomRight, pBottomLeft],
          });
          childIdx++;
        }
      }
      return lands;
    } else if (splitStyle === "vertical") {
      for (let i = 0; i < count; i++) {
        const u0 = i / count;
        const u1 = (i + 1) / count;

        const pTop0 = bilinearInterpolate(v0, v1, v2, v3, u0, 0);
        const pTop1 = bilinearInterpolate(v0, v1, v2, v3, u1, 0);
        const pBottom1 = bilinearInterpolate(v0, v1, v2, v3, u1, 1);
        const pBottom0 = bilinearInterpolate(v0, v1, v2, v3, u0, 1);

        const colorObj = CHILD_COLORS_LIST[i % CHILD_COLORS_LIST.length];
        lands.push({
          id: i + 1,
          label: `Child Land ${i + 1}`,
          color: colorObj.name,
          pins: [pTop0, pTop1, pBottom1, pBottom0],
        });
      }
      return lands;
    } else {
      for (let i = 0; i < count; i++) {
        const v0_val = i / count;
        const v1_val = (i + 1) / count;

        const pLeft0 = bilinearInterpolate(v0, v1, v2, v3, 0, v0_val);
        const pRight0 = bilinearInterpolate(v0, v1, v2, v3, 1, v0_val);
        const pRight1 = bilinearInterpolate(v0, v1, v2, v3, 1, v1_val);
        const pLeft1 = bilinearInterpolate(v0, v1, v2, v3, 0, v1_val);

        const colorObj = CHILD_COLORS_LIST[i % CHILD_COLORS_LIST.length];
        lands.push({
          id: i + 1,
          label: `Child Land ${i + 1}`,
          color: colorObj.name,
          pins: [pLeft0, pRight0, pRight1, pLeft1],
        });
      }
      return lands;
    }
  }

  if (orderedPins.length === 3) {
    const [v0, v1, v2] = orderedPins;
    const lands: any[] = [];
    for (let i = 0; i < count; i++) {
      const b0 = lerpCoord(v1, v2, i / count);
      const b1 = lerpCoord(v1, v2, (i + 1) / count);
      const colorObj = CHILD_COLORS_LIST[i % CHILD_COLORS_LIST.length];
      lands.push({
        id: i + 1,
        label: `Child Land ${i + 1}`,
        color: colorObj.name,
        pins: [v0, b0, b1],
      });
    }
    return lands;
  }

  return [];
};

export const calculateChildQuadrants = (pins: { lat: number; lng: number }[]): ChildQuadrant[] => {
  if (pins.length < 3) return [];
  const lands = divideParentLand(pins, { count: 4, splitStyle: "grid", startPinIndex: 0 });
  const positions: Array<"TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT"> = [
    "TOP_LEFT",
    "TOP_RIGHT",
    "BOTTOM_LEFT",
    "BOTTOM_RIGHT",
  ];
  return lands.map((land, idx) => ({
    childId: land.id,
    parentId: 1,
    position: positions[idx] || "TOP_LEFT",
    label: `Child ${land.id}`,
    coordinates: land.pins.map((p: any) => [p.lng, p.lat]),
  }));
};

export const createDefaultChildLands = (parentPins: { lat: number; lng: number }[], count = 4) => {
  return divideParentLand(parentPins, {
    count,
    splitStyle: count === 4 ? "grid" : "vertical",
    startPinIndex: 0,
  });
};

// ── Custom Dropdown Component ──
const CustomSelect: React.FC<{
  value: { id: number; label: string } | null;
  onChange: (val: { id: number; label: string } | null) => void;
  options: { id: number; label: string }[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-full h-full flex items-center justify-between px-3.5"
      >
        <span className={`font-sans font-normal text-sm ${value ? 'text-[#191C1E]' : 'text-gray-400'}`}>
          {value ? value.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-[#363434]/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full max-h-[240px] overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 py-2 custom-scrollbar">
          {options.length === 0 ? (
            <div className="px-5 py-3 text-sm text-gray-400 font-sans italic">No options available</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-5 py-2.5 cursor-pointer text-sm transition-colors flex items-center gap-2 ${
                  value?.id === opt.id 
                    ? "bg-[#F4F9FF] text-[#3B82F6] font-medium" 
                    : "text-[#191C1E] hover:bg-[#F8F9FA] hover:text-[#3B82F6]"
                }`}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ── Map Preview Component ──
const LandMapPreview: React.FC<{
  pins: { lat: number; lng: number }[];
  childLands?: any[];
  isConfirmed: boolean;
  onOpenMap: () => void;
}> = ({ pins, childLands = [], isConfirmed, onOpenMap }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] =
      pins.length > 0 ? [pins[0].lng, pins[0].lat] : [77.209, 28.6139];

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: [
              "https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              "https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              "https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            ],
            tileSize: 256,
            maxzoom: 20,
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#121820",
            },
          },
          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite-tiles",
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      center,
      zoom: pins.length > 0 ? 16 : 14,
      maxZoom: 19,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // Bulletproof resize observer to guarantee the map fills the flex container
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    map.on("load", () => {
      if (pins.length >= 3) {
        const closed = [...pins.map((p) => [p.lng, p.lat]), [pins[0].lng, pins[0].lat]];
        map.addSource("preview-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [closed],
                },
                properties: {},
              },
              {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: closed,
                },
                properties: {},
              },
            ],
          },
        });

        map.addLayer({
          id: "preview-fill",
          type: "fill",
          source: "preview-source",
          filter: ["==", "$type", "Polygon"],
          paint: {
            "fill-color": "rgba(100, 200, 100, 0.45)",
            "fill-outline-color": "#FBBF24",
          },
        });

        map.addLayer({
          id: "preview-stroke",
          type: "line",
          source: "preview-source",
          paint: {
            "line-color": "#FBBF24",
            "line-width": 3,
          },
        });

        // Fit bounds around pins
        const bounds = new maplibregl.LngLatBounds();
        pins.forEach((p) => bounds.extend([p.lng, p.lat]));
        map.fitBounds(bounds, { padding: 30, duration: 0 });
        // Render saved child lands on preview map
        if (childLands && childLands.length > 0) {
          const childFeatures = childLands
            .filter((c: any) => c.pins && c.pins.length >= 3)
            .map((c: any, cIdx: number) => {
              const colorObj =
                CHILD_COLORS_LIST.find((co) => co.name === c.color) ||
                CHILD_COLORS_LIST[cIdx % CHILD_COLORS_LIST.length];
              const closedChild = [
                ...c.pins.map((p: any) => [p.lng, p.lat]),
                [c.pins[0].lng, c.pins[0].lat],
              ];
              return {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [closedChild],
                },
                properties: {
                  hexColor: colorObj.hex,
                  strokeColor: colorObj.stroke,
                },
              };
            });

          map.addSource("child-preview-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: childFeatures as any,
            },
          });

          map.addLayer({
            id: "child-preview-fill",
            type: "fill",
            source: "child-preview-source",
            filter: ["==", "$type", "Polygon"],
            paint: {
              "fill-color": ["get", "hexColor"],
              "fill-opacity": 0.55,
            },
          });

          map.addLayer({
            id: "child-preview-stroke",
            type: "line",
            source: "child-preview-source",
            paint: {
              "line-color": ["get", "strokeColor"],
              "line-width": 2.5,
            },
          });
        }
      }

      // Add parent pin markers
      pins.forEach((pin, idx) => {
        const el = document.createElement("div");
        el.style.transform = "translate(0, -50%)";
        el.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));">
            <svg width="24" height="28" viewBox="0 0 24 24" fill="#EF4444" stroke="#B91C1C" stroke-width="1.2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <div style="position: absolute; top: 3px; background: white; border: 1.2px solid #EF4444; color: #EF4444; font-weight: 800; font-size: 9px; font-family: sans-serif; width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              ${idx + 1}
            </div>
          </div>
        `;
        new maplibregl.Marker({ element: el })
          .setLngLat([pin.lng, pin.lat])
          .addTo(map);
      });

      // Add Child Land pin markers on preview map
      if (childLands && childLands.length > 0) {
        childLands.forEach((child: any, cIdx: number) => {
          const colorObj =
            CHILD_COLORS_LIST.find((c) => c.name === child.color) ||
            CHILD_COLORS_LIST[cIdx % CHILD_COLORS_LIST.length];

          if (child.pins && Array.isArray(child.pins)) {
            child.pins.forEach((coord: any, pIdx: number) => {
              const el = document.createElement("div");
              el.style.transform = "translate(0, -50%)";
              el.innerHTML = `
                <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5));">
                  <svg width="24" height="28" viewBox="0 0 24 24" fill="${colorObj.hex}" stroke="${colorObj.stroke}" stroke-width="1.2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  </svg>
                  <div style="position: absolute; top: 2px; background: white; border: 1px solid ${colorObj.stroke}; color: ${colorObj.stroke}; font-weight: 800; font-size: 7.5px; font-family: sans-serif; padding: 0 2px; height: 13px; border-radius: 6px; display: flex; align-items: center; justify-content: center; white-space: nowrap;">
                    C${child.id || cIdx + 1}.${pIdx + 1}
                  </div>
                </div>
              `;
              new maplibregl.Marker({ element: el })
                .setLngLat([coord.lng, coord.lat])
                .addTo(map);
            });
          }
        });
      }
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [pins, childLands]);

  return (
    <div
      onClick={onOpenMap}
      className="relative w-full h-full border border-[rgba(0,0,0,0.12)] rounded-xl overflow-hidden shadow-sm select-none cursor-pointer hover:border-[#3D4A0D]/50 transition-all bg-gray-900"
    >
      <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {!isConfirmed && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {/* Transparent Dark Overlay matching Figma */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
          
          <div className="relative z-20 flex flex-col items-center gap-3 w-full px-4">
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-lg text-white text-center drop-shadow-[0px_4px_8px_rgba(0,0,0,0.8)]">
              Select location on maps
            </span>
            <button
              type="button"
              className="flex justify-center items-center rounded-full font-['Plus_Jakarta_Sans'] font-medium text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer bg-[#2A3008] hover:bg-[#3D4A0D] px-6 py-2.5 text-sm"
            >
              View maps
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const SuperAdminUploadLandDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBoundaryConfirmed = searchParams.get("boundaryConfirmed") === "true";
  const targetId = id || "GLCSOS-05";

  const location = useLocation();
  const stateData = location.state as any;

  // State for interactive toggles & fields
  const user = useSelector(selectCurrentUser);
  const [acquisitionCategory] = useState<"purchase" | "ancestral">(stateData?.formData?.acquisitionCategory || "ancestral");
  const [referredAgent] = useState<"default" | "other">(stateData?.formData?.referredAgent || "other");
  const [countryVal, setCountryVal] = useState<{ id: number; label: string } | null>(stateData?.formData?.countryVal || null);
  const [stateVal, setStateVal] = useState<{ id: number; label: string } | null>(stateData?.formData?.stateVal || null);
  const [districtVal, setDistrictVal] = useState<{ id: number; label: string } | null>(stateData?.formData?.districtVal || null);
  const [mandalVal, setMandalVal] = useState<{ id: number; label: string } | null>(stateData?.formData?.mandalVal || null);
  
  const [totalAcres, setTotalAcres] = useState(stateData?.formData?.totalAcres || "");
  const [valuation, setValuation] = useState(stateData?.formData?.valuation || "");
  const [fieldNotes, setFieldNotes] = useState(stateData?.formData?.fieldNotes || "");
  const costPerAcre = (totalAcres && valuation && !isNaN(Number(valuation)) && !isNaN(Number(totalAcres)) && Number(totalAcres) > 0)
    ? (Number(valuation) / Number(totalAcres)).toFixed(2)
    : "";
  
  const { data: geoData } = useGetAllGeoMasterDataQuery();
  const { data: masterData } = useGetAllMasterDataQuery();
  const [submitNewFarmLand] = useSubmitNewFarmLandMutation();
  const [submitFarmland] = useSubmitFarmlandMutation();

  const sadminStageId = masterData?.milestoneStagesResult?.find((s: any) => s.code === "SADMIN")?.id;
  const pendingStatusId = masterData?.milestoneStageStatusResult?.find((s: any) => s.code === "PENDNG")?.id;
  const farmlandStatusId = masterData?.farmlandStatusResult?.find((s: any) => s.code === "ACTIVE" || s.code === "PENDNG")?.id || 1;

  const countries = geoData?.countries?.map((c: any) => ({ id: c.id, label: c.desc })) || [];
  const states = countryVal
    ? geoData?.states?.filter((s: any) => s.country_id === countryVal.id).map((s: any) => ({ id: s.id, label: s.desc })) || []
    : [];
  const districts = stateVal 
    ? geoData?.districts?.filter((d: any) => d.state_id === stateVal.id).map((d: any) => ({ id: d.id, label: d.desc })) || []
    : [];
  const mandals = districtVal
    ? geoData?.mandals?.filter((m: any) => m.districts_id === districtVal.id).map((m: any) => ({ id: m.id, label: m.desc })) || []
    : [];

  const [savedPins] = useState<{ lat: number; lng: number }[]>(stateData?.pins || []);
  const [savedChildLands] = useState<any[]>(() => {
    if (stateData?.childLands && stateData.childLands.length > 0) {
      return stateData.childLands.map((c: any) => {
        let pins = c.pins;
        if (!pins && c.geojson?.coordinates?.[0]) {
          pins = c.geojson.coordinates[0].map((coord: number[]) => ({
            lng: coord[0],
            lat: coord[1],
          }));
        }
        return {
          id: c.id || c.childId || 1,
          label: c.label || `Child Land ${c.id || c.childId || 1}`,
          color: c.color || "green",
          pins: pins || [],
        };
      });
    }

    if (stateData?.geoJsonPayload?.childGeoJson && stateData.geoJsonPayload.childGeoJson.length > 0) {
      return stateData.geoJsonPayload.childGeoJson.map((c: any) => {
        const rawCoords = c.geojson?.coordinates?.[0] || [];
        const pins = rawCoords.map((coord: number[]) => ({
          lng: coord[0],
          lat: coord[1],
        }));
        return {
          id: c.childId || c.id || 1,
          label: c.label || `Child Land ${c.childId || c.id || 1}`,
          color: c.color || "green",
          pins,
        };
      });
    }

    return [];
  });
  const [savedGeoJsonPayload] = useState<any>(stateData?.geoJsonPayload || null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};
    if (!totalAcres) newErrors.totalAcres = "Total acres is required";
    if (!valuation) newErrors.valuation = "Valuation is required";
    if (!countryVal || !stateVal || !districtVal || !mandalVal) {
      toast.error("Please select a complete location (Country, State, District, Mandal)");
      newErrors.location = "Required";
    }

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    let polygon = null;
    if (savedPins.length >= 3) {
      const polygonCoordinates = [...savedPins.map(p => [p.lng, p.lat]), [savedPins[0].lng, savedPins[0].lat]];
      polygon = {
        type: "Polygon",
        coordinates: [polygonCoordinates]
      };
    }

    const payload = {
      user_id: user?.id || 1,
      polygon,
      auto_capture: true,
      valuation,
      totalAcres,
      fieldNotes,
      is_glc_exclusive: true,
      farmland_status_id: farmlandStatusId,
      milestone_stage_id: sadminStageId,
      milestone_stage_status_id: pendingStatusId,
      location_details: {
        country_id: countryVal?.id,
        state_id: stateVal?.id,
        district_id: districtVal?.id,
        mandal_id: mandalVal?.id
      }
    };

    try {
      const response = await submitNewFarmLand(payload).unwrap();
      const newId = response?.id;
      if (!newId) throw new Error("API did not return an ID");

      try {
        const inprgsStatusId = masterData?.milestoneStageStatusResult?.find((s: any) => s.code === "INPRGS")?.id;
        const apiId = parseInt(newId, 10) || 1;
        
        await submitFarmland({
          farmlandId: apiId,
          master_milestone_stage_id: sadminStageId || 1,
          master_milestone_stage_status_id: inprgsStatusId || 1,
          userId: user?.id || 1,
        }).unwrap();
      } catch (submitErr) {
        console.error("Failed to update farmland status to INPRGS:", submitErr);
      }
      
      if (isBoundaryConfirmed || savedPins.length >= 3) {
        navigate(`/super-admin/upload/process/${newId}/customer-information`);
      } else {
        navigate(`/super-admin/upload/view-maps/${newId}`, {
          state: {
            formData: { totalAcres, valuation, fieldNotes, countryVal, stateVal, districtVal, mandalVal, acquisitionCategory, referredAgent },
            pins: savedPins,
            childLands: savedChildLands,
            geoJsonPayload: savedGeoJsonPayload,
          }
        });
      }
    } catch (err) {
      toast.error("Failed to submit farmland details");
      console.error("Failed to update farmland:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col justify-start items-center py-4 px-4 md:px-8 font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-3">
        {/* ── Top Header - Reuses UploadGoBack ── */}
        <div className="flex justify-start w-full">
          <UploadGoBack onClick={handleBack} />
        </div>

        {/* ── Central Card ── */}
        <div className="w-full bg-white shadow-sm rounded-2xl p-5 lg:p-6 relative flex flex-col gap-4">
          {/* Header Title */}
          <div>
            <h2 className="font-['Manrope'] font-bold text-xl lg:text-2xl leading-none text-[#1A1C1D]">
              Enter land details
            </h2>
          </div>

          {/* ── Body: Form Controls ── */}
          <div className="flex flex-col gap-5 w-full">

            {/* Form Inputs (Grid: 4 Columns Max) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

              {/* Country Dropdown */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">Country</label>
                <div className="relative w-full bg-white border border-[#E1E5EF] rounded-xl flex items-center justify-between h-[48px]">
                  <CustomSelect
                    value={countryVal}
                    onChange={(selected) => {
                      setCountryVal(selected);
                      setStateVal(null);
                      setDistrictVal(null);
                      setMandalVal(null);
                    }}
                    options={countries}
                    placeholder="Select Country"
                  />
                </div>
              </div>

              {/* State Dropdown */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">State</label>
                <div className="relative w-full bg-white border border-[#E1E5EF] rounded-xl flex items-center justify-between h-[48px]">
                  <CustomSelect
                    value={stateVal}
                    onChange={(selected) => {
                      setStateVal(selected);
                      setDistrictVal(null);
                      setMandalVal(null);
                    }}
                    options={states}
                    placeholder="Select State"
                  />
                </div>
              </div>

              {/* District Dropdown */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">District</label>
                <div className="relative w-full bg-white border border-[#E1E5EF] rounded-xl flex items-center justify-between h-[48px]">
                  <CustomSelect
                    value={districtVal}
                    onChange={(selected) => {
                      setDistrictVal(selected);
                      setMandalVal(null);
                    }}
                    options={districts}
                    placeholder="Select District"
                  />
                </div>
              </div>

              {/* Area/City/Town Dropdown */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">Area/City/Town</label>
                <div className="relative w-full bg-white border border-[#E1E5EF] rounded-xl flex items-center justify-between h-[48px]">
                  <CustomSelect
                    value={mandalVal}
                    onChange={(selected) => {
                      setMandalVal(selected);
                    }}
                    options={mandals}
                    placeholder="Select Area/City/Town"
                  />
                </div>
              </div>

              {/* Total Acres Input */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">Total Acres</label>
                <input
                  type="text"
                  value={totalAcres}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) setTotalAcres(val);
                  }}
                  maxLength={100}
                  className="w-full bg-white border border-[#E1E5EF] rounded-xl px-3.5 font-sans font-normal text-sm text-[#191C1E] focus:outline-none focus:border-[#3E4A3D] h-[48px]"
                />
              </div>

              {/* Valuation Input */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">Valuation</label>
                <input
                  type="text"
                  value={valuation}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) setValuation(val);
                  }}
                  maxLength={100}
                  className="w-full bg-white border border-[#E1E5EF] rounded-xl px-3.5 font-sans font-normal text-sm text-[#191C1E] focus:outline-none focus:border-[#3E4A3D] h-[48px]"
                />
              </div>

              {/* Cost Per Acre Input */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">Cost Per Acre (computed)</label>
                <input
                  type="text"
                  value={costPerAcre}
                  readOnly
                  className="w-full bg-[#F8F9FA] border border-[#E1E5EF] rounded-xl px-3.5 font-sans font-normal text-sm text-gray-500 focus:outline-none cursor-not-allowed h-[48px]"
                />
              </div>
            </div>

            {/* Map and Field Notes side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {/* Map Preview */}
              <div className="flex flex-col gap-1.5 w-full">
                <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-black">Select Location of Land</span>
                <div className="h-[200px] w-full">
                  <LandMapPreview
                    pins={savedPins}
                    childLands={savedChildLands}
                    isConfirmed={isBoundaryConfirmed || savedPins.length >= 3}
                    onOpenMap={() => navigate(`/super-admin/upload/view-maps/${targetId}`, {
                      state: {
                        formData: { totalAcres, valuation, fieldNotes, countryVal, stateVal, districtVal, mandalVal, acquisitionCategory, referredAgent },
                        pins: savedPins,
                        childLands: savedChildLands,
                        geoJsonPayload: savedGeoJsonPayload,
                      }
                    })}
                  />
                </div>
              </div>

              {/* Field Notes */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#3E4A3D]">Field Notes</label>
                <textarea
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Enter any additional field notes here..."
                  className="w-full bg-white border border-[#E1E5EF] rounded-xl p-3.5 font-sans font-normal text-sm text-[#191C1E] focus:outline-none focus:border-[#3E4A3D] resize-none h-[200px]"
                />
                <div className="flex justify-end -mt-1 px-1">
                  <span className="text-xs text-gray-500 font-sans">{fieldNotes.length} / 500</span>
                </div>
              </div>
            </div>

            {/* ── Coordinates Section (Parent Boundary + Child Sub-Lands) ── */}
            {(savedPins.length >= 3 || savedChildLands.length > 0) && (
              <div className="flex flex-col gap-4 w-full pt-4 border-t border-gray-100 mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Manrope'] font-bold text-base text-[#1A1C1D] flex items-center gap-2">
                    <span>Land Coordinates Details</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E5E9D8] text-[#3D4A0D]">
                      GeoJSON Verified
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                  {/* Parent Land Coordinates Card */}
                  {savedPins.length >= 3 && (
                    <div className="bg-[#F8F9FA] border border-gray-200/80 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#3E4A3D] uppercase tracking-wider">
                          Parent Land Boundary ({savedPins.length} Pins)
                        </span>
                        <span className="text-xs font-extrabold text-[#3D4A0D] bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                          {calculateArea(savedPins)} Acres
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                        {savedPins.map((pin, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center gap-2 shadow-2xs">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] flex items-center justify-center border border-red-300 shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex flex-col truncate">
                              <span className="text-gray-800 font-semibold truncate">
                                Lat: {pin.lat.toFixed(6)}
                              </span>
                              <span className="text-gray-500 text-[11px] truncate">
                                Lng: {pin.lng.toFixed(6)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Child Lands Coordinates Card */}
                  {savedChildLands.length > 0 ? (
                    <div className="bg-[#F8F9FA] border border-gray-200/80 rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#3E4A3D] uppercase tracking-wider">
                          Selected Child Sub-Lands ({savedChildLands.length} Lands)
                        </span>
                        <span className="text-xs font-extrabold text-[#3D4A0D] bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                          Manual Sub-Polygons
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                        {savedChildLands.map((child, cIdx) => {
                          const colorObj =
                            CHILD_COLORS_LIST.find((c) => c.name === child.color) ||
                            CHILD_COLORS_LIST[cIdx % CHILD_COLORS_LIST.length];
                          const cArea = calculateArea(child.pins || []);

                          return (
                            <div key={child.id || cIdx} className="bg-white p-3 rounded-xl border border-gray-200/90 flex flex-col gap-2 shadow-2xs">
                              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full shrink-0 border"
                                    style={{
                                      backgroundColor: colorObj.hex,
                                      borderColor: colorObj.stroke,
                                    }}
                                  />
                                  <span className="font-bold text-xs text-gray-800">
                                    Child {child.id || cIdx + 1} ({child.label || `Child Land ${child.id || cIdx + 1}`})
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-[#3D4A0D] bg-[#E5E9D8] px-2 py-0.5 rounded-md">
                                  {cArea} Acres
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                                {child.pins?.map((p: any, pIdx: number) => (
                                  <div key={pIdx} className="bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                    <span
                                      className="font-bold text-[9px] px-1 py-0.2 rounded text-white shrink-0"
                                      style={{ backgroundColor: colorObj.stroke }}
                                    >
                                      C{child.id || cIdx + 1}.{pIdx + 1}
                                    </span>
                                    <span className="text-gray-700 truncate">
                                      {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F8F9FA] border border-gray-200/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-gray-400 gap-1 min-h-[160px]">
                      <span className="text-xs font-semibold">No Child Lands selected yet</span>
                      <span className="text-[11px]">Click "Select Location of Land" map above to draw child lands</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ── Footer / Next button ── */}
          <div className="flex justify-end w-full mt-2">
            <button
              onClick={handleNext}
              className="flex justify-center items-center rounded-full text-white font-['Outfit'] font-normal transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm px-8 py-3 text-base"
              style={{
                background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)"
              }}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuperAdminUploadLandDetails;
