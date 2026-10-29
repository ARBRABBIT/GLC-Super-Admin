import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import UploadGoBack from "@/features/super-admin/sub-features/upload-docs/components/UploadGoBack";
import {
  Search,
  Undo2,
  RotateCcw,
  Plus,
  Minus,
  Crosshair,
  MapPin,
  Edit3,
  ArrowRight,
  X,
  Loader2,
  Layers,
  Trash2,
  Magnet,
  CheckCircle2,
} from "lucide-react";
import maplibregl from "maplibre-gl";

export interface PinCoordinate {
  lat: number;
  lng: number;
}

export interface SearchResult {
  id: string;
  display_name: string;
  latitude: number;
  longitude: number;
}

export interface ChildLand {
  id: number;
  label: string;
  color: string;
  pins: PinCoordinate[];
}

export interface SnapTarget {
  coord: PinCoordinate;
  label: string;
  type: "parent-vertex" | "child-vertex" | "parent-edge" | "child-edge";
  screenPoint?: { x: number; y: number };
}

export const CHILD_COLORS_LIST = [
  { name: "green", hex: "#22C55E", stroke: "#15803D", labelBg: "#15803D" },
  { name: "blue", hex: "#3B82F6", stroke: "#1D4ED8", labelBg: "#1D4ED8" },
  { name: "yellow", hex: "#EAB308", stroke: "#CA8A04", labelBg: "#CA8A04" },
  { name: "red", hex: "#EF4444", stroke: "#B91C1C", labelBg: "#B91C1C" },
  { name: "purple", hex: "#A855F7", stroke: "#7E22CE", labelBg: "#7E22CE" },
  { name: "cyan", hex: "#06B6D4", stroke: "#0E7490", labelBg: "#0E7490" },
  { name: "orange", hex: "#F97316", stroke: "#C2410C", labelBg: "#C2410C" },
  { name: "pink", hex: "#EC4899", stroke: "#BE185D", labelBg: "#BE185D" },
];

export const lerpCoord = (pA: PinCoordinate, pB: PinCoordinate, t: number): PinCoordinate => {
  return {
    lng: pA.lng + (pB.lng - pA.lng) * t,
    lat: pA.lat + (pB.lat - pA.lat) * t,
  };
};

export const buildGeoJsonPayload = (
  parentPins: PinCoordinate[],
  childLandsList: ChildLand[]
) => {
  if (parentPins.length < 3) return null;

  const parentClosedCoords = [
    ...parentPins.map((p) => [p.lng, p.lat]),
    [parentPins[0].lng, parentPins[0].lat],
  ];

  const parentGeoJson = {
    type: "Polygon",
    coordinates: [parentClosedCoords],
  };

  const childGeoJson = childLandsList
    .filter((c) => c.pins.length >= 3)
    .map((c, idx) => {
      const childClosedCoords = [
        ...c.pins.map((p) => [p.lng, p.lat]),
        [c.pins[0].lng, c.pins[0].lat],
      ];
      const colorObj = CHILD_COLORS_LIST[idx % CHILD_COLORS_LIST.length];
      return {
        childId: c.id,
        parentId: 1,
        label: c.label || `Child Land ${c.id}`,
        selected: true,
        color: c.color || colorObj.name,
        geojson: {
          type: "Polygon",
          coordinates: [childClosedCoords],
        },
      };
    });

  return {
    parentGeoJson,
    childGeoJson,
  };
};

