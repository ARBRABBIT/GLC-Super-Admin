import { useState, useEffect, useRef } from "react";

import { UploadMemberEditModal, type ModalRole } from "./UploadMemberEditModal";
import { useAddFamilyMemberMutation, useUpdateFamilyMemberMutation } from "@/features/super-admin/api/customer.api";
import { farmlandService } from "@/features/super-admin/api/farmland.api";
import { toast } from "sonner";

interface Props {
  farmlandData?: any;
  farmlandId: number;
  onBack: () => void;
  onNext: () => void;
}

export const UploadFamilyTreeTab = ({ farmlandId, onBack, onNext }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<ModalRole>("Member");
  const [editMember, setEditMember] = useState<any>(null);

  const [addFamilyMember] = useAddFamilyMemberMutation();
  const [updateFamilyMember] = useUpdateFamilyMemberMutation();
  
  const [getFamilyTree, { data: familyTreeData }] = farmlandService.useLazyGetFamilyTreeQuery();

  useEffect(() => {
    if (farmlandId) {
      getFamilyTree({ farmland_id: farmlandId });
    }
  }, [farmlandId, getFamilyTree]);

  useEffect(() => {
    // Only evaluate once we have actual data from the query
    if (familyTreeData !== undefined) {
      const data = familyTreeData?.data || familyTreeData;
      const rawMembers = Array.isArray(data) ? data : [];
      const hasOwner = rawMembers.some((m: any) => (m.relationship_code || m.relationship || m.relation || "").toLowerCase() === 'owner');
      
      if (!data || rawMembers.length === 0 || !hasOwner) {
        setIsEditing(true);
      }
    }
  }, [familyTreeData]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Center scroll horizontally when data loads so owner is always visible
  useEffect(() => {
    if (familyTreeData && scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const { scrollWidth, clientWidth } = scrollContainerRef.current;
          if (scrollWidth > clientWidth) {
            // Scroll to the exact center
            scrollContainerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
          }
        }
      }, 100);
    }
  }, [familyTreeData]);



  const openModal = (role: ModalRole, initialData: any = null) => {
    setModalRole(role);
    setEditMember(initialData);
    setIsModalOpen(true);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const rawMembers = Array.isArray(familyTreeData?.data) ? familyTreeData.data : (Array.isArray(familyTreeData) ? familyTreeData : []);
  
  const flattenMembers = (list: any[]) => {
    const result: any[] = [];
    const search = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.id || obj.member_id || obj.relationship_code) {
        if (!result.some(existing => (existing.id === obj.id && obj.id) || (existing.member_id === obj.member_id && obj.member_id))) {
          if (obj.first_name !== undefined || obj.relationship_code !== undefined) {
             result.push(obj);
          }
        }
      }
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (Array.isArray(val)) {
          for (const item of val) search(item);
        } else if (val && typeof val === 'object') {
          search(val);
        }
      }
    };
    for (const m of list) search(m);
    return result;
  };
  
  // Only map the first object (data[0]) as requested to avoid duplicates
  const membersToMap = rawMembers.length > 0 ? [rawMembers[0]] : [];
  const members = flattenMembers(membersToMap);

  const getRelCode = (m: any) => (m.relationship_code || m.relationship || m.relation || m.relationship_code_id || "").toLowerCase();

  const getLatest = (code: string) => {
    const matches = members.filter((m: any) => getRelCode(m) === code);
    // Prefer the one with the highest ID (most recently added) if IDs are numeric
    matches.sort((a, b) => {
      const idA = a.member_id || a.id || 0;
      const idB = b.member_id || b.id || 0;
      return idA - idB; // Ascending, so last is largest
    });
    return matches.length > 0 ? matches[matches.length - 1] : undefined;
  };

  const owner = getLatest('owner');
  console.log("DEBUG - Resolved Owner Object:", owner);
  
  const children = members.filter((m: any) => {
    const code = getRelCode(m);
    const mId = m.id || m.member_id;
    const isPrimary = 
      (mId !== undefined && mId === (owner?.id || owner?.member_id)) || 
      (code === 'owner');
    return !isPrimary;
  });

  const getChildrenOf = (parentId?: number | string) => {
    if (!parentId) return [];
    return children.filter((c: any) => c.related_member_id == parentId || c.related_to_member_id == parentId || c.connection == parentId || c.parent_id == parentId);
  };

  const orphans = children.filter((c: any) => {
    const parentId = c.related_member_id || c.related_to_member_id || c.connection || c.parent_id;
    return !parentId || !members.find(m => m.id == parentId || m.member_id == parentId);
  });

  const getCardDetails = (person: any, roleName: string) => {
    if (!person) return { name: `+ Add ${roleName}`, subtitle: "", hasData: false };
    const name = `${person.first_name || person.farmer_first_name || "-"} ${person.last_name || person.farmer_last_name || ""}`.trim() || "-";
    let ageText = "-";
    if (person.age !== undefined && person.age !== null && person.age !== "") {
      ageText = `${person.age} yrs`;
    } else if (person.dob) {
      const birthYear = new Date(person.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(birthYear)) ageText = `${currentYear - birthYear} yrs`;
    }
    const subtitle = `${person.gender || "-"}, ${ageText}`;
    return { name, subtitle, hasData: true };
  };

  const renderMemberCard = (child: any, onClick: () => void, isClickable: boolean = true) => {
    const details = getCardDetails(child, "Member");
    return (
      <button 
        onClick={isClickable ? onClick : undefined}
        className={`bg-white border border-[#E2E8F0] rounded-[16px] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] w-[200px] flex items-center justify-start gap-3 relative z-10 ${isClickable ? 'hover:bg-gray-50 cursor-pointer transition-colors' : 'cursor-default'}`}
      >
        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] overflow-hidden flex items-center justify-center shrink-0">
          {child?.profile_url ? (
            <img src={child.profile_url} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-5 h-5 text-[#94A3B8]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          )}
        </div>
        <div className="flex flex-col text-left justify-center flex-1 min-w-0">
          <span className="text-[13px] font-bold text-[#1A1C1D] truncate">{details.name}</span>
          {details.hasData && <span className="text-[12px] text-[#64748B] truncate">{details.subtitle}</span>}
        </div>
      </button>
    );
  };


  const renderExtraChildren = (parentId?: number | string) => {
    const kids = getChildrenOf(parentId);
    if (!kids.length) return null;
    return (
      <div className="flex items-start justify-center relative mt-8 z-10">
        {kids.map((child: any, idx: number) => (
          <div key={child.id || child.member_id || idx} className="flex flex-col items-center relative px-4">
            {/* Horizontal connector to siblings */}
            {kids.length > 1 && (
              <div className={`absolute -top-4 h-[1.5px] bg-[#CBD5E1] ${idx === 0 ? 'left-1/2 right-0' : idx === kids.length - 1 ? 'left-0 right-1/2' : 'left-0 right-0'}`}></div>
            )}
            
            {/* Node Wrapper for proper line positioning */}
            <div className="flex flex-col items-center relative">
              {/* Vertical line UP to the horizontal sibling connector */}
              <div className="w-[1.5px] h-4 bg-[#CBD5E1] absolute -top-4 left-1/2 -translate-x-1/2"></div>
              
              {/* Relationship Badge */}
              <div className="relative mb-2 z-20 flex justify-center w-full">
                <span className="bg-[#EAEFF5] text-[#64748B] text-[9px] font-bold px-3 py-1 rounded-[100px] uppercase tracking-widest font-plus-jakarta shadow-sm border border-white">
                  {child.relationship_code?.toUpperCase() || "MEMBER"}
                </span>
              </div>
              
              {/* The Member Card */}
              {renderMemberCard(child, () => openModal("Member", child), isEditing)}
              
              {/* Vertical line DOWN if it has children */}
              {getChildrenOf(child.id || child.member_id).length > 0 && (
                <div className="w-[1.5px] h-8 bg-[#CBD5E1] absolute -bottom-8 left-1/2 -translate-x-1/2"></div>
              )}
            </div>
            
            {/* Recursive Children */}
            {renderExtraChildren(child.id || child.member_id)}
          </div>
        ))}
      </div>
    );
  };

  const ownerDetails = getCardDetails(owner, "Owner");

  return (
    <div className="h-full flex flex-col w-full relative">
      <div ref={scrollContainerRef} className="flex-1 overflow-x-auto overflow-y-auto px-6 py-6 md:px-8 md:py-8 w-full custom-scrollbar">
        <div className="w-max min-w-full flex flex-col items-center gap-4 relative font-sans pb-12">
        
        {!isEditing && (
          <div className="absolute top-0 right-0 z-20">
            <button 
              onClick={handleEditToggle}
              className="bg-[#2D3409] hover:bg-[#3D4A0D] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 font-sans border-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              Edit
            </button>
          </div>
        )}

        <div className={`w-max min-w-[800px] flex flex-col items-center relative mt-6 transition-all duration-300 ${isEditing ? 'border-2 border-dashed border-[#E2E8F0] rounded-[24px] pb-12 pt-8 px-12' : ''}`}>
          
          <div className="w-full flex flex-col items-center relative mt-4">
            {/* OWNER CARD */}
            {owner ? (
               <div className="flex flex-col items-center relative">
                 <div className="flex flex-col items-center relative">
                    <button 
                      onClick={isEditing ? () => openModal("Owner", owner) : undefined} 
                      className={`bg-[#F9F9F9] border border-[#E6EEAD] rounded-[16px] p-6 shadow-sm w-[240px] flex flex-col items-center text-center relative z-20 ${isEditing ? 'cursor-pointer hover:bg-[#F0F4D4] transition-colors' : 'cursor-default'}`}
                   >
                     <span className="absolute -top-3 bg-[#BDD327] text-[#2D3409] text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm font-plus-jakarta border-[2px] border-white">
                       OWNER
                     </span>
                     {owner?.profile_url ? (
                       <img
                         src={owner.profile_url}
                         className="w-16 h-16 rounded-full object-cover shadow-sm mb-3 border-[3px] border-[#E2E8F0] bg-gray-100"
                         alt={ownerDetails.name}
                       />
                     ) : (
                       <div className="w-16 h-16 rounded-full bg-[#E2E8F0] shadow-sm mb-3 border-[3px] border-white flex items-center justify-center shrink-0">
                         <svg className="w-8 h-8 text-[#94A3B8]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                       </div>
                     )}
                     <p className="text-[17px] font-bold text-[#1A1C1D] m-0 leading-tight">
                       {ownerDetails.name}
                     </p>
                     <p className="text-[13px] font-medium text-[#2D3409] m-0 mt-1">
                       {ownerDetails.subtitle}
                     </p>
                   </button>
                   
                   {/* Parent vertical line extending down if Owner has children */}
                   {getChildrenOf(owner.id || owner.member_id).length > 0 && (
                      <div className="w-[1.5px] h-8 bg-[#CBD5E1] absolute -bottom-8 left-1/2 -translate-x-1/2"></div>
                   )}
                 </div>
                 
                 {renderExtraChildren(owner.id || owner.member_id)}
               </div>
            ) : (
               isEditing && (
                 <button onClick={() => openModal("Owner")} className="bg-[#F9F9F9] border border-[#E6EEAD] rounded-[16px] p-6 shadow-sm w-[240px] flex flex-col items-center text-center relative z-20 cursor-pointer hover:bg-[#F0F4D4] transition-colors">
                   <span className="bg-[#BDD327] text-[#2D3409] text-[10px] font-bold px-4 py-1 rounded-[100px] uppercase absolute -top-3 left-1/2 -translate-x-1/2 z-10 shadow-sm border-[2px] border-white">OWNER</span>
                   <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#E6EEAD] shadow-sm mb-3 border-[3px] border-white shrink-0">
                     <span className="text-[24px] text-[#2D3409] leading-none">+</span>
                   </div>
                   <p className="text-[15px] font-bold text-[#1A1C1D] m-0 leading-tight">Add Owner</p>
                 </button>
               )
            )}
          </div>

          {/* ORPHANS / UNCONNECTED MEMBERS */}
          {orphans.length > 0 && (
            <div className="flex flex-col items-center w-full relative z-10 mt-12 pt-8 border-t border-dashed border-[#E2E8F0]">
              <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Unconnected Members</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {orphans.map((child: any, idx: number) => (
                  <div key={`orphan-${idx}`} className="flex flex-col items-center">
                    {renderMemberCard(child, () => openModal("Member", child), isEditing)}
                    {renderExtraChildren(child.id || child.member_id)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD MEMBER BUTTON (Only in Edit Mode) */}
          {isEditing && (
            <div className="w-full flex justify-center items-center mt-12 relative z-10">
              <button 
                onClick={() => openModal("Member")}
                className="bg-[#2D3409] hover:bg-[#3D4A0D] text-white px-6 py-2.5 rounded-full text-[13px] font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2 border-none font-plus-jakarta"
              >
                <span className="text-[16px] leading-none mb-0.5">+</span>
                Add Member
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-row justify-end items-center gap-6 px-6 py-4 md:px-8 md:py-6 border-t border-gray-100 shrink-0 bg-white w-full">
        <button
          onClick={onBack}
          className="font-sans font-medium text-black uppercase hover:underline cursor-pointer tracking-wider text-xs md:text-sm bg-transparent border-none"
        >
          BACK
        </button>
        <button
          onClick={() => {
            onNext();
          }}
          className="flex items-center justify-center text-white rounded-full shadow-lg hover:scale-105 active:scale-95 cursor-pointer font-sans font-normal px-8 py-3 min-w-[120px] border-none"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)"
          }}
        >
          <span className="text-sm md:text-base">
            NEXT
          </span>
        </button>
      </div>

      <UploadMemberEditModal 
        isOpen={isModalOpen}
        role={modalRole}
        initialData={editMember}
        existingMembers={members}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          try {
            const memberIdToUpdate = editMember?.member_id || editMember?.id;

            if (memberIdToUpdate) {
              await updateFamilyMember({
                member_id: memberIdToUpdate,
                member: {
                  first_name: data.first_name || "",
                  last_name: data.last_name || "",
                  gender: data.gender || "",
                  age: data.age ? parseInt(data.age, 10) : 0
                }
              }).unwrap();
              toast.success("Family member updated successfully!");
              setIsEditing(false);
            } else {
              const isOwner = modalRole.toLowerCase() === 'owner';
              let relatedMemberId = 0;
              if (!isOwner) {
                relatedMemberId = data.connection 
                  ? parseInt(data.connection, 10) 
                  : (owner?.id || owner?.member_id || 0);
              }

              const relationshipCode = modalRole === 'Member' 
                ? (data.relation ? String(data.relation).toUpperCase() : '') 
                : modalRole.toUpperCase();

              await addFamilyMember({
                farmland_id: farmlandId,
                related_member_id: relatedMemberId,
                relationship_code: relationshipCode,
                member: {
                  first_name: data.first_name || "",
                  last_name: data.last_name || "",
                  gender: data.gender || "",
                  age: data.age ? parseInt(data.age, 10) : 0
                }
              }).unwrap();
              toast.success("Family member added successfully!");

              setIsEditing(false);
            }
            getFamilyTree({ farmland_id: farmlandId });
          } catch (error: any) {
            console.error("Failed to add family member:", error);
            const errMsg = error?.data?.error || error?.data?.message || error?.message || "Failed to add family member. Please try again.";
            toast.error(`Error: ${errMsg}`);
          }
        }}
      />
    </div>
  );
}
