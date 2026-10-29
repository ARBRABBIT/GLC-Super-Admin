import React, { useState } from 'react';
import { Check } from 'lucide-react';

// ─── Star Badge ───────────────────────────────────────────────────────────────

export const StarBadge: React.FC<{ size: number; innerColor: string; outerColor: string }> = ({ size, innerColor, outerColor }) => {
  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="absolute inset-0" style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(0deg)' }} />
      <div className="absolute inset-0" style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(30deg)' }} />
      <div className="absolute inset-0" style={{ background: outerColor, borderRadius: '25%', transform: 'rotate(60deg)' }} />
      <div className="absolute" style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(15deg)' }} />
      <div className="absolute" style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(45deg)' }} />
      <div className="absolute" style={{ width: size * 0.78, height: size * 0.78, background: innerColor, borderRadius: '25%', transform: 'rotate(75deg)' }} />
      <div className="relative z-10">
        <Check size={size * 0.45} strokeWidth={4} color="white" />
      </div>
    </div>
  );
};

// ─── Reject Modal ─────────────────────────────────────────────────────────────

export const RejectModal: React.FC<{ onClose: () => void; onConfirm: (reason: string) => void }> = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-[500px] p-8 flex flex-col items-center shadow-2xl relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Reject Document</h2>
        <textarea
          className="w-full h-[150px] p-4 bg-gray-50 border border-gray-200 rounded-2xl resize-none text-sm outline-none focus:border-red-400 mb-6"
          placeholder="Enter reason for rejection..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-4 w-full justify-end">
          <button className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-semibold" onClick={onClose}>Cancel</button>
          <button 
            className="px-6 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            onClick={() => {
              if (reason.trim()) onConfirm(reason);
            }}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Proceed Modal ────────────────────────────────────────────────────────────

export const ProceedModal: React.FC<{
  onProceed: () => void;
  currentStepName: string;
  nextStepName: string;
  farmlandId: string;
}> = ({ onProceed, currentStepName, nextStepName, farmlandId }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-[500px] py-10 px-8 flex flex-col items-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative">
        <h2 className="font-bold text-[24px] mb-8 text-gray-900">{currentStepName}</h2>
        
        <div className="mb-8">
          <StarBadge size={140} outerColor="#F3F4F6" innerColor="#A3C33D" />
        </div>

        <p className="text-center font-medium text-[17px] text-gray-800 leading-[1.6] mb-10 max-w-[360px]">
          Proceed With '<span className="text-[#1D7ABE] font-bold">{nextStepName}</span>' for
          Farmland ID: <span className="text-[#1D7ABE] font-bold">{farmlandId}</span> for further
          Verification.
        </p>

        <button 
          onClick={onProceed}
          className="bg-[#2A3125] text-white font-semibold text-[17px] px-[50px] py-[14px] rounded-full hover:bg-black transition-colors"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};
