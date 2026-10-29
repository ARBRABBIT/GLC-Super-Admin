import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

import type {
  GetAllFarmlandsPayload,
  GetAllFarmlandsResponse,
  GetFarmlandByIdPayload,
  GetOwnerDetailsByFarmlandIdPayload,
  GetOwnerDetailsResponse,
  GetFamilyTreePayload,
  GetFamilyTreeResponse,
  GetLocalIntelligenceStatusPayload,
  GetAgricultureReportStatusPayload,
  GetLandAndBoundariesStatusPayload,
  GetFarmlandLegalDocsStatusPayload,
  GetFarmlandLegalDocsStatusResponse
} from "../types/farmland.types";

export const farmlandService = createApi({
  reducerPath: "farmlandService",
  baseQuery: createBaseQueryWithReauth(env.SUPER_ADMIN_API_BASE_URL),
  tagTypes: ["Farmland", "LegalDocsStatus", "LocalIntelligenceStatus", "AgricultureStatus", "LandBoundariesStatus", "ValuationStatus"],
  endpoints: (builder) => ({
    getAllFarmlands: builder.query<GetAllFarmlandsResponse, GetAllFarmlandsPayload | void>({
      query: (payload = {}) => ({
        url: "/dashBoard/getALLFarmlands",
        method: "POST",
        body: payload,
      }),
      providesTags: ["Farmland"],
    }),
    getFarmlandById: builder.query<any, GetFarmlandByIdPayload>({
      query: (payload) => ({
        url: "/dashBoard/getFarmlandById",
        method: "POST",
        body: payload,
      }),
      providesTags: (_result, _error, arg) => [{ type: "Farmland", id: arg.farmlandId }],
    }),
    getOwnerDetailsByFarmlandId: builder.query<GetOwnerDetailsResponse, GetOwnerDetailsByFarmlandIdPayload>({
      query: (payload) => ({  
        url: "/customer/getOwnerDetailsByFarmlandId",
        method: "POST",
        body: payload,
      }),
    }),
    getFamilyTree: builder.query<GetFamilyTreeResponse, GetFamilyTreePayload>({
      query: (payload) => ({
        url: "/customer/getFamilyTree",
        method: "POST",
        body: payload,
      }),
    }),
    getFarmlandLegalDocsStatus: builder.query<GetFarmlandLegalDocsStatusResponse, GetFarmlandLegalDocsStatusPayload>({
      query: (payload) => ({
        url: "/farmlandLegalDocs/status",
        method: "POST",
        body: payload,
      }),
      providesTags: ["LegalDocsStatus"],
    }),
    getLocalIntelligenceStatus: builder.query<any, GetLocalIntelligenceStatusPayload>({
      query: (payload) => ({
        url: "/localIntelligence/status",
        method: "POST",
        body: payload,
      }),
      providesTags: ["LocalIntelligenceStatus"],
    }),
    getAgricultureReportStatus: builder.query<any, GetAgricultureReportStatusPayload>({
      query: (payload) => ({
        url: "/agricultureReport/status",
        method: "POST",
        body: payload,
      }),
      providesTags: ["AgricultureStatus"],
    }),
    getLandAndBoundariesStatus: builder.query<any, GetLandAndBoundariesStatusPayload>({
      query: (payload) => ({
        url: "/landAndBoundaries/status",
        method: "POST",
        body: payload,
      }),
      providesTags: ["LandBoundariesStatus"],
    }),
    getValuationStatus: builder.query<any, { farmlandId: number | string }>({
      query: (payload) => ({
        url: "/Valuation/status",
        method: "POST",
        body: payload,
      }),
      providesTags: ["ValuationStatus"],
    }),
    submitNewFarmLand: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/dashBoard/submitNewFarmLand",
        method: "POST",
        body: payload,
      }),
    }),
    uploadFarmlandLegalDoc: builder.mutation<any, {
      farmlandId: number | string;
      docType: string;
      documentUrls: string[] | string;
      remarks: string;
      version: string | number;
    }>({
      query: (payload) => ({
        url: "/farmlandLegalDocs/upload",
        method: "POST",
        body: payload,
      }),
    }),
    saveLandCoordinates: builder.mutation<any, {
      farmlandId: number | string;
      land_coordinates: string;
      remarks: string;
      docType: string;
      version: string | number;
    }>({
      query: (payload) => ({
        url: "/farmlandLegalDocs/save-coordinates",
        method: "POST",
        body: payload,
      }),
    }),
    uploadAnyIssues: builder.mutation<any, any>({
      query: (payload) => ({ url: "/localIntelligence/anyIssues", method: "POST", body: payload }),
    }),
    uploadLocalLiabilities: builder.mutation<any, any>({
      query: (payload) => ({ url: "/localIntelligence/localLiabilities", method: "POST", body: payload }),
    }),
    uploadPendingLoans: builder.mutation<any, any>({
      query: (payload) => ({ url: "/localIntelligence/pendingLoans", method: "POST", body: payload }),
    }),
    uploadOwnerMindset: builder.mutation<any, any>({
      query: (payload) => ({ url: "/localIntelligence/ownerMindset", method: "POST", body: payload }),
    }),
    uploadSourcePerson: builder.mutation<any, any>({
      query: (payload) => ({ url: "/localIntelligence/sourcePerson", method: "POST", body: payload }),
    }),
    uploadAgreements: builder.mutation<any, any>({
      query: (payload) => ({ url: "/localIntelligence/agreements", method: "POST", body: payload }),
    }),
    uploadPreviousTransactions: builder.mutation<any, any>({
      query: (payload) => ({ url: "/localIntelligence/previousTransactions", method: "POST", body: payload }),
    }),
    getDraftFarmlands: builder.query<any, void>({
      query: () => ({
        url: "/dashBoard/getDraftFarmlands",
        method: "POST",
        body: { offset: 0, limit: 200, country_id: 1, state_id: 1 },
      }),
      providesTags: ["Farmland"],
    }),
  }),
});

export const {
  useGetAllFarmlandsQuery,
  useLazyGetAllFarmlandsQuery,
  useGetFarmlandByIdQuery,
  useGetOwnerDetailsByFarmlandIdQuery,
  useGetFamilyTreeQuery,
  useGetFarmlandLegalDocsStatusQuery,
  useGetLocalIntelligenceStatusQuery,
  useGetAgricultureReportStatusQuery,
  useGetLandAndBoundariesStatusQuery,
  useGetValuationStatusQuery,
  useSubmitNewFarmLandMutation,
  useUploadFarmlandLegalDocMutation,
  useSaveLandCoordinatesMutation,
  useUploadAnyIssuesMutation,
  useUploadLocalLiabilitiesMutation,
  useUploadPendingLoansMutation,
  useUploadOwnerMindsetMutation,
  useUploadSourcePersonMutation,
  useUploadAgreementsMutation,
  useUploadPreviousTransactionsMutation,
  useGetDraftFarmlandsQuery,
} = farmlandService;
