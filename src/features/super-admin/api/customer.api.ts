import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

export const customerService = createApi({
  reducerPath: "customerService",
  baseQuery: createBaseQueryWithReauth(env.SUPER_ADMIN_API_BASE_URL),
  tagTypes: ["Customer", "FamilyTree"],
  endpoints: (builder) => ({
    saveOwnerDetails: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/customer/save",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Customer", "FamilyTree"],
    }),
    addFamilyMember: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/customer/addFamilyMember",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FamilyTree"],
    }),
    updateFamilyMember: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/customer/updateFamilyMember",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FamilyTree"],
    }),
    deleteFamilyMember: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/customer/deleteFamilyMember",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FamilyTree"],
    }),
  }),
});

export const {
  useSaveOwnerDetailsMutation,
  useAddFamilyMemberMutation,
  useUpdateFamilyMemberMutation,
  useDeleteFamilyMemberMutation,
} = customerService;
