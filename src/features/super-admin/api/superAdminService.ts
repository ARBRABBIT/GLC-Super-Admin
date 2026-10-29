import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

export const superAdminService = createApi({
  reducerPath: "superAdminService",
  baseQuery: createBaseQueryWithReauth(env.ROLE_MANAGER_API_BASE_URL),
  tagTypes: ["SADashboard", "SAFarmland", "SAUser"],
  endpoints: (builder) => ({
    // ── Dashboard endpoints (placeholder — wire to real API when ready) ──
    getDashboardStats: builder.query<any, void>({
      query: () => ({
        url: "/superadmin/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["SADashboard"],
    }),

    getSalesReport: builder.query<any, { period: string }>({
      query: ({ period }) => ({
        url: "/superadmin/sales-report",
        method: "POST",
        body: { period },
      }),
      providesTags: ["SADashboard"],
    }),

    getTopPerformers: builder.query<any, void>({
      query: () => ({
        url: "/superadmin/top-performers",
        method: "GET",
      }),
      providesTags: ["SADashboard"],
    }),

    getSubscriberGrowth: builder.query<any, { period: string }>({
      query: ({ period }) => ({
        url: "/superadmin/subscriber-growth",
        method: "POST",
        body: { period },
      }),
      providesTags: ["SADashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesReportQuery,
  useGetTopPerformersQuery,
  useGetSubscriberGrowthQuery,
} = superAdminService;
