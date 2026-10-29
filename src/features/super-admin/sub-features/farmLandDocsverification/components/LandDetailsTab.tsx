import React from 'react';
import { useLocationLookup } from '@/features/super-admin/utils/locationUtils';
import { mockDashboardData } from '@/features/super-admin/data/mockDashboardData'; // Fallback for some things like small map if needed

export const LandDetailsTab: React.FC<{ landDetailsData: any, isLoading?: boolean }> = ({ landDetailsData, isLoading }) => {
  // Use the new hook to look up the names from IDs
  const locationNames = useLocationLookup(landDetailsData?.data?.location);

  if (isLoading || locationNames.isLoading) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-500 font-medium">Loading land details...</span>
      </div>
    );
  }

  if (!landDetailsData?.data) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
        No land details available.
      </div>
    );
  }

  const data = landDetailsData.data;
  
  // Safe defaults if API data is missing
  const stateName = locationNames.stateName;
  const districtName = locationNames.districtName;
  // If your API returns area/mandal name directly, use that, else use lookup.
  const areaName = locationNames.mandalName !== '-' ? locationNames.mandalName : (data.location?.mandal_id || '-');
  const agentName = data.agent_name || '-';
  const price = data.price ? `₹ ${data.price}` : '-';
  // const landConversion = data.land_conversion || '-';
  
  // Fallbacks for images if API cover_image_url is missing
  const coverImage = data.cover_image_url || mockDashboardData.customerInformation.landDetails.largeAerialImage;

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-center font-bold text-gray-400 tracking-[0.2em] mb-8 lg:mb-10 text-sm lg:text-base">FARMLAND DETAILS</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full items-center justify-center max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 lg:gap-6 flex-1 text-center lg:text-right items-center lg:items-end justify-center w-full">
          <div className="flex flex-col gap-1 w-full max-w-[250px]">
            <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">STATE</span>
            <span className="font-semibold text-[#A3C33D] text-base lg:text-lg break-words">{stateName}</span>
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[250px]">
            <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">DISTRICT</span>
            <span className="font-semibold text-[#A3C33D] text-base lg:text-lg break-words">{districtName}</span>
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[250px]">
            <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">AREA/CITY/TOWN</span>
            <span className="font-semibold text-[#A3C33D] text-base lg:text-lg break-words">{areaName}</span>
          </div>
        </div>

        <div className="w-full max-w-[280px] shrink-0 mx-4">
          <img 
            src={coverImage} 
            className="w-full h-[200px] lg:h-[240px] rounded-[1.5rem] object-cover shadow-sm" 
            alt="Farmland Aerial"
          />
        </div>

        <div className="flex flex-col gap-4 lg:gap-6 flex-1 text-center lg:text-left items-center lg:items-start justify-center w-full">
          <div className="flex flex-col gap-1 w-full max-w-[250px]">
            <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">AGENT</span>
            <span className="font-semibold text-[#A3C33D] text-lg break-words">{agentName}</span>
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[250px]">
            <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">LAND CONVERSION</span>
            <span className="font-semibold text-[#A3C33D] text-lg break-words">ACRES</span>
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[250px]">
            <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">VALUE FOR AREA</span>
            <span className="font-semibold text-[#A3C33D] text-lg break-words">{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
