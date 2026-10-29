import { useNavigate } from "react-router-dom";
import {
  SelectLocationModal,
  LOCATION_FARMLAND_MAP,
  type GlcExclusiveLand,
} from "../components/SelectLocationModal";

export default function SuperAdminPoolSelectLocation() {
  const navigate = useNavigate();

  const handleContinue = (loc: string, selectedLand?: GlcExclusiveLand) => {
    const details =
      selectedLand ||
      LOCATION_FARMLAND_MAP[loc] ||
      LOCATION_FARMLAND_MAP["Hyderabad, Telangana"];

    navigate("/super-admin/pool-buying/create", {
      state: {
        location: selectedLand?.location || loc,
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
    <div className="min-h-screen bg-[#F6F7F6]">
      <SelectLocationModal
        isOpen={true}
        onClose={handleClose}
        onContinue={handleContinue}
      />
    </div>
  );
}
