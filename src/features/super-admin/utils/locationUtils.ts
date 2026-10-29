import { useGetAllGeoMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useMemo } from 'react';

export interface LocationLookupParams {
  country_id?: number | null;
  state_id?: number | null;
  district_id?: number | null;
  mandal_id?: number | null;
}

export interface LocationNames {
  countryName: string;
  stateName: string;
  districtName: string;
  mandalName: string;
  isLoading: boolean;
}

export const useLocationLookup = (location?: LocationLookupParams): LocationNames => {
  const { data: geoData, isLoading } = useGetAllGeoMasterDataQuery();

  return useMemo(() => {
    if (!geoData || !location) {
      return {
        countryName: '-',
        stateName: '-',
        districtName: '-',
        mandalName: '-',
        isLoading,
      };
    }

    const country = location.country_id 
      ? geoData.countries?.find((c: any) => c.id === location.country_id) 
      : null;
      
    const state = location.state_id 
      ? geoData.states?.find((s: any) => s.id === location.state_id) 
      : null;
      
    const district = location.district_id 
      ? geoData.districts?.find((d: any) => d.id === location.district_id) 
      : null;
      
    const mandal = location.mandal_id 
      ? geoData.mandals?.find((m: any) => m.id === location.mandal_id) 
      : null;

    return {
      countryName: country?.desc || '-',
      stateName: state?.desc || '-',
      districtName: district?.desc || '-',
      mandalName: mandal?.desc || '-',
      isLoading,
    };
  }, [geoData, location, isLoading]);
};

/**
 * Format location names (Village, Mandal, District) from farmland/service-request
 * data and geoMasterData.
 */
export const formatLocation = (
  raw: any,
  geoData?: any
): string => {
  if (!raw) return "—";

  // If raw is already a string
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (
      trimmed &&
      trimmed !== "—" &&
      trimmed !== "-" &&
      trimmed.toLowerCase() !== "null" &&
      trimmed.toLowerCase() !== "undefined"
    ) {
      return trimmed;
    }
  }

  const locObj =
    (raw.location_details && typeof raw.location_details === "object" ? raw.location_details : null) ||
    (raw.location && typeof raw.location === "object" ? raw.location : null) ||
    (raw.locationDetails && typeof raw.locationDetails === "object" ? raw.locationDetails : null) ||
    (typeof raw === "object" ? raw : {});

  const isStringVal = (v: any): boolean =>
    typeof v === "string" &&
    isNaN(Number(v)) &&
    v.trim() !== "" &&
    v.trim() !== "—" &&
    v.trim() !== "-" &&
    v.trim().toLowerCase() !== "null" &&
    v.trim().toLowerCase() !== "undefined";

  const village =
    (isStringVal(locObj.village_name) ? locObj.village_name : null) ||
    (isStringVal(locObj.village) ? locObj.village : null) ||
    (isStringVal(raw.village_name) ? raw.village_name : null) ||
    (isStringVal(raw.village) ? raw.village : null) ||
    (isStringVal(locObj.area_name) ? locObj.area_name : null) ||
    (isStringVal(locObj.area) ? locObj.area : null) ||
    (isStringVal(raw.area_name) ? raw.area_name : null);

  const mandalName =
    (isStringVal(locObj.mandal_name) ? locObj.mandal_name : null) ||
    (isStringVal(locObj.mandal) ? locObj.mandal : null) ||
    (isStringVal(raw.mandal_name) ? raw.mandal_name : null) ||
    (isStringVal(raw.mandal) ? raw.mandal : null);

  const districtName =
    (isStringVal(locObj.district_name) ? locObj.district_name : null) ||
    (isStringVal(locObj.district) ? locObj.district : null) ||
    (isStringVal(raw.district_name) ? raw.district_name : null) ||
    (isStringVal(raw.district) ? raw.district : null);

  const stateName =
    (isStringVal(locObj.state_name) ? locObj.state_name : null) ||
    (isStringVal(locObj.state) ? locObj.state : null) ||
    (isStringVal(raw.state_name) ? raw.state_name : null) ||
    (isStringVal(raw.state) ? raw.state : null);

  const toNumId = (v: any): number | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    const n = Number(v);
    return !isNaN(n) && n > 0 ? n : undefined;
  };

  const mandalId =
    toNumId(locObj.mandal_id) ??
    toNumId(locObj.mandalId) ??
    toNumId(raw.mandal_id) ??
    toNumId(raw.mandalId) ??
    toNumId(locObj.mandal) ??
    toNumId(raw.mandal);

  const districtId =
    toNumId(locObj.district_id) ??
    toNumId(locObj.districtId) ??
    toNumId(raw.district_id) ??
    toNumId(raw.districtId) ??
    toNumId(locObj.district) ??
    toNumId(raw.district);

  const stateId =
    toNumId(locObj.state_id) ??
    toNumId(locObj.stateId) ??
    toNumId(raw.state_id) ??
    toNumId(raw.stateId) ??
    toNumId(locObj.state) ??
    toNumId(raw.state);

  const countryId =
    toNumId(locObj.country_id) ??
    toNumId(locObj.countryId) ??
    toNumId(raw.country_id) ??
    toNumId(raw.countryId);

  const resolvedMandal =
    mandalName ||
    (mandalId &&
      (geoData?.mandals?.find((m: any) => Number(m.id) === mandalId)?.desc ||
        geoData?.mandals?.find((m: any) => Number(m.id) === mandalId)?.name ||
        geoData?.mandals?.find((m: any) => Number(m.id) === mandalId)?.mandal_name)) ||
    "";

  const resolvedDistrict =
    districtName ||
    (districtId &&
      (geoData?.districts?.find((d: any) => Number(d.id) === districtId)?.desc ||
        geoData?.districts?.find((d: any) => Number(d.id) === districtId)?.name ||
        geoData?.districts?.find((d: any) => Number(d.id) === districtId)?.district_name)) ||
    "";

  const resolvedState =
    stateName ||
    (stateId &&
      (geoData?.states?.find((s: any) => Number(s.id) === stateId)?.desc ||
        geoData?.states?.find((s: any) => Number(s.id) === stateId)?.name ||
        geoData?.states?.find((s: any) => Number(s.id) === stateId)?.state_name)) ||
    "";

  const resolvedCountry =
    (countryId &&
      (geoData?.countries?.find((c: any) => Number(c.id) === countryId)?.desc ||
        geoData?.countries?.find((c: any) => Number(c.id) === countryId)?.name ||
        geoData?.countries?.find((c: any) => Number(c.id) === countryId)?.country_name)) ||
    "";

  const parts: string[] = [];
  if (village && isStringVal(village)) {
    parts.push(village.trim());
  }
  if (resolvedMandal && isStringVal(resolvedMandal)) {
    parts.push(resolvedMandal.trim());
  }
  if (resolvedDistrict && isStringVal(resolvedDistrict)) {
    parts.push(resolvedDistrict.trim());
  }

  // Deduplicate parts case-insensitively
  const uniqueParts = parts.filter(
    (part, idx) => parts.findIndex((p) => p.toLowerCase() === part.toLowerCase()) === idx
  );

  if (uniqueParts.length > 0) {
    return uniqueParts.join(", ");
  }

  if (resolvedState && isStringVal(resolvedState)) {
    return resolvedState.trim();
  }

  if (resolvedCountry && isStringVal(resolvedCountry)) {
    return resolvedCountry.trim();
  }

  if (isStringVal(raw.location)) {
    return raw.location.trim();
  }

  if (isStringVal(raw.address)) {
    return raw.address.trim();
  }

  return "—";
};
