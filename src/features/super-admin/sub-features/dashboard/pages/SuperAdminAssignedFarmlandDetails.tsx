import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, MapPin, Loader2, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { useGetFarmlandByIdQuery } from '@/features/super-admin/api/farmland.api';
import { useGetAllMasterDataQuery, useGetAllGeoMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useSubmitFarmlandMutation } from '@/features/super-admin/api/farmlandAction.api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/store/authSlice';
import { S3Image } from '@/components/common/S3Image';
import { cn } from '@/lib/utils';

const SuperAdminAssignedFarmlandDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const farmlandId = id || "GLCSOS 01";
  
  const location = useLocation();
  const isFromUpload = location.state?.from === 'upload';
  
  const { data: farmlandDetails, isLoading, error } = useGetFarmlandByIdQuery({
    farmlandId: id || "",
  }, { skip: !id });

  const { data: masterData } = useGetAllMasterDataQuery();
  const { data: geoMasterData } = useGetAllGeoMasterDataQuery();

  const [submitFarmland, { isLoading: isSubmitting }] = useSubmitFarmlandMutation();
  const user = useSelector(selectCurrentUser);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#F9F9F9] text-[#2D3032]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-[var(--text-primary)] font-medium">Loading details...</p>
      </div>
    );
  }

  if (error || !farmlandDetails?.data) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#F9F9F9]">
        <p className="text-[#2D3032] font-medium text-lg">No data available</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 border rounded-full hover:bg-gray-50 font-medium">Go Back</button>
      </div>
    );
  }

  const data = farmlandDetails.data;

  // Location Mapping
  const stateDesc = geoMasterData?.states?.find(s => s.id === data.location?.state_id)?.desc || "";
  const districtDesc = geoMasterData?.districts?.find(d => d.id === data.location?.district_id)?.desc || "";
  const mandalDesc = geoMasterData?.mandals?.find(m => m.id === data.location?.mandal_id)?.desc || "";
  const locationStr = [stateDesc, districtDesc, mandalDesc].filter(Boolean).join(", ") || "Location not available";

  // Status Mapping
  const systemStatus = masterData?.milestoneStagesResult?.find(s => s.id === data.status?.master_milestone_stage_id)?.description || "N/A";
  const liveStatus = masterData?.milestoneStageStatusResult?.find(s => s.id === data.status?.master_milestone_stage_status_id)?.description || "N/A";

  const isApproved = systemStatus?.toLowerCase().includes("approved") || liveStatus?.toLowerCase().includes("approved");

  // Agent Details
  const agentName = data.agent_name;
  const agentAvatar = data.profile_url;

  // Images
  const FALLBACK_IMAGE = "/super-admin/images/farmland1.png";
  const coverImage = data.cover_image_url || FALLBACK_IMAGE;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const day = getOrdinal(date.getUTCDate());
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F9F9F9] p-4 lg:p-6 box-border flex flex-col font-sans">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-700" />
          <span className="font-medium text-gray-700 text-sm">Go Back</span>
        </button>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-200 shadow-sm">
            <S3Image
              src="https://i.pravatar.cc/150?u=superadmin"
              fallbackType="avatar"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="mt-4 flex flex-col w-full max-w-7xl mx-auto flex-1 min-h-0">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h2" className="font-bold text-[1.25rem] lg:text-[1.5rem] text-gray-900">
            Assigned Farmland
          </Typography>
          <button
            onClick={async () => {
              if (isApproved) return;
              try {
                const sadminStage = masterData?.milestoneStagesResult?.find((s: any) => s.code === 'SADMIN');
                const inprgsStatus = masterData?.milestoneStageStatusResult?.find((s: any) => s.code === 'INPRGS');
                
                const apiId = parseInt(farmlandId, 10) || 1;
                
                await submitFarmland({
                  farmlandId: apiId,
                  master_milestone_stage_id: sadminStage?.id || 1,
                  master_milestone_stage_status_id: inprgsStatus?.id || 1,
                  userId: user?.id || 1,
                }).unwrap();

                if (isFromUpload) {
                  navigate(`/super-admin/upload/process/${farmlandId}/customer-information`);
                } else {
                  navigate(`/super-admin/assigned-farmlands/${farmlandId}/customer-information`);
                }
              } catch (err) {
                console.error("Failed to update status before navigating", err);
                // Navigating anyway as fallback, or you can choose not to navigate
                if (isFromUpload) {
                  navigate(`/super-admin/upload/process/${farmlandId}/customer-information`);
                } else {
                  navigate(`/super-admin/assigned-farmlands/${farmlandId}/customer-information`);
                }
              }
            }}
            disabled={isSubmitting || isApproved}
            className={cn(
              "px-6 py-2 rounded-full font-semibold text-sm transition-colors disabled:opacity-50",
              isApproved ? "bg-gray-400 text-white cursor-not-allowed hover:bg-gray-400" : "bg-[#2A3125] text-white hover:bg-black"
            )}
          >
            {isSubmitting ? "Loading..." : isFromUpload ? 'Upload Documents' : 'View Documents'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch flex-1 min-h-0">
          {/* Left Column: Image Card */}
          <div className="flex-1 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden relative shadow-md min-h-0">
            <S3Image
              src={coverImage}
              fallbackType="cover"
              alt="Farmland"
              className="w-full h-full object-cover"
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 lg:p-10">
              {/* <span className="inline-flex items-center justify-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wider uppercase mb-4 w-max border border-white/30">
                Badge
              </span> */}
              <h1 className="text-white text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
                {data.farmland_code}
              </h1>
              <div className="flex items-center text-white/90 gap-1.5">
                <MapPin size={18} />
                <span className="font-medium text-sm lg:text-base">{locationStr}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cards */}
          <div className="w-full lg:w-[25rem] flex flex-col gap-3">
            {/* Current Status Card */}
            <Card className="p-4 rounded-[1.25rem] bg-white border-0 shadow-sm flex flex-col gap-3">
              <Typography variant="h4" className="font-bold text-[14px] lg:text-[15px] text-gray-900">
                Current Status
              </Typography>
              <div className="h-px w-full bg-gray-100" />
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 p-2.5 lg:p-3 rounded-xl border border-gray-100 bg-[#FAFAFA]">
                  <span className="text-[0.625rem] uppercase font-bold tracking-wider text-gray-400">
                    SYSTEM STATUS
                  </span>
                  <span className="font-semibold text-gray-900 text-[13px] lg:text-[14px]">
                    {systemStatus}
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-2.5 lg:p-3 rounded-xl border border-gray-100 bg-[#FAFAFA]">
                  <span className="text-[0.625rem] uppercase font-bold tracking-wider text-gray-400">
                    LIVE STATUS
                  </span>
                  <span className="font-semibold text-gray-900 text-[13px] lg:text-[14px]">
                    {liveStatus}
                  </span>
                </div>
              </div>
            </Card>

            {/* Asset Details Card */}
            <Card className="p-4 rounded-[1.25rem] bg-white border-0 shadow-sm flex flex-col gap-3 flex-1">
              <Typography variant="h4" className="font-bold text-[14px] lg:text-[15px] text-gray-900">
                Asset Details
              </Typography>
              <div className="h-px w-full bg-gray-100" />

              <div className="grid grid-cols-2 gap-y-2.5 gap-x-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.625rem] uppercase font-bold tracking-wider text-gray-400">
                    FARMLAND ID
                  </span>
                  <span className="font-medium text-gray-900 text-[13px]">
                    {data.farmland_id}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-gray-900 text-[13px] mt-auto">
                    <MapPin size={14} className="text-gray-500" />
                    {locationStr}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 col-span-2 mt-1">
                  <span className="text-[0.625rem] uppercase font-bold tracking-wider text-gray-400">
                    ASSIGNED AGENT
                  </span>
                  <div className="flex items-center gap-2.5">
                    {!agentName && !agentAvatar ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                           <User size={20} />
                        </div>
                        <span className="font-semibold text-gray-500 text-sm italic">
                          No agent
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {agentAvatar ? (
                           <S3Image
                            src={agentAvatar}
                            fallbackType="avatar"
                            alt="Agent"
                            className="w-10 h-10 rounded-full object-cover bg-gray-100"
                           />
                        ) : (
                           <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                             <User size={20} />
                           </div>
                        )}
                        <span className="font-semibold text-gray-900 text-sm">
                          {agentName || "Unknown"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[0.625rem] uppercase font-bold tracking-wider text-gray-400">
                    CREATION TIME
                  </span>
                  <span className="font-medium text-gray-600 text-[11px]">
                    {formatDate(data.created_on)}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[0.625rem] uppercase font-bold tracking-wider text-gray-400">
                    LAST UPDATED
                  </span>
                  <span className="font-medium text-gray-600 text-[11px]">
                    {formatDate(data.updated_on)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAssignedFarmlandDetails;
