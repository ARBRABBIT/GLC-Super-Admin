import React, { useState } from "react";
import { X, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import GlcLogo from "@/assets/glc-logo.svg";
import { useMaintenanceUpdatePasswordMutation } from "../api/maintenanceAuthApi";
import { toast } from "sonner";

interface MaintenanceUpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const MaintenanceUpdatePasswordModal: React.FC<MaintenanceUpdatePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [updatePassword, { isLoading }] = useMaintenanceUpdatePasswordMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await updatePassword({
        old_password: "",
        new_password: newPassword,
      }).unwrap();

      setIsSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        setIsSuccess(false);
        setNewPassword("");
        setConfirmPassword("");
        onSuccess?.();
        onClose();
      }, 1200);
    } catch (err: any) {
      const msg = err?.data?.error || err?.data?.message || "Failed to update password";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-[28px] max-w-[420px] w-full p-7 sm:p-8 shadow-2xl z-10 border border-[#ECEFF2] flex flex-col items-center animate-in zoom-in-95 duration-200">
        {/* Close Button on Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Logo matching Figma */}
        <div className="flex flex-col items-center mb-5">
          <img src={GlcLogo} alt="Green Land Capital" className="h-11 w-auto object-contain mb-1" />
          <span className="text-[9.5px] font-bold text-[#1E75BB] tracking-wider uppercase">
            GREEN LAND CAPITAL
          </span>
          <span className="text-[7.5px] text-[#7A8699] tracking-widest uppercase">
            Seal of Soil
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="w-full text-left mb-5">
          <h3 className="text-[18px] sm:text-[20px] font-bold text-[#111827] m-0 mb-1.5 tracking-tight">
            Update Password
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed m-0 font-normal">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#1F2937]">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#1E75BB] focus:bg-white transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-[#1F2937]">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#1E75BB] focus:bg-white transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <span className="text-red-500 text-xs text-left">{errorMessage}</span>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[46px] rounded-xl bg-[#1E75BB] hover:bg-[#1864A0] text-white font-semibold text-xs cursor-pointer border-none shadow-xs hover:shadow-md transition-all mt-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : isSuccess ? (
              "Password Updated!"
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* Footer Security Notice matching Figma */}
        <div className="flex items-center gap-1.5 mt-5 text-[11px] text-[#64748B]">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>Secured by TechGy Innovations. End-to-end encrypted connection.</span>
        </div>
      </div>
    </div>
  );
};
