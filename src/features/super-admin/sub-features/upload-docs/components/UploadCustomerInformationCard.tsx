import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadOwnerDetailsForm } from "./UploadOwnerDetailsForm";
import { UploadFamilyTreeTab } from "./UploadFamilyTreeTab";
import { UploadLandDetailsTab } from "./UploadLandDetailsTab";

import { UploadSubmittedModal } from "./UploadSubmittedModal";
import { useSaveOwnerDetailsMutation } from "@/features/super-admin/api/customer.api";
import { farmlandService } from "@/features/super-admin/api/farmland.api";
import { toast } from "sonner";

interface UploadCustomerInformationCardProps {
  farmlandId: string;
  onSubmit?: (data: any) => void;
  onDismiss?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const UploadCustomerInformationCard: React.FC<UploadCustomerInformationCardProps> = ({
  farmlandId,
  onSubmit,
  onDismiss,
  style,
  className = "",
}) => {
  const navigate = useNavigate();
  
  const { data: ownerResponse, refetch: refetchOwner } = farmlandService.useGetOwnerDetailsByFarmlandIdQuery(
    { farmlandId: Number(farmlandId) },
    { skip: !farmlandId || isNaN(Number(farmlandId)) }
  );
  
  const [saveOwnerDetails] = useSaveOwnerDetailsMutation();

  // Modals state
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);


  // Input fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  const [gender, setGender] = useState("");

  React.useEffect(() => {
    if (ownerResponse?.data) {
      const data = ownerResponse.data;
      if (data.first_name) setFirstName(data.first_name);
      if (data.last_name) setLastName(data.last_name);
      if (data.phone) setPhoneNumber(data.phone.replace("+91", ""));
      if (data.email) setEmail(data.email);
      if (data.dob) setDob(data.dob.split("T")[0]);
      else if ((data as any).date_of_birth) setDob((data as any).date_of_birth.split("T")[0]);
      if (data.gender) setGender(data.gender);
    }
  }, [ownerResponse]);

  // Tabs state - matching figma tabs: Owner details, Family Tree, Land Details
  const [activeTab, setActiveTab] = useState<"owner" | "family" | "land">("owner");



  // Dynamic values for avatar and heading
  const getInitials = () => {
    const f = firstName.trim().charAt(0);
    const l = lastName.trim().charAt(0);
    if (!f && !l) return "";
    return `${f}${l}`.toUpperCase();
  };

  const getDisplayName = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    return fullName || "";
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveOwnerDetails({
        farmlandId: Number(farmlandId),
        firstName,
        lastName,
        countryCode: "+91",
        phone: phoneNumber.replace("+91", ""),
        email,
        gender,
        dateOfBirth: dob
      }).unwrap();
      
      toast.success("Owner details saved successfully!");
      refetchOwner();
      
      // Pre-populate owner node inside family tree automatically with Owner's full name
      
