import { baseApi } from "@/core/api/baseApi";
import type { LoginRequest, LoginResponse, UserProfileResponse } from "@/features/auth/types";

export interface MaintenanceForgotPasswordRequest {
  login_id: string;
}

export interface MaintenanceForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface MaintenanceUpdatePasswordRequest {
  old_password?: string;
  new_password: string;
}

export interface MaintenanceUpdatePasswordResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export interface UpdateMaintenanceProfileRequest {
  userId: number;
  first_name: string;
  last_name: string;
  dob: string;
  profile_url: string;
}

export const maintenanceAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    maintenanceLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    maintenanceForgotPassword: builder.mutation<
      MaintenanceForgotPasswordResponse,
      MaintenanceForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forgotPassword",
        method: "POST",
        body,
      }),
    }),

    maintenanceUpdatePassword: builder.mutation<
      MaintenanceUpdatePasswordResponse,
      MaintenanceUpdatePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/updatePassword",
        method: "POST",
        body,
      }),
    }),

    getMaintenanceUserProfile: builder.query<
      { success: boolean; data: UserProfileResponse },
      number
    >({
      query: (user_id) => ({
        url: "/user/getUserById",
        method: "POST",
        body: { user_id },
      }),
      providesTags: ["User"],
    }),

    updateMaintenanceProfileDetails: builder.mutation<
      any,
      UpdateMaintenanceProfileRequest
    >({
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
  useMaintenanceLoginMutation,
  useMaintenanceForgotPasswordMutation,
  useMaintenanceUpdatePasswordMutation,
  useGetMaintenanceUserProfileQuery,
  useUpdateMaintenanceProfileDetailsMutation,
} = maintenanceAuthApi;
