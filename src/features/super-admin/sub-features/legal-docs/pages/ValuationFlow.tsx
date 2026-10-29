import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  type DocumentTab,
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
import { VALUATION_MOCK_DATA } from './mockData';

// ─── Valuation Tabs ───────────────────────────────────────────────────────────

const VALUATION_TABS: DocumentTab[] = [
  { id: 'village-map-naksha', label: 'Village Map or Naksha', status: 'pending' },
  { id: 'sub-register-value', label: 'Sub - Register Value', status: 'pending' },
  { id: 'valuator-report', label: 'Valuator Report', status: 'pending' },
  { id: 'legal-opinion-report', label: 'Legal Opinion Report', status: 'pending' },
  { id: 'road-approach', label: 'Road Approach', status: 'pending' },
  { id: 'water-facility', label: 'Water Facility', status: 'pending' },
  { id: 'electricity-facility', label: 'Electricity Facility', status: 'pending' },
  { id: 'recent-transactions', label: 'Recent Transactions', status: 'pending' },
  { id: 'any-existing-trees', label: 'Any Existing Trees', status: 'pending' },
  { id: 'geological-advantages', label: 'Geological Advantages', status: 'pending' },
  { id: 'future-plans', label: 'Future Plans', status: 'pending' },
  { id: 'validating-disadvantages', label: 'Validating Disadvantages', status: 'pending' },
  { id: 'upcoming-infrastructures', label: 'Upcoming Infrastrucutres', status: 'pending' },
  { id: 'railway-track-connectivity', label: 'Railway Track Connectivity', status: 'pending' },
  { id: 'airport-connectivity', label: 'Airport Connectivity', status: 'pending' },
];

