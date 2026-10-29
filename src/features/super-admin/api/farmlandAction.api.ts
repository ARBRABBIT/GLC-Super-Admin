import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

export const farmlandActionService = createApi({
  reducerPath: "farmlandActionApi",
  baseQuery: createBaseQueryWithReauth(env.SUPER_ADMIN_API_BASE_URL + "/farmlandAction"),
  tagTypes: ["FarmlandAction", "LegalDocsStatus", "LocalIntelligenceStatus", "AgricultureStatus", "LandBoundariesStatus", "ValuationStatus"],
  endpoints: (builder) => ({
    submitFarmland: builder.mutation<
      any,
      {
        farmlandId: number;
        master_milestone_stage_id: number;
        master_milestone_stage_status_id: number;
        userId: number;
        forSale?: number;
      }
    >({
      query: (body) => ({
        url: "/submit",
        method: "POST",
        body,
      }),
    }),
    draftFarmland: builder.mutation<
      any,
      {
        farmlandId: number;
        master_milestone_stage_id: number;
        master_milestone_stage_status_id: number;
        is_draft: number;
      }
    >({
      query: (body) => ({
        url: "/draft",
        method: "POST",
        body,
      }),
    }),
    approveFarmlandTab: builder.mutation<
      any,
      {
        farmland_upload_id: number;
      }
    >({
      query: (body) => ({
        url: "/approve",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LegalDocsStatus", "LocalIntelligenceStatus", "AgricultureStatus", "LandBoundariesStatus", "ValuationStatus"],
    }),
    revertFarmlandTab: builder.mutation<
      any,
      {
        farmland_upload_id: number;
        revert_reason: string;
        version: number;
        master_revert_status_id: number;
        userId: number;
      }
    >({
      query: (body) => ({
        url: "/revert",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LegalDocsStatus", "LocalIntelligenceStatus", "AgricultureStatus", "LandBoundariesStatus", "ValuationStatus"],
    }),
    revertFarmland: builder.mutation<
      any,
      {
        farmlandId: number;
        userId: number;
        revertedStages: number[];
      }
    >({
      query: (body) => ({
        url: "/revertFarmland",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { 
  useSubmitFarmlandMutation, 
  useDraftFarmlandMutation,
  useApproveFarmlandTabMutation,
  useRevertFarmlandTabMutation,
  useRevertFarmlandMutation,
} = farmlandActionService;
