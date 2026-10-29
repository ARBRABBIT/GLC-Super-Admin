import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

import type { MasterDataResponse, GeoMasterData } from "../types/masterData.types";
import { transformTable } from "../utils/dataTransformers";
console.log(env.SUPER_ADMIN_API_BASE_URL, "super-admin")
export const masterDataService = createApi({
  reducerPath: "masterDataService",
  baseQuery: createBaseQueryWithReauth(env.SUPER_ADMIN_API_BASE_URL),
  tagTypes: ["MasterData", "GeoMasterData"],
  endpoints: (builder) => ({
    getAllMasterData: builder.query<MasterDataResponse, void>({
      query: () => ({
        url: "/master/getAllMasterData",
        method: "POST",
        body: "", // empty body as specified in curl
      }),
      providesTags: ["MasterData"],
      transformResponse: (response: any): MasterDataResponse => {
        return (response?.data ? response.data : response) as MasterDataResponse;
      },
    }),
    getAllGeoMasterData: builder.query<GeoMasterData, void>({
      query: () => ({
        url: "/master/getAllGeoMasterData",
        method: "POST",
        body: "", // empty body as specified in curl
      }),
      providesTags: ["GeoMasterData"],
      transformResponse: (response: any): GeoMasterData => {
        const payload = response?.data ? response.data : response;
        const transformed: GeoMasterData = {
          countries: transformTable(payload?.countries || payload?.countrys),
          states: transformTable(payload?.states),
          districts: transformTable(payload?.districts),
          mandals: transformTable(payload?.mandals),
        };
        return transformed;
      },
    }),
  }),
});

export const {
  useGetAllMasterDataQuery,
  useGetAllGeoMasterDataQuery,
  useLazyGetAllMasterDataQuery,
  useLazyGetAllGeoMasterDataQuery,
} = masterDataService;
