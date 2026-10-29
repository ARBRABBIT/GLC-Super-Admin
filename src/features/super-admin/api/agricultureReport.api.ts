import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

export const agricultureReportService = createApi({
  reducerPath: "agricultureReportService",
  baseQuery: createBaseQueryWithReauth(env.SUPER_ADMIN_API_BASE_URL),
  tagTypes: ["AgricultureReport"],
  endpoints: (builder) => ({
    getAgricultureReportStatus: builder.query<any, { farmlandId: string | number }>({
      query: (body) => ({
        url: "/agricultureReport/status",
        method: "POST",
        body,
      }),
      providesTags: ["AgricultureReport"],
    }),
    uploadAgricultureReportDoc: builder.mutation<any, {
      farmlandId: number | string;
      docType: string;
      documentUrls: string[] | string;
      remarks: string;
      version: string | number;
    }>({
      query: (payload) => ({
        url: "/landAndBoundaries/upload",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveSoil: builder.mutation<any, { farmlandId: string | number; docType: string; soil_type_id: number; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-soil",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveCropType: builder.mutation<any, { farmlandId: string | number; docType: string; crop_id: number; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-crop-type",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveGroundWater: builder.mutation<any, { farmlandId: string | number; docType: string; ground_water_level: string; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-ground-water",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveTypesOfCropCanBeGrown: builder.mutation<any, { farmlandId: string | number; docType: string; is_crop_available: string; crop_ids: number[]; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-types-of-crop-can-be-grown",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveCurrentCultivation: builder.mutation<any, { farmlandId: string | number; docType: string; is_lease: number; name: string; contact_number: string; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-current-cultivation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveCurrentYield: builder.mutation<any, { farmlandId: string | number; docType: string; current_yield_cost: string; current_returns: string; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-current-yield",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveFutureCrops: builder.mutation<any, { farmlandId: string | number; docType: string; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-future-crops",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveMaintenance: builder.mutation<any, { farmlandId: string | number; docType: string; expected_return: string; crop_ids: number[]; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-maintenance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
    saveAdvantagesDisadvantages: builder.mutation<any, { farmlandId: string | number; docType: string; advantages: string; disadvantages: string; remarks: string; version: string }>({
      query: (body) => ({
        url: "/agricultureReport/save-advantages-disadvantages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgricultureReport"],
    }),
  }),
});

export const {
  useGetAgricultureReportStatusQuery,
  useUploadAgricultureReportDocMutation,
  useSaveSoilMutation,
  useSaveCropTypeMutation,
  useSaveGroundWaterMutation,
  useSaveTypesOfCropCanBeGrownMutation,
  useSaveCurrentCultivationMutation,
  useSaveCurrentYieldMutation,
  useSaveFutureCropsMutation,
  useSaveMaintenanceMutation,
  useSaveAdvantagesDisadvantagesMutation,
} = agricultureReportService;
