import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { DocumentTab } from '@/features/super-admin/types/legal-docs';
import { useGetAgricultureReportStatusQuery } from '@/features/super-admin/api/farmland.api';
import { useGetAllMasterDataQuery } from '@/features/super-admin/api/masterData.api';
import { useVerificationFlow } from '../hooks/useVerificationFlow';
import { TabsCard, CommentsSection, FooterActions } from '../components/SharedUI';
import { FileRow } from '../components/Icons';
import { DropdownField, TextField, MultiTagField, DualTextField } from '../components/FormFields';
import { RejectModal } from '../components/Modals';
import { useFileDownload } from '@/features/super-admin/utils/useFileDownload';
import { useApproveFarmlandTabMutation, useRevertFarmlandTabMutation } from '@/features/super-admin/api/farmlandAction.api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/store/authSlice';

const AGRICULTURE_TABS: DocumentTab[] = [
  { id: 'local-agriculture-officer-report', label: 'Local Agriculture Officer Report', status: 'pending', code: 'LAORP' },
  { id: 'last-5-years-crop-yielding', label: 'Last 5 years Crop Yielding Report', status: 'pending', code: 'L5CYR' },
  { id: 'soil', label: 'Soil', status: 'pending', code: 'SOILS' },
  { id: 'type-of-crop', label: 'Type Of Crop', status: 'pending', code: 'TYCRP' },
  { id: 'ground-water-level', label: 'Ground Water Level', status: 'pending', code: 'GWLVL' },
  { id: 'types-of-crop-can-be-grown', label: 'Types of Crop can be grown', status: 'pending', code: 'TCCBG' },
  { id: 'current-yield-cost', label: 'Current Yield Cost', status: 'pending', code: 'CURYD' },
  { id: 'current-cultivation', label: 'Current Cultivation', status: 'pending', code: 'CURCL' },
  { id: 'future-crops', label: 'Future Crops', status: 'pending', code: 'FCRPS' },
  { id: 'maintenance', label: 'Maintenance', status: 'pending', code: 'MAINT' },
  { id: 'natural-advantages-and-disadvantages', label: 'Natural Advantages and Disadvantages', status: 'pending', code: 'NATAD' },
];

