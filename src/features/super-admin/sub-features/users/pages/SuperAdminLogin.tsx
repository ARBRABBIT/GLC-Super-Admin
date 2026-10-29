import { useState } from "react";
import { Eye, EyeOff, Lock, User, ShieldCheck } from "lucide-react";
import MainLoginBg from "@/assets/main login.svg";
import GlcLogo from "@/assets/glc-logo.svg";
import SharpIcon from "@/assets/sharp.svg";
import { useLoginMutation, useUpdatePasswordMutation, useForgotPasswordMutation } from "@/features/auth/api/authApi";
import { useLazyGetAllMasterDataQuery } from "@/features/super-admin/api/masterData.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/store/authSlice";
import { ROLE_CODES } from "@/features/auth/types";

// ─── Dev Mock Users ───────────────────────────────────────────────────────────
// const MOCK_USERS = [
//   { login_id: "superadmin@glc.com", password: "superadmin@123", role_id: UserRole.SADMIN, first_name: "Super", last_name: "Admin", id: 999 },
// ];

// ─── Styles ───────────────────────────────────────────────────────────────────
const btnGradient = { background: 'radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)' };

// ─── Components ───────────────────────────────────────────────────────────────

function SecureFooter() {
  return (
    <div className="w-full max-w-[454px] mx-auto xl:mx-0 flex items-center gap-[8px] lg:gap-[16px] mt-8 xl:mt-auto pt-4">
       <ShieldCheck className="text-[#006D3A] w-[16px] h-[20px] flex-shrink-0" />
       <span className="font-['Plus_Jakarta_Sans'] font-normal text-[10px] lg:text-[12px] leading-[14px] lg:leading-[16px] text-[#3D4949]/80">
         Secured by TechGy Innovations. End-to-end encrypted connection.
       </span>
    </div>
  );
}

