import React from "react";
import { useLocationLookup } from "@/features/super-admin/utils/locationUtils";
import { farmlandService } from "@/features/super-admin/api/farmland.api";

interface UploadLandDetailsTabProps {
  farmlandId: number;
  setActiveTab: (tab: "owner" | "family" | "land") => void;
  onNextClick: () => void;
}

export const UploadLandDetailsTab: React.FC<UploadLandDetailsTabProps> = ({
  farmlandId,
  setActiveTab,
  onNextClick,
}) => {
  const { data: landDetailsResponse, isLoading: isLandDetailsLoading } = farmlandService.useGetFarmlandByIdQuery(
    { farmlandId },
    { skip: !farmlandId || isNaN(farmlandId) }
  );

  const landDetailsData = landDetailsResponse?.data;
  const locationNames = useLocationLookup(landDetailsData?.location);

  if (isLandDetailsLoading || locationNames.isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-[clamp(0.5rem,1.5vw,2rem)] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A3C33D]"></div>
        <span className="ml-3 text-gray-500 font-medium">Loading land details...</span>
      </div>
    );
  }

  const stateName = locationNames.stateName || "N/A";
  const districtName = locationNames.districtName || "N/A";
  const areaName = locationNames.mandalName !== "-" ? locationNames.mandalName : (landDetailsData?.location?.mandal_id || "N/A");
  const price = landDetailsData?.price ? `₹ ${landDetailsData.price}` : "N/A";
  const coverImage = landDetailsData?.cover_image_url || "/super-admin/images/farmland1.png";
  const agentName = landDetailsData?.agent_name || "N/A";

  return (
    <div className="h-full flex flex-col w-full relative animate-in fade-in duration-300">
      
      <div className="flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-4 w-full flex flex-col justify-center">
        <h3 className="font-sans font-bold text-xs md:text-sm tracking-wide text-[#5A5C5E] uppercase text-center mb-4 md:mb-6">
          Farmland Details
        </h3>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center justify-center w-full">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6 md:gap-8 text-left md:text-right w-full">
          {/* State */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#8A96A3] uppercase">
              State
            </span>
            <span className="font-sans font-medium text-sm md:text-base text-[#9BB424] break-words">
              {stateName}
            </span>
          </div>
          
          {/* District */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#8A96A3] uppercase">
              District
            </span>
            <span className="font-sans font-medium text-sm md:text-base text-[#9BB424] break-words">
              {districtName}
            </span>
          </div>

          {/* Area/City/Town */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#8A96A3] uppercase">
              Area/City/Town
            </span>
            <span className="font-sans font-medium text-sm md:text-base text-[#9BB424] break-words">
              {areaName}
            </span>
          </div>
        </div>

        {/* Middle Column: Aerial Image */}
        <div className="relative w-full max-w-[200px] md:max-w-[280px] aspect-[417/306] rounded-xl md:rounded-2xl overflow-hidden border border-white/50 shadow-sm bg-[#F1F5F9] shrink-0 mx-auto">
          <img 
            src={coverImage} 
            alt="Farmland Aerial View" 
            className="w-full h-full object-cover animate-in fade-in duration-300" 
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 md:gap-8 text-left w-full">
          {/* Land Conversion */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#8A96A3] uppercase">
              Land Conversion
            </span>
            <span className="font-sans font-medium text-sm md:text-base text-[#9BB424]">
              Acres
            </span>
          </div>

          {/* Value for Area */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#8A96A3] uppercase">
              Value for Area
            </span>
            <span className="font-sans font-medium text-sm md:text-base text-[#9BB424] break-words">
              {price}
            </span>
          </div>

          {/* Agent */}
          <div className="flex flex-col gap-1 w-full">
            <span className="font-sans font-bold text-[10px] tracking-wider text-[#8A96A3] uppercase">
              Agent
            </span>
            <span className="font-sans font-medium text-sm md:text-base text-[#9BB424] break-words">
              {agentName}
            </span>
          </div>
        </div>

      </div>
      </div>



      {/* Navigation Buttons Row */}
      <div className="flex flex-row justify-end items-center gap-6 px-6 py-4 md:px-8 md:py-6 border-t border-gray-100 shrink-0 bg-white w-full">
        <button
          type="button"
          onClick={() => setActiveTab("family")}
          className="font-sans font-medium text-black hover:opacity-75 uppercase cursor-pointer tracking-wider text-xs md:text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNextClick}
          className="flex items-center justify-center text-white rounded-full shadow-lg hover:scale-105 active:scale-95 cursor-pointer font-sans font-normal px-8 py-3 min-w-[120px]"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)"
          }}
        >
          <span className="text-sm md:text-base">
            Next
          </span>
        </button>
      </div>

    </div>
  );
};