export const AgricultureReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const farmlandId = id ?? 'GLCSOS 01';

  const numericId = parseInt(farmlandId, 10);
  const apiId = isNaN(numericId) ? 1 : numericId;

  const { data: masterDataObj } = useGetAllMasterDataQuery();
  const { data: agricultureReportStatus, isLoading, isError, refetch } = useGetAgricultureReportStatusQuery({
    farmlandId: apiId
  });

  const { downloadFile, isDownloading } = useFileDownload();

  // Create mapped tabs dynamically based on API response
  const mappedTabs = useMemo(() => {
    if (!agricultureReportStatus?.data) {
      return AGRICULTURE_TABS;
    }
    
    const backendData = agricultureReportStatus.data;
    // Build map keyed by item.code (directly from API response)
    const backendCodeMap = new Map<string, { uploaded: boolean; isApproved: boolean; isRejected: boolean; revertReason: string | null }>();

    Object.keys(backendData).forEach((idKey) => {
      const item = (backendData as any)[idKey];
      const isApp = Number(item.is_super_admin_approved) === 1;
      const isRej = !isApp && !!item.revert_reason;

      if (item.code) {
        backendCodeMap.set(item.code, {
          uploaded: item.uploaded,
          isApproved: isApp,
          isRejected: isRej,
          revertReason: item.revert_reason ?? null
        });
      }
    });

    return AGRICULTURE_TABS.map(tab => {
      const data = tab.code ? backendCodeMap.get(tab.code) : undefined;
      return {
        ...tab,
        isUploaded: data ? data.uploaded : false,
        status: data?.isRejected ? 'rejected' : (data?.isApproved ? 'approved' : 'pending'),
        revertReason: data?.revertReason
      };
    });
  }, [agricultureReportStatus]);

  const [approveTab] = useApproveFarmlandTabMutation();
  const [revertTab] = useRevertFarmlandTabMutation();
  const user = useSelector(selectCurrentUser);

  const handleApproveTab = async (tabId: string) => {
    const activeCode = AGRICULTURE_TABS.find(t => t.id === tabId)?.code;
    const masterRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === activeCode);
    const doc = masterRecord && agricultureReportStatus?.data ? (agricultureReportStatus.data as any)[masterRecord.id] : null;
    const version = doc?.versions?.[0];
    const uploadId = version?.farmland_upload_id || 0;
    
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
    const activeCode = AGRICULTURE_TABS.find(t => t.id === tabId)?.code;
    const masterRecord = masterDataObj?.farmlandUploadResult?.find((m: any) => m.code === activeCode);
    const doc = masterRecord && agricultureReportStatus?.data ? (agricultureReportStatus.data as any)[masterRecord.id] : null;
    const version = doc?.versions?.[0];
    const uploadId = version?.farmland_upload_id || 0;
    
    if (masterRecord) {
      try {
        const revertStatusRecord = masterDataObj?.revertStatus?.find((r: any) => r.code === "OPEN") || masterDataObj?.revertStatusResult?.find((r: any) => r.code === "OPEN");
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
    }
    return true;
  };

  const {
    tabs,
    activeTabId,
    setActiveTabId,
    currentTab,
    showRejectModal,
    setShowRejectModal,
    handleApprove,
    handleRejectConfirm,
    isSubmitting,
  } = useVerificationFlow(mappedTabs, farmlandId, 'land-boundaries', {
    onApproveTab: handleApproveTab,
    onRejectTab: handleRejectTab
  });

  // Find currently active document data from API
  const activeDocumentData = React.useMemo(() => {
    if (!agricultureReportStatus?.data || !masterDataObj?.farmlandUploadResult) return null;
    
    const activeCode = AGRICULTURE_TABS.find(t => t.id === activeTabId)?.code;
    if (!activeCode) return null;

    // Find the ID from master data using the code
    const masterRecord = masterDataObj.farmlandUploadResult.find((m: any) => m.code === activeCode);
    if (!masterRecord) return null;

    return (agricultureReportStatus.data as any)[masterRecord.id];
  }, [agricultureReportStatus, masterDataObj, activeTabId]);

  const activeVersion = activeDocumentData?.versions?.[0];
  const remarks = activeVersion?.remarks || '';
  const files = activeVersion?.files || [];

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
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3 text-gray-500 font-medium">Loading documents...</span>
              </div>
            ) : isError ? (
              <div className="flex-1 flex items-center justify-center text-red-500">
                Failed to load agriculture reports. Please try again.
              </div>
            ) : !activeVersion ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <span className="font-medium text-lg">No data available</span>
                <span className="text-sm">There are no records for this document yet.</span>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                {activeTabId === 'future-crops' ? (
                  <div className="flex flex-col min-w-0">
                    <span className="w-[max-content] whitespace-nowrap font-sans font-semibold text-base leading-relaxed text-black mb-2">
                      Future crop plans suggested by <span className="text-[#3A8EE6]">Green Land Captial</span>
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col min-w-0 gap-6">
                      
                      {activeTabId === 'soil' ? (
                        <DropdownField 
                          label="Soil Type" 
                          value={
                            masterDataObj?.soilTypeResult?.find(
                              (m: any) => String(m.id) === String(activeVersion?.soil_type_id)
                            )?.description || 'Unknown'
                          } 
                        />
                      ) : activeTabId === 'type-of-crop' ? (
                        <DropdownField 
                          label="Type of Crop" 
                          value={
                            masterDataObj?.cropsResult?.find(
                              (m: any) => String(m.id) === String(activeVersion?.crop_id)
                            )?.description || 'Unknown'
                          } 
                        />
                      ) : activeTabId === 'ground-water-level' ? (
                        <TextField label="Ground Water Level" value={activeVersion?.ground_water_level || 'N/A'} />
                      ) : activeTabId === 'types-of-crop-can-be-grown' ? (
                        <MultiTagField 
                          label="Types of Crop can be grown" 
                          tags={
                            activeVersion?.crop_ids && Array.isArray(activeVersion.crop_ids)
                            ? activeVersion.crop_ids.map((id: number) => 
                                masterDataObj?.cropsResult?.find((c: any) => String(c.id) === String(id))?.description
                              ).filter(Boolean)
                            : []
                          } 
                        />
                      ) : activeTabId === 'current-yield-cost' ? (
                        <DualTextField 
                          label1="Current Yield Cost" 
                          value1={activeVersion?.current_yield_cost || 'N/A'} 
                          label2="Current Returns" 
                          value2={activeVersion?.current_returns || 'N/A'} 
                        />
                      ) : activeTabId === 'current-cultivation' ? (
                        <div className="flex flex-col gap-6">
                          <TextField label="Cultivation Type" value={activeVersion?.is_lease === 0 ? "Self" : "Lease"} />
                          <TextField label="Name" value={activeVersion?.name || 'N/A'} />
                          <TextField label="Contact Number" value={activeVersion?.contact_number || 'N/A'} />
                        </div>
                      ) : activeTabId === 'maintenance' ? (
                        <div className="flex flex-col gap-6">
                          <MultiTagField 
                            label="Maintenance Suggested Crops" 
                            tags={
                              activeVersion?.crop_ids && Array.isArray(activeVersion.crop_ids)
                              ? activeVersion.crop_ids.map((id: number) => 
                                  masterDataObj?.cropsResult?.find((c: any) => String(c.id) === String(id))?.description
                                ).filter(Boolean)
                              : []
                            } 
                          />
                          <TextField label="Expected Returns" value={activeVersion?.expected_return || 'N/A'} />
                        </div>
                      ) : activeTabId === 'natural-advantages-and-disadvantages' ? (
                        <DualTextField 
                          label1="Advantages" 
                          value1={activeVersion?.advantages || 'N/A'} 
                          label2="Disadvantages" 
                          value2={activeVersion?.disadvantages || 'N/A'} 
                        />
                      ) : (
                        <>
                          <h3 className="text-[22px] font-bold text-gray-900 mb-5">Uploaded Files</h3>
                          <div className="flex flex-col gap-4">
                            {files.length > 0 ? (
                              files.map((file: any, index: number) => {
                                const originalFileName = file.document_url?.split('/').pop() || `Document ${index + 1}`;
                                return (
                                  <FileRow 
                                    key={file.id || index} 
                                    file={{ id: String(file.id), name: originalFileName, size: '' }} 
                                    onDownload={() => downloadFile(file.document_url, originalFileName)}
                                    isDownloading={isDownloading}
                                  />
                                );
                              })
                            ) : (
                              <div className="text-gray-400 text-sm py-4">No files uploaded for this document.</div>
                            )}
                          </div>
                        </>
                      )}

                    </div>
                  </>
                )}

                  <div className="flex flex-col min-w-0">
                    <CommentsSection comment={remarks || "No remarks provided."} className="w-full h-[140px]" />
                  </div>
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
            )}
          </div>
        </>
      )}
    </>
  );
};