// ─── SCREEN 1 · Login ─────────────────────────────────────────────────────────
function LoginScreen({ onSuccess, onForgotPassword }: { onSuccess: (d: { is_first_login: number; passwordUsed: string }) => void; onForgotPassword: () => void; }) {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [fetchMasterData] = useLazyGetAllMasterDataQuery();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!loginId.trim()) e.loginId = "Login ID is required";
    else if (!/\S+@\S+\.\S+/.test(loginId)) e.loginId = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLoginId = loginId.trim();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    try {
      setLoading(true);
      const response = await login({ login_id: trimmedLoginId, password }).unwrap();
      dispatch(
        setCredentials({
          user: {
            id: response.id,
            login_id: response.login_id,
            first_name: response.first_name,
            last_name: response.last_name,
            role_id: response.role_id,
            role: ROLE_CODES[response.role_id] || "",
            is_first_login: response.is_first_login,
          },
          accessToken: response.token,
          refreshToken: response.refreshToken,
        })
      );
      try {
        fetchMasterData();
      } catch (_) {}
      onSuccess({ is_first_login: response.is_first_login, passwordUsed: password });
    } catch (err: any) {
      setErrors({ password: err?.data?.error || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center w-full">
      <div className="w-full max-w-[454px] mx-auto xl:mx-0 flex flex-col gap-[28px]">
        
        <div className="flex flex-col gap-3">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[32px] lg:text-[40px] leading-[1.2] lg:leading-[50px] tracking-[-0.9px] text-[#1A1C1D] m-0">
            Super Admin
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] lg:text-[16px] leading-[1.5] lg:leading-[26px] text-[#3D4949] m-0">
            Secure access for authorized Super Admin. Please authenticate to continue.
          </p>
        </div>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] leading-[20px] text-[#3D4949]">
              Login ID
            </label>
            <div className={`flex items-center w-full h-[56px] bg-[#F3F3F5] border ${errors.loginId ? 'border-red-500' : 'border-black/10'} rounded-[32px] px-6 gap-[18px]`}>
              <User className="text-[#6D7A7A] w-[16px] h-[16px] flex-shrink-0" strokeWidth={2} />
              <input 
                type="text" 
                placeholder="Enter your assigned ID" 
                autoComplete="username"
                className="flex-1 bg-transparent border-none outline-none font-['Plus_Jakarta_Sans'] text-[16px] text-[#1A1C1D] placeholder:text-[#6D7A7A]/30 w-full"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>
            {errors.loginId && <span className="text-red-500 text-sm mt-1 font-['Plus_Jakarta_Sans']">{errors.loginId}</span>}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] leading-[20px] text-[#3D4949]">
              Password
            </label>
            <div className={`flex items-center w-full h-[56px] bg-[#F3F3F5] border ${errors.password ? 'border-red-500' : 'border-black/10'} rounded-[32px] px-6 gap-[18px]`}>
              <Lock className="text-[#6D7A7A] w-[16px] h-[16px] flex-shrink-0" strokeWidth={2} />
              <input 
                type={showPw ? "text" : "password"} 
                placeholder="Enter Password" 
                autoComplete="current-password"
                className="flex-1 bg-transparent border-none outline-none font-['Plus_Jakarta_Sans'] text-[16px] text-[#1A1C1D] placeholder:text-[#6D7A7A]/30 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="border-none bg-transparent cursor-pointer p-0 flex items-center justify-center flex-shrink-0">
                 {showPw ? <Eye className="text-[#6D7A7A] w-[18px] h-[18px]" /> : <EyeOff className="text-[#6D7A7A] w-[18px] h-[18px]" />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-sm mt-1 font-['Plus_Jakarta_Sans']">{errors.password}</span>}
            <div className="w-full text-right mt-[4px]">
               <button type="button" onClick={onForgotPassword} className="bg-transparent border-none p-0 cursor-pointer font-['Plus_Jakarta_Sans'] font-medium text-[14px] leading-[20px] text-[#3D4949] hover:underline">
                 Forgot Password?
               </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={btnGradient}
            className="w-full h-[52px] disabled:opacity-50 disabled:cursor-not-allowed rounded-[48px] text-white font-['Plus_Jakarta_Sans'] font-bold text-[16px] flex items-center justify-center border-none cursor-pointer mt-[8px] transition-opacity hover:opacity-90 shadow-md"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── SCREEN 2 · Forgot Password ───────────────────────────────────────────────
function ForgotPasswordScreen({ onSuccess }: { onSuccess: (maskedEmail: string) => void; }) {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const maskEmail = (raw: string) => {
    const [local, domain] = raw.split("@");
    const visible = local.slice(0, Math.min(3, local.length));
    return `${visible}${"X".repeat(Math.max(0, local.length - visible.length))}@${domain}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    setError("");
    try {
      await forgotPassword({ login_id: email }).unwrap();
      onSuccess(maskEmail(email));
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center w-full">
      <div className="w-full max-w-[454px] mx-auto xl:mx-0 flex flex-col gap-[28px]">
        <div className="flex flex-col gap-3">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[32px] lg:text-[40px] leading-[1.2] lg:leading-[50px] tracking-[-0.9px] text-[#1A1C1D] m-0">
            Forgot your password?
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] lg:text-[16px] leading-[1.5] lg:leading-[26px] text-[#3D4949] m-0">
            Enter your registered mail to receive a temporary password
          </p>
        </div>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] leading-[20px] text-[#3D4949]">
              Enter registered mail
            </label>
            <div className={`flex items-center w-full h-[56px] bg-[#F3F3F5] border ${error ? 'border-red-500' : 'border-black/10'} rounded-[32px] px-6 gap-[18px]`}>
              <User className="text-[#6D7A7A] w-[16px] h-[16px] flex-shrink-0" strokeWidth={2} />
              <input 
                type="text" 
                placeholder="Enter your register mail here" 
                className="flex-1 bg-transparent border-none outline-none font-['Plus_Jakarta_Sans'] text-[16px] text-[#1A1C1D] placeholder:text-[#6D7A7A]/30 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <span className="text-red-500 text-sm mt-1 font-['Plus_Jakarta_Sans']">{error}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={btnGradient}
            className="w-full h-[52px] disabled:opacity-50 disabled:cursor-not-allowed rounded-[48px] text-white font-['Plus_Jakarta_Sans'] font-bold text-[16px] flex items-center justify-center border-none cursor-pointer mt-[8px] transition-opacity hover:opacity-90 shadow-md"
          >
            {isLoading ? 'Sending...' : 'Send Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── SCREEN 3 · Forgot Password Success ──────────────────────────────────────
function ForgotPasswordSuccessScreen({ maskedEmail, onDone }: { maskedEmail: string; onDone: () => void; }) {
  return (
    <div className="flex-1 flex flex-col justify-center w-full">
      <div className="w-full max-w-[454px] mx-auto xl:mx-0 flex flex-col items-center text-center gap-[28px] bg-white">
        
        <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[32px] lg:text-[40px] leading-[1.2] lg:leading-[50px] tracking-[-0.9px] text-[#1A1C1D] m-0">
          Password Sent Succesfully
        </h2>

        <div className="flex items-center justify-center py-4">
          <img src={SharpIcon} alt="Success" className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] object-contain" />
        </div>

        <p className="font-['Plus_Jakarta_Sans'] font-medium text-[16px] lg:text-[18px] leading-[1.4] text-[#3D4949] m-0">
          We Have Sent a Temporary Password<br/>to {maskedEmail}
        </p>

        <button 
          type="button" 
          onClick={onDone}
          style={btnGradient}
          className="w-full max-w-[200px] h-[52px] rounded-[48px] text-white font-['Plus_Jakarta_Sans'] font-bold text-[16px] flex items-center justify-center border-none cursor-pointer mt-[8px] transition-opacity hover:opacity-90 shadow-md"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 4 · Update Default Password ──────────────────────────────────────
function UpdateDefaultPasswordScreen({ onSetNew, onContinue }: { onSetNew: () => void; onContinue: () => void; }) {
  return (
    <div className="flex-1 flex flex-col justify-center w-full">
      <div className="w-full max-w-[454px] mx-auto xl:mx-0 flex flex-col gap-[28px]">
        <div className="flex flex-col gap-3">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[32px] lg:text-[40px] leading-[1.2] lg:leading-[50px] tracking-[-0.9px] text-[#1A1C1D] m-0">
            Update Default<br/>Password
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] lg:text-[16px] leading-[1.5] lg:leading-[26px] text-[#3D4949] m-0">
            You are currently logging in with a system-generated password sent to your email. For your security, we strongly recommend setting a new password now.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full mt-4">
          <button 
            type="button" 
            onClick={onSetNew}
            style={btnGradient}
            className="w-full h-[52px] rounded-[48px] text-white font-['Plus_Jakarta_Sans'] font-bold text-[16px] flex items-center justify-center border-none cursor-pointer transition-opacity hover:opacity-90 shadow-md"
          >
            Set New Password
          </button>
          
          <button 
            type="button" 
            onClick={onContinue}
            className="w-full bg-transparent hover:underline text-[#1A1C1D] font-['Plus_Jakarta_Sans'] font-bold text-[14px] flex items-center justify-center border-none cursor-pointer transition-colors mt-2"
          >
            Continue to login
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 5 · Change Password ───────────────────────────────────────────────
function ChangePasswordScreen({ onDone, oldPassword }: { onDone: () => void; oldPassword: string }) {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!newPw) e.newPw = "New password is required";
    else if (newPw.length < 8) e.newPw = "Password must be at least 8 characters";
    if (!confirmPw) e.confirmPw = "Please confirm your password";
    else if (newPw !== confirmPw) e.confirmPw = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    try {
      await updatePassword({ old_password: oldPassword, new_password: newPw }).unwrap();
      setSuccess(true);
      setTimeout(() => { onDone(); }, 1400);
    } catch (err: any) {
      setErrors({ confirmPw: err?.data?.error || "Failed to update password" });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center w-full">
      <div className="w-full max-w-[454px] mx-auto xl:mx-0 flex flex-col gap-[28px]">
        <div className="flex flex-col gap-3">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[32px] lg:text-[40px] leading-[1.2] lg:leading-[50px] tracking-[-0.9px] text-[#1A1C1D] m-0">
            Change password
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] lg:text-[16px] leading-[1.5] lg:leading-[26px] text-[#3D4949] m-0">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="rounded-full bg-[#E5F0EB] flex items-center justify-center w-16 h-16">
              <svg className="w-8 h-8 text-[#006D3A]" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-['Plus_Jakarta_Sans'] font-semibold text-[#006D3A] text-[18px] m-0">
              Password updated successfully!
            </p>
            <p className="font-['Plus_Jakarta_Sans'] text-[#6D7A7A] text-[14px] m-0">
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 w-full">
              <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] leading-[20px] text-[#3D4949]">
                New Password
              </label>
              <div className={`flex items-center w-full h-[56px] bg-[#F3F3F5] border ${errors.newPw ? 'border-red-500' : 'border-black/10'} rounded-[32px] px-6 gap-[18px]`}>
                <Lock className="text-[#6D7A7A] w-[16px] h-[16px] flex-shrink-0" strokeWidth={2} />
                <input 
                  type={showNew ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="flex-1 bg-transparent border-none outline-none font-['Plus_Jakarta_Sans'] text-[16px] text-[#1A1C1D] placeholder:text-[#6D7A7A]/30 w-full"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="border-none bg-transparent cursor-pointer p-0 flex items-center justify-center flex-shrink-0">
                   {showNew ? <Eye className="text-[#6D7A7A] w-[18px] h-[18px]" /> : <EyeOff className="text-[#6D7A7A] w-[18px] h-[18px]" />}
                </button>
              </div>
              {errors.newPw && <span className="text-red-500 text-sm mt-1 font-['Plus_Jakarta_Sans']">{errors.newPw}</span>}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] leading-[20px] text-[#3D4949]">
                Confirm New Password
              </label>
              <div className={`flex items-center w-full h-[56px] bg-[#F3F3F5] border ${errors.confirmPw ? 'border-red-500' : 'border-black/10'} rounded-[32px] px-6 gap-[18px]`}>
                <Lock className="text-[#6D7A7A] w-[16px] h-[16px] flex-shrink-0" strokeWidth={2} />
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="Re-enter new password" 
                  className="flex-1 bg-transparent border-none outline-none font-['Plus_Jakarta_Sans'] text-[16px] text-[#1A1C1D] placeholder:text-[#6D7A7A]/30 w-full"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="border-none bg-transparent cursor-pointer p-0 flex items-center justify-center flex-shrink-0">
                   {showConfirm ? <Eye className="text-[#6D7A7A] w-[18px] h-[18px]" /> : <EyeOff className="text-[#6D7A7A] w-[18px] h-[18px]" />}
                </button>
              </div>
              {errors.confirmPw && <span className="text-red-500 text-sm mt-1 font-['Plus_Jakarta_Sans']">{errors.confirmPw}</span>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={btnGradient}
              className="w-full h-[52px] disabled:opacity-50 disabled:cursor-not-allowed rounded-[48px] text-white font-['Plus_Jakarta_Sans'] font-bold text-[16px] flex items-center justify-center border-none cursor-pointer mt-[8px] transition-opacity hover:opacity-90 shadow-md"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function SuperAdminLogin() {
  const navigate = useNavigate();
  type Screen = "login" | "update-default" | "change-password" | "forgot-password" | "forgot-success";
  const [screen, setScreen] = useState<Screen>("login");
  const [oldPassword, setOldPassword] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const handleLoginSuccess = ({ is_first_login, passwordUsed }: { is_first_login: number; passwordUsed: string; }) => {
    setOldPassword(passwordUsed);
    if (is_first_login === 1) {
      setScreen("update-default");
    } else {
      navigate("/super-admin/farmlands");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center p-0 lg:p-4">
      <div className="relative w-full max-w-[1440px] min-h-screen lg:min-h-0 lg:h-[90vh] lg:max-h-[920px] bg-[#ffffff] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row items-center lg:justify-start lg:rounded-[32px]">
        
        {/* Left Side - Image Background */}
        <div 
          className="relative w-full lg:flex-1 lg:m-4 xl:m-6 h-[35vh] min-h-[280px] lg:min-h-0 lg:h-[calc(100%-2rem)] xl:h-[calc(100%-3rem)] bg-cover bg-center overflow-hidden flex flex-col justify-between shrink-0 rounded-b-[32px] lg:rounded-[24px]"
          style={{ backgroundImage: `url('${MainLoginBg}')` }}
        >
           {/* Dark Overlay for better text readability */}
           <div className="absolute inset-0 bg-black/20" />
           
           {/* Top Left Logo */}
           <div className="relative z-10 p-6 lg:p-[32px]">
              <img src={GlcLogo} alt="Green Land Capital" className="w-[100px] lg:w-[134px] object-contain drop-shadow-md" />
           </div>

           <div className="relative z-10 w-full text-center mt-auto mb-8 lg:mb-[60px]">
             <h1 className="font-['Plus_Jakarta_Sans'] font-semibold text-[28px] lg:text-[42px] leading-[1.2] lg:leading-[52px] text-white drop-shadow-lg">
               Welcome To<br/>Green Land Capital
             </h1>
           </div>
        </div>

        {/* Right Side - Dynamic Form Area */}
        <div className="w-full lg:flex-1 flex-1 h-full flex flex-col justify-between py-[32px] lg:py-[40px] px-6 lg:px-[40px] xl:px-0 xl:pl-[60px] xl:pr-[60px] bg-[#ffffff]">
          
          {screen === "login" && (
            <LoginScreen
              onSuccess={handleLoginSuccess}
              onForgotPassword={() => setScreen("forgot-password")}
            />
          )}

          {screen === "forgot-password" && (
            <ForgotPasswordScreen
              onSuccess={(masked) => { setMaskedEmail(masked); setScreen("forgot-success"); }}
            />
          )}

          {screen === "forgot-success" && (
            <ForgotPasswordSuccessScreen
              maskedEmail={maskedEmail}
              onDone={() => setScreen("login")}
            />
          )}

          {screen === "update-default" && (
            <UpdateDefaultPasswordScreen
              onSetNew={() => setScreen("change-password")}
              onContinue={() => navigate("/super-admin/farmlands")}
            />
          )}

          {screen === "change-password" && (
            <ChangePasswordScreen 
              onDone={() => navigate("/super-admin/farmlands")} 
              oldPassword={oldPassword} 
            />
          )}

          {/* Persistent Footer on all screens except forgot-success which has its own white card layout conceptually, but we keep it uniform here */}
          <SecureFooter />

        </div>
      </div>
    </div>
  );
}
