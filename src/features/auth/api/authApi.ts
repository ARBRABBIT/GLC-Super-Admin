import { baseApi } from "../../../core/api/baseApi";
import type { LoginRequest, LoginResponse, UserProfileResponse } from "../types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
     
    forgotPassword: builder.mutation<{ success: boolean; message: string }, { login_id: string }>({
  query: (body) => ({
    url: "/auth/forgotPassword",
    method: "POST",
    body,
  }),
}),

    updatePassword: builder.mutation<any, { old_password: string; new_password: string }>({
      query: (body) => ({
        url: "/auth/updatePassword",
        method: "POST",
        body,
      }),
    }),

    sendIssueMail: builder.mutation({
      query: (body) => ({
        url: "/mail/send",
        method: "POST",
        body,
      }),
    }),

    approveUser: builder.mutation<any, { user_id: number; role_id: number; role_code: string }>({
      query: (body) => ({
        url: "/auth/approveUser",
        method: "POST",
        body,
      }),
    }),

    generatePresignedUrl: builder.query<{ url: string }, string>({
      query: (key) => ({
        url: "/s3/generateUrl",
        method: "POST",
        body: { key },
      }),
    }),

    getUserProfile: builder.query<{ success: boolean; data: UserProfileResponse }, number>({
      query: (user_id) => ({
        url: "/user/getUserById",
        method: "POST",
        body: { user_id },
      }),
      providesTags: ["User"],
    }),

    updateProfileDetails: builder.mutation<any, { userId: number; first_name: string; last_name: string; dob: string; profile_url: string }>({
      query: (body) => ({
        url: "/user/updateProfileDetails",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSendIssueMailMutation,
  useApproveUserMutation,
  useGeneratePresignedUrlQuery,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useGetUserProfileQuery,
  useUpdateProfileDetailsMutation,
} = authApi;