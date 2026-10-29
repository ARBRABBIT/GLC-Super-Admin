import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, MapPin } from 'lucide-react';

import { mockDashboardData } from '@/features/super-admin/data/mockDashboardData';
import { S3Image } from '@/components/common/S3Image';

// Modal Component
const ConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; farmlandId: string }> = ({ isOpen, onClose, farmlandId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-[500px] p-10 flex flex-col items-center shadow-2xl relative">
        <h2 className="font-bold text-2xl mb-8">Customer Information</h2>
        
        {/* Large Checkmark Badge */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-100/50 rounded-full scale-[1.5]" />
          <div className="w-24 h-24 bg-[#8DC63F] rounded-full flex items-center justify-center relative z-10 shadow-lg border-4 border-white">
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
        </div>

        <p className="text-center font-medium text-lg leading-snug mb-8">
          Proceed With '<span className="text-[#1D7ABE]">Legal Documents</span>' for <br/>
          Farmland ID: <span className="text-[#1D7ABE]">{farmlandId}</span> for further <br/>
          Verification.
        </p>

        <button 
          onClick={onClose}
          className="bg-[#2A3125] text-white font-semibold text-lg px-12 py-4 rounded-full hover:bg-black transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

// Family Tree Tab Component
const FamilyTreeTab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col items-center pt-8">
      {/* Container for the tree */}
      <div className="relative w-[700px] h-[500px] flex flex-col items-center">
        
        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ top: '60px' }}>
          {/* Main vertical line from owner down to horizontal bus */}
          <line x1="350" y1="110" x2="350" y2="180" stroke="#D1D5DB" strokeWidth="2" />
          {/* Horizontal bus */}
          <line x1="150" y1="180" x2="550" y2="180" stroke="#D1D5DB" strokeWidth="2" />
          
          {/* Vertical line to Father */}
          <line x1="150" y1="180" x2="150" y2="230" stroke="#D1D5DB" strokeWidth="2" />
          {/* Vertical line to Spouse */}
          <line x1="350" y1="180" x2="350" y2="230" stroke="#D1D5DB" strokeWidth="2" />
          {/* Vertical line to Mother */}
          <line x1="550" y1="180" x2="550" y2="230" stroke="#D1D5DB" strokeWidth="2" />

          {/* Vertical line from Spouse down to Daughter */}
          <line x1="350" y1="310" x2="350" y2="380" stroke="#D1D5DB" strokeWidth="2" />
        </svg>

        {/* Owner */}
        <div className="z-10 bg-[#F4F9FF] border border-[#BFDBFE] rounded-[1rem] p-4 flex flex-col items-center w-[220px] shadow-sm">
          <div className="relative">
            <S3Image src={data.owner.avatar} fallbackType="avatar" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" alt={data.owner.name} />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1D7ABE] text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase">
              OWNER
            </div>
          </div>
          <span className="font-bold text-[#1F2937] mt-3">{data.owner.name}</span>
          <span className="text-[#3B82F6] text-xs font-medium mt-1">{data.owner.info}</span>
        </div>

        {/* Level 2 Container */}
        <div className="flex justify-between w-full mt-[70px] z-10 relative">
          
          {/* Father */}
          <div className="absolute left-[125px] -top-[45px] bg-[#E0E7FF] text-[#4F46E5] text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase">FATHER</div>
          <div className="bg-white border border-gray-200 rounded-[1rem] p-3 flex items-center gap-3 w-[180px] shadow-sm ml-[60px]">
            <S3Image src={data.father.avatar} fallbackType="avatar" className="w-12 h-12 rounded-full object-cover" alt={data.father.name} />
            <div className="flex flex-col">
              <span className="font-bold text-[#1F2937] text-sm leading-tight">{data.father.name}</span>
              <span className="text-gray-500 text-xs">{data.father.info}</span>
            </div>
          </div>

          {/* Spouse */}
          <div className="absolute left-[322px] -top-[45px] bg-[#E0E7FF] text-[#4F46E5] text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase">SPOUSE</div>
          <div className="bg-white border border-gray-200 rounded-[1rem] p-3 flex items-center gap-3 w-[180px] shadow-sm">
            <S3Image src={data.spouse.avatar} fallbackType="avatar" className="w-12 h-12 rounded-full object-cover" alt={data.spouse.name} />
            <div className="flex flex-col">
              <span className="font-bold text-[#1F2937] text-sm leading-tight">{data.spouse.name}</span>
              <span className="text-gray-500 text-xs">{data.spouse.info}</span>
            </div>
          </div>

          {/* Mother */}
          <div className="absolute left-[520px] -top-[45px] bg-[#E0E7FF] text-[#4F46E5] text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase">MOTHER</div>
          <div className="bg-white border border-gray-200 rounded-[1rem] p-3 flex items-center gap-3 w-[180px] shadow-sm mr-[60px]">
            <S3Image src={data.mother.avatar} fallbackType="avatar" className="w-12 h-12 rounded-full object-cover" alt={data.mother.name} />
            <div className="flex flex-col">
              <span className="font-bold text-[#1F2937] text-sm leading-tight">{data.mother.name}</span>
              <span className="text-gray-500 text-xs">{data.mother.info}</span>
            </div>
          </div>
        </div>

        {/* Level 3 Container (Daughter) */}
        <div className="z-10 mt-[70px] relative">
          {/* Daughter Label */}
          <div className="absolute left-[60px] -top-[45px] bg-[#E0E7FF] text-[#4F46E5] text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase">DAUGHTER</div>
          <div className="bg-white border border-gray-200 rounded-[1rem] p-3 flex items-center gap-3 w-[180px] shadow-sm">
            <S3Image src={data.daughter.avatar} fallbackType="avatar" className="w-12 h-12 rounded-full object-cover" alt={data.daughter.name} />
            <div className="flex flex-col">
              <span className="font-bold text-[#1F2937] text-sm leading-tight">{data.daughter.name}</span>
              <span className="text-gray-500 text-xs">{data.daughter.info}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


export const SuperAdminCustomerInformation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const targetId = id || "GLCSOS 01";

  const [activeTab, setActiveTab] = useState<'owner' | 'family' | 'land'>('owner');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = mockDashboardData.customerInformation;

  const handleBack = () => {
    navigate(-1);
  };

  const handleApprove = () => {
    setIsModalOpen(true);
  };

  const handleProceed = () => {
    setIsModalOpen(false);
    navigate(`/super-admin/Documents/legal-documents/${targetId}`);
  };

  return (
    <div className="min-h-screen lg:min-h-0 lg:h-screen bg-[#F2F2F2] p-4 lg:p-8 flex flex-col gap-6 font-sans box-border lg:overflow-hidden">
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={handleProceed} 
        farmlandId={targetId} 
      />

      {/* ── Top Header ── */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="bg-white rounded-full flex items-center px-4 md:px-6 py-2.5 md:py-3 gap-2 md:gap-3 border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#353535] shrink-0" />
          <span className="font-medium text-[14px] md:text-[15px] text-[#353535] hidden sm:block">Go back to dashboard</span>
          <span className="font-medium text-[14px] text-[#353535] sm:hidden">Back</span>
        </button>

        <div className="flex gap-3 md:gap-4">
          <button className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex justify-center items-center border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-[#2C2C2C]" />
          </button>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <S3Image src="https://i.pravatar.cc/150?u=superadmin" fallbackType="avatar" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* ── LEFT COLUMN: Stepper Card ── */}
        <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm flex flex-col hidden md:flex lg:overflow-y-auto custom-scrollbar">
          <span className="font-medium text-gray-900 text-[16px] lg:text-[18px]">Farmland ID:</span>
          <div className="font-medium text-3xl lg:text-[42px] text-gray-900 mt-1 mb-10 lg:mb-16 break-all leading-tight">{targetId}</div>

          {/* Stepper Timeline */}
          <div className="relative pl-2 flex flex-col gap-12 lg:gap-[80px]">
            {/* Vertical Line */}
            <div className="absolute left-[22px] top-[14px] bottom-[14px] w-[1px] bg-gray-300" />
            
            {
              [
                { name: 'CUSTOMER INFORMATION', route: `/super-admin/assigned-farmlands/${targetId}/customer-information` },
                { name: 'LEGAL DOCUMENTS', route: `/super-admin/Documents/legal-documents/${targetId}` },
                { name: 'AGRICULTURE REPORT', route: `/super-admin/Documents/agriculture-report/${targetId}` },
                { name: 'LAND & BOUNDARIES', route: `/super-admin/Documents/land-boundaries/${targetId}` },
                { name: 'VALUATION', route: `/super-admin/Documents/valuation/${targetId}` },
                { name: 'LOCAL INTELLIGENCE', route: `/super-admin/Documents/local-intelligence/${targetId}` },
              ].map((step) => {
              const isCurrent = step.name === 'CUSTOMER INFORMATION';
              return (
                <div 
                  key={step.name} 
                  className={`relative flex items-center gap-6 cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => navigate(step.route)}
                >
                  <div className="w-[28px] h-[28px] rounded-full bg-[#E1E8B0] flex items-center justify-center relative z-10 shadow-[0_0_0_2px_white] shrink-0">
                    <div className="w-[12px] h-[12px] rounded-full bg-[#2B3024]" />
                  </div>
                  <span className={`font-semibold tracking-wide text-[12px] lg:text-[14px] ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CENTRAL MAIN CONTENT ── */}
        <div className="flex-1 bg-white shadow-sm rounded-[2rem] overflow-hidden flex flex-col min-h-[600px] lg:min-h-0 relative w-full">
          
          {/* Top Tabs */}
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 p-6 lg:pt-10 lg:pb-6 shrink-0 border-b border-gray-100 lg:border-none">
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

          <div className="flex-1 overflow-y-auto px-6 lg:px-[60px] pb-[100px] relative custom-scrollbar">
            
            {/* ── TAB CONTENT: OWNER DETAILS ── */}
            {activeTab === 'owner' && (
              <div className="flex flex-col h-full w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">First Name</label>
                    <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
                      <span className="text-gray-900 font-medium break-all">{data.ownerDetails.firstName}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">Last Name</label>
                    <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
                      <span className="text-gray-900 font-medium break-all">{data.ownerDetails.lastName}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">Email</label>
                    <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
                      <span className="text-gray-900 font-medium break-all">{data.ownerDetails.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">Phone Number</label>
                    <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
                      <span className="text-gray-900 font-medium break-all">{data.ownerDetails.phoneNumber}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">Date of Birth</label>
                    <div className="min-h-[48px] bg-gray-50 border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center break-words">
                      <span className="text-gray-900 font-medium break-all">{data.ownerDetails.dob ? data.ownerDetails.dob.split('T')[0] : '-'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">Religion</label>
                    <div className="min-h-[48px] bg-white border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center justify-between break-words">
                      <span className="text-gray-900 font-medium break-all">{data.ownerDetails.religion}</span>
                      <ChevronDown size={16} className="text-gray-500 shrink-0 ml-2" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm text-gray-700">Gender</label>
                    <div className="min-h-[48px] bg-white border border-gray-200 rounded-[1rem] px-4 py-2 flex items-center justify-between break-words">
                      <span className="text-gray-900 font-medium break-all">{data.ownerDetails.gender}</span>
                      <ChevronDown size={16} className="text-gray-500 shrink-0 ml-2" />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                  <h3 className="font-bold text-xl text-gray-900">Location of land</h3>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MapPin className="text-[#1D7ABE] shrink-0" size={18} />
                    <span className="text-[#1D7ABE] font-medium underline truncate">{data.ownerDetails.locationLink}</span>
                  </div>
                  <S3Image 
                    src={data.ownerDetails.mapImage} 
                    fallbackType="cover"
                    alt="Map" 
                    className="w-full lg:w-[400px] h-[200px] lg:h-[250px] rounded-[1.5rem] object-cover mt-2 shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* ── TAB CONTENT: FAMILY TREE ── */}
            {activeTab === 'family' && (
              <div className="w-full overflow-x-auto custom-scrollbar pb-4">
                 <div className="min-w-[700px]">
                   <FamilyTreeTab data={data.familyTree} />
                 </div>
              </div>
            )}

            {/* ── TAB CONTENT: LAND DETAILS ── */}
            {activeTab === 'land' && (
              <div className="flex flex-col h-full w-full">
                <h3 className="text-center font-bold text-gray-400 tracking-[0.2em] mb-8 lg:mb-10 text-sm lg:text-base">FARMLAND DETAILS</h3>
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full items-center lg:items-stretch">
                  <div className="flex flex-col gap-6 lg:gap-8 flex-1 text-center lg:text-right items-center lg:items-end justify-center w-full">
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">STATE</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.state}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">DISTRICT</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.district}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">AREA/CITY/TOWN</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.area}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">ACQUISITION CATEGORY</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.acquisitionCategory}</span>
                    </div>
                  </div>

                  <div className="w-full max-w-[400px] shrink-0">
                    <S3Image 
                      src={data.landDetails.largeAerialImage} 
                      fallbackType="cover"
                      className="w-full h-[250px] lg:h-[320px] rounded-[2rem] object-cover shadow-sm" 
                      alt="Farmland Aerial"
                    />
                  </div>

                  <div className="flex flex-col gap-6 lg:gap-8 flex-1 text-center lg:text-left items-center lg:items-start justify-center w-full">
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">AGENT</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.agent}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">LAND CONVERSION</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.landConversion}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">VALUE FOR AREA</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.valueForArea}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-[250px]">
                      <span className="font-bold text-gray-400 text-xs tracking-wider uppercase">AGENT REFERRAL LOCATION</span>
                      <span className="font-semibold text-[#A3C33D] text-lg break-words">{data.landDetails.agentReferralLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 lg:mt-16 flex flex-col-reverse lg:flex-row justify-between items-center lg:items-end w-full max-w-[850px] mx-auto gap-8 lg:gap-0">
                  <div className="flex flex-col text-center lg:text-left">
                    <span className="font-bold text-gray-300 text-sm tracking-wider">GEO REFERENCE</span>
                    <span className="text-gray-500 font-medium text-xl lg:text-2xl mt-1 break-words">{data.landDetails.geoReference.coordinates}</span>
                    <span className="text-gray-400 text-sm mt-1">{data.landDetails.geoReference.gridElev}</span>
                  </div>
                  <S3Image 
                    src={data.landDetails.smallMapImage} 
                    fallbackType="cover"
                    className="w-[150px] lg:w-[200px] h-[75px] lg:h-[100px] rounded-[1rem] object-cover opacity-80 mix-blend-multiply" 
                    alt="Map small"
                  />
                </div>
              </div>
            )}
            
          </div>

          {/* ── Footer Actions ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[80px] lg:h-[90px] bg-white border-t border-gray-100 flex items-center justify-end px-6 lg:px-12 gap-4">
            <button 
              className="px-6 lg:px-8 py-2.5 rounded-full border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
            <button 
              onClick={handleApprove}
              className="px-6 lg:px-8 py-2.5 rounded-full bg-[#2A3125] text-white font-semibold text-sm hover:bg-black transition-colors"
            >
              Approve
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminCustomerInformation;

const ChevronDown = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
