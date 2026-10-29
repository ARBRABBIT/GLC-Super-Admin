import React from "react";
import { Phone, Mail, Calendar } from "lucide-react";

interface UploadOwnerDetailsFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  onDismiss?: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const UploadOwnerDetailsForm: React.FC<UploadOwnerDetailsFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  dob,
  setDob,
  gender,
  setGender,
  onDismiss,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="h-full flex flex-col w-full relative">
      <div className="flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-6 md:gap-y-8 w-full">
        {/* First Name */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-sans font-semibold text-[#3D4949] text-[10px] md:text-xs leading-tight tracking-[0.35px] uppercase">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="w-full h-10 md:h-12 bg-[#F3F3F5] rounded-xl outline-none text-[#1A1C1D] placeholder:text-gray-400 border border-transparent focus:border-[#2D3409]/30 transition-all font-sans font-normal text-xs md:text-sm px-4 py-2"
            maxLength={50}
            required
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-sans font-semibold text-[#3D4949] text-[10px] md:text-xs leading-tight tracking-[0.35px] uppercase">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter second name"
            className="w-full h-10 md:h-12 bg-[#F3F3F5] rounded-xl outline-none text-[#1A1C1D] placeholder:text-gray-400 border border-transparent focus:border-[#2D3409]/30 transition-all font-sans font-normal text-xs md:text-sm px-4 py-2"
            maxLength={50}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-sans font-semibold text-[#3D4949] text-[10px] md:text-xs leading-tight tracking-[0.35px] uppercase">
            Phone Number
          </label>
          <div className="relative w-full rounded-2xl overflow-hidden">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter mobile number"
              maxLength={10}
              className="w-full h-10 md:h-12 bg-[#F3F3F5] rounded-xl outline-none text-[#1A1C1D] placeholder:text-gray-400 border border-transparent focus:border-[#2D3409]/30 transition-all font-sans font-normal text-xs md:text-sm pl-10 md:pl-11 pr-4 py-2"
              required
            />
            <Phone 
              className="absolute text-[#3D4949] -translate-y-1/2 w-4 h-4 left-3.5 md:left-4 top-1/2"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-sans font-semibold text-[#3D4949] text-[10px] md:text-xs leading-tight tracking-[0.35px] uppercase">
            Email
          </label>
          <div className="relative w-full rounded-2xl overflow-hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="examplemail@gmail.com"
              className="w-full h-10 md:h-12 bg-[#F3F3F5] rounded-xl outline-none text-[#1A1C1D] placeholder:text-gray-400 border border-transparent focus:border-[#2D3409]/30 transition-all font-sans font-normal text-xs md:text-sm pl-10 md:pl-11 pr-4 py-2"
              maxLength={50}
              required
            />
            <Mail 
              className="absolute text-[#3D4949] -translate-y-1/2 w-4 h-4 left-3.5 md:left-4 top-1/2"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-sans font-semibold text-[#3D4949] text-[10px] md:text-xs leading-tight tracking-[0.35px] uppercase">
            Date of Birth
          </label>
          <div className="relative w-full rounded-2xl overflow-hidden">
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full h-10 md:h-12 bg-[#F3F3F5] rounded-xl outline-none text-[#1A1C1D] placeholder:text-gray-400 border border-transparent focus:border-[#2D3409]/30 transition-all font-sans font-normal text-xs md:text-sm pl-10 md:pl-11 pr-4 py-2"
              max={new Date().toISOString().split('T')[0]}
              required
            />
            <Calendar 
              className="absolute text-[#3D4949] -translate-y-1/2 w-4 h-4 left-3.5 md:left-4 top-1/2"
            />
          </div>
        </div>

        {/* Religion 
        <div className="flex flex-col gap-[clamp(0.27rem,0.56vw,0.8rem)] w-full">
          <label className="font-['Plus_Jakarta_Sans'] font-semibold text-[#3D4949] text-[clamp(0.47rem,0.97vw,1.15rem)] leading-tight tracking-[0.35px] uppercase">
            Religion
          </label>
          <input
            type="text"
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
            placeholder="Enter Hindu, Muslim, Christian, etc..."
            className="box-sizing-border-box w-full h-[clamp(1.67rem,3.47vw,4.0rem)] bg-[#F3F3F5] rounded-[clamp(0.8rem,1.67vw,2.0rem)] outline-none text-[#1A1C1D] placeholder-[rgba(26,28,29,0.24)] border border-transparent focus:border-[#2D3409]/30 transition-all font-['Plus_Jakarta_Sans'] font-normal text-[clamp(0.53rem,1.11vw,1.35rem)] px-[clamp(0.53rem,1.11vw,1.5rem)] py-[clamp(0.4rem,0.83vw,1.1rem)]"
          />
        </div>
        */}

        {/* Gender */}
        <div className="flex flex-col gap-2 w-full">
          <label className="font-sans font-semibold text-[#3D4949] text-[10px] md:text-xs leading-tight tracking-[0.35px] uppercase">
            Gender
          </label>
          <div className="relative w-full rounded-2xl overflow-hidden">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="appearance-none w-full h-10 md:h-12 bg-[#F3F3F5] rounded-xl outline-none text-[#1A1C1D] border border-transparent focus:border-[#2D3409]/30 transition-all font-sans font-normal text-xs md:text-sm pl-4 pr-10 py-2 cursor-pointer"
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#3D4949]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ── Footer CTAs ── */}
      <div className="flex flex-row justify-end items-center gap-6 px-6 py-4 md:px-8 md:py-6 border-t border-gray-100 shrink-0 bg-white">
        {/* Dismiss Button */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="font-sans font-medium text-black uppercase hover:underline cursor-pointer tracking-wider text-xs md:text-sm"
          >
            Dismiss
          </button>
        )}

        {/* Create Button */}
        <button
          type="submit"
          className="flex items-center justify-center text-white rounded-full shadow-lg hover:scale-105 active:scale-95 cursor-pointer font-sans font-normal px-8 py-3 min-w-[120px]"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, #3D4A0D 0%, #2A3008 100%)"
          }}
        >
          <span className="text-sm md:text-base">
            Create
          </span>
        </button>
      </div>
    </form>
  );
};
