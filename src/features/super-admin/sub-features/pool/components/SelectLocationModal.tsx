import React, { useState } from "react";
import { X, ChevronDown, MapPin } from "lucide-react";

export const LOCATION_OPTIONS: string[] = [
  "Hyderabad, Telangana",
  "Warangal, Telangana",
  "Vijayawada, Andhra Pradesh",
  "East Godavari, Andhra Pradesh",
  "Bengaluru, Karnataka",
  "Pune, Maharashtra",
  "Chennai, Tamil Nadu",
  "Mumbai, Maharashtra",
];

export const LOCATION_FARMLAND_MAP: Record<
  string,
  {
    farmlandId: string;
    assignedCode: string;
    wholeAreaAcres: string;
    wholeAreaSqFt: string;
  }
> = {
  "Hyderabad, Telangana": {
    farmlandId: "GLCSOS - 045",
    assignedCode: "HYDERABAD – TG",
    wholeAreaAcres: "25.00",
    wholeAreaSqFt: "10,89,000",
  },
  "Warangal, Telangana": {
    farmlandId: "GLCSOS - 043",
    assignedCode: "WARANGAL – TG",
    wholeAreaAcres: "32.50",
    wholeAreaSqFt: "14,15,700",
  },
  "Vijayawada, Andhra Pradesh": {
    farmlandId: "GLCSOS - 042",
    assignedCode: "VIJAYAWADA – AP",
    wholeAreaAcres: "18.00",
    wholeAreaSqFt: "7,84,080",
  },
  "East Godavari, Andhra Pradesh": {
    farmlandId: "GLCSOS - 001",
    assignedCode: "GODAVARI – AP",
    wholeAreaAcres: "45.00",
    wholeAreaSqFt: "19,60,200",
  },
  "Bengaluru, Karnataka": {
    farmlandId: "GLCSOS - 048",
    assignedCode: "BENGALURU – KA",
    wholeAreaAcres: "15.00",
    wholeAreaSqFt: "6,53,400",
  },
  "Pune, Maharashtra": {
    farmlandId: "GLCSOS - 050",
    assignedCode: "PUNE – MH",
    wholeAreaAcres: "20.00",
    wholeAreaSqFt: "8,71,200",
  },
  "Chennai, Tamil Nadu": {
    farmlandId: "GLCSOS - 052",
    assignedCode: "CHENNAI – TN",
    wholeAreaAcres: "22.00",
    wholeAreaSqFt: "9,58,320",
  },
  "Mumbai, Maharashtra": {
    farmlandId: "GLCSOS - 055",
    assignedCode: "MUMBAI – MH",
    wholeAreaAcres: "12.00",
    wholeAreaSqFt: "5,22,720",
  },
};

interface SelectLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (location: string) => void;
  initialLocation?: string;
}

export const SelectLocationModal: React.FC<SelectLocationModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  initialLocation = "Hyderabad, Telangana",
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-[440px] shadow-2xl p-6 font-sans z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-[#111] m-0">Select Location</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content: ONLY the location, nothing more */}
        <div className="py-6">
          <label className="block text-[12px] font-semibold text-[#555] mb-2">
            Location
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#738258]">
              <MapPin size={16} />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border-[1.5px] border-[#e8e8e8] rounded-xl py-3 pl-10 pr-10 text-[14px] font-medium text-[#222] outline-none appearance-none bg-white cursor-pointer box-border focus:border-[#738258] transition-colors"
            >
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onContinue(selectedLocation)}
            className="w-full bg-[#2a2f1e] hover:bg-black text-white font-semibold py-3 px-4 rounded-xl text-[14px] cursor-pointer transition-colors shadow-sm"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-transparent text-gray-500 hover:text-gray-800 font-medium py-2 rounded-xl text-[13px] cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
