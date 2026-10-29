import React from "react";
import { cn } from "@/lib/utils";

export interface UploadFarmlandData {
  id: string;
  title: string;
  acres: string;
  uploadedAt?: string;
  soilType?: string;
  image: string;
  status: "draft" | "completed";
  uploader: {
    name: string;
    avatar: string;
  };
}

interface UploadFarmlandCardProps {
  data: UploadFarmlandData;
  onResume?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

const UploadFarmlandCard: React.FC<UploadFarmlandCardProps> = ({
  data,
  onResume,
  onViewDetails,
  className,
}) => {
  const isDraft = data.status === "draft";

  return (
    <div
      className={cn(
        "flex flex-col gap-[clamp(0.72rem,1.5vw,1.25rem)] p-[clamp(0.72rem,1.5vw,1.25rem)] bg-white border border-[#F1F5F9] rounded-[clamp(0.96rem,2vw,1.56rem)] transition-all duration-300 hover:shadow-lg w-[clamp(10.32rem,21.5vw,23.0rem)] shrink-0",
        "shadow-[0px_0.05rem_0.1rem_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {/* Image Container */}
      <div className="w-full h-[clamp(5.64rem,11.75vw,13.0rem)] rounded-[clamp(0.72rem,1.5vw,1.25rem)] overflow-hidden shrink-0">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Details Container */}
      <div className="flex flex-col gap-[clamp(0.48rem,1vw,0.8rem)]">
        {/* Title */}
        <h4 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[clamp(0.62rem,1.3vw,1.875rem)] leading-snug tracking-tight text-[#262C00]">
          {data.title}
        </h4>

        {/* Info Grid (Bounded by top/bottom border) */}
        <div className="border-y border-[#F1F5F9] py-[clamp(0.38rem,0.8vw,0.75rem)] flex items-center justify-between relative">
          <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)] w-1/2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.34rem,0.7vw,0.875rem)] leading-none tracking-wider text-[#94A3B8] uppercase">
              Acres
            </span>
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.48rem,1vw,1.25rem)] leading-normal text-[#334155]">
              {data.acres}
            </span>
          </div>

          <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)] w-1/2">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.34rem,0.7vw,0.875rem)] leading-none tracking-wider text-[#94A3B8] uppercase">
              {data.soilType ? "Soil Type" : "Uploaded At"}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.48rem,1vw,1.25rem)] leading-normal text-[#334155]">
              {data.soilType || data.uploadedAt}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-[clamp(0.24rem,0.5vw,0.45rem)]">
          {/* Uploader Avatar & Name */}
          <div className="flex items-center gap-[clamp(0.24rem,0.5vw,0.45rem)] min-w-0">
            <img
              src={data.uploader.avatar}
              alt={data.uploader.name}
              className="w-[clamp(0.72rem,1.5vw,1.25rem)] h-[clamp(0.72rem,1.5vw,1.25rem)] rounded-full object-cover shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.uploader.name
                )}&background=random&size=32`;
              }}
            />
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[clamp(0.38rem,0.8vw,1.125rem)] leading-none text-[#64748B] truncate">
              {data.uploader.name}
            </span>
          </div>

          {/* Action Button */}
          {isDraft ? (
            <button
              onClick={() => onResume?.(data.id)}
              className="h-[clamp(1.06rem,2.2vw,1.9rem)] px-[clamp(0.72rem,1.5vw,1.25rem)] rounded-[clamp(1.2rem,2.5vw,2.0rem)] text-white font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.38rem,0.8vw,1.125rem)] leading-none text-center flex items-center justify-center transition-opacity hover:opacity-90"
              style={{
                background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)",
              }}
            >
              Resume
            </button>
          ) : (
            <button
              onClick={() => onViewDetails?.(data.id)}
              className="h-[clamp(0.96rem,2vw,1.75rem)] px-[clamp(0.58rem,1.2vw,1.0rem)] border border-[#E2E8F0] hover:bg-gray-50 rounded-full text-[#475569] font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.38rem,0.8vw,1.125rem)] leading-none text-center flex items-center justify-center transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFarmlandCard;
