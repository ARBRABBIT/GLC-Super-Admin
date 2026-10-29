import { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import { masterDataService } from "@/features/super-admin/api/masterData.api";
import { toast } from "sonner";


export type ModalRole = "Father" | "Mother" | "Owner" | "Spouse" | "Member";

interface Props {
  role: ModalRole;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  existingMembers?: any[];
  initialData?: any;
}

export const UploadMemberEditModal = ({ role, isOpen, onClose, onSubmit, existingMembers = [], initialData }: Props) => {
  const [isExpired, setIsExpired] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { data: masterData } = masterDataService.useGetAllMasterDataQuery();
  const [relations, setRelations] = useState<{id: string|number, name: string}[]>([]);

  useEffect(() => {
    try {
      if (!masterData) return;
      
      const result = masterData.familyRelationshipTypesResult || (masterData as any)?.familyRelationshipTypeResult || [];
      
      if (result && Array.isArray(result)) {
        const mapped = result.map((r: any) => {
          if (typeof r === 'string') return { id: r, name: r };
          const name = r.description || r.name || r.relationship_name || r.label || r.title || r.desc || r.type || "";
          const id = r.code || r.id || r.value || r.relationship_id || name;
          return { id, name };
        }).filter((m: any) => m.name);
        
        if (mapped.length > 0) {
          setRelations(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to parse relations", err);
    }
  }, [role, masterData]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setIsExpired(!!initialData.dateOfExpiry || !!initialData.isExpired);
        setProfileImage(initialData.profile_url || initialData.img || null);
      } else {
        setIsExpired(false);
        setProfileImage(null);
      }
    }
  }, [isOpen, initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const gender = formData.get("gender") as string;
    const age = formData.get("age") as string;
    const dateOfExpiry = formData.get("dateOfExpiry") as string;
    
    // For 'Member' role
    const connection = formData.get("connection") as string;
    const relation = formData.get("relation") as string;

    const data: any = {
      first_name: firstName,
      last_name: lastName,
      isExpired
    };

    if (initialData?.id) data.id = initialData.id;
    if (initialData?.member_id) data.member_id = initialData.member_id;
    if (profileImage) data.profile_url = profileImage;

    if (gender) data.gender = gender;
    if (age) {
      data.age = parseInt(age, 10);
    }
    if (isExpired && dateOfExpiry) data.dateOfExpiry = dateOfExpiry;
    if (role === "Member") {
      if (connection) data.connection = connection;
      if (relation) data.relation = relation;
    }
    
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  const title = initialData ? `Edit ${role === "Member" ? "Member" : role}` : (role === "Member" ? "Add a member" : `Add ${role}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 font-plus-jakarta p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-[420px] max-w-full max-h-[90vh] flex flex-col shadow-xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 pb-4 shrink-0 border-b border-gray-50">
          <h2 className="text-[15px] font-bold text-[#1A1C1D]">{title}</h2>
          <button onClick={onClose} type="button" className="text-[#64748B] hover:text-[#1A1C1D] transition-colors cursor-pointer border-none bg-transparent">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 custom-scrollbar">

        {/* Photo Upload */}
        <div className="flex justify-center mb-8">
          <label className="relative cursor-pointer group">
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const ext = file.name.split('.').pop()?.toLowerCase();
                  const isValidType = file.type.startsWith('image/') || ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg'].includes(ext || '');
                  if (!isValidType) {
                    toast.error(`"${file.name}" is not a supported format.`);
                    e.target.value = "";
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error(`"${file.name}" is too large. Max size is 5MB.`);
                    e.target.value = "";
                    return;
                  }
                  handleImageUpload(e);
                }
              }} 
            />
            <div className="w-[110px] h-[110px] rounded-full border-[3px] border-dashed border-[#BCC6BC] flex flex-col items-center justify-center text-[#0B6230] group-hover:bg-[#f2f8f2] transition-colors overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <span className="text-[34px] font-light leading-[1] mt-1">+</span>
                  <span className="text-[10px] font-medium tracking-wide mt-1">ADD PHOTO</span>
                </>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#0B6230] rounded-full w-[38px] h-[38px] flex items-center justify-center border-[4px] border-white shadow-sm z-10">
              <Camera className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
          </label>
        </div>

        {/* Member Dropdowns */}
        {role === "Member" && !initialData && (
          <>
            <div className="flex flex-col gap-2 mb-5">
              <label className="text-[13px] font-medium text-[#475569]">Related To</label>
              <div className="relative">
                <select name="connection" defaultValue={initialData?.connection || initialData?.related_member_id || (existingMembers.find((m:any) => (m.relationship_code || "").toLowerCase() === 'owner')?.id || existingMembers.find((m:any) => (m.relationship_code || "").toLowerCase() === 'owner')?.member_id) || ""} className="w-full px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-[8px] outline-none text-[#1A1C1D] text-[13px] focus:bg-white focus:border-[#E2E8F0] appearance-none cursor-pointer">
                  <option value="" disabled>Select</option>
                  {existingMembers.map((m: any, idx: number) => {
                    const memberId = m.member_id || m.id;
                    if (!memberId) return null;
                    return (
                      <option key={idx} value={memberId}>
                        {m.first_name || m.farmer_first_name} {m.last_name || m.farmer_last_name || ""} {m.relationship_code ? `(${m.relationship_code})` : ""}
                      </option>
                    );
                  })}
                </select>
                <svg className="w-4 h-4 text-[#1A1C1D] absolute right-4 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mb-5">
              <label className="text-[13px] font-medium text-[#475569]">Select Relation</label>
              <div className="relative">
                <select name="relation" defaultValue={initialData?.relation || initialData?.relationship_code || ""} className="w-full px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-[8px] outline-none text-[#1A1C1D] text-[13px] focus:bg-white focus:border-[#E2E8F0] appearance-none cursor-pointer">
                  <option value="">Select a relation of the person</option>
                  {relations.length > 0 ? (
                    relations.filter(rel => {
                      if (rel.name.toLowerCase() === 'owner') {
                        return !existingMembers.some((m: any) => (m.relationship_code || m.relationship || "").toLowerCase() === 'owner');
                      }
                      return true;
                    }).map((rel, i) => (
                      <option key={i} value={rel.id}>{rel.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </>
                  )}
                </select>
                <svg className="w-4 h-4 text-[#1A1C1D] absolute right-4 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-4 mb-5">
          {/* First Name */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[13px] font-medium text-[#475569]">First Name</label>
            <input 
              type="text" 
              name="firstName"
              placeholder="First name"
              defaultValue={initialData?.first_name || initialData?.farmer_first_name || ""}
              required
              maxLength={50}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-[8px] outline-none text-[#1A1C1D] text-[13px] focus:bg-white focus:border-[#E2E8F0] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-[13px] font-medium text-[#475569]">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              placeholder="Last name"
              defaultValue={initialData?.last_name || initialData?.farmer_last_name || ""}
              maxLength={50}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-[8px] outline-none text-[#1A1C1D] text-[13px] focus:bg-white focus:border-[#E2E8F0] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2 mb-5">
          <label className="text-[13px] font-medium text-[#475569]">Gender</label>
          <div className="relative">
            <select name="gender" defaultValue={initialData?.gender || ""} className="w-full px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-[8px] outline-none text-[#1A1C1D] text-[13px] focus:bg-white focus:border-[#E2E8F0] appearance-none cursor-pointer">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <svg className="w-4 h-4 text-[#1A1C1D] absolute right-4 top-3.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Age */}
        <div className="flex flex-col gap-2 mb-1.5 relative">
          <label className="text-[13px] font-medium text-[#475569]">Age</label>
          <div className="relative">
            <input 
              type="text" 
              inputMode="numeric"
              name="age"
              placeholder="Enter age"
              defaultValue={initialData?.age || ""}
              maxLength={50}
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-[8px] outline-none text-[#1A1C1D] text-[13px] focus:bg-white focus:border-[#E2E8F0] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {/* Expiry Toggle Text */}
        <div className="flex justify-end mb-5">
          <button 
            type="button"
            onClick={() => setIsExpired(!isExpired)}
            className="text-[10px] text-[#475569] hover:text-[#1A1C1D] cursor-pointer font-medium border-none bg-transparent"
          >
            {isExpired ? "Not expired?" : "Person expired?"}
          </button>
        </div>

        {/* Date of Expiry */}
        {isExpired && (
          <div className="flex flex-col gap-2 mb-6 relative animate-in slide-in-from-top-2 fade-in duration-200">
            <label className="text-[13px] font-medium text-[#475569]">Date of Expiry</label>
            <div className="relative">
              <input 
                type="date" 
                name="dateOfExpiry"
                defaultValue={initialData?.dateOfExpiry ? new Date(initialData.dateOfExpiry).toISOString().split('T')[0] : ""}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-transparent rounded-[8px] outline-none text-[#1A1C1D] text-[13px] focus:bg-white focus:border-[#E2E8F0] transition-colors placeholder:text-[#94A3B8]"
              />
            </div>
          </div>
        )}

        </div>

        {/* Actions */}
        <div className="flex flex-row gap-3 p-6 md:p-8 pt-4 shrink-0 border-t border-gray-50">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 text-[#64748B] hover:text-[#1A1C1D] hover:bg-gray-50 font-medium py-3 rounded-[8px] text-[13px] transition-colors cursor-pointer border border-gray-200 bg-transparent"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 bg-[#2D3409] hover:bg-[#3D4A0D] text-white font-medium py-3 rounded-[8px] text-[13px] transition-colors cursor-pointer border-none"
          >
            {initialData ? "Save changes" : "Add details"}
          </button>
        </div>

      </form>
    </div>
  );
}
