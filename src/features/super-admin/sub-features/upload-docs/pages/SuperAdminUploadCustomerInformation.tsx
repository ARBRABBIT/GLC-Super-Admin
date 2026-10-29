import React from "react";
import { useOutletContext } from "react-router-dom";
import UploadCustomerInformationCard from "../components/UploadCustomerInformationCard";

interface UploadDocsContext {
  farmlandId: string;
  activeStep: string;
  onNextStep: () => void;
}

export const SuperAdminUploadCustomerInformation: React.FC = () => {
  const { farmlandId, onNextStep } = useOutletContext<UploadDocsContext>();

  const handleSubmit = (formData: any) => {
    console.log("Customer creation form data submitted:", formData);
    // Proceed to next step automatically
    onNextStep();
  };

  return (
    <div className="flex-1 min-w-0 h-full w-full flex flex-col relative overflow-hidden">
      <UploadCustomerInformationCard 
        farmlandId={farmlandId} 
        onSubmit={handleSubmit}
        onDismiss={onNextStep}
        className="h-full w-full overflow-y-auto"
      />
    </div>
  );
};

export default SuperAdminUploadCustomerInformation;
