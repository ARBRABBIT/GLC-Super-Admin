import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';
import type { FlowStep } from '@/features/super-admin/types/legal-docs';
import { WarningIcon, CheckIcon } from './Icons';

// ─── Page Header (Back button + Bell + Avatar) ───────────────────────────────

export const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center bg-transparent mb-6 shrink-0 w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate('/super-admin/assigned-farmlands')}
        className="bg-white rounded-full flex items-center px-5 py-3 gap-3 cursor-pointer border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-[#353535] shrink-0" />
        <span className="font-medium text-[15px] text-[#353535] hidden sm:block">Go Back to Dashboard</span>
      </button>

      {/* Bell & Avatar */}
      <div className="flex gap-3">
        <button className="w-10 h-10 md:w-[52px] md:h-[52px] bg-white rounded-full flex justify-center items-center border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors shrink-0">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#2C2C2C]" />
        </button>
        <div className="w-10 h-10 md:w-[52px] md:h-[52px] bg-white rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
          <img src="https://i.pravatar.cc/150?u=superadmin" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

// ─── Stepper Sidebar ──────────────────────────────────────────────────────────

export const StepperSidebar: React.FC<{
  farmlandId: string;
  currentStepId: string;
  steps: FlowStep[];
  onNavigate: (stepPath: string, stepId: string) => void;
}> = ({ farmlandId, currentStepId, steps, onNavigate }) => (
  <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm flex flex-col hidden md:flex lg:overflow-y-auto custom-scrollbar">
    <span className="font-medium text-gray-900 text-[16px] lg:text-[18px]">Farmland ID:</span>
    <div className="font-medium text-3xl lg:text-[42px] text-gray-900 mt-1 mb-10 lg:mb-16 break-all leading-tight">{farmlandId}</div>

    <div className="relative pl-2 flex flex-col gap-12 lg:gap-[80px]">
      <div className="absolute left-[22px] top-[14px] bottom-[14px] w-[1px] bg-gray-300" />
      
      {steps.map((step) => {
        const isCurrent = step.id === currentStepId;
        return (
          <div 
            key={step.id} 
            className="relative flex items-center gap-6 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate(step.routePath, step.id)}
          >
            <div className="w-[28px] h-[28px] rounded-full bg-[#E1E8B0] flex items-center justify-center relative z-10 shadow-[0_0_0_2px_white] shrink-0">
              <div className="w-[12px] h-[12px] rounded-full bg-[#2B3024]" />
            </div>
            <span className={`font-semibold tracking-wide text-[12px] lg:text-[14px] ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.name.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Tabs Card ────────────────────────────────────────────────────────────────

export const TabsCard: React.FC<{
  tabs: DocumentTab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
}> = ({ tabs, activeTabId, onTabClick }) => (
  <div className="bg-white shadow-sm rounded-[2rem] p-6 lg:p-10 shrink-0 w-full">
    <div className="flex flex-wrap gap-4">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isApproved = tab.status === 'approved';

        const bgClass = isActive ? 'bg-[#2A3125]' : isApproved ? 'bg-white' : 'bg-[#F9FAFB]';
        const textClass = isActive ? 'text-white' : 'text-gray-700';
        const borderClass = isActive 
          ? 'border-[#2A3125]' 
          : isApproved 
            ? 'border-[#8CB43A]' 
            : 'border-gray-100';

        return (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all ${bgClass} ${textClass} ${borderClass} hover:opacity-90 font-semibold text-[14px]`}
          >
            {tab.label}
            <div className="flex items-center justify-center">
              {isApproved ? <CheckIcon /> : <WarningIcon />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Comments Section ─────────────────────────────────────────────────────────

export const CommentsSection: React.FC<{ comment: string; className?: string }> = ({ comment, className }) => (
  <div className={`flex flex-col ${className || 'flex-1'}`}>
    <h3 className="text-[22px] font-bold text-gray-900 mb-6">Comments</h3>
    <div className="bg-[#EFF6FF] rounded-2xl p-6 text-[15px] leading-relaxed text-gray-700 min-h-[160px]">
      {comment}
    </div>
  </div>
);

// ─── Footer Actions (Reject + Approve) ───────────────────────────────────────

export const FooterActions: React.FC<{
  isApproved: boolean;
  onReject: () => void;
  onApprove: () => void;
}> = ({ isApproved, onReject, onApprove }) => (
  <div className="flex justify-end gap-5 mt-8 pt-6">
    <button 
      onClick={onReject}
      className="px-10 py-3.5 rounded-full border border-red-400 text-red-500 font-semibold text-[15px] hover:bg-red-50 transition-colors"
    >
      Reject
    </button>
    <button 
      onClick={onApprove}
      disabled={isApproved}
      className={`px-12 py-3.5 rounded-full font-semibold text-[15px] transition-colors ${
        isApproved 
        ? 'bg-gray-400 text-white cursor-not-allowed' 
        : 'bg-[#2A3125] text-white hover:bg-black cursor-pointer'
      }`}
    >
      {isApproved ? 'Approved ✓' : 'Approve'}
    </button>
  </div>
);
