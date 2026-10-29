import React, { useState } from "react";
import { useGeneratePresignedUrlQuery } from "@/features/auth/api/authApi";

interface S3ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackType?: 'avatar' | 'cover' | 'none';
  customFallback?: string;
}

const FALLBACKS = {
  avatar: "https://i.pravatar.cc/150?u=superadmin",
  cover: "/super-admin/images/farmland1.png",
  none: ""
};

export const S3Image: React.FC<S3ImageProps> = ({ 
  src, 
  fallbackType = 'none', 
  customFallback,
  alt = "",
  ...props 
}) => {
  const [imgError, setImgError] = useState(false);
  
  // A string is considered an S3 key if it is not empty and does not start with http, data:, or /
  const isS3Key = Boolean(src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("/"));
  
  const { data: s3Data, isError: isS3Error } = useGeneratePresignedUrlQuery(src || "", { 
    skip: !isS3Key 
  });
  
  const fallback = customFallback || FALLBACKS[fallbackType];
  
  let finalUrl = src;
  if (isS3Key) {
    finalUrl = s3Data?.url;
  }
  
  // If S3 query failed, or image tag failed to load naturally, or no URL is available, use fallback
  const displayUrl = (isS3Error || imgError || !finalUrl) ? fallback : finalUrl;

  return (
    <img 
      src={displayUrl} 
      alt={alt} 
      onError={() => setImgError(true)}
      {...props} 
    />
  );
};

export default S3Image;
