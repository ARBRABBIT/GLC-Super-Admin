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
  RadioGroupField,
  InputTextField,
} from '@/features/super-admin/sub-features/legal-docs/components';
import { LAND_BOUNDARIES_MOCK_DATA } from './mockData';

// ─── Land & Boundaries Tabs (10 tabs) ─────────────────────────────────────────

const LAND_BOUNDARIES_TABS: DocumentTab[] = [
  { id: 'land-images', label: 'Land Images', status: 'pending' },
  { id: 'landscape-view', label: 'Landscape View of Farmlands', status: 'pending' },
  { id: 'shape-of-land', label: 'Shape of the Land', status: 'pending' },
  { id: 'water-electricity', label: 'Water and Electricity Facility', status: 'pending' },
  { id: 'master-plan', label: 'Master Plan', status: 'pending' },
  { id: 'survey-report', label: 'Survey Report', status: 'pending' },
  { id: 'east-boundaries', label: 'East Boundaries', status: 'pending' },
  { id: 'west-boundaries', label: 'West Boundaries', status: 'pending' },
  { id: 'north-boundaries', label: 'North Boundaries', status: 'pending' },
  { id: 'south-boundaries', label: 'South Boundaries', status: 'pending' },
];

const MOCK_COVER_IMAGE = { id: 'cover-1', name: 'Cover image.pdf', size: '8MB' };
const MOCK_UPLOADED_IMAGES = [
  { id: '1', name: 'File_name_1.pdf', size: '8MB' },
  { id: '2', name: 'File_name_1.pdf', size: '8MB' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const LandBoundariesFlow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const farmlandId = id ?? 'GLCSOS 01';

  // State
  const [tabs, setTabs] = useState<DocumentTab[]>(
    LAND_BOUNDARIES_TABS.map((t) => ({ ...t }))
  );
  const [activeTabId, setActiveTabId] = useState(LAND_BOUNDARIES_TABS[0].id);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);

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
        setShowProceedModal(true);
      }
    }
  };

  const handleRejectConfirm = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, status: 'rejected' as DocumentStatus } : t))
    );
    setShowRejectModal(false);
  };

  const handleProceedNext = () => {
    setShowProceedModal(false);
    navigate(`/super-admin/Documents/valuation/${farmlandId}`);
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
          currentStepName="Land & Boundaries"
          nextStepName="Valuation"
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
          currentStepId="land-boundaries"
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
                {activeTabId === 'shape-of-land' ? (
                  <DropdownField label="Shape of the Land" value={LAND_BOUNDARIES_MOCK_DATA.shapeOfLand} />
                ) : activeTabId === 'water-electricity' ? (
                  <>
                    <RadioGroupField 
                      label="Select availability Facility" 
                      options={[
                        { label: 'Water Facility', selected: false },
                        { label: 'Electricity Facility', selected: false },
                        { label: 'Both', selected: true },
                      ]} 
                    />
                    <RadioGroupField 
                      label="Select Water Facility" 
                      options={[
                        { label: 'Bore', selected: true },
                        { label: 'Muncipal', selected: false },
                      ]} 
                    />
                    <RadioGroupField 
                      label="Select Electricity Facility" 
                      options={[
                        { label: '2 Phase', selected: false },
                        { label: '3 Phase', selected: true },
                      ]} 
                    />
                  </>
                ) : activeTabId === 'master-plan' || activeTabId === 'landscape-view' ? (
                  <>
                    <h3 className="text-[22px] font-bold text-gray-900 mb-6">Upload Files</h3>
                    <div className="flex flex-col gap-4">
                      {MOCK_FILES.map((file) => (
                        <FileRow key={file.id} file={file} />
                      ))}
                    </div>
                  </>

                ) : activeTabId === 'survey-report' ? (
                  <>
                    <RadioGroupField 
                      label="Select Survey Report Type" 
                      options={[
                        { label: 'Private Survey Report', selected: false },
                        { label: 'Government Survey Report', selected: false },
                        { label: 'Both Survey Reports', selected: true },
                      ]} 
                    />
                    
                    <h3 className="text-[18px] font-bold text-gray-900 mb-4">Private Survey Report</h3>
                    <span className="text-[14px] font-medium text-gray-800 mb-3 block">Uploaded Files</span>
                    <div className="flex flex-col gap-3 mb-8">
                      {MOCK_FILES.map((file) => (
                        <FileRow key={file.id} file={file} />
                      ))}
                    </div>

                    <h3 className="text-[18px] font-bold text-gray-900 mb-4">Government Survey Report</h3>
                    <span className="text-[14px] font-medium text-gray-800 mb-3 block">Uploaded Files</span>
                    <div className="flex flex-col gap-3">
                      {MOCK_FILES.map((file) => (
                        <FileRow key={`gov-${file.id}`} file={file} />
                      ))}
                    </div>
                  </>

                ) : activeTabId === 'east-boundaries' ? (
                  <>
                    <DropdownField label="East Boundaries" value={LAND_BOUNDARIES_MOCK_DATA.eastBoundaries.type} />
                    <h3 className="text-[20px] font-bold text-gray-900 mt-2 mb-6">Land Owner Details</h3>
                    <InputTextField label="Name" value={LAND_BOUNDARIES_MOCK_DATA.eastBoundaries.ownerName} />
                    <InputTextField label="Age" value={LAND_BOUNDARIES_MOCK_DATA.eastBoundaries.ownerAge} />
                  </>

                ) : activeTabId === 'west-boundaries' ? (
                  <>
                    <DropdownField label="West Boundaries" value={LAND_BOUNDARIES_MOCK_DATA.westBoundaries.type} />
                    <RadioGroupField 
                      label="Type of Road" 
                      options={[
                        { label: 'Private Road', selected: false },
                        { label: 'Governement Road', selected: true },
                      ]} 
                    />
                    <InputTextField label="Width of the Road" value={LAND_BOUNDARIES_MOCK_DATA.westBoundaries.roadWidth} />
                  </>

                ) : activeTabId === 'north-boundaries' ? (
                  <>
                    <DropdownField label="North Boundaries" value={LAND_BOUNDARIES_MOCK_DATA.northBoundaries.type} />
                    <InputTextField label="Trees Count" value={LAND_BOUNDARIES_MOCK_DATA.northBoundaries.treesCount} />
                  </>

                ) : activeTabId === 'south-boundaries' ? (
                  <>
                    <DropdownField label="South Boundaries" value={LAND_BOUNDARIES_MOCK_DATA.southBoundaries.type} />
                  </>

                ) : (
                  <>
                    <h3 className="text-[22px] font-bold text-gray-900 mb-5">Uploaded Files</h3>
                    
                    {/* Cover Image Sub-section */}
                    <span className="text-[13px] font-medium text-gray-500 mb-2 block">Cover image</span>
                    <FileRow file={MOCK_COVER_IMAGE} />

                    {/* Uploaded Images Sub-section */}
                    <span className="text-[13px] font-medium text-gray-500 mt-4 mb-2 block">Uploaded images</span>
                    <div className="flex flex-col gap-3">
                      {MOCK_UPLOADED_IMAGES.map((file) => (
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

export default LandBoundariesFlow;
