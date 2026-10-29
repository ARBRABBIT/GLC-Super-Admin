import React, { useState } from "react";
import { Bell } from "lucide-react";
import UploadGoBack from "./UploadGoBack";

export interface UploadFarmlandDetailsProps {
  farmland: {
    id: string;
    title: string;
    acres: string;
    uploadedAt?: string;
    image: string;
    status: "draft" | "completed";
    uploader: {
      name: string;
      avatar: string;
    };
    soilType?: string;
  };
  onBack: () => void;
  onActionComplete?: (id: string, action: "resume" | "view") => void;
}

const UploadFarmlandDetails: React.FC<UploadFarmlandDetailsProps> = ({
  farmland,
  onBack,
  onActionComplete,
}) => {
  const isDraft = farmland.status === "draft";

  // Simulate verification state/completion action
  const [isVerifying, setIsVerifying] = useState(false);

  const handleActionClick = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onActionComplete?.(farmland.id, isDraft ? "resume" : "view");
    }, 1200);
  };

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(0.72rem,1.5vw,1.5rem)] px-[clamp(0.5rem,1.5vw,1rem)] py-[clamp(0.96rem,2vw,2.0rem)] text-[#1A1C1D]">
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex items-center justify-between w-full">
        <UploadGoBack onClick={onBack} />

        {/* Right Notification & Profile Controls */}
        <div className="flex items-center gap-[clamp(0.38rem,0.8vw,0.75rem)]">
          {/* Notification Bell */}
          <button className="relative w-[clamp(1.56rem,3.25vw,3.5rem)] h-[clamp(1.56rem,3.25vw,3.5rem)] bg-white hover:bg-gray-50 border border-[#F1F5F9] rounded-full flex items-center justify-center transition-colors shadow-sm">
            <Bell size={20} className="text-[#2C2C2C]" />
            <span className="absolute top-[clamp(0.38rem,0.8vw,0.9rem)] right-[clamp(0.38rem,0.8vw,0.9rem)] w-[clamp(0.24rem,0.5vw,0.5rem)] h-[clamp(0.24rem,0.5vw,0.5rem)] bg-[#EF4646] rounded-full" />
          </button>

          {/* User Profile Avatar */}
          <div className="w-[clamp(1.56rem,3.25vw,3.5rem)] h-[clamp(1.56rem,3.25vw,3.5rem)] rounded-full border border-[#F1F5F9] overflow-hidden shadow-sm shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
              alt="Super Admin Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Page Section Title ── */}
      <div className="mt-[clamp(0.5rem,1.5vw,1rem)]">
        <h1 className="font-['Manrope'] font-extrabold text-[clamp(0.93rem,1.94vw,2.25rem)] leading-[clamp(1.6rem,3.33vw,3.75rem)] tracking-[-1.2px] text-[#1A1C1D]">
          {isDraft ? "Resume Farmland" : "Uploaded Farmland"}
        </h1>
      </div>

      {/* ── Two-Column Mid Section ── */}
      <div className="flex flex-col md:flex-row gap-[clamp(0.72rem,1.5vw,1.5rem)] items-stretch w-full">
        {/* Left Side: Land Hero Image Card with overlays */}
        <div className="relative flex-1 min-w-[clamp(18rem,50%,36rem)] md:w-[clamp(17.47rem,36.39vw,36.0rem)] md:h-[clamp(13.63rem,28.4vw,32.0rem)] rounded-[clamp(1.07rem,2.22vw,2.75rem)] overflow-hidden shadow-sm aspect-[4/3] md:aspect-auto">
          {/* Main Background Image */}
          <img
            src={farmland.image}
            alt={farmland.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";
            }}
          />
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Bottom Left Badge & Title */}
          <div className="absolute bottom-[clamp(0.96rem,2vw,2.25rem)] left-[clamp(0.96rem,2vw,2.25rem)] flex flex-col gap-[clamp(0.29rem,0.6vw,0.6rem)]">
            <div
              className="self-start px-[clamp(0.33rem,0.69vw,1.0rem)] py-[clamp(0.18rem,0.375vw,0.5rem)] rounded-full bg-white/20 border border-white/10 backdrop-blur-md flex items-center justify-center"
              style={{ width: isDraft ? "clamp(3.77rem,7.85vw,9.0rem)" : "clamp(4.53rem,9.44vw,11.0rem)" }}
            >
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.33rem,0.69vw,0.875rem)] tracking-[0.6px] uppercase text-white leading-none">
                {isDraft ? "In progress" : "Live on website"}
              </span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[clamp(1.07rem,2.22vw,2.75rem)] leading-[clamp(1.6rem,3.33vw,4.0rem)] text-white tracking-[-1.2px]">
              {farmland.title}
            </h2>
          </div>
        </div>

        {/* Right Side: Current Status Card */}
        <div className="bg-white border border-[#BCC9C9]/15 shadow-[0px_20px_40px_rgba(0,49,50,0.02)] rounded-[clamp(1.07rem,2.22vw,2.75rem)] p-[clamp(1.1rem,2.29vw,2.5rem)] w-full md:w-[clamp(18rem,37.5vw,39.0rem)] md:h-[clamp(13.63rem,28.4vw,32.0rem)] flex flex-col gap-[clamp(0.8rem,1.67vw,2.2rem)] shrink-0 justify-between">
          <div className="border-b border-[#EEEEF0] pb-[clamp(0.48rem,1vw,1.0rem)]">
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.67rem,1.39vw,1.6rem)] leading-[clamp(0.93rem,1.94vw,2.2rem)] text-[#1A1C1D]">
              Current Status
            </h3>
          </div>

          <div className="flex flex-col gap-[clamp(0.58rem,1.2vw,1.25rem)] flex-1 justify-center mt-[clamp(0.48rem,1vw,1.0rem)]">
            {/* Box 1: System Status */}
            <div className="bg-[#F9F9FB] border border-[#E2E2E4] rounded-[clamp(1.07rem,2.22vw,2.75rem)] p-[clamp(0.8rem,1.67vw,2.0rem)] flex flex-row justify-between items-center h-[clamp(3.27rem,6.81vw,8.0rem)] w-full">
              <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)]">
                <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.4rem,0.83vw,1.0rem)] tracking-[0.6px] uppercase text-[#3D4949]">
                  SYSTEM STATUS
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-medium text-[clamp(0.6rem,1.25vw,1.5rem)] leading-[clamp(0.93rem,1.94vw,2.2rem)] text-[#1A1C1D]">
                  Active
                </span>
              </div>
            </div>

            {/* Box 2: Status */}
            <div className="bg-[#F9F9FB] border border-[#E2E2E4] rounded-[clamp(1.07rem,2.22vw,2.75rem)] p-[clamp(0.8rem,1.67vw,2.0rem)] flex flex-row justify-between items-center h-[clamp(3.27rem,6.81vw,8.0rem)] w-full">
              <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)]">
                <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.4rem,0.83vw,1.0rem)] tracking-[0.6px] uppercase text-[#3D4949]">
                  {isDraft ? "STATUS" : "LIVE STATUS"}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] font-medium text-[clamp(0.6rem,1.25vw,1.5rem)] leading-[clamp(0.93rem,1.94vw,2.2rem)] text-[#1A1C1D]">
                  {isDraft ? "In Draft" : "Live on Website"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Asset Details Block ── */}
      <div className="bg-white border border-[#BCC9C9]/15 shadow-[0px_20px_40px_rgba(0,49,50,0.02)] rounded-[clamp(1.07rem,2.22vw,2.75rem)] p-[clamp(1.1rem,2.29vw,3.0rem)] flex flex-col gap-[clamp(0.8rem,1.67vw,2.2rem)] min-h-[clamp(11.73rem,24.44vw,28.0rem)] justify-between">
        <div className="border-b border-[#EEEEF0] pb-[clamp(0.48rem,1vw,1.0rem)]">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.67rem,1.39vw,1.6rem)] leading-[clamp(0.93rem,1.94vw,2.2rem)] text-[#1A1C1D]">
            Asset Details
          </h3>
        </div>

        {/* Details Data List/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.5rem,3.33vw,4.5rem)] mt-[clamp(0.24rem,0.5vw,0.5rem)] flex-1">
          {/* Column 1 (Left) */}
          <div className="flex flex-col gap-[clamp(1.5rem,3.33vw,4.5rem)] justify-center">
            {/* Field: Farmland ID */}
            <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)]">
              <span className="font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.4rem,0.83vw,1.0rem)] tracking-[0.6px] uppercase text-[#3D4949]">
                FARMLAND ID
              </span>
              <span className="font-['Plus_Jakarta_Sans'] font-medium text-[clamp(0.53rem,1.11vw,1.375rem)] leading-[clamp(0.8rem,1.67vw,2.0rem)] text-[#1A1C1D] font-extrabold">
                {farmland.title.replace(/\s+/g, "")}
              </span>
            </div>

            {/* Field: Creation Time */}
            <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)]">
              <span className="font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.33rem,0.69vw,0.875rem)] tracking-[0.5px] uppercase text-[#3D4949]">
                CREATION TIME
              </span>
              <span className="font-['Plus_Jakarta_Sans'] font-medium text-[clamp(0.47rem,0.97vw,1.125rem)] leading-[clamp(0.67rem,1.39vw,1.75rem)] text-[#1A1C1D] font-extrabold">
                6th Oct, 12:53 PM
              </span>
            </div>
          </div>

          {/* Column 2 (Right) */}
          <div className="flex flex-col gap-[clamp(1.5rem,3.33vw,4.5rem)] justify-center">
            {/* Field: Location */}
            <div className="flex items-center h-[clamp(1.47rem,3.06vw,3.5rem)]">
              <div className="flex flex-row items-center gap-[clamp(0.14rem,0.3vw,0.375rem)]">
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6 15C6 15 12 10.5 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 15 6 15ZM6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z" fill="#000000" />
                </svg>
                <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[clamp(0.53rem,1.11vw,1.375rem)] leading-[clamp(0.8rem,1.67vw,2.0rem)] text-black">
                  West Godvari, AP
                </span>
              </div>
            </div>

            {/* Field: Last Updated */}
            <div className="flex flex-col gap-[clamp(0.12rem,0.25vw,0.25rem)]">
              <span className="font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.33rem,0.69vw,0.875rem)] tracking-[0.5px] uppercase text-[#3D4949]">
                LAST UPDATED
              </span>
              <span className="font-['Plus_Jakarta_Sans'] font-medium text-[clamp(0.47rem,0.97vw,1.125rem)] leading-[clamp(0.67rem,1.39vw,1.75rem)] text-[#1A1C1D] font-extrabold">
                {isDraft ? "Land and Boundaries > Land Images" : "23/04/26, 09:15 AM"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Button Row ── */}
      <div className="flex justify-end mt-[clamp(0.48rem,1vw,1.5rem)]">
        <button
          onClick={handleActionClick}
          disabled={isVerifying}
          className="h-[clamp(1.27rem,2.64vw,3.125rem)] w-[clamp(6.7rem,13.96vw,15.0rem)] rounded-[clamp(1.1rem,2.29vw,2.75rem)] text-white font-['Plus_Jakarta_Sans'] font-bold text-[clamp(0.47rem,0.97vw,1.125rem)] leading-[clamp(0.6rem,1.25vw,1.5rem)] text-center flex items-center justify-center transition-all disabled:opacity-50"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)",
          }}
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : isDraft ? (
            "Resume Verification"
          ) : (
            "View Documents"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadFarmlandDetails;
