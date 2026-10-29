import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, LogOut, Loader2, Lock, Eye, EyeOff, X, User } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logOut, selectCurrentUser } from "@/features/auth/store/authSlice";
import { S3Image } from '@/components/common/S3Image';
import { useGetUserProfileQuery, useUpdateProfileDetailsMutation, useUpdatePasswordMutation } from "@/features/auth/api/authApi";
import { useUploadS3FileMutation } from "@/features/super-admin/api/file.api";
import glcLogo from "@/assets/glc-logo.svg";
import { toast } from "sonner";

// Reusable toggle component (Currently unused/commented out)
/*
const CustomToggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2",
      checked ? "bg-[#4CAF50]" : "bg-gray-200"
    )}>
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);
*/

const SuperAdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  // const [notifications, setNotifications] = useState(true);
  // const [smsAlerts, setSmsAlerts] = useState(true);

  // API Hooks
  const { data: profileResponse, isLoading: isFetchingProfile, refetch } = useGetUserProfileQuery(user?.id ?? 0, {
    skip: !user?.id,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileDetailsMutation();
  const [uploadS3, { isLoading: isUploadingImage }] = useUploadS3FileMutation();

  const profile = profileResponse?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
  });
  const [profileUrl, setProfileUrl] = useState<string>("");

  // Password Update State
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        dob: profile.dob ? profile.dob.split("T")[0] : "",
      });
      setProfileUrl(profile.profile_url || "");
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Strict typing prevention for names: block numbers and spaces
    if (name === "first_name" || name === "last_name") {
       if (/[^a-zA-Z]/.test(value) && value !== "") return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      const formPayload = new FormData();
      formPayload.append("file", file);
      
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileKey = `users/${user.role_id}/profile/${user.id}/${cleanFileName}`;
      
      formPayload.append("key", fileKey);
      
      await uploadS3(formPayload).unwrap();
      setProfileUrl(fileKey);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await updateProfile({
        userId: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        dob: formData.dob,
        profile_url: profileUrl,
      }).unwrap();
      await refetch();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await updatePassword({
        old_password: "", // No old password field required by Figma
        new_password: newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setShowUpdatePassword(false);
    } catch (err: any) {
      console.error("Update password error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to update password.");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const isSaveDisabled = isUpdating || isUploadingImage || !formData.first_name || !formData.last_name;

  return (
    <div className="box-border min-h-screen bg-[#F6F7F6] p-[clamp(16px,2vw,32px)] overflow-auto custom-scrollbar flex flex-col items-center">
      <div className="w-full max-w-[1000px] flex flex-col gap-6">
        
        {/* Go Back Button */}
        <div>
          <button
            onClick={() => navigate('/super-admin/dashboard')}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-sm font-medium text-[var(--text-primary)] hover:bg-gray-50 transition-colors"
           >
            <ArrowLeft size={18} />
            Go Back to Dashboard
          </button>
        </div>

        {isFetchingProfile ? (
          <div className="bg-white rounded-[32px] p-4 md:p-8 flex flex-col gap-6 shadow-sm w-full animate-pulse">
            <div className="h-[180px] w-full bg-gray-200 rounded-[24px]"></div>
            <div className="px-8 pb-8 pt-4 flex items-center justify-between">
               <div className="w-32 h-32 rounded-full bg-gray-300 -mt-20 border-4 border-white"></div>
               <div className="ml-[140px] flex flex-col gap-2">
                 <div className="h-6 bg-gray-200 w-48 rounded"></div>
                 <div className="h-4 bg-gray-200 w-24 rounded"></div>
               </div>
            </div>
            <div className="rounded-[24px] p-8 border border-gray-200 flex flex-col gap-6">
               <div className="h-6 bg-gray-200 w-32 rounded mb-4"></div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                 {[1,2,3,4,5,6].map(i => <div key={i} className="h-11 bg-gray-100 rounded-xl"></div>)}
               </div>
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-[32px] p-4 md:p-8 flex flex-col gap-6 shadow-sm w-full">
          {/* ── Main Profile Banner Card ── */}
          <div className="rounded-[24px] overflow-hidden border border-gray-200 flex flex-col">
            {/* Banner Image */}
            <div className="h-[180px] w-full bg-gray-200 relative">
              <S3Image
                src="/super-admin/412454830_4ab87760-e674-4c28-80e0-4ba647ad5166 1.svg" 
                fallbackType="cover"
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info Section */}
            <div className="relative px-8 pb-8 pt-4 flex items-center min-h-[80px]">
              {/* Avatar overlapping banner */}
              <div className="absolute -top-16 left-8 group">
                {profileUrl ? (
                  <S3Image
                    src={profileUrl}
                    fallbackType="none"
                    alt={profile ? `${profile.first_name} ${profile.last_name}` : "User Profile"}
                    className={cn("w-32 h-32 rounded-full border-4 border-white object-cover bg-white shadow-sm", isUploadingImage && "opacity-50")}
                  />
                ) : (
                  <div className={cn("w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-sm", isUploadingImage && "opacity-50")}>
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* Upload Overlay (Only show when editing) */}
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="animate-spin text-white w-6 h-6" />
                    ) : (
                      <>
                        <Edit3 className="text-white w-5 h-5 mb-1" />
                        <span className="text-white text-[10px] font-medium leading-tight">Change Photo</span>
                      </>
                    )}
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </div>

              {/* Name & Role */}
              <div className="ml-[140px] flex flex-col flex-1">
                <Typography variant="h3" className="font-bold text-[1.5rem] text-[#2D3032]">
                  {formData.first_name || formData.last_name ? `${formData.first_name} ${formData.last_name}` : "Super Admin"}
                </Typography>
                <Typography variant="span" className="text-[0.875rem] text-gray-500 font-medium">
                  Super Admin
                </Typography>
              </div>
            </div>
          </div>

          {/* ── Personal Details Form ── */}
          <div className="rounded-[24px] p-8 border border-gray-200 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Typography variant="h4" className="font-bold text-[1.25rem] text-[#2D3032]">
                Personal details
              </Typography>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (profile) {
                        setFormData({
                          first_name: profile.first_name || "",
                          last_name: profile.last_name || "",
                          dob: profile.dob ? profile.dob.split("T")[0] : "",
                        });
                        setProfileUrl(profile.profile_url || "");
                      }
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaveDisabled}
                    className="flex items-center justify-center min-w-[80px] px-4 py-2 rounded-lg bg-[#2A3008] text-white hover:bg-[#3f470d] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-medium text-gray-600">First name</label>
                <input 
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  maxLength={50}
                  className={cn("w-full h-11 px-4 rounded-xl border border-gray-200 text-[0.875rem] text-[#2D3032] focus:outline-none focus:ring-1 focus:ring-gray-300", !isEditing ? "bg-transparent cursor-default" : "bg-white")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-medium text-gray-600">Last name</label>
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  maxLength={50}
                  className={cn("w-full h-11 px-4 rounded-xl border border-gray-200 text-[0.875rem] text-[#2D3032] focus:outline-none focus:ring-1 focus:ring-gray-300", !isEditing ? "bg-transparent cursor-default" : "bg-white")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-medium text-gray-600">Date Of Birth</label>
                <input 
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  max={today}
                  className={cn("w-full h-11 px-4 rounded-xl border border-gray-200 text-[0.875rem] text-[#2D3032] focus:outline-none focus:ring-1 focus:ring-gray-300", !isEditing ? "bg-transparent cursor-default" : "bg-white")}
                />
              </div>

              {/* Read Only Fields */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-medium text-gray-600">Phone number</label>
                <input 
                  type="text" 
                  readOnly
                  value={profile?.phone_number ? `${profile.country_code || ''} ${profile.phone_number}` : ""}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[0.875rem] text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-medium text-gray-600">Email</label>
                <input 
                  type="text" 
                  readOnly
                  value={profile?.email || ""}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-[0.875rem] text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-medium text-gray-600">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    readOnly
                    value="XXXXXXXXXXX"
                    className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-200 bg-transparent text-[0.875rem] text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                  {!isEditing ? (
                    <button 
                      onClick={() => setShowUpdatePassword(true)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                  ) : (
                    <button disabled className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Alerts (Commented out as requested) ── */}
          {/*
          <div className="rounded-[24px] p-8 border border-gray-200 flex flex-col gap-6">
            <Typography variant="h4" className="font-bold text-[1.25rem] text-[#2D3032]">
              Alerts
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-between bg-white rounded-xl">
                <div className="flex flex-col gap-1">
                  <h5 className="text-[0.875rem] font-bold text-[#2D3032]">Notifications</h5>
                  <p className="text-[0.8125rem] text-gray-500">Receive updates via Notifications</p>
                </div>
                <CustomToggle checked={notifications} onChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl">
                <div className="flex flex-col gap-1">
                  <h5 className="text-[0.875rem] font-bold text-[#2D3032]">SMS Alerts</h5>
                  <p className="text-[0.8125rem] text-gray-500">Get important alerts via SMS</p>
                </div>
                <CustomToggle checked={smsAlerts} onChange={setSmsAlerts} />
              </div>
            </div>
          </div>
          */}

          {/* ── Want to logout? ── */}
          <div className="rounded-[24px] p-6 px-8 border border-gray-200 flex items-center justify-between">
            <Typography variant="h4" className="font-bold text-[1.125rem] text-[#2D3032]">
              Want to logout?
            </Typography>
            
            <button 
              onClick={() => {
                dispatch(logOut());
                navigate('/super-admin/login', { replace: true });
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FFF0F0] text-[#FF4B4B] hover:bg-[#FFE5E5] transition-colors font-medium text-sm"
             >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
        )}
      </div>

      {/* ── Update Password Dialog ── */}
      {showUpdatePassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-[600px] bg-white shadow-2xl rounded-[32px] px-8 py-10 flex flex-col items-start animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowUpdatePassword(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <img
              src={glcLogo}
              alt="Green Land Capital Logo"
              className="w-32 h-14 object-contain select-none mb-8"
            />
            
            {/* Heading */}
            <div className="w-full flex flex-col gap-2 mb-8 text-left">
              <Typography variant="h2" className="font-bold text-[1.5rem] text-[#2D3032]">
                Update Password
              </Typography>
              <Typography variant="p" className="text-[1rem] text-gray-500">
                Ensure your account is using a long, random password to stay secure.
              </Typography>
            </div>

            {/* Form */}
            <form onSubmit={handlePasswordUpdateSubmit} className="w-full flex flex-col gap-6">
              {/* New Password Input */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[0.875rem] font-medium text-gray-600">
                  New Password
                </label>
                <div className="relative w-full h-12 rounded-xl border border-gray-200 bg-white flex items-center focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                  <Lock className="absolute left-4 text-gray-400 w-4 h-4" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-full bg-transparent pl-12 pr-12 border-none outline-none text-[0.875rem] text-[#2D3032] placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Input */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[0.875rem] font-medium text-gray-600">
                  Confirm New Password
                </label>
                <div className="relative w-full h-12 rounded-xl border border-gray-200 bg-white flex items-center focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                  <Lock className="absolute left-4 text-gray-400 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-full bg-transparent pl-12 pr-12 border-none outline-none text-[0.875rem] text-[#2D3032] placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full h-12 rounded-xl bg-[#2A3008] text-white font-medium text-[0.875rem] flex items-center justify-center transition-colors hover:bg-[#3f470d] disabled:opacity-50 mt-4 shadow-sm"
              >
                {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminProfile;
