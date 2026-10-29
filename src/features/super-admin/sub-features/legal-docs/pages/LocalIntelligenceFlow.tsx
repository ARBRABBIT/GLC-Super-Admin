import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  type DocumentTab,
  type DocumentStatus,
  FLOW_STEPS,
  MOCK_FILES,
  MOCK_COMMENT,
  FileRow,
  RejectModal,
  PageHeader,
  StepperSidebar,
  TabsCard,
  CommentsSection,
  FooterActions,
  DropdownField,
  RadioGroupField,
  InputTextField,
} from '@/features/super-admin/sub-features/legal-docs/components';
import { LOCAL_INTELLIGENCE_MOCK_DATA } from './mockData';

// ─── Local Intelligence Tabs (7 tabs) ─────────────────────────────────────────

const LOCAL_INTELLIGENCE_TABS: DocumentTab[] = [
  { id: 'any-issues', label: 'Any Issues', status: 'pending' },
  { id: 'local-liabilities', label: 'Local Liabilities', status: 'pending' },
  { id: 'any-pending-loans', label: 'Any Pending Loans', status: 'pending' },
  { id: 'owner-mindset', label: 'Owner Mindset', status: 'pending' },
  { id: 'source-person', label: 'Source Person', status: 'pending' },
  { id: 'agreements', label: 'Agreements', status: 'pending' },
  { id: 'previous-transactions', label: 'Previous Transactions', status: 'pending' },
];

// ─── Final Approve Modal ──────────────────────────────────────────────────────

const FinalApproveModal: React.FC<{
  onClose: () => void;
  onSubmit: (reason: string, rating: number) => void;
}> = ({ onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [rating, setRating] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-[500px] p-8 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-[24px] text-gray-900">Approve the land</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <span className="text-[14px] text-gray-600 mb-2 block">Provide the reason for approval:</span>
        <div className="relative mb-6">
          <textarea
            className="w-full h-[120px] bg-[#F5F5F5] border border-transparent rounded-2xl p-4 text-[14px] text-gray-800 resize-none outline-none focus:border-gray-300"
            placeholder="Start write here..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button className="absolute bottom-4 right-4 w-8 h-8 bg-[#3E4A35] rounded-full flex items-center justify-center text-white hover:opacity-90">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[13px] text-gray-500 mb-2 block">Attach audio file</span>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Attach
            </button>
          </div>
          <div>
            <span className="text-[13px] text-gray-500 mb-2 block">Rate this land</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="text-gray-400 hover:text-yellow-400 focus:outline-none"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => onSubmit(reason, rating)}
            className="bg-[#2A3125] text-white font-semibold text-[15px] px-8 py-2.5 rounded-full hover:bg-black transition-colors"
          >
            Submit
          </button>
        </div>        </div>
      </div>
    
  );
};

// ─── Final Success Modal ──────────────────────────────────────────────────────

