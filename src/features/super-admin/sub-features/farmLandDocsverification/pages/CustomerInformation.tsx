import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react'
import { ConfirmationModal } from './CustomerInfoConfirmationModal'; // I'll extract it
import { useGetOwnerDetailsByFarmlandIdQuery, useGetFamilyTreeQuery, useGetFarmlandByIdQuery } from '@/features/super-admin/api/farmland.api';
import { OwnerDetailsTab } from '../components/OwnerDetailsTab';
import { LandDetailsTab } from '../components/LandDetailsTab';
import type { FamilyTreeRelative, FamilyTreeOwner } from '@/features/super-admin/types/farmland.types';
import { User } from 'lucide-react';

const MemberCard: React.FC<{
  role: string;
  name: string;
  details?: string;
  photo?: string | null;
  isOwner?: boolean;
}> = ({ role, name, details, photo, isOwner }) => {
  if (isOwner) {
    return (
      <div className="z-10 bg-[#F4F9FF] border border-[#BFDBFE] rounded-[1rem] p-6 flex flex-col items-center w-[250px] shadow-sm shrink-0">
        <div className="relative">
          {photo ? (
            <img src={photo} className="w-20 h-20 rounded-full border-4 border-[#FBBF24] shadow-sm object-cover" alt={name} />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-[#FBBF24] shadow-sm bg-gray-200 flex items-center justify-center">
              <User className="text-gray-500 w-10 h-10" />
            </div>
          )}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {role}
          </div>
        </div>
        <span className="font-bold text-[#1F2937] mt-5 truncate w-full text-center">{name}</span>
        {details && <span className="text-[#3B82F6] text-xs font-medium mt-1 truncate w-full text-center">{details}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0 relative z-10 shrink-0">
      {/* Small line connecting pill to the card */}
      <div className="w-0.5 h-6 bg-gray-200 shrink-0 relative">
        <div className="bg-[#E0E7FF] text-[#4F46E5] text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-sm border border-white">
          {role}
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-[1rem] p-3 flex items-center gap-3 w-[220px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative z-10">
        {photo ? (
          <img src={photo} className="w-12 h-12 rounded-full object-cover shrink-0" alt={name} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <User className="text-gray-500 w-6 h-6" />
          </div>
        )}
        <div className="flex flex-col overflow-hidden w-full">
          <span className="font-bold text-[#1F2937] text-sm leading-tight truncate w-full">{name}</span>
          {details && <span className="text-gray-500 text-xs mt-1 truncate w-full">{details}</span>}
        </div>
      </div>
    </div>
  );
};

const FamilyTreeTab: React.FC<{ familyData?: FamilyTreeOwner, isLoading?: boolean }> = ({ familyData, isLoading }) => {
  const groups = React.useMemo(() => {
    let topRow: any[] = [];
    let middleRow: any[] = [];
    let bottomRow: any[] = [];

    const getDetails = (member: any) => {
      let parts = [];
      if (member.gender) parts.push(member.gender);
      if (member.age) parts.push(`${member.age} yrs`);
      return parts.length > 0 ? parts.join(", ") : undefined;
    };

    if (familyData) {
      topRow.push({
        role: familyData.relationship_code || "OWNER",
        name: familyData.first_name + (familyData.last_name ? " " + familyData.last_name : ""),
        details: getDetails(familyData),
        photo: null,
        isOwner: true,
      });

      // To maintain the visual symmetry: Father left, Spouse center, Mother right
      // We will collect FATHER, SPOUSE, MOTHER separately to enforce order.
      let father: any = null;
      let spouse: any = null;
      let mother: any = null;
      let otherMiddle: any[] = [];

      (familyData.relatives || []).forEach((rel: FamilyTreeRelative) => {
        const roleStr = rel.relationship_code?.toUpperCase() || "";
        const nameStr = rel.first_name + (rel.last_name ? " " + rel.last_name : "");
        const member = {
          role: roleStr,
          name: nameStr,
          details: getDetails(rel),
          photo: null,
          isOwner: false,
        };

        if (roleStr === "FATHER") {
          father = member;
        } else if (roleStr === "MOTHER") {
          mother = member;
        } else if (roleStr === "SPOUSE") {
          spouse = member;
        } else if (roleStr === "SON" || roleStr === "DAUGHTER") {
          bottomRow.push(member);
        } else {
          otherMiddle.push(member);
        }
      });

      if (father) middleRow.push(father);
      if (spouse) middleRow.push(spouse);
      if (mother) middleRow.push(mother);
      middleRow = middleRow.concat(otherMiddle);
    }

    return { topRow, middleRow, bottomRow };
  }, [familyData]);

  if (isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-500 font-medium">Loading family tree...</span>
      </div>
    );
  }

  if (!familyData || (familyData.relatives && familyData.relatives.length === 0 && !familyData.first_name)) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center text-gray-500 gap-3">
        <User className="w-12 h-12 text-gray-300" />
        <span className="font-medium text-lg">No family tree data available</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-6 overflow-x-auto custom-scrollbar">
      <div className="relative flex flex-col items-center gap-0 min-w-max px-12">
        
        {/* Top Row (Owner) */}
        {groups.topRow.length > 0 && (
          <div className="flex flex-row justify-center w-full relative z-10">
            {groups.topRow.map((o, i) => (
              <MemberCard key={`top-${i}`} role={o.role} name={o.name} details={o.details} photo={o.photo} isOwner={o.isOwner} />
            ))}
          </div>
        )}

        {/* Tree Connectors between Top and Middle */}
        {groups.middleRow.length > 0 && (
          <div className="relative flex flex-col items-center w-full h-10">
            <div className="w-0.5 h-6 bg-gray-200"></div>
            {groups.middleRow.length > 1 && (
              <div className="h-0.5 bg-gray-200 w-[calc(100%-220px)] border-t border-gray-200"></div>
            )}
          </div>
        )}

        {/* Middle Row (Father, Spouse, Mother) */}
        {groups.middleRow.length > 0 && (
          <div className="flex flex-row gap-12 items-start justify-center w-full relative z-10">
            {groups.middleRow.map((m, i) => (
              <MemberCard key={`middle-${i}`} role={m.role} name={m.name} details={m.details} photo={m.photo} />
            ))}
          </div>
        )}

        {/* Tree Connectors between Middle and Bottom */}
        {groups.bottomRow.length > 0 && (
          <div className="relative flex flex-col items-center w-full h-8">
            <div className="w-0.5 h-8 bg-gray-200"></div>
          </div>
        )}

        {/* Bottom Row (Children) */}
        {groups.bottomRow.length > 0 && (
          <div className="flex flex-row gap-12 items-start justify-center w-full relative z-10">
            {groups.bottomRow.map((c, i) => (
              <MemberCard key={`bottom-${i}`} role={c.role} name={c.name} details={c.details} photo={c.photo} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};


export const CustomerInformation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const targetId = id || "GLCSOS 01";

  const [activeTab, setActiveTab] = useState<'owner' | 'family' | 'land'>('owner');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Assuming farmlandId should be numeric for the API. Using 1 as a fallback if the ID string isn't numeric.
  const numericId = parseInt(targetId, 10);
  const farmlandId = isNaN(numericId) ? 1 : numericId;

  const { data: ownerDetailsData, isLoading: isOwnerLoading } = useGetOwnerDetailsByFarmlandIdQuery(
    { farmlandId },
    { skip: !targetId }
  );

  const { data: familyTreeData, isLoading: isFamilyTreeLoading } = useGetFamilyTreeQuery(
    { farmland_id: farmlandId },
    { skip: !targetId }
  );

  const { data: landDetailsData, isLoading: isLandDetailsLoading } = useGetFarmlandByIdQuery(
    { farmlandId },
    { skip: activeTab !== 'land' }
  );

  const handleNext = () => {
    if (activeTab === 'owner') setActiveTab('family');
    else if (activeTab === 'family') setActiveTab('land');
    else if (activeTab === 'land') setIsModalOpen(true);
  };

  const handleBack = () => {
    if (activeTab === 'land') setActiveTab('family');
    else if (activeTab === 'family') setActiveTab('owner');
  };
  const handleProceed = () => {
    setIsModalOpen(false);
    navigate(`/super-admin/assigned-farmlands/${targetId}/legal-documents`);
  };

  return (
    <>
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={handleProceed} 
        farmlandId={targetId} 
      />

      <div className="flex-1 min-w-0 h-full w-full flex flex-col relative overflow-hidden bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)]">
        
        {/* Top Tabs */}
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4 p-4 lg:py-6 shrink-0 border-b border-gray-100 lg:border-none">
          <button 
            onClick={() => setActiveTab('owner')}
            className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-full border transition-colors whitespace-nowrap ${
              activeTab === 'owner' 
              ? 'bg-[#2A3125] text-white border-[#2A3125]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="font-semibold text-xs lg:text-sm">Owner Details</span>
            <div className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] bg-[#A3C33D] rounded-full flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('family')}
            className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-full border transition-colors whitespace-nowrap ${
              activeTab === 'family' 
              ? 'bg-[#2A3125] text-white border-[#2A3125]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="font-semibold text-xs lg:text-sm">Family Tree</span>
            <div className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] bg-[#A3C33D] rounded-full flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('land')}
            className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 rounded-full border transition-colors whitespace-nowrap ${
              activeTab === 'land' 
              ? 'bg-[#2A3125] text-white border-[#2A3125]' 
              : 'bg-[#E5E9D8] text-gray-600 border-transparent hover:bg-[#d8ddc7]'
            }`}
          >
            <span className="font-semibold text-xs lg:text-sm">Land Details</span>
            <div className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] bg-[#A3C33D] rounded-full flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 lg:px-[40px] pb-[80px] relative custom-scrollbar">
          
          {activeTab === 'owner' && (
            <div className="flex flex-col h-full w-full">
              <OwnerDetailsTab ownerDetailsData={ownerDetailsData} isLoading={isOwnerLoading} />
            </div>
          )}

          {activeTab === 'family' && (
            <div className="w-full overflow-x-auto custom-scrollbar pb-4">
               <div className="min-w-[700px]">
                 <FamilyTreeTab familyData={familyTreeData?.data?.[0]} isLoading={isFamilyTreeLoading} />
               </div>
            </div>
          )}

          {activeTab === 'land' && (
            <LandDetailsTab landDetailsData={landDetailsData} isLoading={isLandDetailsLoading} />
          )}
          
        </div>

        {/* ── Footer Actions ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[80px] lg:h-[90px] bg-white border-t border-gray-100 flex items-center justify-end px-6 lg:px-12 gap-4 rounded-b-[2rem]">
          <button 
            onClick={handleBack}
            disabled={activeTab === 'owner'}
            className={`px-6 lg:px-8 py-2.5 rounded-full border font-semibold text-sm transition-colors ${
              activeTab === 'owner' 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            className="px-6 lg:px-8 py-2.5 rounded-full bg-[#2A3125] text-white font-semibold text-sm hover:bg-black transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};
