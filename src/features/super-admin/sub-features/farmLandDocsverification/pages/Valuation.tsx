import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';
import { useVerificationFlow } from '../hooks/useVerificationFlow';
import { useGetValuationStatusQuery } from '../../../api/farmland.api';
import { TabsCard, CommentsSection, FooterActions } from '../components/SharedUI';
import { useApproveFarmlandTabMutation, useRevertFarmlandTabMutation } from '@/features/super-admin/api/farmlandAction.api';
import { useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/store/authSlice';
import { FileRow } from '../components/Icons';
import { useFileDownload } from '@/features/super-admin/utils/useFileDownload';
import { DropdownField, TextField, RadioGroupField } from '../components/FormFields';
import { RejectModal } from '../components/Modals';

const VALUATION_TABS: DocumentTab[] = [
  { id: "village-map-or-naksha", label: "Village Map or Naksha", status: 'pending', code: 'VMNAP' },
  { id: "sub-register-value", label: "Sub - Register Value", status: 'pending', code: 'SUBRV' },
  { id: "valuator-report", label: "Valuator Report", status: 'pending', code: 'VALRP' },
  { id: "legal-opinion-report", label: "Legal Opinion Report", status: 'pending', code: 'LEGOP' },
  { id: "road-approach", label: "Road Approach", status: 'pending', code: 'RDAPR' },
  { id: "recent-transactions", label: "Recent Transactions", status: 'pending', code: 'RCTRN' },
  { id: "geological-advantages", label: "Geological Advantages", status: 'pending', code: 'GEOAD' },
  { id: "future-plans", label: "Future Plans", status: 'pending', code: 'FPLAN' },
  { id: "validating-disadvantages", label: "Validating Disadvantages", status: 'pending', code: 'VALDS' },
  { id: "upcoming-infrastructures", label: "Upcoming Infrastrucutres", status: 'pending', code: 'UPINF' },
  { id: "railway-track-connectivity", label: "Railway Track Connectivity", status: 'pending', code: 'HWCON' },
  { id: "airport-connectivity", label: "Airport Connectivity", status: 'pending', code: 'AIRPT' },
];

const getDocTypeDesc = (tabId: string) => {
  const map: Record<string, string> = {
    "village-map-or-naksha": "village_map_or_naksha",
    "sub-register-value": "sub_registrar_value",
    "valuator-report": "valuator_report",
    "legal-opinion-report": "legal_opinion_report",
    "road-approach": "road_approach",
    "recent-transactions": "recent_transaction",
    "geological-advantages": "geological_advantages",
    "future-plans": "future_plan",
    "validating-disadvantages": "validating_disadvantages",
    "upcoming-infrastructures": "upcoming_infrastructure",
    "railway-track-connectivity": "railway_truck_connectivity",
    "airport-connectivity": "airport_connectivity",
  };
  return map[tabId] || tabId.replace(/-/g, "_");
};

const getDocTypeCode = (tabId: string) => {
  const map: Record<string, string> = {
    "village-map-or-naksha": "VMNAP",
    "sub-register-value": "SUBRV",
    "valuator-report": "VALRP",
    "legal-opinion-report": "LEGOP",
    "road-approach": "RDAPR",
    "recent-transactions": "RCTRN",
    "geological-advantages": "GEOAD",
    "future-plans": "FPLAN",
    "validating-disadvantages": "VALDS",
    "upcoming-infrastructures": "UPINF",
    "railway-track-connectivity": "HWCON",
    "airport-connectivity": "AIRPT",
  };
  return map[tabId] || tabId;
};

const getDistanceLabel = (id?: number | string, masterData?: any) => {
  if (id === undefined || id === null || id === "") return "N/A";
  if (typeof id === "string" && isNaN(Number(id))) return id;
  const numId = Number(id);

  if (masterData?.distancesResult && Array.isArray(masterData.distancesResult)) {
    const found = masterData.distancesResult.find(
      (item: any) => item.id === numId || Number(item.id) === numId
    );
    if (found?.description) return found.description;
  }

  return "N/A";
};

const getInfrastructureLabel = (id?: number | string, masterData?: any) => {
  if (id === undefined || id === null || id === "") return "N/A";
  if (typeof id === "string" && isNaN(Number(id))) return id;
  const numId = Number(id);

  if (masterData?.infrastructuresResult && Array.isArray(masterData.infrastructuresResult)) {
    const found = masterData.infrastructuresResult.find(
      (item: any) => item.id === numId || Number(item.id) === numId
    );
    if (found?.description) return found.description;
  }

  return "N/A";
};

export const Valuation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const farmlandId = id ?? '';
  const { downloadFile, isDownloading } = useFileDownload();

  // Assuming farmlandId should be numeric for the API. Using 1 as a fallback if the ID string isn't numeric.
  const numericId = parseInt(farmlandId, 10);
  const apiFarmlandId = isNaN(numericId) ? farmlandId : numericId;

  const { data: valuationData, error, refetch } = useGetValuationStatusQuery(
    { farmlandId: apiFarmlandId },
    { skip: !id }
  );
  
  const [approveTab] = useApproveFarmlandTabMutation();
  const [revertTab] = useRevertFarmlandTabMutation();
  const { data: masterData } = useGetAllMasterDataQuery();
  const user = useSelector(selectCurrentUser);

  const handleApproveTab = async (tabId: string) => {
    const desc = getDocTypeDesc(tabId);
    const doc = valuationData?.data ? Object.values(valuationData.data).find((d: any) => d.description === desc) as any : null;
    const version = doc?.versions?.[0];
    const uploadId = version?.farmland_upload_id || 0;
    
    console.log("Approve Tab", { tabId, desc, doc, version });

    try {
      await approveTab({ farmland_upload_id: uploadId }).unwrap();
      await refetch();
      return true;
    } catch (err) {
      console.error("Approve failed", err);
      return false;
    }
  };

  const handleRejectTab = async (tabId: string, reason: string) => {
    const desc = getDocTypeDesc(tabId);
    const code = getDocTypeCode(tabId);
    const doc = valuationData?.data ? Object.values(valuationData.data).find((d: any) => d.description === desc) as any : null;
    const version = doc?.versions?.[0];
    const statusResult = masterData?.farmlandUploadResult?.find((r: any) => r.code === code);
    const uploadId = version?.farmland_upload_id || 0;
    
    console.log("Reject Tab", { tabId, desc, code, doc, version, statusResult });

    if (statusResult) {
      try {
        const revertStatusRecord = masterData?.revertStatus?.find((r: any) => r.code === "OPEN") || masterData?.revertStatusResult?.find((r: any) => r.code === "OPEN");
        await revertTab({
          farmland_upload_id: uploadId,
          revert_reason: reason,
          version: version?.version || 1,
          master_revert_status_id: revertStatusRecord?.id || 1,
          userId: user?.id || 1
        }).unwrap();
        await refetch();
        return true;
      } catch (err) {
        console.error("Reject failed", err);
        return false;
      }
    } else {
      console.warn("Cannot reject: missing statusResult", { version, statusResult });
    }
    return true;
  };

  useEffect(() => {
    if (valuationData) {
      console.log('Valuation API Response:', valuationData);
    }
    if (error) {
      console.error('Error fetching valuation:', error);
    }
  }, [valuationData, error]);

  const mappedTabs = React.useMemo(() => {
    if (!valuationData?.data) {
      return VALUATION_TABS;
    }
    
    // Build map keyed by item.code (directly from API response)
    const backendCodeMap = new Map<string, { uploaded: boolean; isApproved: boolean; isRejected: boolean; revertReason: string | null }>();
    Object.values(valuationData.data).forEach((item: any) => {
      const isApp = Number(item.is_super_admin_approved) === 1;
      const isRej = !isApp && !!item.revert_reason;
      if (item.code) {
        backendCodeMap.set(item.code, { uploaded: item.uploaded, isApproved: isApp, isRejected: isRej, revertReason: item.revert_reason ?? null });
      }
    });

    return VALUATION_TABS.map(tab => {
      // Lookup by code first; fall back to description-based lookup for compatibility
      const data = (tab.code && backendCodeMap.get(tab.code)) || (() => {
        const desc = getDocTypeDesc(tab.id);
        const doc = Object.values(valuationData.data).find((d: any) => d.description === desc) as any;
        if (!doc) return undefined;
        const isApp = Number(doc.is_super_admin_approved) === 1;
        const isRej = !isApp && !!doc.revert_reason;
        return { uploaded: doc.uploaded, isApproved: isApp, isRejected: isRej, revertReason: doc.revert_reason ?? null };
      })();

      return {
        ...tab,
        isUploaded: data ? data.uploaded : false,
        status: data?.isRejected ? 'rejected' : (data?.isApproved ? 'approved' : 'pending'),
        revertReason: data?.revertReason
      };
    });
  }, [valuationData]);  const {
    tabs,
    activeTabId,
    setActiveTabId,
    currentTab,
    showRejectModal,
    setShowRejectModal,
    handleApprove,
    handleRejectConfirm,
    isSubmitting,
  } = useVerificationFlow(mappedTabs, farmlandId, 'local-intelligence', {
    onApproveTab: handleApproveTab,
    onRejectTab: handleRejectTab
  });

  const currentDesc = getDocTypeDesc(activeTabId);
  const currentDoc = valuationData?.data ? Object.values(valuationData.data).find((d: any) => d.description === currentDesc) as any : null;
  const currentVersion = currentDoc?.versions?.[0];
  const files = currentVersion?.files || [];
  const remarks = currentVersion?.remarks || "";

  const mappedFiles = files.map((f: any) => ({
    id: f.id.toString(),
    name: f.document_url?.split('/').pop() || f.document_url,
    url: f.document_url,
    size: "-",
    progress: 100,
    status: "completed",
  }));

  return (
    <>
      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectConfirm}
        />
      )}

      {tabs.length > 0 && (
        <>
          <TabsCard tabs={tabs} activeTabId={activeTabId} onTabClick={setActiveTabId} />

          <div className="bg-white rounded-[24px] shadow-[0px_20px_40px_rgba(0,49,50,0.06)] flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
            {/* ── Header ── */}
            <div className="px-6 py-6 shrink-0 border-b border-gray-100">
              <h2 className="text-black font-sans font-bold text-base md:text-lg m-0 leading-tight">
                {currentTab?.label || activeTabId}
              </h2>
              <p className="text-[#8C9088] font-sans text-xs md:text-sm m-0 mt-1">
                Review details and supporting documents for {currentTab?.label || activeTabId}.
              </p>
            </div>
            <div className="flex flex-col flex-1 h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                <div className="flex flex-col min-w-0 gap-6">
                {activeTabId === 'road-approach' ? (
                  <div className="flex flex-col gap-6">
                    <RadioGroupField 
                      label="Type of Road Approach" 
                      options={[
                        { label: 'Private Road', selected: currentVersion?.is_private === 1 }, 
                        { label: 'Governement Road', selected: currentVersion?.is_governament === 1 }
                      ]} 
                    />
                    <TextField label="Width of the Road (in Feet)" value={currentVersion?.road_width?.toString() || "N/A"} />
                  </div>
                ) : activeTabId === 'recent-transactions' ? (
                  <>
                    <RadioGroupField 
                      label="Available" 
                      options={[{ label: 'Yes', selected: currentVersion?.is_transactions_available === 1 }, { label: 'No', selected: currentVersion?.is_transactions_available === 0 }]} 
                    />
                    <TextField label="Valuation Per Acre" value={currentVersion?.valuation_per_acre?.toString() || "N/A"} />
                    <TextField label="Local Market Price" value={currentVersion?.local_market_acre_price?.toString() || "N/A"} />
                  </>
                ) : activeTabId === 'geological-advantages' ? (
                  <RadioGroupField 
                    label="Available" 
                    options={[{ label: 'Yes', selected: currentVersion?.is_geological_advantage_available === 1 }, { label: 'No', selected: currentVersion?.is_geological_advantage_available === 0 }]} 
                  />
                ) : activeTabId === 'upcoming-infrastructures' ? (
                  <DropdownField label="Upcoming Infrastructure Details" value={getInfrastructureLabel(currentVersion?.infrastructure_id, masterData)} />
                ) : activeTabId === 'railway-track-connectivity' ? (
                  <>
                    <RadioGroupField 
                      label="Available" 
                      options={[{ label: 'Yes', selected: currentVersion?.is_railway_connectivity_available === 1 }, { label: 'No', selected: currentVersion?.is_railway_connectivity_available === 0 }]} 
                    />
                    <DropdownField label="Distance (In Kms)" value={getDistanceLabel(currentVersion?.distance_id, masterData)} />
                  </>
                ) : activeTabId === 'airport-connectivity' ? (
                  <>
                    <RadioGroupField 
                      label="Available" 
                      options={[{ label: 'Yes', selected: currentVersion?.is_airport_connectivity_available === 1 }, { label: 'No', selected: currentVersion?.is_airport_connectivity_available === 0 }]} 
                    />
                    <DropdownField label="Distance (In Kms)" value={getDistanceLabel(currentVersion?.distance_id, masterData)} />
                  </>
                ) : activeTabId === 'future-plans' ? (
                  <>
                    <h3 className="text-[22px] font-bold text-gray-900 mb-6">Future Plans for the Land</h3>
                    <div className="bg-[#EFF6FF] rounded-2xl p-6 text-[15px] leading-relaxed text-gray-700 min-h-[160px]">
                      {currentVersion?.remarks || "No plans available."}
                    </div>
                  </>
                ) : activeTabId === 'validating-disadvantages' ? (
                  <>
                    <h3 className="text-[22px] font-bold text-gray-900 mb-6">Validating the Disadvantages</h3>
                    <div className="bg-[#EFF6FF] rounded-2xl p-6 text-[15px] leading-relaxed text-gray-700 min-h-[160px]">
                      {currentVersion?.remarks || "No disadvantages available."}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-[22px] font-bold text-gray-900 mb-6">Uploaded Files</h3>
                    <div className="flex flex-col gap-4">
                      {mappedFiles.length > 0 ? (
                        mappedFiles.map((file: any) => (
                          <FileRow 
                            key={file.id} 
                            file={file} 
                            onDownload={() => downloadFile(file.url || file.name, file.name)}
                            isDownloading={isDownloading}
                          />
                        ))
                      ) : (
                        <p className="text-gray-500">No files uploaded.</p>
                      )}
                    </div>
                  </>
                )}
                </div>

                {!['future-plans', 'validating-disadvantages'].includes(activeTabId) && (
                  <div className="flex flex-col min-w-0">
                    <CommentsSection comment={remarks || "No remarks provided."} className="w-full h-[140px]" />
                  </div>
                )}
              </div>

              {/* ── Footer Navigation ── */}
              <div className="px-6 lg:px-10 py-4 lg:py-6 border-t border-gray-100 bg-white shrink-0">
                <FooterActions
                  isApproved={currentTab?.status === 'approved'}
                  isRejected={currentTab?.status === 'rejected'}
                  revertReason={currentTab?.revertReason}
                  onReject={() => setShowRejectModal(true)}
                  onApprove={handleApprove}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