export const calculateArea = (coordinates: PinCoordinate[]) => {
  if (coordinates.length < 3) return "0.00";

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

export const SuperAdminUploadViewMaps: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const targetId = id || "GLCSOS-05";

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const childMarkersRef = useRef<maplibregl.Marker[]>([]);
  const snapMarkerRef = useRef<maplibregl.Marker | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasZoomedParentRef = useRef<boolean>(false);

  const location = useLocation();
  const stateData = location.state as any;

  // States
  const [pins, setPins] = useState<PinCoordinate[]>(stateData?.pins || []);
  const [childLands, setChildLands] = useState<ChildLand[]>(() => {
    if (stateData?.childLands && stateData.childLands.length > 0) {
      return stateData.childLands;
    }
    return [];
  });
  const [isParentConfirmed, setIsParentConfirmed] = useState<boolean>(
    (stateData?.childLands && stateData.childLands.length > 0) ||
      (stateData?.pins && stateData.pins.length >= 3)
      ? true
      : false
  );
  const [activeChildPins, setActiveChildPins] = useState<PinCoordinate[]>(() => {
    // If parent is confirmed and no child lands exist yet, automatically start Child 1 from P1
    if (
      ((stateData?.childLands && stateData.childLands.length > 0) ||
        (stateData?.pins && stateData.pins.length >= 3)) &&
      (!stateData?.childLands || stateData.childLands.length === 0) &&
      stateData?.pins &&
      stateData.pins.length > 0
    ) {
      return [stateData.pins[0]];
    }
    return [];
  });
  const [activeSnapTarget, setActiveSnapTarget] = useState<SnapTarget | null>(null);
  const [enableSnapping, setEnableSnapping] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [estimatedArea, setEstimatedArea] = useState("0.00");
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(4);
  const [isConfirming, setIsConfirming] = useState(false);

  // Sync refs for event listeners
  const isParentConfirmedRef = useRef(isParentConfirmed);
  useEffect(() => {
    isParentConfirmedRef.current = isParentConfirmed;
  }, [isParentConfirmed]);

  const pinsRef = useRef(pins);
  useEffect(() => {
    pinsRef.current = pins;
  }, [pins]);

  const childLandsRef = useRef(childLands);
  useEffect(() => {
    childLandsRef.current = childLands;
  }, [childLands]);

  const activeChildPinsRef = useRef(activeChildPins);
  useEffect(() => {
    activeChildPinsRef.current = activeChildPins;
  }, [activeChildPins]);

  const enableSnappingRef = useRef(enableSnapping);
  useEffect(() => {
    enableSnappingRef.current = enableSnapping;
  }, [enableSnapping]);

  // Console log payload live when pins or childLands update
  useEffect(() => {
    if (pins.length >= 3) {
      const payload = buildGeoJsonPayload(pins, childLands);
      if (payload) {
        console.log("📍 LIVE GEOJSON PAYLOAD (Parent + Child Lands):", payload);
      }
    }
  }, [pins, childLands]);

  /**
   * Snapping Engine: Find closest vertex or boundary edge on parent or child lands
   */
  const findSnapTarget = useCallback(
    (screenPoint: { x: number; y: number }): SnapTarget | null => {
      const map = mapRef.current;
      if (!map || !enableSnappingRef.current) return null;

      const SNAP_VERTEX_RADIUS = 35; // Generous 35px threshold for magnetic coordinator snapping
      const SNAP_EDGE_RADIUS = 25; // 25px threshold for boundary edges

      let bestTarget: SnapTarget | null = null;
      let minDistance = Infinity;

      // 1. Check Parent Vertices (High priority)
      pinsRef.current.forEach((pin, idx) => {
        const pt = map.project([pin.lng, pin.lat]);
        const dist = Math.hypot(pt.x - screenPoint.x, pt.y - screenPoint.y);
        if (dist <= SNAP_VERTEX_RADIUS && dist < minDistance) {
          minDistance = dist;
          bestTarget = {
            coord: { lat: pin.lat, lng: pin.lng },
            label: `Parent Coordinator P${idx + 1}`,
            type: "parent-vertex",
            screenPoint: { x: pt.x, y: pt.y },
          };
        }
      });

      if (bestTarget) return bestTarget;

      // 2. Check Saved Child Land Vertices (High priority)
      childLandsRef.current.forEach((child) => {
        child.pins.forEach((cPin, pIdx) => {
          const pt = map.project([cPin.lng, cPin.lat]);
          const dist = Math.hypot(pt.x - screenPoint.x, pt.y - screenPoint.y);
          if (dist <= SNAP_VERTEX_RADIUS && dist < minDistance) {
            minDistance = dist;
            bestTarget = {
              coord: { lat: cPin.lat, lng: cPin.lng },
              label: `Child ${child.id} Point ${pIdx + 1}`,
              type: "child-vertex",
              screenPoint: { x: pt.x, y: pt.y },
            };
          }
        });
      });

      if (bestTarget) return bestTarget;

      // 3. Check Parent Boundary Edges
      if (pinsRef.current.length >= 2) {
        const nPins = pinsRef.current.length;
        for (let i = 0; i < nPins; i++) {
          const pA = pinsRef.current[i];
          const pB = pinsRef.current[(i + 1) % nPins];
          const ptA = map.project([pA.lng, pA.lat]);
          const ptB = map.project([pB.lng, pB.lat]);

          const dx = ptB.x - ptA.x;
          const dy = ptB.y - ptA.y;
          const lenSq = dx * dx + dy * dy;
          if (lenSq > 0) {
            let t = ((screenPoint.x - ptA.x) * dx + (screenPoint.y - ptA.y) * dy) / lenSq;
            t = Math.max(0, Math.min(1, t));
            const projX = ptA.x + t * dx;
            const projY = ptA.y + t * dy;
            const dist = Math.hypot(screenPoint.x - projX, screenPoint.y - projY);

            if (dist <= SNAP_EDGE_RADIUS && dist < minDistance) {
              minDistance = dist;
              const snappedCoord = lerpCoord(pA, pB, t);
              bestTarget = {
                coord: snappedCoord,
                label: `Parent Edge (P${i + 1} → P${((i + 1) % nPins) + 1})`,
                type: "parent-edge",
                screenPoint: { x: projX, y: projY },
              };
            }
          }
        }
      }

      if (bestTarget) return bestTarget;

      // 4. Check Child Land Edges
      childLandsRef.current.forEach((child) => {
        const cPins = child.pins;
        if (cPins.length >= 2) {
          for (let i = 0; i < cPins.length; i++) {
            const pA = cPins[i];
            const pB = cPins[(i + 1) % cPins.length];
            const ptA = map.project([pA.lng, pA.lat]);
            const ptB = map.project([pB.lng, pB.lat]);

            const dx = ptB.x - ptA.x;
            const dy = ptB.y - ptA.y;
            const lenSq = dx * dx + dy * dy;
            if (lenSq > 0) {
              let t = ((screenPoint.x - ptA.x) * dx + (screenPoint.y - ptA.y) * dy) / lenSq;
              t = Math.max(0, Math.min(1, t));
              const projX = ptA.x + t * dx;
              const projY = ptA.y + t * dy;
              const dist = Math.hypot(screenPoint.x - projX, screenPoint.y - projY);

              if (dist <= SNAP_EDGE_RADIUS && dist < minDistance) {
                minDistance = dist;
                const snappedCoord = lerpCoord(pA, pB, t);
                bestTarget = {
                  coord: snappedCoord,
                  label: `Child ${child.id} Boundary Edge`,
                  type: "child-edge",
                  screenPoint: { x: projX, y: projY },
                };
              }
            }
          }
        }
      });

      return bestTarget;
    },
    []
  );

  // Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter: [number, number] =
      pins.length > 0 ? [pins[0].lng, pins[0].lat] : [77.209, 28.6139];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
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
            attribution: "Google Satellite",
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
      center: initialCenter,
      zoom: pins.length > 0 ? 16 : 14,
      maxZoom: 19,
      attributionControl: false,
    });

    mapRef.current = map;

    // Create magnetic snap target DOM element and marker
    const snapEl = document.createElement("div");
    snapEl.className = "snap-indicator pointer-events-none hidden";
    snapEl.innerHTML = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid #10B981; background: rgba(16, 185, 129, 0.25); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #10B981; border: 2px solid white; box-shadow: 0 0 6px #10B981;"></div>
      </div>
    `;
    const snapMarker = new maplibregl.Marker({ element: snapEl, anchor: "center" })
      .setLngLat([0, 0])
      .addTo(map);
    snapMarkerRef.current = snapMarker;

    map.on("load", () => {
      // 1. Parent Boundary Source
      map.addSource("boundary-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // 2. Saved Child Lands Source
      map.addSource("saved-child-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // 3. Active Drawing Child Land Source
      map.addSource("active-child-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // 4. Rubber-band Preview Line Source (Google Earth style line from last pin to cursor)
      map.addSource("rubber-band-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Parent Polygon Fill
      map.addLayer({
        id: "boundary-fill",
        type: "fill",
        source: "boundary-source",
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": "#5FBF5F",
          "fill-opacity": 0.2,
        },
      });

      // Parent Polygon Line Stroke
      map.addLayer({
        id: "boundary-stroke",
        type: "line",
        source: "boundary-source",
        paint: {
          "line-color": "#2A3008",
          "line-width": 3.5,
        },
      });

      // Saved Child Lands Fill (Renders on top of parent with distinct colors)
      map.addLayer({
        id: "saved-child-fill",
        type: "fill",
        source: "saved-child-source",
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": ["get", "hexColor"],
          "fill-opacity": 0.6,
        },
      });

      // Saved Child Lands Stroke
      map.addLayer({
        id: "saved-child-stroke",
        type: "line",
        source: "saved-child-source",
        paint: {
          "line-color": ["get", "strokeColor"],
          "line-width": 3,
        },
      });

      // Active Child Land Fill
      map.addLayer({
        id: "active-child-fill",
        type: "fill",
        source: "active-child-source",
        filter: ["==", "$type", "Polygon"],
        paint: {
          "fill-color": ["get", "hexColor"],
          "fill-opacity": 0.45,
        },
      });

      // Active Child Land Line Stroke
      map.addLayer({
        id: "active-child-stroke",
        type: "line",
        source: "active-child-source",
        paint: {
          "line-color": ["get", "strokeColor"],
          "line-width": 2.5,
          "line-dasharray": [3, 3],
        },
      });

      // Rubber-band Line Layer
      map.addLayer({
        id: "rubber-band-stroke",
        type: "line",
        source: "rubber-band-source",
        paint: {
          "line-color": "#F59E0B",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });
    });

    // Mouse Move Listener for Snapping & Rubber Band Line
    map.on("mousemove", (e) => {
      const screenPt = { x: e.point.x, y: e.point.y };
      const snap = findSnapTarget(screenPt);

      let effectiveCoord: PinCoordinate;
      if (snap) {
        effectiveCoord = snap.coord;
        setActiveSnapTarget(snap);
        if (snapMarkerRef.current) {
          snapMarkerRef.current.setLngLat([snap.coord.lng, snap.coord.lat]);
          snapMarkerRef.current.getElement().classList.remove("hidden");
        }
      } else {
        effectiveCoord = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        setActiveSnapTarget(null);
        if (snapMarkerRef.current) {
          snapMarkerRef.current.getElement().classList.add("hidden");
        }
      }

      // Update rubber band line
      if (map.isStyleLoaded() && map.getSource("rubber-band-source")) {
        const source = map.getSource("rubber-band-source") as maplibregl.GeoJSONSource;
        const features: any[] = [];

        if (isParentConfirmedRef.current && activeChildPinsRef.current.length > 0) {
          const lastPin = activeChildPinsRef.current[activeChildPinsRef.current.length - 1];
          features.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [lastPin.lng, lastPin.lat],
                [effectiveCoord.lng, effectiveCoord.lat],
              ],
            },
            properties: {},
          });
        } else if (!isParentConfirmedRef.current && pinsRef.current.length > 0 && pinsRef.current.length < 4) {
          const lastPin = pinsRef.current[pinsRef.current.length - 1];
          features.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [lastPin.lng, lastPin.lat],
                [effectiveCoord.lng, effectiveCoord.lat],
              ],
            },
            properties: {},
          });
        }

        source.setData({ type: "FeatureCollection", features });
      }
    });

    map.on("mouseout", () => {
      setActiveSnapTarget(null);
      if (snapMarkerRef.current) {
        snapMarkerRef.current.getElement().classList.add("hidden");
      }
      if (map.isStyleLoaded() && map.getSource("rubber-band-source")) {
        const source = map.getSource("rubber-band-source") as maplibregl.GeoJSONSource;
        source.setData({ type: "FeatureCollection", features: [] });
      }
    });

    // Handle Map Clicks with Magnetic Snapping
    map.on("click", (e) => {
      const screenPt = { x: e.point.x, y: e.point.y };
      const snap = findSnapTarget(screenPt);
      const coord: PinCoordinate = snap
        ? snap.coord
        : { lat: e.lngLat.lat, lng: e.lngLat.lng };

      if (!isParentConfirmedRef.current) {
        setPins((prev) => {
          if (prev.length >= 4) return prev;
          return [...prev, coord];
        });
      } else {
        // Child Land Drawing Mode: Add snapped / exact point
        setActiveChildPins((prev) => {
          // If starting Child 1 from scratch and clicked beside/inside parent land, ensure P1 is the starting point
          if (prev.length === 0 && childLandsRef.current.length === 0 && pinsRef.current.length > 0) {
            const p1 = pinsRef.current[0];
            if (Math.abs(p1.lat - coord.lat) < 0.000001 && Math.abs(p1.lng - coord.lng) < 0.000001) {
              return [p1];
            }
            return [p1, coord];
          }
          return [...prev, coord];
        });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [findSnapTarget]);

  // Synchronize Markers & GeoJSON Layers when state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    childMarkersRef.current.forEach((m) => m.remove());
    childMarkersRef.current = [];

    // Render Parent Pin Markers (Red map pins)
    pins.forEach((pin, index) => {
      const el = document.createElement("div");
      el.className = "custom-map-pin flex flex-col items-center cursor-pointer select-none";
      el.style.transform = "translate(0, -50%)";
      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.5));">
          <svg width="34" height="38" viewBox="0 0 24 24" fill="#EF4444" stroke="#B91C1C" stroke-width="1.2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          <div style="position: absolute; top: 4px; background: white; border: 1.5px solid #EF4444; color: #EF4444; font-weight: 800; font-size: 10px; font-family: sans-serif; width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">
            ${index + 1}
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Render Saved Child Land Pin Markers (Draggable for fine tuning)
    childLands.forEach((child) => {
      const colorObj =
        CHILD_COLORS_LIST.find((c) => c.name === child.color) ||
        CHILD_COLORS_LIST[(child.id - 1) % CHILD_COLORS_LIST.length];

      child.pins.forEach((coord, idx) => {
        const el = document.createElement("div");
        el.className = "child-map-pin flex flex-col items-center cursor-move select-none";
        el.style.transform = "translate(0, -50%)";
        el.title = `Drag to adjust Child ${child.id} pin ${idx + 1}`;
        el.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.5));">
            <svg width="34" height="38" viewBox="0 0 24 24" fill="${colorObj.hex}" stroke="${colorObj.stroke}" stroke-width="1.2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <div style="position: absolute; top: 3px; background: white; border: 1.5px solid ${colorObj.stroke}; color: ${colorObj.stroke}; font-weight: 800; font-size: 9px; font-family: sans-serif; padding: 0 4px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3); white-space: nowrap;">
              C${child.id}.${idx + 1}
            </div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el, draggable: true })
          .setLngLat([coord.lng, coord.lat])
          .addTo(map);

        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          setChildLands((prev) =>
            prev.map((c) => {
              if (c.id !== child.id) return c;
              const updatedPins = [...c.pins];
              updatedPins[idx] = { lng: lngLat.lng, lat: lngLat.lat };
              return { ...c, pins: updatedPins };
            })
          );
        });

        childMarkersRef.current.push(marker);
      });
    });

    // Render Active Drawing Child Pin Markers
    if (isParentConfirmed && activeChildPins.length > 0) {
      const nextChildId = childLands.length + 1;
      const activeColor = CHILD_COLORS_LIST[(nextChildId - 1) % CHILD_COLORS_LIST.length];

      activeChildPins.forEach((coord, idx) => {
        const el = document.createElement("div");
        el.className = "active-child-map-pin flex flex-col items-center cursor-pointer select-none";
        el.style.transform = "translate(0, -50%)";
        el.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.5));">
            <svg width="36" height="40" viewBox="0 0 24 24" fill="${activeColor.hex}" stroke="${activeColor.stroke}" stroke-width="1.6" stroke-dasharray="2 2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <div style="position: absolute; top: 3px; background: white; border: 1.5px solid ${activeColor.stroke}; color: ${activeColor.stroke}; font-weight: 800; font-size: 9px; font-family: sans-serif; padding: 0 4px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3); white-space: nowrap;">
              C${nextChildId}.${idx + 1}
            </div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([coord.lng, coord.lat])
          .addTo(map);

        childMarkersRef.current.push(marker);
      });
    }

    // Auto-fit bounds for Parent Land on confirm/load
    if (pins.length >= 3 && !hasZoomedParentRef.current) {
      hasZoomedParentRef.current = true;
      const lngs = pins.map((p) => p.lng);
      const lats = pins.map((p) => p.lat);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 120, duration: 1200 }
      );
    }

    // Update Parent Boundary Source
    if (map.isStyleLoaded() && map.getSource("boundary-source")) {
      const source = map.getSource("boundary-source") as maplibregl.GeoJSONSource;
      const features: any[] = [];

      if (pins.length >= 3) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [...pins.map((p) => [p.lng, p.lat]), [pins[0].lng, pins[0].lat]],
            ],
          },
          properties: {},
        });
      }

      if (pins.length >= 2) {
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              ...pins.map((p) => [p.lng, p.lat]),
              [pins[0].lng, pins[0].lat],
            ],
          },
          properties: {},
        });
      }

      source.setData({ type: "FeatureCollection", features });
    }

    // Update Saved Child Lands Source
    if (map.isStyleLoaded() && map.getSource("saved-child-source")) {
      const source = map.getSource("saved-child-source") as maplibregl.GeoJSONSource;
      const features = childLands
        .filter((c) => c.pins.length >= 3)
        .map((c) => {
          const colorObj =
            CHILD_COLORS_LIST.find((co) => co.name === c.color) ||
            CHILD_COLORS_LIST[(c.id - 1) % CHILD_COLORS_LIST.length];
          return {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  ...c.pins.map((p) => [p.lng, p.lat]),
                  [c.pins[0].lng, c.pins[0].lat],
                ],
              ],
            },
            properties: {
              childId: c.id,
              hexColor: colorObj.hex,
              strokeColor: colorObj.stroke,
            },
          };
        });

      source.setData({ type: "FeatureCollection", features: features as any });
    }

    // Update Active Drawing Child Source
    if (map.isStyleLoaded() && map.getSource("active-child-source")) {
      const source = map.getSource("active-child-source") as maplibregl.GeoJSONSource;
      const features: any[] = [];
      const nextChildId = childLands.length + 1;
      const activeColor = CHILD_COLORS_LIST[(nextChildId - 1) % CHILD_COLORS_LIST.length];

      if (activeChildPins.length >= 3) {
        features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                ...activeChildPins.map((p) => [p.lng, p.lat]),
                [activeChildPins[0].lng, activeChildPins[0].lat],
              ],
            ],
          },
          properties: {
            hexColor: activeColor.hex,
            strokeColor: activeColor.stroke,
          },
        });
      }

      if (activeChildPins.length >= 2) {
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              ...activeChildPins.map((p) => [p.lng, p.lat]),
              [activeChildPins[0].lng, activeChildPins[0].lat],
            ],
          },
          properties: {
            hexColor: activeColor.hex,
            strokeColor: activeColor.stroke,
          },
        });
      }

      source.setData({ type: "FeatureCollection", features });
    }
  }, [pins, childLands, activeChildPins, isParentConfirmed]);

  // Debounced Search
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowResults(false);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (text.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    searchDebounceRef.current = setTimeout(() => {
      searchLocation(text);
    }, 600);
  };

  const searchLocation = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const formatted: SearchResult[] = data.map((item: any, idx: number) => ({
          id: item.place_id ? String(item.place_id) : String(idx),
          display_name: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        }));
        setSearchResults(formatted);
      } else {
        setSearchResults([]);
      }
      setShowResults(true);
    } catch (error) {
      console.error("Geocoding search error:", error);
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [result.longitude, result.latitude],
        zoom: 16,
        duration: 1200,
      });
    }

    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Map Controls
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [pos.coords.longitude, pos.coords.latitude],
              zoom: 16,
            });
          }
        },
        (err) => {
          console.warn("Geolocation failed or denied:", err);
          if (pins.length > 0 && mapRef.current) {
            mapRef.current.flyTo({
              center: [pins[0].lng, pins[0].lat],
              zoom: 16,
            });
          }
        }
      );
    }
  };

  // Start next child land from last point of previous child land
  const startFromPreviousChildEndpoint = () => {
    if (childLands.length === 0) return;
    const lastChild = childLands[childLands.length - 1];
    if (lastChild.pins.length > 0) {
      const endPin = lastChild.pins[lastChild.pins.length - 1];
      setActiveChildPins([endPin]);
    }
  };

  // Set active starting coordinator
  const setStartingCoordinator = (pinIndex: number) => {
    if (pins.length > pinIndex) {
      setActiveChildPins([pins[pinIndex]]);
    }
  };

  // Save current child land and chain to next
  const saveCurrentChildLand = () => {
    if (activeChildPins.length < 3) return;
    const nextId = childLands.length + 1;
    const colorObj = CHILD_COLORS_LIST[(nextId - 1) % CHILD_COLORS_LIST.length];
    const newChild: ChildLand = {
      id: nextId,
      label: `Child Land ${nextId}`,
      color: colorObj.name,
      pins: [...activeChildPins],
    };
    setChildLands((prev) => [...prev, newChild]);
    // Automatically chain to next child land from current endpoint
    const lastPin = activeChildPins[activeChildPins.length - 1];
    setActiveChildPins([lastPin]);
  };

  const deleteChildLand = (id: number) => {
    setChildLands((prev) => prev.filter((c) => c.id !== id));
  };

  const undoLastPin = () => {
    if (!isParentConfirmed) {
      setPins((prev) => prev.slice(0, -1));
    } else {
      if (activeChildPins.length > 0) {
        setActiveChildPins((prev) => prev.slice(0, -1));
      } else if (childLands.length > 0) {
        setChildLands((prev) => prev.slice(0, -1));
      }
    }
  };

  const resetPins = () => {
    if (!isParentConfirmed) {
      setPins([]);
      hasZoomedParentRef.current = false;
    } else {
      setChildLands([]);
      if (pins.length > 0) {
        setActiveChildPins([pins[0]]);
      } else {
        setActiveChildPins([]);
      }
    }
  };

  const handleConfirmClick = () => {
    if (pins.length >= 3) {
      setIsConfirming(true);
      const area = calculateArea(pins);
      setEstimatedArea(area);
      setGpsAccuracy(Math.floor(Math.random() * 3) + 3);

      setTimeout(() => {
        setIsConfirming(false);
        if (!isParentConfirmed) {
          setShowModal(true);
        } else {
          handleSaveAndConfirm();
        }
      }, 300);
    }
  };

  const handleConfirmParentFromModal = () => {
    setShowModal(false);
    setIsParentConfirmed(true);
    if (pins.length > 0) {
      setActiveChildPins([pins[0]]); // Pre-seed Child 1 starting from P1 (Coordinator 1)
    }
    if (mapRef.current && pins.length >= 3) {
      const lngs = pins.map((p) => p.lng);
      const lats = pins.map((p) => p.lat);
      mapRef.current.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 120, duration: 1200 }
      );
    }
  };

  const handleSaveAndConfirm = () => {
    let finalChildLands = [...childLands];
    if (activeChildPins.length >= 3) {
      const nextId = finalChildLands.length + 1;
      const colorObj = CHILD_COLORS_LIST[(nextId - 1) % CHILD_COLORS_LIST.length];
      finalChildLands.push({
        id: nextId,
        label: `Child Land ${nextId}`,
        color: colorObj.name,
        pins: [...activeChildPins],
      });
    }

    setShowModal(false);
    const payload = buildGeoJsonPayload(pins, finalChildLands);

    console.log("=================================================");
    console.log("🟢 CONFIRMED & SAVED LAND DATA SUBMITTED");
    console.log("📌 PARENT LAND PINS:", pins);
    console.log("📌 SAVED CHILD LANDS (Count: " + finalChildLands.length + "):", finalChildLands);
    console.log("📍 COMPLETE GEOJSON PAYLOAD OBJECT:", payload);
    console.log("📍 GEOJSON JSON STRING:\n", JSON.stringify(payload, null, 2));
    console.log("=================================================");

    navigate(`/super-admin/upload/land-details/${targetId}?boundaryConfirmed=true`, {
      state: {
        formData: stateData?.formData,
        pins: pins,
        childLands: finalChildLands,
        geoJsonPayload: payload,
      },
    });
  };

  const currentActiveChildId = childLands.length + 1;
  const currentActiveColor = CHILD_COLORS_LIST[(currentActiveChildId - 1) % CHILD_COLORS_LIST.length];

  // Calculate sum of child acres
  const totalChildAcres = childLands
    .reduce((sum, c) => sum + parseFloat(calculateArea(c.pins)), 0)
    .toFixed(2);
  const activeArea = activeChildPins.length >= 3 ? calculateArea(activeChildPins) : "0.00";
  const parentAcres = calculateArea(pins);

  return (
    <div className="h-screen w-full bg-[#F2F2F2] flex flex-col justify-start items-center py-4 px-4 md:px-8 font-sans overflow-hidden">
      <div className="w-full max-w-7xl h-full flex flex-col gap-4 min-h-0">
        {/* ── Top Header ── */}
        <div className="flex flex-row justify-between items-center w-full shrink-0">
          <UploadGoBack
            onClick={() =>
              navigate(`/super-admin/upload/land-details/${targetId}`, {
                state: {
                  formData: stateData?.formData,
                  pins,
                  childLands,
                  geoJsonPayload: buildGeoJsonPayload(pins, childLands),
                },
              })
            }
          />

          {/* Mode Indicator Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm border ${
                isParentConfirmed
                  ? "bg-[#E5E9D8] text-[#3D4A0D] border-[#CBD796]"
                  : "bg-amber-100 text-amber-900 border-amber-300"
              }`}
            >
              {isParentConfirmed
                ? "STEP 2: MANUAL CHILD LAND DRAWING (GOOGLE EARTH MODE)"
                : "STEP 1: PARENT LAND BOUNDARY"}
            </span>

            {isParentConfirmed && (
              <button
                type="button"
                onClick={() => {
                  setIsParentConfirmed(false);
                  setActiveChildPins([]);
                }}
                className="px-3 py-1 rounded-full text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Edit Parent Boundary
              </button>
            )}
          </div>
        </div>

        {/* ── Central Card Container ── */}
        <div className="w-full flex-1 min-h-0 bg-white shadow-sm rounded-3xl p-4 lg:p-5 relative flex flex-col gap-4">
          {/* Map Container */}
          <div className="relative w-full flex-1 min-h-0 bg-[#FFFFFF] border border-[rgba(0,0,0,0.12)] rounded-2xl overflow-hidden select-none">
            {/* Real MapLibre Interactive Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Live Snap Target Floating Pill at Top Center */}
            {activeSnapTarget && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#10B981] text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                <Magnet size={14} className="animate-bounce" />
                <span>Snapped to: {activeSnapTarget.label}</span>
              </div>
            )}

            {/* Top-Left Google Earth Style Manual Drawing Control Panel */}
            {isParentConfirmed && (
              <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-2xl rounded-2xl p-3.5 flex flex-col gap-3 w-80 max-h-[calc(100%-2rem)] overflow-y-auto animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Layers size={16} className="text-[#3D4A0D]" />
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#1A1C1D] uppercase tracking-wider">
                      Child Lands ({childLands.length})
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5E9D8] text-[#3D4A0D]">
                    {parentAcres} Acres Total
                  </span>
                </div>

                {/* Snapping Toggle & Status */}
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Magnet
                      size={14}
                      className={enableSnapping ? "text-[#10B981]" : "text-gray-400"}
                    />
                    <span className="text-[11px] font-bold text-gray-700">Magnetic Boundary Snap</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableSnapping(!enableSnapping)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold cursor-pointer transition-colors ${
                      enableSnapping
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {enableSnapping ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Instructions */}
                <div className="text-[10px] text-gray-500 font-medium leading-tight bg-blue-50/70 border border-blue-100 p-2 rounded-xl flex flex-col gap-1">
                  <span className="font-bold text-blue-900">How to draw:</span>
                  <span>
                    1. Click on Parent Coordinators (P1..P4) or boundary edge to snap starting point.
                  </span>
                  <span>2. Click points across the land portion.</span>
                  <span>3. Click on the boundary again to snap closing edge.</span>
                  <span>4. Click <b>Save Child #{currentActiveChildId}</b>.</span>
                </div>

                {/* Active Drawing Status */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border"
                        style={{
                          backgroundColor: currentActiveColor.hex,
                          borderColor: currentActiveColor.stroke,
                        }}
                      />
                      <span className="text-xs font-bold text-gray-800">
                        Drawing Child {currentActiveChildId}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500">
                      {activeChildPins.length} pts {activeChildPins.length >= 3 ? `(${activeArea} Ac)` : ""}
                    </span>
                  </div>

                  {/* Actions for Active Drawing */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={saveCurrentChildLand}
                        disabled={activeChildPins.length < 3}
                        className="flex-1 py-1.5 px-3 rounded-lg text-white font-bold text-[11px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                        style={{
                          backgroundColor: currentActiveColor.stroke,
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Save Child {currentActiveChildId}</span>
                      </button>

                      {activeChildPins.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveChildPins([])}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                          title="Clear current drawing points"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Quick Starting Point Selection Chips */}
                    <div className="flex flex-col gap-1 pt-1 border-t border-gray-200/60">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                        Quick Start From:
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {pins.map((_, pIdx) => {
                          const isCurrentStart =
                            activeChildPins.length > 0 &&
                            Math.abs(activeChildPins[0].lat - pins[pIdx].lat) < 0.000001 &&
                            Math.abs(activeChildPins[0].lng - pins[pIdx].lng) < 0.000001;

                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => setStartingCoordinator(pIdx)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border ${
                                isCurrentStart
                                  ? "bg-[#10B981] text-white border-[#047857] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                              }`}
                              title={`Start drawing from Parent Coordinator P${pIdx + 1}`}
                            >
                              P{pIdx + 1}
                            </button>
                          );
                        })}

                        {childLands.length > 0 && (
                          <button
                            type="button"
                            onClick={startFromPreviousChildEndpoint}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E5E9D8] text-[#3D4A0D] border border-[#CBD796] hover:bg-[#CBD796] transition-colors cursor-pointer"
                            title="Start from previous child endpoint"
                          >
                            Prev End
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved Child Lands List */}
                {childLands.length > 0 && (
                  <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Saved Child Lands ({totalChildAcres} / {parentAcres} Ac):
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildLands([])}
                        className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-0.5">
                      {childLands.map((child) => {
                        const colorObj =
                          CHILD_COLORS_LIST.find((c) => c.name === child.color) ||
                          CHILD_COLORS_LIST[(child.id - 1) % CHILD_COLORS_LIST.length];
                        const childArea = calculateArea(child.pins);

                        return (
                          <div
                            key={child.id}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border bg-white shadow-2xs text-xs font-semibold"
                            style={{ borderColor: colorObj.stroke }}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: colorObj.hex }}
                              />
                              <span className="truncate font-bold text-gray-800">
                                Child {child.id}
                              </span>
                              <span className="text-[10px] font-medium text-gray-500">
                                ({childArea} Acres)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteChildLand(child.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Child Land"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <span className="text-[9.5px] text-gray-400 italic">
                      💡 Tip: Drag any child pin on the map to adjust boundaries.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Top Right HUD Search Bar */}
            <div
              className="absolute flex flex-col z-20 top-4 right-4"
              style={{
                width: "clamp(12.4rem, 25vw, 24rem)",
              }}
            >
              <div className="flex flex-row items-center bg-white px-4 py-2 gap-2 shadow-[0px_4px_16px_rgba(0,0,0,0.18)] rounded-full border border-black/10">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search city, area...."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowResults(true);
                  }}
                  className="w-full bg-transparent outline-none font-['Plus_Jakarta_Sans'] font-medium text-xs md:text-sm text-gray-800 placeholder-gray-400"
                />
                {isSearching ? (
                  <Loader2 size={16} className="animate-spin text-gray-500 shrink-0" />
                ) : searchQuery.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                ) : null}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="bg-white rounded-2xl mt-2 max-h-56 overflow-y-auto shadow-2xl border border-gray-100 divide-y divide-gray-100 z-30">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectResult(item)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <MapPin size={16} className="text-[#3D4A0D] mt-0.5 shrink-0" />
                      <span className="font-['Plus_Jakarta_Sans'] text-xs font-medium text-gray-700 leading-snug">
                        {item.display_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results state */}
              {showResults &&
                searchResults.length === 0 &&
                !isSearching &&
                searchQuery.trim().length >= 3 && (
                  <div className="bg-white rounded-2xl mt-2 p-4 text-center shadow-2xl border border-gray-100 z-30">
                    <span className="font-['Plus_Jakarta_Sans'] text-xs text-gray-400">
                      No matching locations found
                    </span>
                  </div>
                )}
            </div>

            {/* Bottom-Left Action Controls (Undo & Reset) */}
            <div className="absolute bottom-4 left-4 z-10 flex flex-row items-center gap-3">
              <button
                type="button"
                onClick={undoLastPin}
                disabled={
                  !isParentConfirmed
                    ? pins.length === 0
                    : activeChildPins.length === 0 && childLands.length === 0
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md text-white font-['Plus_Jakarta_Sans'] text-xs font-semibold hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer border border-white/10"
              >
                <Undo2 size={16} />
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={resetPins}
                disabled={
                  !isParentConfirmed
                    ? pins.length === 0
                    : childLands.length === 0 && activeChildPins.length === 0
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md text-white font-['Plus_Jakarta_Sans'] text-xs font-semibold hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg cursor-pointer border border-white/10"
              >
                <RotateCcw size={16} />
                <span>{isParentConfirmed ? "Reset Children" : "Reset Pins"}</span>
              </button>
            </div>

            {/* Bottom-Right Zoom HUD Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center gap-2">
              <div className="flex flex-col items-center bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg select-none">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/15 active:bg-white/30 transition-colors border-b border-white/10 cursor-pointer"
                >
                  <Plus size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/15 active:bg-white/30 transition-colors cursor-pointer"
                >
                  <Minus size={18} />
                </button>
              </div>

              {/* Recenter Button */}
              <button
                type="button"
                onClick={handleRecenter}
                className="w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/15 active:bg-white/30 transition-colors shadow-lg cursor-pointer"
              >
                <Crosshair size={18} />
              </button>
            </div>
          </div>

          {/* Bottom Confirm Boundary Bar */}
          <div className="flex flex-row justify-between items-center w-full shrink-0 mt-1">
            <div className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-xs font-semibold text-gray-500">
              {!isParentConfirmed ? (
                pins.length < 3 ? (
                  <span>
                    Click on the map to add at least 3 points for Parent Boundary ({pins.length}/3)
                  </span>
                ) : (
                  <span className="text-[#3D4A0D]">
                    Parent boundary points added ({pins.length} points). Click Confirm to proceed to
                    Child Lands.
                  </span>
                )
              ) : (
                <span className="text-[#3D4A0D]">
                  Parent Confirmed ({parentAcres} Acres) | {childLands.length} Child Land
                  {childLands.length === 1 ? "" : "s"} Saved ({totalChildAcres} Acres)
                  {activeChildPins.length > 0
                    ? ` | Drawing Child ${currentActiveChildId} (${activeChildPins.length} pts)`
                    : ""}
                </span>
              )}
            </div>

            <button
              onClick={handleConfirmClick}
              disabled={pins.length < 3 || isConfirming}
              className="flex justify-center items-center rounded-full text-white font-['Outfit'] font-normal transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer shadow-sm px-8 py-3 text-sm bg-[#2A3008]"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isParentConfirmed ? (
                <span>CONFIRM & SAVE ALL LANDS</span>
              ) : (
                <span>Confirm Parent Boundary</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 md:p-6 animate-in fade-in duration-200">
          <div className="bg-[#F8F9FA] w-full max-w-lg rounded-t-[36px] md:rounded-[36px] p-6 md:p-8 shadow-2xl flex flex-col gap-6 border border-gray-200">
            {/* Modal Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full self-center" />

            {/* Header Row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] tracking-[1.5px] text-[#576400] uppercase block mb-1">
                  PARENT LAND DETECTED
                </span>
                <h3 className="font-['Manrope'] font-extrabold text-2xl md:text-3xl text-[#1A1C1D] leading-tight">
                  Parent Boundary
                  <br />
                  Confirmed
                </h3>
              </div>
              <div className="text-right">
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold text-gray-400 tracking-wider block uppercase mb-0.5">
                  STATUS
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#3D4A0D]">
                  Ready to Draw
                  <br />
                  Child Lands
                </span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-xs">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#3E4A3D] uppercase tracking-wider mb-2">
                  ESTIMATED AREA
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-['Manrope'] font-extrabold text-2xl text-gray-900">
                    {estimatedArea}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-gray-500">
                    Acres
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-xs">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[10px] text-[#3E4A3D] uppercase tracking-wider mb-2">
                  GPS ACCURACY
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-['Manrope'] font-extrabold text-2xl text-gray-900">
                    ±{gpsAccuracy}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-gray-500">
                    Meters
                  </span>
                </div>
                <div className="h-1 bg-[#576400] w-4/5 rounded-full mt-2" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 rounded-full border-2 border-[#3D4A0D] text-[#3D4A0D] font-['Plus_Jakarta_Sans'] font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Edit3 size={16} />
                <span>ADJUST PARENT POINTS</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmParentFromModal}
                className="w-full py-3.5 rounded-full text-white font-['Plus_Jakarta_Sans'] font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)",
                }}
              >
                <span>CONFIRM PARENT & DRAW CHILD LANDS</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminUploadViewMaps;


