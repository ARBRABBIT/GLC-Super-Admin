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
  ProceedModal,
  PageHeader,
  StepperSidebar,
  TabsCard,
  CommentsSection,
  FooterActions,
  DropdownField,
  TextField,
  MultiTagField,
  DualTextField,
} from '@/features/super-admin/sub-features/legal-docs/components';
import { AGRICULTURE_MOCK_DATA } from './mockData';

// ─── Agriculture Report Tabs ────────────────────────────────────────

const AGRICULTURE_TABS: DocumentTab[] = [
  { id: 'local-agriculture-officer-report', label: 'Local Agriculture Officer Report', status: 'pending' },
  { id: 'last-5-years-crop-yielding', label: 'Last 5 years Crop Yielding Report', status: 'pending' },
  { id: 'soil-certificate', label: 'Soil Certificate', status: 'pending' },
  { id: 'water-certificate', label: 'Water Certificate', status: 'pending' },
  { id: 'soil', label: 'Soil', status: 'pending' },
  { id: 'type-of-crop', label: 'Type of Crop', status: 'pending' },
  { id: 'ground-water-level', label: 'Ground Water Level', status: 'pending' },
  { id: 'types-of-crop-can-be-grown', label: 'Types of Crop can be grown', status: 'pending' },
  { id: 'current-yield-cost', label: 'Current Yield Cost', status: 'pending' },
  { id: 'current-cultivation', label: 'Current Cultivation', status: 'pending' },
  { id: 'future-crops', label: 'Future Crops', status: 'pending' },
  { id: 'farmer-agriculture-certificate', label: 'Farmer Agriculture Certificate', status: 'pending' },
  { id: 'mro-reports', label: 'MRO Reports', status: 'pending' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const AgricultureReportFlow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const farmlandId = id ?? 'GLCSOS 01';

  const [tabs, setTabs] = useState<DocumentTab[]>(AGRICULTURE_TABS.map(t => ({ ...t })));
  const [activeTabId, setActiveTabId] = useState(AGRICULTURE_TABS[0].id);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTabId);

  const handleApprove = () => {
    const updatedTabs = tabs.map((t) => t.id === activeTabId ? { ...t, status: 'approved' as DocumentStatus } : t);
    setTabs(updatedTabs);
    
    const nextPending = updatedTabs.find((t) => t.status === 'pending');
    if (nextPending) {
      setActiveTabId(nextPending.id);
    } else {
      const allApproved = updatedTabs.every((t) => t.status === 'approved');
      if (allApproved) {
        setShowProceedModal(true);
      }
    }
  };

  const handleRejectConfirm = (reason: string) => {
    console.log("Document rejected with reason:", reason);
    setTabs((prev) =>
      prev.map((t) => t.id === activeTabId ? { ...t, status: 'rejected' as DocumentStatus } : t)
    );
    setShowRejectModal(false);
  };

  const handleProceedNext = () => {
    setShowProceedModal(false);
    navigate(`/super-admin/Documents/land-boundaries/${farmlandId}`);
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
      {showProceedModal && (
        <ProceedModal
          
          onProceed={handleProceedNext}
          currentStepName="Agriculture Report"
          nextStepName="Land & Boundaries"
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
          currentStepId="agriculture-report"
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
                {activeTabId === 'soil' ? (
                  <DropdownField label="Soil Type" value={AGRICULTURE_MOCK_DATA.soilType} />

                ) : activeTabId === 'type-of-crop' ? (
                  <DropdownField label="Types of crops available present?" value={AGRICULTURE_MOCK_DATA.typesOfCropsPresent} />

                ) : activeTabId === 'ground-water-level' ? (
                  <TextField label="Depth of the Ground Water level" value={AGRICULTURE_MOCK_DATA.groundWaterLevel} />

                ) : activeTabId === 'types-of-crop-can-be-grown' ? (
                  <MultiTagField label="Types of crops can be grown in future?" tags={AGRICULTURE_MOCK_DATA.futureCropsCanBeGrown} />

                ) : activeTabId === 'current-yield-cost' ? (
                  <DualTextField 
                    label1="What is the current yielding cost?" value1={AGRICULTURE_MOCK_DATA.currentYieldCost} 
                    label2="Current returns from yield?" value2={AGRICULTURE_MOCK_DATA.currentReturnsFromYield} 
                  />

                ) : activeTabId === 'current-cultivation' ? (
                  <DropdownField label="What is the current cultivation?" value={AGRICULTURE_MOCK_DATA.currentCultivation} />

                ) : activeTabId === 'future-crops' ? (
                  <MultiTagField label="What are the future crops planned?" tags={AGRICULTURE_MOCK_DATA.futureCropsPlanned} />

                ) : (
                  <>
                    <h3 className="text-[22px] font-bold text-gray-900 mb-6">Uploaded Files</h3>
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
        </div>        </div>

      </div>
    
  );
};

export default AgricultureReportFlow;
