import React from 'react';
import { Check } from 'lucide-react';

export const ConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; farmlandId: string }> = ({ isOpen, onClose, farmlandId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-[500px] p-10 flex flex-col items-center shadow-2xl relative">
        <h2 className="font-bold text-2xl mb-8 text-gray-900">Customer Information</h2>
        
        {/* Large Checkmark Badge */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-100/50 rounded-full scale-[1.5]" />
          <div className="w-24 h-24 bg-[#8DC63F] rounded-full flex items-center justify-center relative z-10 shadow-lg border-4 border-white">
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
        </div>

        <p className="text-center font-medium text-lg leading-snug mb-8 text-gray-800">
          Proceed With '<span className="text-[#1D7ABE] font-bold">Legal Documents</span>' for <br/>
          Farmland ID: <span className="text-[#1D7ABE] font-bold">{farmlandId}</span> for further <br/>
          Verification.
        </p>

        <button 
          onClick={onClose}
          className="bg-[#2A3125] text-white font-semibold text-lg px-12 py-4 rounded-full hover:bg-black transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};