const FinalSuccessModal: React.FC<{
  onDone: () => void;
  farmlandId: string;
}> = ({ onDone, farmlandId }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-[500px] py-10 px-8 flex flex-col items-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] relative">
        <h2 className="font-bold text-[24px] mb-8 text-gray-900">Local Intelligence</h2>
        
        <div className="mb-8">
          {/* Custom large star badge SVG from Modals, copied structure */}
          <div style={{ width: 140, height: 140, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="absolute inset-0 bg-[#F3F4F6] rounded-[25%] rotate-0" />
            <div className="absolute inset-0 bg-[#F3F4F6] rounded-[25%] rotate-30" />
            <div className="absolute inset-0 bg-[#F3F4F6] rounded-[25%] rotate-60" />
            <div className="absolute w-[109px] h-[109px] bg-[#A3C33D] rounded-[25%] rotate-15" />
            <div className="absolute w-[109px] h-[109px] bg-[#A3C33D] rounded-[25%] rotate-45" />
            <div className="absolute w-[109px] h-[109px] bg-[#A3C33D] rounded-[25%] rotate-75" />
            <div className="relative z-10">
              <svg width="63" height="63" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>

        <p className="text-center font-medium text-[17px] text-gray-800 leading-[1.6] mb-10 max-w-[360px]">
          Farmland ID: <span className="text-[#1D7ABE] font-bold">{farmlandId}</span> Verified all documents
        </p>

        <button 
          onClick={onDone}
          className="bg-[#2A3125] text-white font-semibold text-[17px] px-[50px] py-[14px] rounded-full hover:bg-black transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const LocalIntelligenceFlow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const farmlandId = id ?? 'GLCSOS 01';

  // State
  const [tabs, setTabs] = useState<DocumentTab[]>(
    LOCAL_INTELLIGENCE_TABS.map((t) => ({ ...t }))
  );
  const [activeTabId, setActiveTabId] = useState(LOCAL_INTELLIGENCE_TABS[0].id);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFinalApproveModal, setShowFinalApproveModal] = useState(false);
  const [showFinalSuccessModal, setShowFinalSuccessModal] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTabId);

  const handleApprove = () => {
    const updatedTabs = tabs.map((t) =>
      t.id === activeTabId ? { ...t, status: 'approved' as DocumentStatus } : t
    );
    setTabs(updatedTabs);

    const nextPending = updatedTabs.find((t) => t.status === 'pending');
    if (nextPending) {
      setActiveTabId(nextPending.id);
    } else {
      const allApproved = updatedTabs.every((t) => t.status === 'approved');
      if (allApproved) {
        setShowFinalApproveModal(true);
      }
    }
  };

  const handleRejectConfirm = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, status: 'rejected' as DocumentStatus } : t))
    );
    setShowRejectModal(false);
  };

  const handleFinalSubmit = () => {
    setShowFinalApproveModal(false);
    setShowFinalSuccessModal(true);
  };

  const handleFinalDone = () => {
    setShowFinalSuccessModal(false);
    navigate(`/super-admin/assigned-farmlands`);
  };

  const navigateToStep = (stepPath: string, stepId: string) => {
    if (stepId === 'dashboard') {
      navigate('/super-admin/assigned-farmlands');
    } else if (stepId === 'customer-information') {
      navigate(`/super-admin/assigned-farmlands/${farmlandId}/customer-information`);
    } else {
      navigate(`/super-admin/Documents/${stepPath}/${farmlandId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 lg:p-8 flex flex-col gap-6 font-sans box-border">
      
      {/* ── Modals ── */}
      {showFinalApproveModal && (
        <FinalApproveModal
          onClose={() => setShowFinalApproveModal(false)}
          onSubmit={handleFinalSubmit}
        />
      )}
      {showFinalSuccessModal && (
        <FinalSuccessModal
          onDone={handleFinalDone}
          farmlandId={farmlandId}
        />
      )}
      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectConfirm}
        />
      )}

      
        <PageHeader />

        <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <StepperSidebar
          farmlandId={farmlandId}
          currentStepId="local-intelligence"
          steps={FLOW_STEPS}
          onNavigate={navigateToStep}
        />

        {/* ── RIGHT CONTENT (Responsive Flex) ── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <TabsCard tabs={tabs} activeTabId={activeTabId} onTabClick={setActiveTabId} />

          <div className="bg-white shadow-sm rounded-[2rem] p-6 lg:p-10 flex flex-col flex-1">
            <div className="flex flex-col xl:flex-row gap-8 xl:gap-10 flex-1 pr-2">
              
              {/* Left Section - Conditional based on active tab */}
              <div className="flex-1 flex flex-col min-w-0">
                {activeTabId === 'any-issues' ? (
                  <RadioGroupField 
                    label="Any issues with Boundaries & Owners?" 
                    options={[
                      { label: 'Available', selected: false },
                      { label: 'Not Available', selected: true },
                    ]} 
                  />

                ) : activeTabId === 'local-liabilities' ? (
                  <RadioGroupField 
                    label="Any local Liabilities?" 
                    options={[
                      { label: 'Available', selected: true },
                      { label: 'Not Available', selected: false },
                    ]} 
                  />

                ) : activeTabId === 'any-pending-loans' ? (
                  <>
                    <RadioGroupField 
                      label="Any Bank Loans or Pending Loans on the Land?" 
                      options={[
                        { label: 'Available', selected: true },
                        { label: 'Not Available', selected: false },
                      ]} 
                    />
                    <InputTextField label="Please Enter Loan Amount" value={LOCAL_INTELLIGENCE_MOCK_DATA.pendingLoanAmount} />
                  </>

                ) : activeTabId === 'owner-mindset' ? (
                  <DropdownField label="Owner Mindset" value={LOCAL_INTELLIGENCE_MOCK_DATA.ownerMindset} />

                ) : activeTabId === 'source-person' ? (
                  <>
                    <DropdownField label="Source Person" value={LOCAL_INTELLIGENCE_MOCK_DATA.sourcePerson.type} />
                    <h3 className="text-[22px] font-bold text-gray-900 mt-2 mb-6">Contact Details</h3>
                    <InputTextField label="Name" value={LOCAL_INTELLIGENCE_MOCK_DATA.sourcePerson.contactName} />
                    <DropdownField label="Mobile" value={LOCAL_INTELLIGENCE_MOCK_DATA.sourcePerson.contactMobile} />
                  </>

                ) : activeTabId === 'agreements' ? (
                  <>
                    <RadioGroupField 
                      label="Any paper agreement on this land?" 
                      options={[
                        { label: 'Available', selected: true },
                        { label: 'Not Available', selected: false },
                      ]} 
                    />
                    <RadioGroupField 
                      label="Agreement type" 
                      options={[
                        { label: 'Legal', selected: false },
                        { label: 'Verbal', selected: true },
                      ]} 
                    />
                    <InputTextField label="Last Price of the land when made agreement?" value={LOCAL_INTELLIGENCE_MOCK_DATA.agreementsLastPrice} />
                  </>

                ) : activeTabId === 'previous-transactions' ? (
                  <>
                    <RadioGroupField 
                      label="Any Previous Transactions on the land?" 
                      options={[
                        { label: 'Available', selected: true },
                        { label: 'Not Available', selected: false },
                      ]} 
                    />
                    <InputTextField label="Last Price of the land when made agreement?" value={LOCAL_INTELLIGENCE_MOCK_DATA.previousTransactionsLastPrice} />
                  </>

                ) : (
                  <>
                    <h3 className="text-[22px] font-bold text-gray-900 mb-6">Upload Files</h3>
                    <div className="flex flex-col gap-4">
                      {MOCK_FILES.map((file) => (
                        <FileRow key={file.id} file={file} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <CommentsSection comment={MOCK_COMMENT} className="flex-1 min-w-0" />
              
            </div>

            <FooterActions
              isApproved={currentTab?.status === 'approved'}
              onReject={() => setShowRejectModal(true)}
              onApprove={handleApprove}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LocalIntelligenceFlow;
