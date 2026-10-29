import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithReauth } from "@/core/api/baseQueryWithReauth";
import { env } from "@/core/config/env";

export interface GenerateS3UrlPayload {
  key: string;
  filename?: string;
  folderPath?: string;
}

export interface GenerateS3UrlResponse {
  key: string;
  url: string; // The presigned URL
}

export const fileService = createApi({
  reducerPath: "fileService",
  baseQuery: createBaseQueryWithReauth(env.AUTH_API_BASE_URL),
  tagTypes: ["File"],
  endpoints: (builder) => ({
    generateS3Url: builder.mutation<GenerateS3UrlResponse, GenerateS3UrlPayload>({
      query: (payload) => ({
        url: "/s3/generateUrl",
        method: "POST",
        body: payload,
      }),
    }),
    uploadS3File: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/s3/uploadFile",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useGenerateS3UrlMutation, useUploadS3FileMutation } = fileService;