      setActiveTab("family");
    } catch (error) {
      toast.error("Failed to save owner details.");
    }
  };

  const handleFinalSubmit = () => {
    setShowSubmittedModal(false);
    if (onSubmit) {
      onSubmit({
        firstName,
        lastName,
        phoneNumber,
        email,
        dob,
        gender,
      });
    }
    navigate(`/super-admin/upload/process/${farmlandId}/legal-documents`);
  };

  return (
    <div 
      className={`bg-white shadow-sm rounded-3xl flex flex-col w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      {/* ── Header: Avatar and Tabs ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full px-6 py-4 md:px-8 md:py-6 border-b border-gray-100 shrink-0 gap-4 md:gap-6">
        
        {/* Avatar HUD */}
        {activeTab === "owner" ? (
          <div className="flex flex-row items-center gap-4 md:gap-6 shrink-0">
            {/* Avatar Circle */}
            <div 
              className="bg-[#E6EEAD] border-4 border-[#F9F9FB] shadow-sm rounded-full flex items-center justify-center relative shrink-0 w-16 h-16 md:w-20 md:h-20"
            >
              <span className="font-sans font-bold text-[#2D3409] text-2xl md:text-3xl leading-none flex items-center justify-center">
                {getInitials()}
              </span>
            </div>
            
            {/* Full Name display */}
            <div className="flex flex-col justify-center items-start shrink-0">
              <h2 className="font-sans font-bold text-[#1A1C1D] text-xl md:text-2xl leading-tight flex items-center m-0">
                {getDisplayName()}
              </h2>
            </div>
          </div>
        ) : (
          <div className="hidden md:block flex-1"></div>
        )}

        {/* Switcher Tabs */}
        <div className="flex flex-row items-center gap-4 sm:gap-6 w-full md:w-auto justify-start md:justify-end overflow-x-auto no-scrollbar shrink-0">
          
          {/* Tab 1: Owner details */}
          <button
            type="button"
            onClick={() => setActiveTab("owner")}
            className="flex flex-row items-center justify-center gap-2 cursor-pointer rounded-full transition-all hover:scale-[1.03] px-4 py-2 shrink-0"
            style={{
              backgroundColor: activeTab === "owner" ? "#FFFFFF" : "#F9F9F9",
              border: activeTab === "owner" ? "1px solid #E6EEAD" : "1px solid transparent",
              color: activeTab === "owner" ? "#2A3008" : "#5A5C5E",
            }}
          >
            {/* Checklist indicator */}
            {activeTab === "owner" ? (
              <div 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#2D3409",
                  border: "4px solid #E6EEAD",
                }}
              />
            ) : (
              <div 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0 bg-[#BDD327] relative"
              >
                {/* Checkmark mark */}
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#FFFCEE]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
            <span className="font-sans font-semibold text-xs md:text-sm leading-tight whitespace-nowrap">
              Owner details
            </span>
          </button>

          {/* Tab 2: Family Tree */}
          <button
            type="button"
            onClick={() => setActiveTab("family")}
            className="flex flex-row items-center justify-center gap-2 cursor-pointer rounded-full transition-all hover:scale-[1.03] px-4 py-2 shrink-0"
            style={{
              backgroundColor: activeTab === "family" ? "#FFFFFF" : "#F9F9F9",
              border: activeTab === "family" ? "1px solid #E6EEAD" : "1px solid transparent",
              color: activeTab === "family" ? "#2A3008" : "#5A5C5E",
            }}
          >
            {/* Checklist indicator */}
            {activeTab === "family" ? (
              <div 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#2D3409",
                  border: "4px solid #E6EEAD",
                }}
              />
            ) : activeTab === "land" ? (
              <div 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0 bg-[#BDD327] relative animate-in zoom-in duration-200"
              >
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#FFFCEE]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            ) : (
              <div 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#C0C2B7",
                  border: "4px solid #E6EEAD",
                }}
              />
            )}
            <span className="font-sans font-semibold text-xs md:text-sm leading-tight whitespace-nowrap">
              Family Tree
            </span>
          </button>

          {/* Tab 3: Land Details */}
          <button
            type="button"
            onClick={() => setActiveTab("land")}
            className="flex flex-row items-center justify-center gap-2 cursor-pointer rounded-full transition-all hover:scale-[1.03] px-4 py-2 shrink-0"
            style={{
              backgroundColor: activeTab === "land" ? "#FFFFFF" : "#F9F9F9",
              border: activeTab === "land" ? "1px solid #E6EEAD" : "1px solid transparent",
              color: activeTab === "land" ? "#2A3008" : "#5A5C5E",
            }}
          >
            {/* Checklist indicator */}
            {activeTab === "land" ? (
              <div 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#2D3409",
                  border: "4px solid #E6EEAD",
                }}
              />
            ) : (
              <div 
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#C0C2B7",
                  border: "4px solid #E6EEAD",
                }}
              />
            )}
            <span className="font-sans font-semibold text-xs md:text-sm leading-tight whitespace-nowrap">
              Land Details
            </span>
          </button>

        </div>
      </div>

      {/* ── Tab Content Renderer ── */}
      <div className="flex-1 min-h-0 h-full flex flex-col w-full relative">
      {activeTab === "owner" ? (
        <UploadOwnerDetailsForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          email={email}
          setEmail={setEmail}
          dob={dob}
          setDob={setDob}
          gender={gender}
          setGender={setGender}
          onDismiss={onDismiss}
          onSubmit={handleCreateSubmit}
        />
      ) : activeTab === "family" ? (
        <UploadFamilyTreeTab
          farmlandId={Number(farmlandId)}
          onBack={() => setActiveTab("owner")}
          onNext={() => setActiveTab("land")}
        />
      ) : (
        <UploadLandDetailsTab
          farmlandId={Number(farmlandId)}
          setActiveTab={setActiveTab}
          onNextClick={() => setShowSubmittedModal(true)}
        />
      )}


      </div>

      {/* ── Submission Success Modal ── */}
      {showSubmittedModal && (
        <UploadSubmittedModal

          onProceed={handleFinalSubmit}
          onDismiss={() => {
            setShowSubmittedModal(false);
            navigate(`/super-admin/upload/documents/legal-documents/${farmlandId}`);
          }}
        />
      )}
    </div>
  );
};

export default UploadCustomerInformationCard;