const ValuationFlow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();  const farmlandId = id || 'GLCSOS 01';

  const [tabs, setTabs] = useState<DocumentTab[]>(VALUATION_TABS.map((t) => ({ ...t })));
  const [activeTabId, setActiveTabId] = useState(VALUATION_TABS[0].id);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTabId);

  const handleApprove = () => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, status: 'approved' } : tab
      )
    );
    
    const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
    if (currentIndex < tabs.length - 1) {
      setActiveTabId(tabs[currentIndex + 1].id);
    } else {
      setShowProceedModal(true);
    }
  };

  const handleRejectConfirm = () => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, status: 'rejected' } : tab
      )
    );
    setShowRejectModal(false);
  };

  const handleProceedNext = () => {
    setShowProceedModal(false);
    navigate(`/super-admin/Documents/local-intelligence/${farmlandId}`);
  };

  const navigateToStep = (stepPath: string) => {
    navigate(`/super-admin/Documents/${stepPath}/${farmlandId}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 lg:p-8 flex flex-col gap-6 font-sans box-border">
      
      {showProceedModal && (
        <ProceedModal
          
          onProceed={handleProceedNext}
          currentStepName="Valuation"
          nextStepName="Local Intelligence"
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
            currentStepId="valuation"
            steps={FLOW_STEPS}
            onNavigate={navigateToStep}
          />

          {/* ── RIGHT CONTENT (Responsive Flex) ── */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <TabsCard tabs={tabs} activeTabId={activeTabId} onTabClick={setActiveTabId} />

          <div className="bg-white shadow-sm rounded-[2rem] p-6 lg:p-10 flex flex-col flex-1">
            <div className="flex flex-col xl:flex-row gap-8 xl:gap-10 flex-1 pr-2">
              {activeTabId === 'future-plans' || activeTabId === 'validating-disadvantages' ? (
                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="text-[22px] font-bold text-gray-900 mb-6">
                    {activeTabId === 'future-plans' ? 'Future Plans of Geographical Advantages' : 'Validating Disadvantages'}
                  </h3>
                  <div className="bg-[#EFF6FF] border border-[#BDE0FE] rounded-2xl p-6 text-[15px] leading-relaxed text-gray-700 min-h-[160px]">
                    {activeTabId === 'future-plans' ? VALUATION_MOCK_DATA.futurePlans : VALUATION_MOCK_DATA.validatingDisadvantages}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 flex flex-col min-w-0">
                    {activeTabId === 'road-approach' ? (
                      <>
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Type of Road Approach</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Private Road', selected: false },
                            { label: 'Governement Road', selected: true }
                          ]}
                        />
                        <div className="mt-8">
                          <InputTextField label="Width of the Road (in Feet)" value={VALUATION_MOCK_DATA.roadApproachWidth} />
                        </div>
                      </>
                    ) : activeTabId === 'water-facility' ? (
                      <>
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Water Facility</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Available', selected: true },
                            { label: 'Not Available', selected: false }
                          ]}
                        />
                        <div className="mt-8">
                          <DropdownField label="Primary Source of Water" value={VALUATION_MOCK_DATA.waterFacility.primarySource} />
                        </div>
                        <div className="mt-8">
                          <InputTextField label="Depth of the Bore(in feet)" value={VALUATION_MOCK_DATA.waterFacility.boreDepth} />
                        </div>
                      </>
                    ) : activeTabId === 'electricity-facility' ? (
                      <>
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Electricity Facility</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Available', selected: true },
                            { label: 'Not Available', selected: false }
                          ]}
                        />
                      </>
                    ) : activeTabId === 'recent-transactions' ? (
                      <>
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Recent Transactions</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Available', selected: true },
                            { label: 'Not Available', selected: false }
                          ]}
                        />
                        <div className="mt-8">
                          <InputTextField label="Valuation Per Acre" value={VALUATION_MOCK_DATA.recentTransactions.valuationPerAcre} />
                        </div>
                        <div className="mt-8">
                          <InputTextField label="Local Market Per Acre Price" value={VALUATION_MOCK_DATA.recentTransactions.localMarketPrice} />
                        </div>
                      </>
                    ) : activeTabId === 'any-existing-trees' ? (
                      <>
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Any Existing Tress available in the surrounding area?</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Available', selected: true },
                            { label: 'Not Available', selected: false }
                          ]}
                        />
                        <div className="mt-8">
                          <DropdownField label="Tress count" value={VALUATION_MOCK_DATA.existingTreesCount} />
                        </div>
                      </>
                    ) : activeTabId === 'geological-advantages' ? (
                      <>
                        <h3 className="text-[22px] font-bold text-gray-900 mb-6">Any Surrounding Mines & Geological Advantages?</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Available', selected: true },
                            { label: 'Not Available', selected: false }
                          ]}
                        />
                      </>
                    ) : activeTabId === 'upcoming-infrastructures' ? (
                      <>
                        <DropdownField label="Upcoming Infrastructures" value={VALUATION_MOCK_DATA.upcomingInfrastructure} />
                      </>
                    ) : activeTabId === 'railway-track-connectivity' ? (
                      <>
                        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Railway Track Connectivity?</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Available', selected: VALUATION_MOCK_DATA.railwayConnectivity.available },
                            { label: 'Not Available', selected: !VALUATION_MOCK_DATA.railwayConnectivity.available }
                          ]}
                        />
                        <div className="mt-8">
                          <DropdownField label="Select Distance" value={VALUATION_MOCK_DATA.railwayConnectivity.distance} />
                        </div>
                      </>
                    ) : activeTabId === 'airport-connectivity' ? (
                      <>
                        <h3 className="text-[16px] font-bold text-gray-900 mb-4">Airport Connectivity?</h3>
                        <RadioGroupField 
                          label=""
                          options={[
                            { label: 'Available', selected: VALUATION_MOCK_DATA.airportConnectivity.available },
                            { label: 'Not Available', selected: !VALUATION_MOCK_DATA.airportConnectivity.available }
                          ]}
                        />
                        <div className="mt-8">
                          <DropdownField label="Select Distance" value={VALUATION_MOCK_DATA.airportConnectivity.distance} />
                        </div>
                      </>
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
                </>
              )}
              
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

export default ValuationFlow;
