import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

export interface SaveRoadApproachPayload {
  farmlandId: number;
  docType: string;
  is_private: number;
  is_governament: number;
  road_width: number;
  remarks: string;
  version: string;
}

export const valuationService = createApi({
  reducerPath: "valuationApi",
  baseQuery: createBaseQueryWithReauth(env.SUPER_ADMIN_API_BASE_URL + "/valuation"),
  tagTypes: ["Valuation"],
  endpoints: (builder) => ({
    getValuationStatus: builder.query<any, { farmlandId: number }>({
      query: (payload) => ({
        url: "/status",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Valuation"],
    }),
    saveRoadApproach: builder.mutation<any, SaveRoadApproachPayload>({
      query: (payload) => ({
        url: "/save-road-approach",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
    saveRecentTransactions: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-recent-transactions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
    saveGeologicalAdvantages: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-geological-advantages",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
    saveFuturePlans: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-future-plans",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
    saveValidatingDisadvantages: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-validating-disadvantages",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
    saveUpcomingInfrastructure: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-upcoming-infrastructure",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
    saveRailwayConnectivity: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-railway-connectivity",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
    saveAirportConnectivity: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-airport-connectivity",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Valuation"],
    }),
  }),
});

export const {
  useGetValuationStatusQuery,
  useSaveRoadApproachMutation,
  useSaveRecentTransactionsMutation,
  useSaveGeologicalAdvantagesMutation,
  useSaveFuturePlansMutation,
  useSaveValidatingDisadvantagesMutation,
  useSaveUpcomingInfrastructureMutation,
  useSaveRailwayConnectivityMutation,
  useSaveAirportConnectivityMutation,
} = valuationService;
