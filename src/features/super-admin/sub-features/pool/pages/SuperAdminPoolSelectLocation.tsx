import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, MapPin } from "lucide-react";
import {
  LOCATION_OPTIONS,
  LOCATION_FARMLAND_MAP,
} from "../components/SelectLocationModal";

export default function SuperAdminPoolSelectLocation() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("Hyderabad, Telangana");

  const handleContinue = () => {
    const details =
      LOCATION_FARMLAND_MAP[selectedLocation] ||
      LOCATION_FARMLAND_MAP["Hyderabad, Telangana"];

    navigate("/super-admin/pool-buying/create", {
      state: {
        location: selectedLocation,
        farmlandId: details.farmlandId,
        assignedCode: details.assignedCode,
        wholeAreaAcres: details.wholeAreaAcres,
        wholeAreaSqFt: details.wholeAreaSqFt,
      },
    });
  };

  const handleClose = () => {
    navigate("/super-admin/pool-buying");
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans flex items-center justify-center p-4">
      {/* Pop-up Screen showing ONLY the location nothing more */}
      <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl p-6 font-sans relative border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-[#111] m-0">Select Location</h2>
          <button
            type="button"
            onClick={handleClose}
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
            onClick={handleContinue}
            className="w-full bg-[#2a2f1e] hover:bg-black text-white font-semibold py-3 px-4 rounded-xl text-[14px] cursor-pointer transition-colors shadow-sm"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-transparent text-gray-500 hover:text-gray-800 font-medium py-2 rounded-xl text-[13px] cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
