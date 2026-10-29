import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

export const landAndBoundariesService = createApi({
  reducerPath: "landAndBoundariesApi",
  baseQuery: createBaseQueryWithReauth(env.SUPER_ADMIN_API_BASE_URL + "/landAndBoundaries"),
  tagTypes: ["LandAndBoundaries"],
  endpoints: (builder) => ({
    uploadLandAndBoundariesDoc: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/upload",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    uploadLandAndBoundariesCoverImage: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-cover-image",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    getLandAndBoundariesCoverImage: builder.query<any, any>({
      query: (payload) => ({
        url: "/get-cover-image",
        method: "POST",
        body: payload,
      }),
      providesTags: ["LandAndBoundaries"],
    }),
    getLandAndBoundariesStatus: builder.query<any, any>({
      query: (payload) => ({
        url: "/status",
        method: "POST",
        body: payload,
      }),
      providesTags: ["LandAndBoundaries"],
    }),
    saveShapeOfLand: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-shape-of-land",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    saveWaterElectricity: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-water-electricity",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    saveExistingTrees: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-existing-trees",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    saveEastBoundaries: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-east-boundaries",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    saveWestBoundaries: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-west-boundaries",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    saveNorthBoundaries: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-north-boundaries",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
    saveSouthBoundaries: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/save-south-boundaries",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["LandAndBoundaries"],
    }),
  }),
});

export const {
  useUploadLandAndBoundariesDocMutation,
  useUploadLandAndBoundariesCoverImageMutation,
  useGetLandAndBoundariesCoverImageQuery,
  useGetLandAndBoundariesStatusQuery,
  useSaveShapeOfLandMutation,
  useSaveWaterElectricityMutation,
  useSaveExistingTreesMutation,
  useSaveEastBoundariesMutation,
  useSaveWestBoundariesMutation,
  useSaveNorthBoundariesMutation,
  useSaveSouthBoundariesMutation,
} = landAndBoundariesService;
